# Mindly Web App - Design Guidelines

## Design System & Aesthetic

**Core Philosophy**: Calm, minimalist, and welcoming. Conveys tranquility and mental clarity, inspired by Calm, Stoic, and Finch. Interface features generous whitespace and smooth transitions.

**Color Palette**:
- Primary: `#4C8BF5` (calm mind blue)
- Secondary: `#7DD3FC` (light focus blue)
- Accent: `#F3F4F6` (light gray)
- Text: `#1F2937` (dark gray)
- White: `#FFFFFF`
- Pro Accent: `#FBBF24` (light gold for premium features)

**Typography**:
- Headers: Poppins, Semibold
- Body: Inter, Regular
- Maintain clear hierarchy with generous spacing

**Visual Elements**:
- Use soft linear icons and minimalist vector illustrations (meditating figures, orbs, clouds, waves, soft lights)
- Avoid realistic images
- Gradients: Subtle blue-to-light-blue backgrounds
- Pro elements marked with diamond 💎, star, or crown icons

## Layout System

**Spacing**: Use Tailwind units: `p-4`, `p-6`, `p-8`, `gap-6`, `gap-8` for consistent rhythm

**Grid Patterns**:
- Homepage: 3-column card grid (responsive to single column on mobile)
- Meditation categories: 2-3 column grid
- Profile stats: 2-column layout

**Component Sizes**:
- Large navigation cards: Prominent with icons, titles, and descriptions
- Modal/Paywall: Centered, max-width 500px
- Forms: Max-width 400px, centered

## Page-Specific Layouts

### Homepage
- Header with Mindly logo and tagline: "Equilíbrio entre Mente e Produtividade"
- Three large navigation cards in center: "Meditar Agora", "Diário Emocional", "Modo Foco"
- Each card: representative icon, title, brief description
- Background: Soft blue-light gradient
- For Pro users: Add fourth prominent card "Área Bônus Pro: Trilhas de Transformação 💎"

### Guided Meditation Page
- Header: "Medite com o Mindly 🧘"
- Category grid: Focus, Relaxation, Sleep (free), Anxiety (Pro 💎), Confidence (Pro 💎)
- Each category card: illustration, title, session count
- Session list: title, duration badge, "Ouvir Agora" button, brief description
- Free users see lock icon on premium categories

### Emotional Journal
- Header: "Como você se sente hoje?"
- Large textarea for free-form writing
- Prominent "Analisar meu humor" button
- AI response display: empathetic message with soft background
- Weekly mood graph below (positive/neutral/negative visualization)
- Free tier: 2 analyses/day limit indicator

### Focus Mode
- Header: "Entre em Foco 🎯"
- Central large Pomodoro timer display (25:00)
- Three buttons below timer: "Iniciar", "Pausar", "Resetar"
- Ambient sound selector with icons (rain, forest, wind)
- Motivational phrases in subtle text: "Respire. Você está indo bem."

### Login/Signup
- Minimalist design with tabs: "Entrar" and "Criar Conta"
- Background: Blue gradient (#7DD3FC) with subtle translucent orbs/waves
- Login fields: Email, Password, "Esqueci minha senha" link
- Signup fields: Name, Email, Password
- Social login buttons: Google, Apple (with respective brand colors)

### Checkout Page
- Clean, inspiring design
- Header: "Assinatura Mindly Pro"
- White background with light blue accents
- Order summary box: "Plano Mensal - Acesso completo"
- Stripe Elements form (card number, expiry, CVC)
- Large "Finalizar Assinatura" button
- Trust elements: Stripe/Visa/Mastercard logos, "Pagamento 100% seguro via Stripe" text

### Pro Bonus Hub
- Header: "Bem-vindo(a) à sua Jornada Mindly Pro 💎"
- Inspirational intro text about exclusive transformation tracks
- Three large cards for tracks with gold/diamond accent:
  - "21 Dias de Foco e Clareza Mental"
  - "7 Dias de Paz Interior"
  - "Desafio Sono Perfeito"
- Premium sounds section with categorized audio library

### Track Detail Pages (Template)
- Header with track title + Pro seal 💎
- Motivational intro block with "Iniciar Jornada" button
- Timeline/list of daily steps with icons, titles, duration, activity type
- Click opens modal with audio player, instructions, AI insights

## Component Library

**Cards**: Rounded corners, soft shadows, hover lift effect, generous padding

**Buttons**:
- Primary (CTA): Bold, full-width on mobile, blue background
- Secondary: Outlined style
- If on images/gradients: Blur background behind button

**Modals**:
- Paywall: Centered overlay, title "Desbloqueie o Mindly Pro 🌿", benefit bullets, pricing, CTA, microcopy "Invista em sua paz mental"
- Success: Large checkmark ✓, "Bem-vindo(a) ao Mindly Pro 🌸", "Começar minha jornada" button
- AI Insight: After activity completion, personalized encouraging message

**Forms**: Clean, single-column, clear labels, generous input padding

**Audio Players**: Minimalist controls, progress bar, like/download options for Pro

## Animations & Interactions

- **Minimal and purposeful**: Smooth page transitions, subtle card hover lifts
- Button states: Gentle scale/opacity changes
- Modal entrance: Fade + slight scale
- Avoid distracting or excessive motion
- Timer: Smooth countdown animation

## Images & Illustrations

**Vector Illustrations** (not photos):
- Meditating figures in minimalist style
- Floating orbs, soft clouds, gentle waves
- Abstract light elements
- Color palette: Blues, whites, soft grays

**Placement**:
- Category cards: Small centered illustrations
- Empty states: Larger centered illustrations
- Background elements: Translucent, subtle

## Trust & Microcopy

- Transparent pricing display
- Security badges on checkout
- Empathetic AI responses: "Você parece cansado hoje, que tal uma pausa?"
- Encouraging messages: "Respire. Você está indo bem."
- Clear free vs Pro distinctions
- "Sua tranquilidade está em boas mãos" on payment pages

## Accessibility

- High contrast text (#1F2937 on #FFFFFF)
- Clear focus states
- Generous tap targets (min 44px)
- Semantic HTML structure
- ARIA labels for icons