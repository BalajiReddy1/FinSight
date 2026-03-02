# Design Document (DesignDoc.md)
# FinSight: Your Daily Money Mentor

**Version:** 1.0  
**Date:** February 4, 2026  
**Design Lead:** Product Design Team  
**Status:** Design Specification  
**Related Document:** [FinSight PRD v1.0](./finsight_prd.md)

---

## Table of Contents
1. [Design Philosophy & Core Metaphor](#1-design-philosophy--core-metaphor)
2. [Visual Identity System](#2-visual-identity-system)
3. [Component Library (Atomic Design)](#3-component-library-atomic-design)
4. [Layout & Navigation Architecture](#4-layout--navigation-architecture)
5. [User Flows & Transitions](#5-user-flows--transitions)
6. [Responsive Design & React Native Patterns](#6-responsive-design--react-native-patterns)
7. [Accessibility & Inclusive Design](#7-accessibility--inclusive-design)
8. [Animation & Micro-interactions](#8-animation--micro-interactions)
9. [Design Tokens & Implementation](#9-design-tokens--implementation)
10. [Research-Backed Design Decisions](#10-research-backed-design-decisions)

---

## 1. Design Philosophy & Core Metaphor

### 1.1 Mental Model: "The Financial Morning Newspaper"

**Core Metaphor:**
FinSight is designed as a **"Living Financial Newspaper"** that adapts throughout the day. Like how people once started their day with a newspaper and coffee, FinSight becomes the daily ritual for financial awareness—but instead of static news, it's personalized, contextual, and educational.

**Key Principles:**

1. **Glanceability First:** Critical information (Market Pulse, Budget Status) must be scannable in <5 seconds
2. **Just-in-Time Intervention:** Educational content appears *at the moment* of financial activity, not buried in menus
3. **Progressive Disclosure:** Complex information revealed in layers (collapsed cards → expanded → deep dive)
4. **Trust Through Transparency:** Every AI-generated insight is clearly labeled; every data point shows its source

### 1.2 Balancing Dual Personalities

FinSight must walk the tightrope between two seemingly contradictory design languages:

| **High Trust (Banking UX)** | **High Engagement (Social Media UX)** |
|------------------------------|---------------------------------------|
| Muted colors, Professional typography | Vibrant gradients, Playful micro-animations |
| Data accuracy, Source citations | Swipeable cards, Gamification badges |
| Security indicators, Lock icons | Streaks, Progress rings, Celebrations |

**Resolution Strategy:**
- **Primary Interface (Feed, Vitals):** 70% Trust (clean, data-focused) + 30% Engagement (subtle animations, card-based)
- **Learning Hub & Gamification:** 60% Engagement + 40% Trust
- **EITM Cards:** 50/50 Balance (friendly AI tone but data-backed insights)

### 1.3 Design for "Loss Aversion"

Drawing from behavioral economics (Thaler & Sunstein, 2008), the design leverages **loss aversion**—people feel losses 2x more intensely than equivalent gains.

**Application:**
- **Budget Overspend Alerts:** Use high-contrast warning colors + specific copy ("You're ₹800 over budget" vs. "You spent ₹800")
- **Market Losses:** Red values are visually de-emphasized (smaller font) compared to contextual explanation (larger font)
- **Savings Wins:** Green gains celebrated with confetti animations, while losses trigger gentle "course-correction" suggestions

---

## 2. Visual Identity System

### 2.1 Color Palette

#### Primary Brand Colors
```css
/* Brand Core */
--brand-primary: #6366F1;      /* Indigo 500 - Trust + Modern */
--brand-primary-dark: #4F46E5; /* Indigo 600 - Active states */
--brand-primary-light: #818CF8; /* Indigo 400 - Hover states */

/* Brand Gradient (for Premium features, badges) */
--brand-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```

**Rationale:** Indigo conveys trust (bank-like) while remaining approachable (not corporate blue). Purple tones add a modern, fintech edge differentiating from legacy banking apps.

#### Semantic Colors (Financial Context)

```css
/* Profit/Gain */
--profit-green: #10B981;       /* Emerald 500 - Gains, Positive trends */
--profit-bg: #D1FAE5;          /* Emerald 100 - Gain card backgrounds */

/* Loss/Debt */
--loss-red: #EF4444;           /* Red 500 - Losses, Debts */
--loss-bg: #FEE2E2;            /* Red 100 - Loss card backgrounds */

/* Nudge/Alert (Behavioral Trigger) */
--alert-amber: #F59E0B;        /* Amber 500 - Budget warnings (80-100%) */
--alert-critical: #DC2626;     /* Red 600 - Budget exceeded (>100%) */
--alert-bg: #FEF3C7;           /* Amber 100 - Alert card backgrounds */

/* AI Content Distinction */
--ai-gradient: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%);
--ai-border: #A78BFA;          /* Purple 400 - Subtle AI card border */
--ai-bg: #F5F3FF;              /* Purple 50 - EITM card backgrounds */
```

**Loss Aversion Design:**
- **Alert Amber (80-100% budget):** "Caution, course-correct now to avoid loss"
- **Alert Critical (>100% budget):** "Loss has occurred, take immediate action"
- Amber triggers *before* overspend to leverage loss aversion psychology

#### Neutral Colors (UI Foundation)

```css
/* Text Hierarchy */
--text-primary: #1F2937;       /* Gray 800 - Headers, primary text */
--text-secondary: #6B7280;     /* Gray 500 - Body text, descriptions */
--text-tertiary: #9CA3AF;      /* Gray 400 - Captions, metadata */
--text-inverse: #FFFFFF;       /* White - Dark backgrounds */

/* Backgrounds */
--bg-primary: #FFFFFF;         /* White - Main screens */
--bg-secondary: #F9FAFB;       /* Gray 50 - Card backgrounds */
--bg-tertiary: #F3F4F6;        /* Gray 100 - Disabled states */

/* Borders & Dividers */
--border-default: #E5E7EB;     /* Gray 200 - Default borders */
--border-focus: #6366F1;       /* Brand primary - Focus states */
```

#### PII Masking Color (Privacy Indicator)

```css
/* Redacted Data Visual Treatment */
--pii-mask-text: #9CA3AF;      /* Gray 400 - Masked characters */
--pii-mask-bg: #F3F4F6;        /* Gray 100 - Background for masked sections */
--pii-highlight: #DBEAFE;      /* Blue 100 - When explaining PII protection */
```

**Usage Example:**
- Display: `Acct ****-1234` where `****` uses `--pii-mask-text`
- In EITM cards: "Your SIP in [FUND_NAME]" where fund name might be masked if user hasn't granted permission

### 2.2 Typography

**Font Family:**
```css
/* Primary Font: Inter (System alternative: San Francisco on iOS, Roboto on Android) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;

/* Monospace (for financial data: amounts, account numbers) */
--font-mono: 'SF Mono', 'Roboto Mono', Consolas, monospace;
```

**Rationale:** Inter is optimized for UI, highly legible at small sizes (critical for mobile), and has excellent tabular number support for financial data.

#### Type Scale (Mobile-First)

```css
/* Headers */
--text-4xl: 36px / 40px;  /* Font Size / Line Height */
--text-3xl: 30px / 36px;  /* Page titles (rare on mobile) */
--text-2xl: 24px / 32px;  /* Section headers */
--text-xl: 20px / 28px;   /* Card titles */

/* Body */
--text-lg: 18px / 28px;   /* Primary body (EITM explanations) */
--text-base: 16px / 24px; /* Default body */
--text-sm: 14px / 20px;   /* Secondary text */

/* Captions */
--text-xs: 12px / 16px;   /* Metadata, timestamps */
--text-2xs: 10px / 14px;  /* Legal disclaimers */

/* Financial Data (Tabular Numbers) */
--text-amount-lg: 28px / 32px; /* Primary amounts (Budget dashboard) */
--text-amount-md: 20px / 24px; /* Transaction amounts */
--text-amount-sm: 16px / 20px; /* Small data points (Market Pulse) */
```

**Font Weights:**
```css
--font-regular: 400;
--font-medium: 500;      /* UI labels, buttons */
--font-semibold: 600;    /* Card titles, emphasis */
--font-bold: 700;        /* Headers, amounts */
```

**Glanceability Optimization:**
- **Market Pulse values:** `--font-bold` + `--text-amount-md` with tabular numbers
- **Transaction amounts:** Always align right, use monospace for consistency
- **Category labels:** `--font-medium` + `--text-sm` for clear hierarchy

### 2.3 Spacing & Layout Grid

**8pt Grid System:**
```css
--space-1: 4px;    /* 0.5 unit */
--space-2: 8px;    /* 1 unit - Base */
--space-3: 12px;   /* 1.5 units */
--space-4: 16px;   /* 2 units - Card padding */
--space-6: 24px;   /* 3 units - Section spacing */
--space-8: 32px;   /* 4 units - Large gaps */
--space-12: 48px;  /* 6 units - Page margins */
```

**Safe Area Insets (React Native):**
```javascript
// Use react-native-safe-area-context
<SafeAreaView edges={['top']}>
  {/* Content respects notches, status bars */}
</SafeAreaView>
```

### 2.4 Elevation & Shadows (Cards, Modals)

```css
/* Card Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

/* Modal/Overlay Shadows */
--shadow-modal: 0 20px 25px rgba(0, 0, 0, 0.15);
```

**Usage:**
- **Transaction rows:** `--shadow-sm` (subtle)
- **EITM cards:** `--shadow-md` (medium prominence)
- **Just-in-Time modals:** `--shadow-lg` (high prominence)
- **Bottom sheets:** `--shadow-modal` (full-screen takeover)

---

## 3. Component Library (Atomic Design)

### 3.1 Atoms

#### 3.1.1 Buttons

**Primary Button (CTA):**
```jsx
<Button variant="primary" size="lg">
  Start Learning
</Button>
```

**Styles:**
```css
.button-primary {
  background: var(--brand-primary);
  color: var(--text-inverse);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-sm);
}

.button-primary:active {
  background: var(--brand-primary-dark);
  transform: scale(0.98); /* Subtle press feedback */
}
```

**Variant Map:**
- `primary`: Brand color (main CTAs)
- `secondary`: Outlined, transparent bg (Cancel, Back)
- `success`: Green (Confirm savings goal)
- `danger`: Red (Delete transaction)
- `ghost`: No background (Dismiss, Skip)

**Sizes:** `sm` (32px height), `md` (40px), `lg` (48px)

#### 3.1.2 Icons

**Icon System:** Lucide React Native (consistent with web)
```jsx
import { TrendingUp, AlertTriangle, Award } from 'lucide-react-native';
```

**Size Scale:**
```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 48px;
```

**Category Icons (Color-Coded):**
- **Dining:** 🍽️ (Orange `#F97316`)
- **Shopping:** 🛍️ (Pink `#EC4899`)
- **Transport:** 🚗 (Blue `#3B82F6`)
- **Groceries:** 🛒 (Green `#10B981`)
- **Utilities:** ⚡ (Yellow `#EAB308`)

**Rationale:** Color + emoji provide instant recognition (faster than text labels)

#### 3.1.3 Badges

**Gamification Badges:**
```jsx
<Badge variant="streak" count={7} />
```

**Design:**
```css
.badge-streak {
  background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
```

**Types:**
- `streak`: Fire gradient (daily login)
- `achievement`: Gold gradient (module completion)
- `level`: Purple gradient (tier unlock)

#### 3.1.4 PII Masked Text Component

**Usage:**
```jsx
<MaskedText value="1234567890" maskPattern="****-{last4}" />
// Renders: ****-7890
```

**Styles:**
```css
.masked-chars {
  color: var(--pii-mask-text);
  background: var(--pii-mask-bg);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
}
```

**Visual Indicator (on long-press):**
```jsx
// Shows privacy tooltip
"We hide sensitive info to protect you 🔒"
```

---

### 3.2 Molecules

#### 3.2.1 Transaction Row

**Layout:**
```
┌─────────────────────────────────────────────┐
│ 🍽️  Swiggy                        -₹450.00 │
│     Dining • 2:30 PM                        │
└─────────────────────────────────────────────┘
```

**Component Structure:**
```jsx
<TransactionRow
  icon="🍽️"
  category="Dining"
  merchant="Swiggy"
  amount={-450.00}
  timestamp="2:30 PM"
  status="auto" // or "manual"
/>
```

**Styles:**
```css
.transaction-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-default);
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.transaction-amount {
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  font-size: var(--text-amount-md);
  color: var(--loss-red); /* Debits in red */
}

.transaction-amount.credit {
  color: var(--profit-green); /* Credits in green */
}

.transaction-meta {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
```

**Scanability Features:**
- **Right-aligned amounts:** Eye naturally scans right column
- **Bold amounts:** Draws attention to key data
- **Category emoji + text:** Dual encoding for faster recognition

**Redacted PII State:**
```jsx
// When merchant name is masked
<TransactionRow
  merchant="Online Payment" // Generic label
  amount={-450.00}
  piiMasked={true} // Adds lock icon
/>
```

#### 3.2.2 Market Pulse Widget

**Collapsed State (Home Feed):**
```
┌─────────────────────────────────────────────┐
│ 📈 Market Pulse                             │
│                                             │
│ NIFTY 50      22,145  ▲ +0.85% ━━━━━━━    │
│ SENSEX        73,298  ▼ -0.12% ━━━━━━━    │
│ GOLD (₹/10g)  64,850  ▲ +1.23% ━━━━━━━    │
│                                             │
│ Markets up on IT sector gains →            │
└─────────────────────────────────────────────┘
```

**Component:**
```jsx
<MarketPulse
  indices={[
    { name: 'NIFTY 50', value: 22145, change: 0.85, sparkline: [...] },
    { name: 'SENSEX', value: 73298, change: -0.12, sparkline: [...] },
    { name: 'GOLD', value: 64850, change: 1.23, sparkline: [...] }
  ]}
  insight="Markets up on IT sector gains"
/>
```

**Styles:**
```css
.market-pulse-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.index-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.index-value {
  font-family: var(--font-mono);
  font-size: var(--text-amount-sm);
  font-weight: var(--font-bold);
}

.index-change {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.index-change.positive {
  color: var(--profit-green);
}

.index-change.negative {
  color: var(--loss-red);
}

.sparkline {
  width: 60px;
  height: 20px;
  /* Victory Native chart */
}
```

**Glanceability Feature:**
- **7-second scan target:** User should grasp all indices in one glance
- **Sparklines:** Trend context without reading numbers
- **Color-coded triangles:** ▲ (green) / ▼ (red) for instant direction

**Update Animation:**
```javascript
// When market data refreshes
Animated.sequence([
  Animated.timing(opacity, { toValue: 0.5, duration: 150 }),
  Animated.timing(opacity, { toValue: 1, duration: 150 })
]).start();
```

#### 3.2.3 Budget Progress Bar

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 🍽️ Dining                                   │
│ ₹3,200 / ₹4,000                             │
│ ████████████████░░░░░░ 80%                  │
└─────────────────────────────────────────────┘
```

**Component:**
```jsx
<BudgetBar
  category="Dining"
  spent={3200}
  limit={4000}
  warningThreshold={0.8} // Triggers alert color
/>
```

**Styles:**
```css
.budget-bar-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.budget-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

/* State-based colors */
.budget-bar-fill.safe {
  background: var(--profit-green); /* 0-79% */
}

.budget-bar-fill.warning {
  background: var(--alert-amber); /* 80-99% */
}

.budget-bar-fill.exceeded {
  background: var(--alert-critical); /* 100%+ */
}
```

**Behavioral Trigger:**
- At 80%: Bar turns amber + sends push notification
- At 100%: Bar turns red + triggers "EITM" card explaining overspend impact

---

### 3.3 Organisms

#### 3.3.1 EITM Card (Collapsed → Expanded States)

**The Core "Just-in-Time" Educational Component**

**Collapsed State (Feed):**
```
┌─────────────────────────────────────────────┐
│ 🤖 Explain It To Me                         │
│                                             │
│ Why did gold prices jump 4% today?         │
│                                             │
│ Tap to learn more →                         │
└─────────────────────────────────────────────┘
```

**Expanded State (Modal/Bottom Sheet):**
```
┌─────────────────────────────────────────────┐
│ 🤖 AI Explains: Gold Price Surge            │
│                                             │
│ Gold prices spiked due to [150-word        │
│ explanation in simple language]...         │
│                                             │
│ 💡 What this means for you:                │
│ Your Gold ETF gained ₹340 today            │
│                                             │
│ [Learn More in Gold 101] [Got It]          │
└─────────────────────────────────────────────┘
```

**Component Structure:**
```jsx
<EITMCard
  trigger="market_event" // or "transaction_spike"
  headline="Why did gold prices jump 4% today?"
  explanation="..." // AI-generated
  personalImpact={{
    holding: "Gold ETF",
    change: "+₹340"
  }}
  learnMoreLink="/learning-hub/gold-101"
  state="collapsed" // or "expanded" or "loading"
/>
```

**Styles:**
```css
.eitm-card {
  background: var(--ai-bg);
  border: 2px solid var(--ai-border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-md);
  position: relative;
}

/* AI Badge (Top-right corner) */
.eitm-card::before {
  content: "✨ AI";
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ai-gradient);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.eitm-headline {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.eitm-explanation {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: var(--text-secondary);
}

.eitm-impact-box {
  background: var(--profit-bg);
  border-left: 4px solid var(--profit-green);
  padding: 12px;
  margin-top: 16px;
  border-radius: 8px;
}
```

**Loading/Streaming State:**
```jsx
// When LLM is generating text (streaming)
<EITMCard state="loading">
  <SkeletonText lines={5} />
  <LoadingIndicator text="Claude is thinking..." />
</EITMCard>
```

**Animation (Streaming Text):**
```javascript
// Typewriter effect for AI response
const [displayedText, setDisplayedText] = useState('');
useEffect(() => {
  let currentIndex = 0;
  const interval = setInterval(() => {
    setDisplayedText(fullText.slice(0, currentIndex));
    currentIndex++;
    if (currentIndex > fullText.length) clearInterval(interval);
  }, 20); // 20ms per character
}, [fullText]);
```

**Accessibility:**
- Screen reader announces: "AI-generated explanation. Why did gold prices jump?"
- Escape key / swipe down dismisses modal
- High contrast mode increases border to 3px

**Privacy Indicator:**
```jsx
// Footer in expanded state
<Text style={styles.privacyNote}>
  🔒 Your data stays private. We masked account details before analysis.
</Text>
```

#### 3.3.2 Financial Vitals Dashboard

**Layout:**
```
┌─────────────────────────────────────────────┐
│ 💰 This Month                               │
│                                             │
│ ₹15,240                                     │
│ Total Spent                                 │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│ Last 7 days spending trend                  │
│                                             │
│ Top Categories:                             │
│ 🍽️ Dining       ₹3,200  ████████░░ 21%     │
│ 🛍️ Shopping     ₹2,800  ███████░░░ 18%     │
│ 🚗 Transport    ₹1,500  ████░░░░░░ 10%     │
│                                             │
│ 15% higher than last month ⚠️               │
└─────────────────────────────────────────────┘
```

**Component:**
```jsx
<FinancialVitals
  totalSpent={15240}
  categories={[
    { name: 'Dining', amount: 3200, percentage: 21, icon: '🍽️' },
    { name: 'Shopping', amount: 2800, percentage: 18, icon: '🛍️' },
    { name: 'Transport', amount: 1500, percentage: 10, icon: '🚗' }
  ]}
  weeklyTrend={[1200, 1800, 2100, 1600, 2400, 3200, 2940]}
  comparison={{ type: 'increase', percentage: 15 }}
/>
```

**Comparison Indicator:**
```css
.comparison-increase {
  color: var(--alert-amber);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
}

.comparison-decrease {
  color: var(--profit-green);
}
```

**Micro-interaction:**
```javascript
// Tap on category bar → Navigate to category detail
<TouchableOpacity onPress={() => navigateTo(`/category/${category.name}`)}>
  <CategoryBar {...category} />
</TouchableOpacity>
```

#### 3.3.3 Learning Path Card

**Visual Design (Based on LMS References):**
```
┌─────────────────────────────────────────────┐
│ 📚 Investing 101                            │
│                                             │
│ Learn the basics of stock market investing │
│                                             │
│ ⬤⬤⬤⬤⬤⬤⚪⚪  6/8 modules                    │
│                                             │
│ 🏆 75% Complete • Next: Risk Management     │
│                                             │
│ [Continue Learning →]                       │
└─────────────────────────────────────────────┘
```

**Component:**
```jsx
<LearningPathCard
  title="Investing 101"
  description="Learn the basics of stock market investing"
  progress={{ completed: 6, total: 8 }}
  nextModule="Risk Management"
  badgeEarned={false}
/>
```

**Progress Visualization:**
```css
.progress-dots {
  display: flex;
  gap: 8px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-tertiary);
}

.progress-dot.completed {
  background: var(--brand-primary);
}

.progress-dot.current {
  background: var(--brand-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**Gamification Hook:**
```jsx
// When all modules complete
<CompletionCelebration>
  <Confetti count={50} />
  <Badge variant="achievement" name="Investing Master" />
  <Text>You've earned the Investing Master badge! 🏆</Text>
</CompletionCelebration>
```

---

### 3.4 Templates

#### 3.4.1 Today's Feed (Home Screen)

**Layout Composition:**
```
┌─────────────────────────────────────────────┐
│ [Status Bar - Safe Area]                    │
│                                             │
│ Good Morning, Ananya 👋                     │
│ Wednesday, February 4                       │
│                                             │
│ [Market Pulse Widget]                       │
│                                             │
│ [EITM Card #1: Gold Price Surge]            │
│                                             │
│ [Financial Vitals Dashboard]                │
│                                             │
│ [EITM Card #2: Your Dining Habit]           │
│                                             │
│ [Recent Transactions]                       │
│ - Swiggy, ₹450                              │
│ - Uber, ₹180                                │
│ - Starbucks, ₹320                           │
│                                             │
│ [Bottom Tab Navigation - Safe Area]         │
└─────────────────────────────────────────────┘
```

**Scroll Behavior:**
- **Parallax Header:** Greeting fades out as user scrolls down
- **Sticky Market Pulse:** Widget "sticks" to top during market hours
- **Infinite Scroll:** Loads older EITM cards / transactions

**Pull-to-Refresh:**
```javascript
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={loading}
      onRefresh={fetchLatestData}
      tintColor={COLORS.brandPrimary}
    />
  }
>
```

#### 3.4.2 Transaction Detail (Deep Link Target)

**Accessed via:** Notification tap → Deep link → Detail screen

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [← Back]                    [Edit] [Delete] │
│                                             │
│ 🍽️                                          │
│ Swiggy                                      │
│                                             │
│ ₹450.00                                     │
│ Dining • UPI • 2:30 PM                      │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                             │
│ 💡 Did you know?                            │
│ [EITM Card: Dining spending is 40% above   │
│  your usual. Consider cooking at home 2x   │
│  this week to balance your budget]          │
│                                             │
│ Notes:                                      │
│ [Add a note...]                             │
│                                             │
│ Category: [Dining ▼]                        │
│                                             │
│ [Save Changes]                              │
└─────────────────────────────────────────────┘
```

**"Teachable Moment" Flow:**
1. User receives notification: "₹450 spent at Swiggy"
2. Taps notification → Deep links to this screen
3. **Contextual EITM card auto-appears** if spending pattern detected
4. User learns about overspending *in the moment* of transaction

**Component:**
```jsx
<TransactionDetail
  transaction={{
    id: 'txn_123',
    merchant: 'Swiggy',
    amount: 450,
    category: 'Dining',
    timestamp: '2:30 PM',
    source: 'auto'
  }}
  eitm={{
    trigger: 'spending_velocity',
    message: 'Dining spending is 40% above your usual...'
  }}
/>
```

---

## 4. Layout & Navigation Architecture

### 4.1 Bottom Tab Navigation (Primary)

**4 Core Tabs:**

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│          [Screen Content]                   │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│  🏠      📊      🎓      👤                 │
│ Feed  Vitals  Learn  Profile                │
└─────────────────────────────────────────────┘
```

**Tab Definitions:**

1. **Feed (🏠):** Today's Feed (Market Pulse + EITM + Recent Transactions)
2. **Vitals (📊):** Financial Dashboard (Budgets, Charts, Category Breakdown)
3. **Learn (🎓):** Learning Hub (Paths, Glossary, Quizzes)
4. **Profile (👤):** Settings, Goals, Account

**Active State:**
```css
.tab-active {
  color: var(--brand-primary);
  font-weight: var(--font-semibold);
  border-top: 2px solid var(--brand-primary);
}
```

**Tab Bar Height:**
- iOS: 49px (default) + Safe Area inset
- Android: 56px (Material Design spec)

### 4.2 Z-Index Strategy (Modal Layering)

**Layering Hierarchy (Low → High):**

```
Z-Index 1:    Base Content (Feed, Vitals)
Z-Index 10:   Sticky Headers (Market Pulse when scrolling)
Z-Index 50:   Bottom Sheets (EITM Expanded, Transaction Detail)
Z-Index 100:  Modals (Budget Setup, Goal Creation)
Z-Index 500:  Alerts (In-App Toasts, System Notifications)
Z-Index 1000: Loading Overlays (Full-screen spinner)
```

**Implementation:**
```javascript
const Z_INDEX = {
  base: 1,
  sticky: 10,
  bottomSheet: 50,
  modal: 100,
  toast: 500,
  overlay: 1000
};
```

### 4.3 Just-in-Time Modal Patterns

**Trigger:** User completes an action (transaction, market event)

**Modal Entry Animation:**
```javascript
// Bottom Sheet slides up from bottom
Animated.timing(translateY, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.cubic)
}).start();
```

**Backdrop:**
```css
.modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px); /* iOS Safari */
}
```

**Dismissal Gestures:**
- Swipe down (drag handle at top)
- Tap outside modal (backdrop)
- [X] button (top-right)

### 4.4 Deep Linking Schema

**URL Structure:**
```
finsight://transaction/{transactionId}
finsight://eitm/{cardId}
finsight://learning/{pathId}/{moduleId}
finsight://profile/goals
```

**Example Flow:**
1. Push notification: "₹450 spent at Swiggy"
2. User taps → Opens app with deep link:
   ```
   finsight://transaction/txn_123
   ```
3. App navigates to `TransactionDetail` screen with ID `txn_123`
4. EITM card auto-displays if spending anomaly detected

**React Navigation Setup:**
```javascript
const linking = {
  prefixes: ['finsight://', 'https://finsight.app'],
  config: {
    screens: {
      Transaction: 'transaction/:id',
      EITM: 'eitm/:id',
      Learning: 'learning/:pathId/:moduleId'
    }
  }
};
```

---

## 5. User Flows & Transitions

### 5.1 The "Teachable Moment" Flow (Critical Path)

**Scenario:** User makes 5th food delivery order this week

**Step-by-Step Flow:**

```
[Transaction Occurs]
    ↓
[Notification Listener Captures]
    ↓
[Regex Parsing: ₹450 to Swiggy]
    ↓
[Backend: Check spending velocity]
    ↓
[Trigger: Dining > 5 transactions in 7 days]
    ↓
[Generate EITM Card via LLM]
    ↓
[Push Notification: "New insight about your spending"]
    ↓
[User Taps Notification]
    ↓
[Deep Link → Transaction Detail Screen]
    ↓
[EITM Card Animates In]
    ↓
[User Reads: "You've ordered food 5x this week..."]
    ↓
[Call-to-Action: "Set a dining budget?"]
    ↓
[User Taps CTA → Budget Setup Modal]
    ↓
[User Sets Budget: ₹4,000/month]
    ↓
[Confirmation: "We'll alert you at 80%"]
    ↓
[Return to Feed]
```

**Design Decisions:**

1. **Notification Copy:**
   - **Bad:** "Transaction logged"
   - **Good:** "New insight about your spending 🔍"
   - Rationale: Creates curiosity (increases tap rate)

2. **EITM Card Timing:**
   - Appears 2 seconds after screen loads (allows user to see transaction first)
   - Animates with slide-up + fade-in

3. **CTA Placement:**
   - Bottom of EITM card (natural scroll endpoint)
   - Primary button style (high contrast)

**Transition Animation:**
```javascript
// EITM card entrance
Animated.parallel([
  Animated.timing(translateY, { toValue: 0, duration: 300 }),
  Animated.timing(opacity, { toValue: 1, duration: 300 })
]).start();
```

### 5.2 First-Time User Onboarding (FTUE)

**Screens (Linear Flow):**

1. **Welcome Splash**
   - Logo animation
   - Tagline: "Your Daily Money Mentor"
   - [Get Started]

2. **Value Proposition (3 Slides)**
   - Slide 1: "Track spending automatically"
   - Slide 2: "Learn with AI-powered insights"
   - Slide 3: "Achieve your financial goals"
   - Swipeable carousel with progress dots

3. **Permission Requests**
   - **Screen 1:** "Why we need notification access"
     - Illustrated graphic showing notification → auto-tracking
     - [Grant Access] / [I'll do it manually]
   - **Screen 2:** "Let's personalize your experience"
     - Request basic profile (age, income range)

4. **Risk Profile Assessment (8 Questions)**
   - Progress bar at top
   - Question types: Multiple choice, slider, scenario-based
   - [Previous] [Next] navigation

5. **Goal Setting**
   - "What's your primary goal?"
   - Options: Emergency Fund, Wealth Creation, Debt Repayment
   - Visual icons for each

6. **Onboarding Complete**
   - Celebration animation (confetti)
   - "You're all set! 🎉"
   - [Start Exploring]

**Design Patterns:**

- **Skip Option:** Available on value prop slides (not permission/assessment)
- **Back Navigation:** Allowed up to assessment screen
- **Progress Indicator:** Dots (slides) or bar (assessment)
- **Estimated Time:** "2 minutes to complete" (reduces abandonment)

**Transition:** Fade between slides (300ms)

### 5.3 Budget Alert → Action Flow

**Trigger:** User hits 80% of dining budget

**Flow:**

```
[Background: Transaction logged]
    ↓
[Check: Dining spent = ₹3,200 / ₹4,000 = 80%]
    ↓
[Send Push Notification (if app in background)]
  OR
[Show In-App Toast (if app in foreground)]
    ↓
[Notification Copy:]
  "⚠️ Dining Budget Alert"
  "You've spent ₹3,200 (80%) of your ₹4,000 budget"
    ↓
[User Taps Notification/Toast]
    ↓
[Navigate to: Budget Detail Screen]
    ↓
[Show Options:]
  - "Adjust budget to ₹5,000"
  - "View dining transactions"
  - "Dismiss"
    ↓
[User Selects Action]
    ↓
[Update Budget / Navigate / Dismiss]
```

**In-App Toast Design (iOS Workaround):**

Since iOS doesn't show system banners when app is open, we use a custom toast:

```jsx
<Toast
  visible={showToast}
  message="⚠️ 80% of dining budget used"
  action="View"
  onActionPress={() => navigateTo('/budgets/dining')}
  duration={5000}
  position="top"
/>
```

**Styles:**
```css
.toast-container {
  position: absolute;
  top: 60px; /* Below status bar */
  left: 16px;
  right: 16px;
  z-index: var(--z-toast);
  background: var(--alert-bg);
  border-left: 4px solid var(--alert-amber);
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  animation: slide-down 0.3s ease;
}

@keyframes slide-down {
  from { transform: translateY(-100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Auto-Dismiss:** Fades out after 5 seconds (unless user interacts)

---

## 6. Responsive Design & React Native Patterns

### 6.1 Device Considerations

**Target Devices:**
- **Primary:** Mid-range Android (1080x2340, 6.1")
- **Secondary:** iPhone 13/14 (1170x2532, 6.1")
- **Minimum:** Android 5.5" (720x1280)

**Breakpoints (for tablet support - future):**
```javascript
const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024
};
```

### 6.2 Safe Area Management

**iOS Notch/Dynamic Island:**
```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
  <Header />
  <ScrollView>
    {/* Content */}
  </ScrollView>
  <BottomTabs />
</SafeAreaView>
```

**Android Navigation Bar:**
```javascript
// Adjust for gesture navigation (edge-to-edge)
paddingBottom: insets.bottom || 16
```

### 6.3 Keyboard Avoidance

**Forms (Transaction Entry, Budget Setup):**
```jsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
>
  <Input placeholder="Enter amount" />
</KeyboardAvoidingView>
```

### 6.4 NativeWind (Tailwind for React Native)

**Setup:**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          dark: '#4F46E5'
        },
        profit: '#10B981',
        loss: '#EF4444'
      }
    }
  }
};
```

**Usage:**
```jsx
<View className="bg-white p-4 rounded-xl shadow-md">
  <Text className="text-xl font-semibold text-gray-800">
    Market Pulse
  </Text>
</View>
```

### 6.5 Performance Optimizations

**Image Optimization:**
```jsx
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
  // Lazy load images outside viewport
/>
```

**List Virtualization (Transactions):**
```jsx
<FlatList
  data={transactions}
  renderItem={({ item }) => <TransactionRow {...item} />}
  keyExtractor={(item) => item.id}
  windowSize={10} // Render 10 items above/below viewport
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
/>
```

**Memo for Expensive Components:**
```javascript
const MemoizedEITMCard = React.memo(EITMCard, (prev, next) => {
  return prev.id === next.id && prev.state === next.state;
});
```

---

## 7. Accessibility & Inclusive Design

### 7.1 Screen Reader Support

**Semantic Labels:**
```jsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="View market pulse details"
  accessibilityHint="Opens detailed market information"
  accessibilityRole="button"
>
  <MarketPulse />
</TouchableOpacity>
```

**Dynamic Content Announcements:**
```javascript
// When EITM card appears
AccessibilityInfo.announceForAccessibility(
  'New AI insight available. Why did gold prices jump 4% today?'
);
```

### 7.2 Color Contrast (WCAG AA)

**Minimum Ratios:**
- Normal text (16px): 4.5:1
- Large text (18px bold / 24px): 3:1

**Testing:**
- Text on white background: `#1F2937` (gray-800) = 14.77:1 ✓
- Green on white: `#10B981` (emerald-500) = 3.15:1 ✗ (fails for small text)

**Fix:**
```css
/* Use darker green for small text */
.profit-text-sm {
  color: #059669; /* Emerald 600 - 4.71:1 ✓ */
}
```

### 7.3 Font Scaling

**Support System Font Sizes:**
```javascript
// User sets "Large Text" in iOS Settings
const scaledFontSize = PixelRatio.getFontScale() * 16;

<Text style={{ fontSize: scaledFontSize }}>
  Transaction amount
</Text>
```

**Maximum Scale:** Cap at 200% to prevent layout breaks

### 7.4 Reduced Motion

**Respect User Preferences:**
```javascript
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
    setReduceMotion(enabled);
  });
}, []);

// Conditionally disable animations
const animationDuration = reduceMotion ? 0 : 300;
```

---

## 8. Animation & Micro-interactions

### 8.1 Principles

**Animation Goals:**
1. **Provide Feedback:** Confirm user actions (button press, swipe)
2. **Guide Attention:** Direct user to important info (new EITM card)
3. **Communicate Relationships:** Show data connections (budget → category)
4. **Delight:** Celebrate milestones (badge earned)

**Timing:**
- **Fast (100-200ms):** Button presses, toggles
- **Medium (300ms):** Page transitions, card expansions
- **Slow (500ms+):** Celebrations, onboarding

### 8.2 Key Animations

#### Button Press
```javascript
const scaleValue = useRef(new Animated.Value(1)).current;

const onPressIn = () => {
  Animated.spring(scaleValue, {
    toValue: 0.95,
    useNativeDriver: true
  }).start();
};

const onPressOut = () => {
  Animated.spring(scaleValue, {
    toValue: 1,
    friction: 3,
    tension: 40,
    useNativeDriver: true
  }).start();
};

<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
  <Button onPressIn={onPressIn} onPressOut={onPressOut} />
</Animated.View>
```

#### EITM Card Expansion
```javascript
const expandCard = () => {
  Animated.parallel([
    Animated.timing(height, {
      toValue: 400,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false // Height animation can't use native driver
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    })
  ]).start();
};
```

#### Transaction Entry (Swipe Actions)
```jsx
<Swipeable
  renderRightActions={() => (
    <View style={styles.deleteAction}>
      <Icon name="trash" color="white" />
    </View>
  )}
  onSwipeableRightOpen={() => deleteTransaction(id)}
>
  <TransactionRow {...transaction} />
</Swipeable>
```

#### Badge Unlock Celebration
```javascript
const BadgeCelebration = ({ badge }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View>
      <Confetti count={50} />
      <Animated.View
        style={{
          transform: [
            { scale },
            { rotate: rotation }
          ]
        }}
      >
        <Badge {...badge} />
      </Animated.View>
    </View>
  );
};
```

### 8.3 Loading States

**Skeleton Screens (vs. Spinners):**
```jsx
const SkeletonCard = () => (
  <View style={styles.skeleton}>
    <ShimmerPlaceholder
      visible={false}
      style={{ width: '60%', height: 20, borderRadius: 4 }}
    />
    <ShimmerPlaceholder
      visible={false}
      style={{ width: '40%', height: 16, borderRadius: 4, marginTop: 8 }}
    />
  </View>
);
```

**Benefits:** Communicates structure, feels faster than spinner

---

## 9. Design Tokens & Implementation

### 9.1 Token Structure (JSON)

**Design Tokens File (`tokens.json`):**
```json
{
  "colors": {
    "brand": {
      "primary": "#6366F1",
      "primaryDark": "#4F46E5",
      "primaryLight": "#818CF8"
    },
    "semantic": {
      "profit": "#10B981",
      "loss": "#EF4444",
      "alertAmber": "#F59E0B",
      "alertCritical": "#DC2626"
    },
    "ai": {
      "gradient": "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)",
      "border": "#A78BFA",
      "background": "#F5F3FF"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter",
      "mono": "SF Mono"
    },
    "fontSize": {
      "xs": 12,
      "sm": 14,
      "base": 16,
      "lg": 18,
      "xl": 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36
    },
    "fontWeight": {
      "regular": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  },
  "spacing": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "6": 24,
    "8": 32,
    "12": 48
  },
  "borderRadius": {
    "sm": 4,
    "md": 8,
    "lg": 12,
    "xl": 16,
    "full": 9999
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px rgba(0, 0, 0, 0.07)",
    "lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
    "modal": "0 20px 25px rgba(0, 0, 0, 0.15)"
  }
}
```

### 9.2 React Native Implementation

**Theme Provider:**
```javascript
import { ThemeProvider } from './theme/ThemeContext';
import tokens from './theme/tokens.json';

const App = () => (
  <ThemeProvider value={tokens}>
    <NavigationContainer>
      {/* App screens */}
    </NavigationContainer>
  </ThemeProvider>
);
```

**Using Tokens:**
```javascript
import { useTheme } from './theme/ThemeContext';

const TransactionRow = () => {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.brand.primary,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg
    }}>
      <Text style={{
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.semibold
      }}>
        Transaction
      </Text>
    </View>
  );
};
```

### 9.3 Dark Mode (Future Enhancement)

**Token Extension:**
```json
{
  "colors": {
    "light": {
      "bgPrimary": "#FFFFFF",
      "textPrimary": "#1F2937"
    },
    "dark": {
      "bgPrimary": "#1F2937",
      "textPrimary": "#F9FAFB"
    }
  }
}
```

**Implementation:**
```javascript
import { useColorScheme } from 'react-native';

const scheme = useColorScheme(); // 'light' or 'dark'
const colors = theme.colors[scheme];
```

---

## 10. Research-Backed Design Decisions

### 10.1 Just-in-Time Intervention UI (Fernandes et al., 2014)

**Research Finding:**
> "Financial literacy education has decaying effects unless reinforced at decision points."

**Design Application:**

1. **Contextual Pop-ups Over Static Menus:**
   - ❌ **Bad:** "Learning Hub" tab with generic articles
   - ✅ **Good:** EITM card appears when user makes 5th food order
   - **Why:** Attaches learning to the *moment* of spending decision

2. **Notification-Triggered Education:**
   - Transaction notification → Deep link → EITM card
   - User learns *why* their spending matters *as it happens*

3. **Progressive Disclosure:**
   - Collapsed EITM (headline only) → Tap for full explanation
   - Prevents information overload while maintaining accessibility

**Measurement:**
- Track time between transaction and EITM engagement
- Target: <5 minutes (while decision context is fresh)

### 10.2 Privacy-First Visuals (PII Masking)

**Research Finding:**
> LLMs require data transmission; users fear privacy breaches.

**Design Application:**

1. **Visual Redaction Component:**
   ```jsx
   <MaskedText value="123456789" pattern="****-{last4}" />
   // Renders: ****-6789 with gray background
   ```

2. **AI Badge Transparency:**
   - Every EITM card shows "✨ AI" badge
   - Footer text: "🔒 Your data stays private. We masked account details."

3. **Privacy Reassurance in Onboarding:**
   - Screen showing: "We see: ₹450 to Swiggy" | "We DON'T see: Account number, full name"
   - Visual diagram of PII flow (redaction before API call)

**Measurement:**
- Survey: "Do you trust FinSight with your financial data?" (Target: >80% "Yes")

### 10.3 Loss Aversion Color Psychology (Thaler & Sunstein, 2008)

**Research Finding:**
> People feel losses 2x more intensely than gains.

**Design Application:**

1. **Alert Color Triggers:**
   - **80% Budget:** Amber (warning, still time to act)
   - **100% Budget:** Red (loss occurred, immediate action)
   - **Rationale:** Amber triggers loss aversion *before* actual loss

2. **De-emphasizing Losses:**
   - Market losses shown in smaller font than explanation
   - Focus on "What you can do" vs. "How much you lost"

3. **Celebrating Gains:**
   - Green values + confetti animation for savings milestones
   - Positive reinforcement > negative punishment

**Measurement:**
- A/B test: Amber alert at 80% vs. 90% (which reduces overspend more?)

### 10.4 iOS Notification Limitation Workaround

**Technical Constraint:**
> iOS doesn't show system banners when app is in foreground.

**Design Solution:**

1. **Custom In-App Toast:**
   - Slides down from top (mimics system notification)
   - Same copy as push notification (consistency)
   - Auto-dismisses after 5 seconds

2. **Visual Distinction:**
   - Amber border (alert) vs. system gray
   - Action button: "View" (direct navigation)

3. **Fallback for Background:**
   - Standard push notification if app closed/backgrounded

**Measurement:**
- Engagement rate: In-app toast vs. push notification (target: >60% parity)

---

## 11. Design Handoff Specifications

### 11.1 Figma File Structure

**Recommended Organization:**
```
FinSight Design System
├── 🎨 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── ⚛️ Components
│   ├── Atoms (Buttons, Icons, Badges)
│   ├── Molecules (Transaction Row, Market Pulse)
│   └── Organisms (EITM Card, Dashboard)
├── 📱 Screens
│   ├── Onboarding
│   ├── Feed
│   ├── Vitals
│   ├── Learning Hub
│   └── Profile
└── 🔄 Flows
    ├── Teachable Moment
    ├── Budget Alert
    └── First-Time User
```

### 11.2 Developer Handoff Checklist

- [ ] All components use design tokens (no hardcoded values)
- [ ] Responsive breakpoints defined for tablet support
- [ ] Accessibility labels on all interactive elements
- [ ] Animation durations specified (in ms)
- [ ] Loading/error/empty states designed for each screen
- [ ] Dark mode variants (if launching with dark mode)
- [ ] Prototype links for complex flows (Teachable Moment, FTUE)

### 11.3 Zeplin / Figma Inspect

**Export Settings:**
- **iOS:** @2x, @3x (PNG for icons, SVG where supported)
- **Android:** mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- **Fonts:** Include Inter and SF Mono font files

**Annotations:**
- Specify dynamic values (e.g., "Transaction amount from API")
- Conditional states (e.g., "Show badge if streak >7 days")

---

## 12. Appendices

### Appendix A: Design System Changelog

| **Version** | **Date** | **Changes** |
|-------------|----------|-------------|
| 1.0 | Feb 4, 2026 | Initial design system |
| 1.1 (Planned) | Mar 2026 | Add dark mode tokens |
| 2.0 (Planned) | May 2026 | Vernacular language support (Hindi typography) |

### Appendix B: Component Status

| **Component** | **Status** | **Figma** | **Coded** |
|---------------|-----------|-----------|-----------|
| EITM Card | ✅ Complete | ✅ | ⏳ In Progress |
| Transaction Row | ✅ Complete | ✅ | ✅ |
| Market Pulse | ✅ Complete | ✅ | ❌ Not Started |
| Budget Bar | ✅ Complete | ✅ | ❌ Not Started |
| Learning Path Card | ⏳ In Review | ✅ | ❌ Not Started |

### Appendix C: Research References

1. Fernandes, D., Lynch Jr, J. G., & Netemeyer, R. G. (2014). "Financial Literacy, Financial Education, and Downstream Financial Behaviors." *Management Science*, 60(8), 1861-1883.
2. Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness*. Yale University Press.
3. Nielsen Norman Group. (2020). "Mobile Design Guidelines for Scannable Content."
4. Material Design 3 (2023). Google's design system for Android.
5. Human Interface Guidelines (2023). Apple's design system for iOS.

### Appendix D: Design Critique Questions

**Before Implementation, Ask:**
1. Does this design respect the user's time? (Glanceability)
2. Is privacy transparent? (PII masking visible)
3. Does this trigger the right behavioral response? (Loss aversion)
4. Is this accessible to all users? (WCAG AA)
5. Does this delight without distracting? (Purposeful animation)

---

## 13. Next Steps

### 13.1 Design Phase Timeline

**Week 1-2:** High-fidelity mockups (all MVP screens)  
**Week 3:** Interactive prototype (Teachable Moment flow)  
**Week 4:** Design QA + Developer handoff  
**Week 5+:** Support development (component reviews, edge cases)

### 13.2 Collaboration Points

**Weekly Sync with:**
- **Engineering:** Component feasibility, animation performance
- **Product:** Feature prioritization, metric alignment
- **Content:** EITM card copy, learning module tone

### 13.3 User Testing

**Plan:**
- **Prototype Testing:** 5 users (Week 3)
- **Beta Testing:** 50 users (Month 4)
- **Metrics:** Time-to-complete tasks, SUS score, emotional response

---

**Document Status:** Ready for Development Handoff  
**Owner:** Design Team  
**Next Review:** March 2026 (Post-MVP Launch)

---

*This design document is a living artifact. Updates will be versioned and communicated via Slack #design-updates channel.*