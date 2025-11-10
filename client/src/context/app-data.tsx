import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  FocusSession,
  JournalEntry,
  MeditationCategory,
  MeditationSession,
  ProTrack,
  User,
} from "../../../../schema";
import {
  mockMeditationCategories,
  mockMeditationSessions,
  mockProTracks,
} from "@/mocks/mockData";

// Helper to get headers with user email for API requests
function getApiHeaders(userEmail?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (userEmail) {
    headers["X-User-Email"] = userEmail;
  }
  return headers;
}

type ProfileStats = {
  journalCount: number;
  meditationMinutes: number;
  focusCount: number;
};

type AppDataContextValue = {
  user: User;
  isPro: boolean;
  isLoggedIn: boolean;
  plan: User["plan"];
  storageLimitMb: number;
  setProStatus: (value: boolean) => void;
  journalEntries: JournalEntry[];
  dailyJournalCount: number;
  addJournalEntry: (content: string) => JournalEntry;
  addJournalEntryFromAPI: (entry: JournalEntry) => void;
  meditationCategories: MeditationCategory[];
  getMeditationSessions: (categoryId: string | null) => MeditationSession[];
  completeMeditationSession: (session: MeditationSession) => void;
  proTracks: ProTrack[];
  profileStats: ProfileStats;
  recordFocusSession: (duration: number) => void;
  resetDailyJournalCount: () => void;
  authenticateUser: (input: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
    isPro?: boolean;
    plan?: User["plan"];
    storageLimitMb?: number;
    password: string;
  }) => void;
  login: (input: { email: string; password: string }) => void;
  logout: () => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined,
);

const DEFAULT_ANALYSES = [
  "Estou com você. Respire com calma e celebre o que já conquistou hoje.",
  "Percebo muita coragem nas suas palavras. Continue se acolhendo com gentileza.",
  "Reconhecer as emoções é o primeiro passo. Você merece descansar e se cuidar.",
];

const BASIC_STORAGE_LIMIT_MB = Number(import.meta.env.VITE_KIWIFY_BASIC_STORAGE_MB ?? 256);
const PRO_STORAGE_LIMIT_MB = Number(import.meta.env.VITE_KIWIFY_PRO_STORAGE_MB ?? 2048);

function resolvePlan(isPro?: boolean, plan?: User["plan"]) {
  if (plan) return plan;
  return isPro ? "pro" : "basic";
}

function resolveStorageLimit(plan: User["plan"], storageLimitMb?: number) {
  if (typeof storageLimitMb === "number") return storageLimitMb;
  return plan === "pro" ? PRO_STORAGE_LIMIT_MB : BASIC_STORAGE_LIMIT_MB;
}

const MOODS: Array<JournalEntry["mood"]> = ["positive", "neutral", "negative"];

function generateMood(): JournalEntry["mood"] {
  const index = Math.floor(Math.random() * MOODS.length);
  return MOODS[index] ?? "neutral";
}

function generateAnalysis(): string {
  const index = Math.floor(Math.random() * DEFAULT_ANALYSES.length);
  return DEFAULT_ANALYSES[index] ?? DEFAULT_ANALYSES[0];
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

type StoredProfile = {
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  isPro?: boolean;
  plan?: User["plan"];
  storageLimitMb?: number;
  password: string;
};

const STORAGE_KEY = "mindly.profile";

const emptyUser: User = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  profileImageUrl: "",
  isPro: false,
  plan: "basic",
  storageLimitMb: BASIC_STORAGE_LIMIT_MB,
  dailyJournalCount: 0,
  lastJournalDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredProfile;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User>(() => {
    if (!storedProfile) return emptyUser;
    const plan = resolvePlan(storedProfile.isPro, storedProfile.plan);
    return {
      ...emptyUser,
      id: createId(),
      firstName: storedProfile.firstName,
      lastName: storedProfile.lastName,
      email: storedProfile.email,
      profileImageUrl: storedProfile.profileImageUrl ?? "",
      isPro: storedProfile.isPro ?? false,
      plan,
      storageLimitMb: resolveStorageLimit(plan, storedProfile.storageLimitMb),
    };
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [dailyJournalCount, setDailyJournalCount] = useState<number>(0);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [meditationMinutes, setMeditationMinutes] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storedProfile !== null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  const persistProfile = (profile: StoredProfile | null) => {
    setStoredProfile(profile);
    if (typeof window === "undefined") return;
    if (!profile) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  // Sync user data from backend when logged in
  useEffect(() => {
    if (!isLoggedIn || !storedProfile) return;

    const syncUserData = async () => {
      setIsLoadingUserData(true);
      try {
        // Use user email if available, otherwise use storedProfile email
        const userEmail = user?.email || storedProfile.email;
        
        const response = await fetch("/api/user", {
          credentials: "include",
          headers: getApiHeaders(userEmail),
        });

        if (!response.ok) {
          console.warn("Failed to fetch user data from backend:", response.status, response.statusText);
          // If 401, user is not authenticated - this is OK in dev mode
          if (response.status === 401) {
            console.log("User not authenticated in backend (dev mode may be active)");
          }
          return;
        }

        const userData = await response.json();
        console.log("Synced user data from backend:", userData);
        console.log("Current stored profile email:", storedProfile.email);
        console.log("Backend user isPro:", userData.isPro);

        // Update user state with backend data - always use backend data as source of truth
        const plan = resolvePlan(userData.isPro, userData.plan);
        const storageLimitMb = resolveStorageLimit(plan, userData.storageLimitMb);
        const isNowPro = userData.isPro === true;
        
        setUser((prev) => {
          const wasPro = prev.isPro === true;
          if (wasPro !== isNowPro) {
            console.log(`✅ Pro status updated: ${wasPro} -> ${isNowPro}`, {
              wasPro,
              isNowPro,
              backendIsPro: userData.isPro,
              backendPlan: userData.plan,
            });
          } else {
            console.log(`Pro status unchanged: ${isNowPro}`, {
              isPro: prev.isPro,
              backendIsPro: userData.isPro,
            });
          }
          return {
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            email: userData.email || prev.email,
            profileImageUrl: userData.profileImageUrl || prev.profileImageUrl,
            isPro: isNowPro,
            plan,
            storageLimitMb,
            dailyJournalCount: userData.dailyJournalCount ?? prev.dailyJournalCount,
          };
        });

        // Update localStorage with backend data
        persistProfile({
          ...storedProfile,
          isPro: isNowPro,
          plan,
          storageLimitMb,
        });
      } catch (error) {
        console.error("Error syncing user data from backend:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    // Sync immediately when component mounts or user logs in
    syncUserData();
    
    // Also sync when user data might have changed (e.g., after granting Pro)
    // Sync every 5 seconds for more responsive updates
    const interval = setInterval(syncUserData, 5000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn, storedProfile?.email]);

  const addJournalEntry = (content: string) => {
    const mood = generateMood();
    const aiAnalysis = generateAnalysis();
    const entry: JournalEntry = {
      id: createId(),
      userId: user.id,
      content,
      aiAnalysis,
      mood,
      createdAt: new Date(),
    };

    setJournalEntries((prev) => [...prev, entry]);
    setDailyJournalCount((prev) => prev + 1);
    setUser((prev) => ({
      ...prev,
      dailyJournalCount: (prev.dailyJournalCount ?? 0) + 1,
      lastJournalDate: new Date(),
      updatedAt: new Date(),
    }));

    return entry;
  };

  const addJournalEntryFromAPI = (entry: JournalEntry) => {
    // Adiciona a entrada completa (com análise de IA real) retornada pela API
    setJournalEntries((prev) => [entry, ...prev]);
    setDailyJournalCount((prev) => prev + 1);
    setUser((prev) => ({
      ...prev,
      dailyJournalCount: (prev.dailyJournalCount ?? 0) + 1,
      lastJournalDate: new Date(),
      updatedAt: new Date(),
    }));
  };

  const handleRecordFocusSession = (duration: number) => {
    const session: FocusSession = {
      id: createId(),
      userId: user.id,
      duration,
      completedAt: new Date(),
      date: new Date(),
    };

    setFocusSessions((prev) => [...prev, session]);
  };

  const handleCompleteMeditationSession = (session: MeditationSession) => {
    setMeditationMinutes((prev) => prev + (session.duration ?? 0));
  };

  const resetDailyJournalCount = () => {
    setDailyJournalCount(0);
    setUser((prev) => ({
      ...prev,
      dailyJournalCount: 0,
      updatedAt: new Date(),
    }));
  };

  const authenticateUser: AppDataContextValue["authenticateUser"] = ({
    firstName,
    lastName,
    email,
    profileImageUrl,
    isPro,
    plan: providedPlan,
    storageLimitMb: providedStorageLimit,
    password,
  }) => {
    const now = new Date();
    const plan = resolvePlan(isPro, providedPlan);
    const storageLimitMb = resolveStorageLimit(plan, providedStorageLimit);
    const nextUser: User = {
      ...emptyUser,
      id: createId(),
      email,
      firstName,
      lastName,
      profileImageUrl: profileImageUrl ?? "",
      isPro: isPro ?? false,
      plan,
      storageLimitMb,
      createdAt: now,
      updatedAt: now,
    };
    setUser(nextUser);
    setIsLoggedIn(true);
    setJournalEntries([]);
    setDailyJournalCount(0);
    setFocusSessions([]);
    setMeditationMinutes(0);
    persistProfile({
      firstName,
      lastName,
      email,
      profileImageUrl,
      isPro,
      plan,
      storageLimitMb,
      password,
    });

    // Sync user with backend in background (non-blocking)
    fetch("/api/users/sync", {
      method: "POST",
      credentials: "include",
      headers: getApiHeaders(email),
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        profileImageUrl,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to sync user");
      })
      .then((data) => {
        console.log("User synced with backend:", data.user);
        
        // Update user with backend data if Pro status changed
        if (data.user.isPro !== isPro) {
          const backendPlan = resolvePlan(data.user.isPro, data.user.plan);
          const backendStorage = resolveStorageLimit(backendPlan, data.user.storageLimitMb);
          
          setUser((prev) => ({
            ...prev,
            isPro: data.user.isPro,
            plan: backendPlan,
            storageLimitMb: backendStorage,
          }));
          
          persistProfile({
            firstName,
            lastName,
            email,
            profileImageUrl,
            isPro: data.user.isPro,
            plan: backendPlan,
            storageLimitMb: backendStorage,
            password,
          });
        }
      })
      .catch((error) => {
        console.error("Error syncing user with backend:", error);
      });
  };

  const logout = () => {
    setUser(emptyUser);
    setIsLoggedIn(false);
    setJournalEntries([]);
    setDailyJournalCount(0);
    setFocusSessions([]);
    setMeditationMinutes(0);
    persistProfile(null);
  };

  const login: AppDataContextValue["login"] = ({ email, password }) => {
    const profile = storedProfile || (typeof window !== "undefined"
      ? ((): StoredProfile | null => {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) return null;
          try {
            return JSON.parse(raw) as StoredProfile;
          } catch {
            return null;
          }
        })()
      : null);

    if (!profile || profile.email !== email || profile.password !== password) {
      throw new Error("Credenciais inválidas.");
    }

    authenticateUser({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      profileImageUrl: profile.profileImageUrl,
      isPro: profile.isPro,
      plan: profile.plan,
      storageLimitMb: profile.storageLimitMb,
      password: profile.password,
    });
  };

  const profileStats = useMemo<ProfileStats>(() => {
    return {
      journalCount: journalEntries.length,
      meditationMinutes,
      focusCount: focusSessions.length,
    };
  }, [journalEntries.length, meditationMinutes, focusSessions.length]);

  const value: AppDataContextValue = {
    user,
    isPro: user.isPro ?? false,
    plan: user.plan,
    storageLimitMb: user.storageLimitMb ?? BASIC_STORAGE_LIMIT_MB,
    isLoggedIn,
    setProStatus: (value) =>
      setUser((prev) => {
        const nextPlan = resolvePlan(value, value ? "pro" : "basic");
        const nextStorage = resolveStorageLimit(nextPlan);
        const next = {
          ...prev,
          isPro: value,
          plan: nextPlan,
          storageLimitMb: nextStorage,
          updatedAt: new Date(),
        };
        if (storedProfile) {
          persistProfile({
            ...storedProfile,
            isPro: value,
            plan: nextPlan,
            storageLimitMb: nextStorage,
          });
        }
        return next;
      }),
    journalEntries,
    dailyJournalCount,
    addJournalEntry,
    addJournalEntryFromAPI,
    meditationCategories: mockMeditationCategories,
    getMeditationSessions: (categoryId) =>
      categoryId
        ? mockMeditationSessions.filter(
            (session) => session.categoryId === categoryId,
          )
        : [],
    completeMeditationSession: handleCompleteMeditationSession,
    proTracks: mockProTracks,
    profileStats,
    recordFocusSession: handleRecordFocusSession,
    resetDailyJournalCount,
    authenticateUser,
    login,
    logout,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  }

  return context;
}

