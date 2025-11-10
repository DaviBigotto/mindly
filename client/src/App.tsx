// Replit Auth integration - javascript_log_in_with_replit blueprint
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppDataProvider } from "@/context/app-data";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Meditate from "@/pages/meditate";
import Journal from "@/pages/journal";
import Focus from "@/pages/focus";
import Profile from "@/pages/profile";
import Subscribe from "@/pages/subscribe";
import ProTracks from "@/pages/pro-tracks";
import Signup from "@/pages/signup";
import AdminKiwify from "@/pages/admin-kiwify";
import { ComponentType, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

function withProtection<T>(Component: ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const { isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
      if (!isAuthenticated) {
        setLocation("/signup");
      }
    }, [isAuthenticated, setLocation]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

const ProtectedHome = withProtection(Home);
const ProtectedMeditate = withProtection(Meditate);
const ProtectedJournal = withProtection(Journal);
const ProtectedFocus = withProtection(Focus);
const ProtectedProfile = withProtection(Profile);
const ProtectedSubscribe = withProtection(Subscribe);
const ProtectedProTracks = withProtection(ProTracks);
const ProtectedAdminKiwify = withProtection(AdminKiwify);

function Router() {
  return (
    <Switch>
      <Route path="/home" component={ProtectedHome} />
      <Route path="/meditate" component={ProtectedMeditate} />
      <Route path="/journal" component={ProtectedJournal} />
      <Route path="/focus" component={ProtectedFocus} />
      <Route path="/profile" component={ProtectedProfile} />
      <Route path="/subscribe" component={ProtectedSubscribe} />
      <Route path="/pro-tracks" component={ProtectedProTracks} />
      <Route path="/admin/kiwify" component={ProtectedAdminKiwify} />
      <Route path="/landing" component={Landing} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppDataProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </AppDataProvider>
  );
}

export default App;
