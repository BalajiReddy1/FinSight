# Product Requirements Document (PRD)
# FinSight: Your Daily Money Mentor

**Version:** 1.0  
**Date:** February 4, 2026  
**Document Owner:** Product Team  
**Status:** Draft for Review

---

## 1. Product Overview

### 1.1 Vision
To become India's most trusted daily financial companion, transforming how Millennials and Gen Z engage with money through contextual, just-in-time education delivered at moments of financial decision-making.

### 1.2 Mission
Empower young Indians to build lasting financial wellness by bridging the gap between high fintech adoption and low financial literacy through intelligent, contextual learning experiences integrated into their daily financial lives.

### 1.3 Value Proposition

**For Indian Millennials and Gen Z who** are overwhelmed by fragmented financial tools and confusing financial jargon,

**FinSight is a** unified mobile financial mentor

**That** automatically tracks spending, delivers contextual market insights, and provides just-in-time financial education at the moment of transactions and market events,

**Unlike** traditional budgeting apps (Walnut, Money View) or standalone news apps (Moneycontrol, ET Markets)

**Our product** combines automated expense intelligence, real-time market awareness, and AI-powered explanations in a single daily habit loop—eliminating app-switching while building genuine financial literacy through micro-learning moments.

### 1.4 Success Metrics (North Star)
- **Primary:** Daily Active Users (DAU) with 3+ feed interactions
- **Secondary:** 
  - EITM card completion rate (>60%)
  - Automated transaction capture rate (>85% of digital transactions)
  - 30-day retention rate (>40%)
  - Financial literacy score improvement (pre/post assessment)

---

## 2. User Personas

### Persona 1: "Aspirational Ananya" (Gen Z Student/Early Career)

**Demographics:**
- Age: 22
- Occupation: Junior Analyst at startup
- Income: ₹30,000/month
- Location: Bangalore

**Behaviors:**
- Uses UPI 15-20 times/day (coffee, swiggy, uber)
- Has a Zerodha account but hasn't placed a trade
- Follows FinTwit but doesn't understand half the terms
- Uses BNPL services (Simpl, ZestMoney)

**Pain Points:**
- "I spend ₹8k on food delivery monthly but don't realize it until credit card bill arrives"
- "When I see 'RBI hikes repo rate,' I panic-Google but forget the explanation next time"
- "I want to invest but intimidated by market jargon"

**Goals:**
- Build an emergency fund (₹50k)
- Understand basic investing concepts
- Control impulsive spending

**FinSight Value:**
- Instant spending alerts when ordering food 5th time this week
- EITM card explaining repo rate impact on her future EMIs (contextual to her loan inquiry)
- Gamified learning paths that unlock investing badges

---

### Persona 2: "Stable Sameer" (Millennial Professional)

**Demographics:**
- Age: 31
- Occupation: Product Manager
- Income: ₹1.2L/month
- Location: Pune

**Behaviors:**
- Has SIPs in 3 mutual funds (set-and-forget)
- Checks stock market once daily
- Uses Excel for expense tracking (last updated 3 months ago)
- Subscribes to ET Prime but doesn't read regularly

**Pain Points:**
- "I have 4 budgeting apps installed; none are synced"
- "Market movements stress me but I don't know which news is signal vs. noise"
- "My wife asks where money went—I just shrug"

**Goals:**
- Holistic view of household finances
- Understand portfolio performance drivers
- Plan for child's education fund

**FinSight Value:**
- Unified dashboard showing all expenses without manual entry
- Daily Market Pulse curated to his portfolio holdings
- Contextual alerts when his MF sectors are affected by policy news

---

## 3. Problem Statement & Research Gap

### 3.1 The "High Tech, Low Literacy" Paradox

**Market Context (India 2025-26):**
- **UPI Transactions:** 15+ billion/month (NPCI data)
- **Demat Accounts:** 180M+ active (SEBI data)
- **Financial Literacy Score:** 27/100 (NCFE Survey 2023)

**The Disconnect:**
Indian youth have the *tools* (trading apps, digital payments) but lack the *knowledge* to use them wisely. This manifests as:
1. **Impulse Spending:** Average Gen Z has 3+ BNPL accounts with ₹15k+ outstanding
2. **Investment FOMO:** 40% of new equity investors in 2024 had <6 months market exposure before loss-making trades
3. **Tool Fragmentation:** Users juggle 4-7 finance apps, leading to abandonment (avg. 14-day retention for budgeting apps)

### 3.2 Why Existing Solutions Fail

| **Solution Type** | **Examples** | **Limitation** |
|-------------------|--------------|----------------|
| Budgeting Apps | Walnut, Money View | Require manual categorization; static, not contextual |
| News/Market Apps | Moneycontrol, Groww News | Information overload; no personalization or simplification |
| Learning Platforms | Varsity by Zerodha | Passive learning; no connection to user's real transactions |
| Aggregators | Perfios, Finvu | B2B focus; lack consumer UX and educational layer |

### 3.3 Research Foundation

**Academic Backing:**
- **Fernandes et al. (2014):** "Financial education has decaying effects unless reinforced at decision points"—justifies just-in-time intervention model
- **Thaler & Sunstein (2008):** "Choice architecture" and nudge theory—basis for budget alerts and micro-learning

**Regulatory Alignment:**
- **NSFE 2020-2025 (RBI/SEBI/IRDAI):** Mandates mobile-first, technology-enabled financial education targeting youth
- **Account Aggregator Framework (2021):** Enables consent-based data sharing (supports future AA integration)

**Behavioral Insight:**
Micro-learning (3-5 minute modules) at moments of relevance shows 78% better retention vs. traditional 60-minute courses (Learning Pool Research, 2023).

---

## 4. Functional Requirements

### 4.1 Module 1: User Onboarding & Profiling

**FR-1.1: Financial Assessment Wizard**
- **Description:** 8-question flow to determine risk profile, goals, and current financial health
- **Questions Include:**
  1. Age bracket and income range
  2. Current savings vs. income ratio
  3. Investment experience (none / beginner / intermediate)
  4. Primary financial goal (emergency fund / wealth creation / debt repayment)
  5. Risk tolerance scenario (market crash reaction)
  6. Preferred learning style (videos / articles / quizzes)
- **Output:** User tagged with profile (`conservative_saver`, `growth_seeker`, `debt_reducer`)
- **Acceptance Criteria:**
  - Completion time <3 minutes
  - Profile influences content personalization (EITM topics, recommended learning paths)

**FR-1.2: Permissions Setup**
- **Android:** Request notification access with clear privacy explanation
- **iOS:** Prompt for manual transaction logging (AA integration for future)
- **Acceptance Criteria:**
  - 70%+ users grant notification access
  - Privacy policy displayed in-app before permission request

---

### 4.2 Module 2: "Today's Feed" (Home Screen)

**FR-2.1: Market Pulse Widget**
- **Data Sources (MVP):** 
  - Mock JSON for NIFTY 50, SENSEX, GOLD, USD/INR
  - Future: NSE API integration (via BSE/NSE approved vendors)
- **Display Elements:**
  - Index name + current value + % change (color-coded: green/red)
  - Micro-chart (sparkline showing 7-day trend)
  - Single-line insight: "Markets up on IT sector gains"
- **Update Frequency:** Every 5 minutes during market hours (9:15 AM - 3:30 PM IST)
- **Acceptance Criteria:**
  - Widget loads in <2 seconds
  - Data updates without full screen refresh

**FR-2.2: "Explain It To Me" (EITM) Cards**
- **Trigger Conditions:**
  1. Major market movement (>2% index change)
  2. RBI/SEBI policy announcement
  3. Sector-specific news related to user's portfolio
  4. User's transaction category spike (e.g., dining +50% vs. last week)
- **Card Structure:**
  - **Headline:** "Why did gold prices jump 4%?" (question format)
  - **Simple Explanation (150 words):** AI-generated, ELI15 language
  - **Impact on You:** Personalized connection (e.g., "Your gold ETF gained ₹340 today")
  - **Learn More:** Link to 3-min explainer in Learning Hub
- **AI Processing:**
  - **Input:** News headline + user context (risk profile, holdings)
  - **LLM Prompt:** "Explain [event] in simple Hindi-English mix (Hinglish) for a 25-year-old beginner. Max 150 words. Use analogy."
  - **Safety:** PII redaction before API call (mask account numbers, names)
- **Acceptance Criteria:**
  - Card generation latency <5 seconds
  - 70%+ users swipe to "Learn More" on first card
  - User feedback rating >4/5

**FR-2.3: Financial Vitals Dashboard**
- **Display Metrics:**
  - **This Month:** Total spent, Top 3 categories (with %), Budget remaining
  - **Mini-Chart:** 7-day spending trend
  - **Comparison:** "15% higher than last month" (color-coded warning)
- **Data Source:** Parsed transactions from notification listener + manual entries
- **Acceptance Criteria:**
  - Auto-categorization accuracy >80%
  - Dashboard loads with skeleton UI in <1 second

---

### 4.3 Module 3: Automated Expense Tracking

**FR-3.1: Notification Listener (Android)**
- **Implementation:**
  - Use `react-native-android-notification-listener` package
  - Background service monitors notifications from whitelisted apps:
    - Payment: GPay, PhonePe, Paytm, BHIM
    - Banking: SBI, HDFC, ICICI, Axis (top 10 banks)
- **Parsing Logic:**
  - Regex patterns to extract:
    - Amount: `(?:INR|Rs\.?)\s*([0-9,]+(?:\.[0-9]{2})?)`
    - Transaction type: `(debited|credited|paid|received)`
    - Merchant/Payee: Context-based extraction (e.g., "paid to Swiggy")
  - **Example Notification:**  
    ```
    "HDFC Bank: INR 450.00 debited from A/c XX1234 on 04-Feb-26 at Starbucks via UPI"
    ```
    **Parsed Output:**  
    ```json
    {
      "amount": 450.00,
      "type": "debit",
      "category": "Dining",
      "merchant": "Starbucks",
      "date": "2026-02-04",
      "source": "HDFC UPI"
    }
    ```
- **Privacy Compliance:**
  - Store only: Amount, Category, Date, Generic merchant name
  - Discard: Account numbers, full notification text
  - Google Play requirement: Don't read "full SMS"; only act on notification metadata
- **Acceptance Criteria:**
  - Capture rate >85% for top 10 banks
  - False positive rate <5%
  - Battery drain <3% over 24 hours

**FR-3.2: Manual Entry Fallback**
- **Use Cases:** Cash transactions, iOS users, failed auto-capture
- **Input Fields:** Amount, Category (dropdown), Date (calendar), Notes (optional)
- **Quick Add:** Floating action button on Feed screen
- **Acceptance Criteria:**
  - Form completion in <20 seconds
  - Auto-suggest category based on past entries

**FR-3.3: Transaction Categorization**
- **Categories (14 total):**
  - Essentials: Groceries, Utilities, Rent/EMI, Healthcare
  - Lifestyle: Dining, Shopping, Entertainment, Travel
  - Savings: Investments, Insurance
  - Others: Education, Gifts, Miscellaneous
- **Auto-Categorization Rules:**
  - Merchant mapping (e.g., "Swiggy" → Dining)
  - Fallback to ML model (keyword-based classification)
- **User Override:** Swipe left on transaction → Edit category
- **Acceptance Criteria:**
  - 80%+ accuracy on first-pass categorization
  - User corrections feed into model retraining (future)

---

### 4.4 Module 4: Learning Hub

**FR-4.1: Structured Learning Paths**
- **Predefined Paths (MVP):**
  1. **"Investing 101"** (8 modules): Stocks, MFs, SIPs, Risk, Diversification
  2. **"Budgeting Basics"** (5 modules): 50-30-20 rule, Emergency fund, Debt management
  3. **"Tax Simplified"** (6 modules): ITR filing, Sections 80C/80D, Capital gains
- **Module Structure:**
  - 3-5 min read/video
  - Interactive quiz (3 MCQs)
  - Progress badge on completion
- **Unlocking Mechanism:** Complete Path 1 to unlock Path 2 (gamification)
- **Acceptance Criteria:**
  - 50%+ users complete at least 1 module in first week
  - Quiz pass rate >70%

**FR-4.2: Glossary (FinVocab)**
- **Search-based glossary:** 100+ terms (SIP, CAGR, NAV, Repo Rate)
- **Integration:** Clickable terms in EITM cards → Opens glossary definition
- **Acceptance Criteria:**
  - Term definitions <100 words
  - Voice search enabled (future)

---

### 4.5 Module 5: Budget Nudges & Alerts

**FR-5.1: Real-Time Budget Alerts**
- **Trigger Logic:**
  - When category spending hits 80%, 100%, 120% of monthly budget
  - When user makes 5th transaction in a category within 7 days (habit alert)
- **Notification Format:**  
  ```
  "⚠️ You've spent ₹3,200 (80%) of your ₹4,000 dining budget. Want to adjust or continue?"
  ```
- **Actions:** [View Details] [Adjust Budget] [Dismiss]
- **Acceptance Criteria:**
  - Alert delivery latency <30 seconds post-transaction
  - Click-through rate >40%

**FR-5.2: Weekly Spending Summary**
- **Delivery:** Every Monday, 9 AM
- **Content:**
  - Last week's total spend vs. previous week
  - Top overspending category
  - Motivational message (if under budget: "Great job! 🎉")
- **Acceptance Criteria:**
  - Open rate >50%

---

## 5. Technical Specifications

### 5.1 Technology Stack

**Frontend:**
- **Framework:** Expo SDK 52+ (React Native 0.76+)
- **Styling:** NativeWind (Tailwind CSS for RN)
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** React Navigation 7.x (with Expo Router support)
- **Charts:** Victory Native (for sparklines and spending charts)
- **Forms:** React Hook Form + Yup validation

**Backend (MVP - Serverless):**
- **Platform:** Firebase (Auth, Firestore, Cloud Functions)
- **Authentication:** Firebase Auth (Phone OTP + Google Sign-In)
- **Database:** 
  - Firestore (user profiles, transactions, budgets)
  - Schema design:
    ```
    users/{userId}
      ├── profile (risk_profile, goals, preferences)
      ├── transactions (subcollection)
      ├── budgets (subcollection)
      └── learning_progress
    ```
- **APIs:**
  - Market data: Alpha Vantage (free tier) or NSE direct (future)
  - AI: OpenAI GPT-4 API (or Anthropic Claude)

**Third-Party Integrations:**
- **Notification Listener:** `react-native-android-notification-listener` v1.5+
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Analytics:** Mixpanel (event tracking) + Firebase Analytics

**Future Enhancements:**
- **Account Aggregator:** Setu AA / Sahamati SDK
- **On-Device AI:** `react-native-executorch` with Llama 3.2 (1B model)

---

### 5.2 Notification Listener Implementation Details

**Android Background Service:**
```javascript
// NotificationListenerService.js (Native Module)
import { NotificationListenerService } from 'react-native-android-notification-listener';

const WHITELISTED_APPS = [
  'com.google.android.apps.nbu.paisa.user', // GPay
  'com.phonepe.app',
  'net.one97.paytm',
  'com.sbi.lotusfleet', // SBI
  'com.snapwork.hdfc',
  // ... top 20 banking/payment apps
];

const TRANSACTION_REGEX = {
  amount: /(?:INR|Rs\.?|₹)\s*([0-9,]+(?:\.[0-9]{2})?)/,
  type: /(debited|credited|paid|received|sent)/i,
  merchant: /(?:to|at|for)\s+([A-Za-z0-9\s]+?)(?:\s+via|\s+on|$)/,
};

export const parseNotification = (notification) => {
  if (!WHITELISTED_APPS.includes(notification.packageName)) {
    return null;
  }
  
  const text = notification.text || '';
  const title = notification.title || '';
  const fullText = `${title} ${text}`;
  
  // Extract amount
  const amountMatch = fullText.match(TRANSACTION_REGEX.amount);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  
  // Extract type
  const typeMatch = fullText.match(TRANSACTION_REGEX.type);
  const type = typeMatch ? typeMatch[1].toLowerCase() : 'debit';
  
  // Extract merchant (best effort)
  const merchantMatch = fullText.match(TRANSACTION_REGEX.merchant);
  const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';
  
  // Auto-categorize
  const category = categorizeMerchant(merchant);
  
  return {
    amount,
    type,
    merchant,
    category,
    date: new Date().toISOString(),
    source: notification.packageName,
    // PII REDACTION: Do NOT store account numbers
  };
};

const categorizeMerchant = (merchant) => {
  const lowerMerchant = merchant.toLowerCase();
  const categoryMap = {
    'dining': ['swiggy', 'zomato', 'starbucks', 'dominos', 'mcdonald'],
    'shopping': ['amazon', 'flipkart', 'myntra', 'ajio'],
    'transport': ['uber', 'ola', 'rapido'],
    'groceries': ['bigbasket', 'blinkit', 'dunzo', 'dmart'],
    'utilities': ['electricity', 'gas', 'water', 'jio', 'airtel'],
    // ... extended mappings
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(kw => lowerMerchant.includes(kw))) {
      return category;
    }
  }
  return 'miscellaneous';
};
```

**Privacy & Compliance:**
- **Data Minimization:** Store only transaction metadata (amount, category, date), NOT full notification text
- **Local Processing:** Regex parsing happens on-device; only parsed data sent to Firestore
- **User Consent:** Explicit permission screen explaining data usage
- **Google Play Policy Alignment:** 
  - Declare `BIND_NOTIFICATION_LISTENER_SERVICE` in AndroidManifest.xml
  - Privacy policy must state: "We access transaction notifications to automate expense logging. No SMS content is read or stored."

---

### 5.3 AI Integration (EITM Feature)

**Cloud-Based LLM (MVP):**
```javascript
// services/eitm.service.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateEITMCard = async (newsHeadline, userContext) => {
  // PII Masking
  const sanitizedContext = {
    riskProfile: userContext.riskProfile,
    holdingsGeneral: userContext.holdings.map(h => h.sector), // Only sectors, not specific stocks
    age: userContext.age,
    // NO: account numbers, names, precise portfolio values
  };
  
  const prompt = `
You are a financial educator for young Indian millennials. Explain this news in simple terms:

Headline: "${newsHeadline}"
User Profile: ${JSON.stringify(sanitizedContext)}

Requirements:
- Use Hinglish (Hindi-English mix) where appropriate
- Maximum 150 words
- Include 1 relatable analogy
- Explain impact on someone with risk profile: ${userContext.riskProfile}
- Avoid jargon; if using terms, define them inline

Format:
{
  "headline": "Why did this happen?",
  "explanation": "...",
  "impact": "What this means for you...",
  "analogy": "Think of it like..."
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

**Future: On-Device AI**
- **Model:** Llama 3.2 (1B parameter) via `react-native-executorch`
- **Benefit:** Zero latency, complete privacy (no data leaves device)
- **Challenge:** Model size (2GB+) requires on-demand download
- **Fallback:** Hybrid approach—on-device for simple queries, cloud for complex analysis

---

### 5.4 Data Schema (Firestore)

**Users Collection:**
```json
{
  "userId": "abc123",
  "profile": {
    "name": "Ananya",
    "age": 22,
    "riskProfile": "growth_seeker",
    "primaryGoal": "emergency_fund",
    "preferences": {
      "notifications": true,
      "language": "en-IN"
    }
  },
  "budgets": [
    {
      "category": "dining",
      "monthlyLimit": 4000,
      "currentSpend": 3200,
      "month": "2026-02"
    }
  ],
  "learningProgress": {
    "completedModules": ["investing101_m1", "investing101_m2"],
    "currentPath": "investing101",
    "badges": ["first_module"]
  }
}
```

**Transactions Subcollection:**
```json
{
  "transactionId": "txn_456",
  "amount": 450.00,
  "type": "debit",
  "category": "dining",
  "merchant": "Starbucks",
  "date": "2026-02-04T10:30:00Z",
  "source": "auto", // or "manual"
  "notes": ""
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance

**NFR-1: App Launch Time**
- **Target:** <3 seconds on mid-range Android devices (Snapdragon 6-series)
- **Strategy:** Lazy load modules, skeleton screens for async data

**NFR-2: Feed Refresh**
- **Target:** <2 seconds for Today's Feed to display initial content
- **Strategy:** Cached market data + optimistic UI updates

**NFR-3: Background Service**
- **Target:** Notification listener consumes <50MB RAM, <3% battery/day
- **Strategy:** Event-driven processing (not continuous polling)

### 6.2 Security & Privacy

**NFR-4: PII Protection**
- **Requirement:** No account numbers, full names, or precise addresses stored in Firestore
- **Implementation:**
  - Client-side redaction before Firestore write
  - Server-side validation (Cloud Functions) to reject PII
  - Regex patterns to detect and mask sensitive data

**NFR-5: Data Encryption**
- **At Rest:** Firestore default encryption
- **In Transit:** HTTPS/TLS 1.3 for all API calls
- **Local Storage:** React Native Encrypted AsyncStorage for auth tokens

**NFR-6: Compliance**
- **Permissions:** Justify notification access in Privacy Policy (Google Play requirement)
- **User Control:** Settings to disable auto-tracking + delete all data
- **GDPR-lite:** Export data feature (JSON download)

### 6.3 Accessibility

**NFR-7: Inclusive Design**
- **Color Contrast:** WCAG AA compliance (4.5:1 ratio)
- **Screen Readers:** All UI elements have accessibility labels
- **Font Scaling:** Support system font size settings (up to 200%)

### 6.4 Offline Capability

**NFR-8: Core Features Offline**
- **Available Offline:**
  - View past transactions (cached in AsyncStorage)
  - Manual transaction entry (queued for sync)
  - Learning Hub articles (preloaded)
- **Unavailable Offline:**
  - Market Pulse (requires live data)
  - EITM card generation (requires AI API)

**NFR-9: Sync Behavior**
- **Strategy:** Optimistic UI + background sync when online
- **Conflict Resolution:** Server timestamp wins for transaction edits

### 6.5 Scalability

**NFR-10: User Growth**
- **Target:** Support 100K DAU by Month 6
- **Firebase Limits:**
  - Firestore: 1M concurrent connections (sufficient)
  - Cloud Functions: Auto-scaling (cold start mitigation with min instances)

---

## 7. Roadmap

### 7.1 MVP (Semester 1 - Months 1-4)

**Phase 1.1: Foundation (Month 1)**
- [ ] React Native project setup + CI/CD (GitHub Actions)
- [ ] Authentication flow (Phone OTP)
- [ ] Onboarding wizard with risk assessment
- [ ] Basic UI shell (navigation, theme)

**Phase 1.2: Core Features (Months 2-3)**
- [ ] Today's Feed UI (Market Pulse + placeholder EITM cards)
- [ ] Notification listener implementation (Android)
- [ ] Transaction parsing + Firestore integration
- [ ] Financial Vitals dashboard
- [ ] Manual transaction entry

**Phase 1.3: AI & Learning (Month 4)**
- [ ] OpenAI API integration for EITM cards
- [ ] Learning Hub with 3 predefined paths
- [ ] Budget alert notifications
- [ ] Internal beta testing (50 users)

**MVP Success Criteria:**
- 85%+ transaction auto-capture rate
- 60%+ EITM card engagement
- 30-day retention >35%

---

### 7.2 Phase 2: Enhanced Intelligence (Months 5-8)

**Features:**
- [ ] Account Aggregator (AA) integration (Setu SDK)
  - Consent-based bank statement fetch
  - 100% transaction accuracy (vs. 85% with notification parsing)
- [ ] Gamification:
  - Streaks (7-day, 30-day tracking)
  - Badges (Gold Investor, Budget Master, Learning Champion)
  - Leaderboard (anonymous, among friends)
- [ ] Advanced Nudges:
  - "Your dining spend is 40% higher than peers in your city"
  - "Based on market trends, consider rebalancing your portfolio"
- [ ] iOS Support:
  - Manual entry + AA integration (no notification access)
  - Widget for Today's Feed

**Success Criteria:**
- AA adoption >40% of users
- 50%+ users earn at least 1 badge
- 45-day retention >45%

---

### 7.3 Phase 3: Vernacular & Advisory (Months 9-12)

**Features:**
- [ ] Multi-language Support:
  - Hindi, Marathi, Tamil, Telugu
  - EITM cards in regional languages
  - Align with NSFE 2020-2025 vernacular goals
- [ ] Robo-Advisory (Beta):
  - Automated portfolio recommendations based on risk profile
  - SIP calculator with goal-based planning
  - Tax-loss harvesting suggestions
- [ ] Social Features:
  - Share achievements (badges) on WhatsApp/Twitter
  - Referral program (invite friends → unlock premium features)
- [ ] On-Device AI:
  - Migrate simple EITM queries to Llama 3.2 (privacy boost)

**Success Criteria:**
- 30%+ users switch to non-English language
- Robo-advisory engagement >25% of users
- Viral coefficient >0.3 (referrals)

---

### 7.4 Future Vision (12+ Months)

**Potential Features:**
- **Credit Score Integration:** Partner with CIBIL/Experian for free credit reports
- **Bill Payment Reminders:** Auto-detect utility bills from notifications
- **Investment Execution:** Direct mutual fund purchases via BSE StAR API
- **Community Forums:** User-generated content (moderated Q&A)
- **Family Plans:** Shared budgets for households
- **Enterprise Version:** Financial wellness for corporate employees (B2B2C)

---

## 8. Success Metrics & KPIs

### 8.1 Acquisition
- **App Installs:** 50K in Month 1, 500K by Month 6
- **Sources:** Organic (30%), Paid (Meta/Google - 50%), Referrals (20%)

### 8.2 Activation
- **Onboarding Completion Rate:** >80%
- **First Transaction Logged (Auto or Manual):** Within 48 hours for 70% of users

### 8.3 Engagement
- **DAU/MAU Ratio:** >40%
- **Average Session Duration:** 4-6 minutes
- **EITM Card CTR:** >60%
- **Learning Module Completion:** >50% complete at least 1 module in first week

### 8.4 Retention
- **Day 7 Retention:** >60%
- **Day 30 Retention:** >40%
- **Day 90 Retention:** >25%

### 8.5 Revenue (Future - Phase 3+)
- **Freemium Conversion:** 5% of users upgrade to Premium (₹99/month)
  - Premium Features: Unlimited EITM queries, ad-free, custom budgets, robo-advisory
- **Affiliate Revenue:** Commission from mutual fund referrals (via Groww/Zerodha partnerships)

---

## 9. Risk Assessment & Mitigation

### 9.1 Technical Risks

| **Risk** | **Impact** | **Mitigation** |
|----------|-----------|----------------|
| Notification parsing accuracy <80% | High | (1) Expand regex patterns via user feedback, (2) Fallback to manual entry prompts, (3) Fast-track AA integration |
| AI API costs exceed budget (>$500/month) | Medium | (1) Cache EITM responses for common queries, (2) Rate limit to 10 AI queries/user/day, (3) Migrate to on-device AI for MVP+ |
| Google Play rejection (notification policy) | High | (1) Legal review of Privacy Policy, (2) Implement data minimization (no full notification storage), (3) Prepare appeal documentation citing educational use case |
| Firebase scaling bottleneck at 100K users | Medium | (1) Monitor Firestore quotas weekly, (2) Implement pagination for transaction queries, (3) Upgrade to Blaze plan with budget alerts |

### 9.2 Market Risks

| **Risk** | **Impact** | **Mitigation** |
|----------|-----------|----------------|
| User fatigue from "yet another finance app" | High | (1) Differentiate with EITM (no competitor offers this), (2) Viral marketing via FinTwit influencers, (3) Freemium model reduces barrier to trial |
| Regulatory changes (RBI restricts AA framework) | Medium | (1) Build notification-based fallback as primary, (2) Diversify to manual entry + bank integrations, (3) Engage with FinTech associations for policy advocacy |
| Competitor replication (Paytm/PhonePe adds EITM) | Medium | (1) Build network effects via Learning Hub, (2) First-mover advantage in youth segment, (3) Patent AI-driven contextual education workflow (if novel) |

---

## 10. Open Questions & Assumptions

### 10.1 Assumptions
1. **User Behavior:** 70%+ of target users have at least 1 UPI app installed
2. **Notification Access:** 60%+ Android users will grant notification permission after education
3. **Content Quality:** AI-generated EITM cards require <10% human review for accuracy
4. **Monetization:** Users willing to pay ₹99/month for premium after 30-day free trial

### 10.2 Open Questions (For Stakeholder Review)
1. **Vernacular Priority:** Which regional language to launch first (Hindi vs. Marathi vs. Tamil)? Depends on user geography data.
2. **AA Partnership:** Should we partner with Setu or build direct AA integration? Cost-benefit analysis needed.
3. **Content Moderation:** For future community forums, in-house team or third-party moderation service?
4. **Revenue Model:** Freemium vs. Ad-supported free tier? User survey required.

---

## 11. Dependencies & Integrations

### 11.1 Third-Party Services
- **OpenAI/Anthropic:** API access for EITM (backup plan: Google Gemini if cost-prohibitive)
- **Alpha Vantage / NSE:** Market data (free tier limits: 5 API calls/min)
- **Setu / Sahamati:** AA integration (Phase 2)
- **Mixpanel:** Analytics (free up to 100K events/month)

### 11.2 Internal Dependencies
- **Legal Team:** Privacy policy review (notification permissions)
- **Design Team:** UI/UX mockups for all screens (Figma handoff required)
- **Backend Team:** Cloud Functions for EITM processing + transaction aggregation

---

## 12. Appendices

### Appendix A: Research References
1. Fernandes, D., Lynch Jr, J. G., & Netemeyer, R. G. (2014). "Financial Literacy, Financial Education, and Downstream Financial Behaviors." *Management Science*, 60(8), 1861-1883.
2. Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness*. Yale University Press.
3. National Centre for Financial Education (NCFE). (2023). "Financial Literacy Survey India."
4. Reserve Bank of India. (2020). "National Strategy for Financial Education (NSFE) 2020-2025."

### Appendix B: Glossary of Terms
- **EITM:** Explain It To Me (AI-generated financial explainers)
- **AA:** Account Aggregator (RBI-regulated data sharing framework)
- **PII:** Personally Identifiable Information
- **DAU/MAU:** Daily Active Users / Monthly Active Users
- **NSFE:** National Strategy for Financial Education

### Appendix C: Competitive Analysis
| **Competitor** | **Strength** | **Weakness** | **FinSight Advantage** |
|----------------|--------------|--------------|------------------------|
| Walnut | Strong auto-tracking | No educational layer | EITM + Learning Hub |
| Moneycontrol | Comprehensive news | Information overload | Personalized, simplified |
| Varsity (Zerodha) | High-quality content | Passive, no transaction link | Contextual, action-based learning |
| Paytm Money | Integrated investing | No budgeting/tracking | Unified financial hub |

---

**Document Status:** Ready for Stakeholder Review  
**Next Steps:**
1. Design team: Create wireframes for all screens (Week 1-2)
2. Engineering: PoC for notification listener (Week 2-3)
3. Product Marketing: Draft GTM strategy for MVP launch (Week 3-4)
4. Legal: Privacy policy review (Week 2)

---

*This PRD is a living document. Version history and change log maintained in [Confluence/Notion link].*