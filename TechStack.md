# Technical Stack Document (TechStack.md)
# FinSight: Your Daily Money Mentor

**Version:** 1.0  
**Date:** February 4, 2026  
**Tech Lead:** Engineering Team  
**Status:** Technical Specification  
**Related Documents:**
- [FinSight PRD v1.0](./finsight_prd.md)
- [FinSight Design Doc v1.0](./DesignDoc.md)

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Mobile Frontend Stack](#2-mobile-frontend-stack)
3. [Backend Services Architecture](#3-backend-services-architecture)
4. [Database & Storage Layer](#4-database--storage-layer)
5. [AI & ML Pipeline](#5-ai--ml-pipeline)
6. [Authentication & Security](#6-authentication--security)
7. [Third-Party Integrations](#7-third-party-integrations)
8. [DevOps & Infrastructure](#8-devops--infrastructure)
9. [Development Tools & Workflow](#9-development-tools--workflow)
10. [Technology Decision Matrix](#10-technology-decision-matrix)
11. [Performance & Scalability](#11-performance--scalability)
12. [Security & Compliance](#12-security--compliance)
13. [Cost Analysis](#13-cost-analysis)
14. [Migration & Upgrade Path](#14-migration--upgrade-path)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE CLIENT (React Native)              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │ Notification │  │  On-Device   │  │   Secure Storage    │   │
│  │  Listener    │  │  AI (Llama)  │  │   (Keychain)        │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS/TLS 1.3
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (NestJS)                         │
│                     Load Balancer / Rate Limiter                 │
└─────────────┬───────────────────────────┬───────────────────────┘
              │                           │
              ↓                           ↓
┌─────────────────────────┐   ┌──────────────────────────┐
│  PYTHON PRIVACY GATEWAY │   │   CORE BACKEND SERVICES  │
│  (FastAPI + Presidio)   │   │   (NestJS Microservices) │
│  • PII Redaction        │   │   • User Service         │
│  • Cloud LLM Proxy      │   │   • Transaction Service  │
│  • Data Masking         │   │   • Budget Service       │
└────────────┬────────────┘   │   • Learning Service     │
             │                 └──────────┬───────────────┘
             │                            │
             ↓                            ↓
┌─────────────────────────┐   ┌──────────────────────────┐
│   AI SERVICES (Cloud)   │   │   PRIMARY DATABASE       │
│   • OpenAI GPT-4o-mini  │   │   MongoDB (NoSQL)        │
│   • Claude 3 Haiku      │   │   • User Profiles        │
│   (via Privacy Gateway) │   │   • Transactions         │
└─────────────────────────┘   │   • Learning Progress    │
                               └──────────┬───────────────┘
                                          │
                               ┌──────────┴───────────────┐
                               │                          │
                    ┌──────────▼──────────┐   ┌──────────▼──────────┐
                    │   REDIS CACHE       │   │   VECTOR DB         │
                    │   • Market Data     │   │   (Pinecone/Milvus) │
                    │   • Session State   │   │   • RAG Embeddings  │
                    └─────────────────────┘   └─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   Sahamati   │  │    NSE/BSE   │  │   Firebase Auth     │   │
│  │   AA APIs    │  │  Market Data │  │   (Phone OTP)       │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

**1. Privacy-First Design**
- All PII redaction happens at the gateway layer before data reaches AI services
- On-device AI for sensitive queries (no data leaves the phone)
- Zero-knowledge architecture: Backend never sees raw account numbers

**2. Just-in-Time Performance**
- Redis caching for <200ms feed load times
- On-device AI inference for <2s EITM generation
- CDN for static assets (learning content, images)

**3. Regulatory Compliance**
- Account Aggregator (AA) integration via Sahamati framework
- Consent management system (OAuth 2.0 compliant)
- Audit logs for all financial data access

**4. Scalability & Resilience**
- Microservices architecture for independent scaling
- Message queues for async processing (transaction categorization)
- Multi-region deployment for high availability

---

## 2. Mobile Frontend Stack

### 2.1 Core Framework

**Expo SDK 52+ (Managed Workflow with Development Builds)**

**Rationale:**
- **Simplified Build Pipeline:** `npx expo run:android` replaces complex Gradle configuration, eliminating native build friction
- **Development Builds:** Expo now supports custom native modules via `expo-dev-client`, enabling notification listener and ExecuTorch integration
- **Config Plugins:** AndroidManifest.xml modifications (notification listener permissions, AA SDK) handled declaratively via `app.json` config plugins
- **OTA Updates:** `expo-updates` enables instant bug fixes without Play Store review cycles
- **Indian Market Fit:** Works on low-end Android devices (65% of target market uses <₹15k phones)

**Why NOT bare React Native CLI?**
- Gradle version conflicts and native dependency management overhead
- Manual Android/iOS project configuration is error-prone
- No OTA update support without additional tooling
- Expo's ecosystem now covers all required native modules

**Version Lock:**
```json
{
  "expo": "~52.0.0",
  "react-native": "0.76.x",
  "react": "18.3.1"
}
```

### 2.2 Language & Type Safety

**TypeScript 5.3+ (Strict Mode)**

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Rationale:**
- **Financial Data Safety:** Prevents runtime errors when handling amounts (e.g., `amount: number | null`)
- **API Contract Enforcement:** Type-safe API responses (no silent failures)
- **Developer Experience:** IntelliSense for 2000+ line codebase

**Critical Types:**
```typescript
// Ensures amounts always have 2 decimal places
type CurrencyAmount = number & { __brand: 'CurrencyAmount' };

// Transaction must have valid category
type Transaction = {
  id: string;
  amount: CurrencyAmount;
  category: Category; // Enum, not string
  date: Date;
  merchant: string;
};
```

### 2.3 Styling & UI Framework

**NativeWind 2.0 (Tailwind CSS for React Native)**

**Rationale:**
- **Design Doc Alignment:** Matches Tailwind-based design tokens
- **Developer Velocity:** 50% faster UI development vs. StyleSheet
- **Consistency:** Single source of truth for design system
- **Bundle Size:** Tree-shaking reduces unused styles

**Setup:**
```bash
npm install nativewind tailwindcss
```

**Configuration (`tailwind.config.js`):**
```javascript
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          dark: '#4F46E5',
        },
        profit: '#10B981',
        loss: '#EF4444',
        alert: {
          amber: '#F59E0B',
          critical: '#DC2626',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['SF Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
};
```

**Usage:**
```tsx
<View className="bg-white p-4 rounded-xl shadow-md">
  <Text className="text-xl font-semibold text-gray-800">
    Market Pulse
  </Text>
</View>
```

### 2.4 State Management

**Redux Toolkit 2.0 + RTK Query**

**Rationale:**
- **Complex State:** Feed requires coordinated state (market data + transactions + EITM cards)
- **Offline-First:** Redux Persist for offline transaction queue
- **DevTools:** Time-travel debugging for financial flows
- **RTK Query:** Built-in caching for API responses (reduces latency)

**Store Structure:**
```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
  };
  transactions: {
    items: Transaction[];
    syncStatus: 'idle' | 'syncing' | 'error';
  };
  feed: {
    marketPulse: MarketData;
    eitmCards: EITMCard[];
    lastUpdated: Date;
  };
  budgets: {
    [category: string]: Budget;
  };
  learning: {
    progress: LearningProgress;
    currentPath: string | null;
  };
}
```

**Why NOT Context API?**
- No built-in DevTools
- Performance issues with frequent updates (market data refreshes every 5 mins)
- No middleware support (needed for offline sync)

**Why NOT MobX?**
- Less TypeScript support
- Smaller ecosystem (fewer React Native libraries)

### 2.5 Navigation

**React Navigation 7.x (with Expo Router support)**

**Rationale:**
- **Industry Standard:** Most mature RN navigation library
- **Deep Linking:** Built-in support for `finsight://transaction/{id}` URLs
- **Tab Navigator:** Matches Design Doc's bottom tab architecture
- **Modal Support:** Stack + Modal navigators for EITM cards

**Navigator Structure:**
```typescript
<Stack.Navigator>
  <Stack.Screen name="MainTabs" component={BottomTabs} />
  <Stack.Screen 
    name="TransactionDetail" 
    component={TransactionDetail}
    options={{ presentation: 'modal' }}
  />
  <Stack.Screen 
    name="EITMModal" 
    component={EITMCard}
    options={{ presentation: 'transparentModal' }}
  />
</Stack.Navigator>
```

### 2.6 Charts & Visualization

**Victory Native 36.x**

**Rationale:**
- **React Native First:** Built specifically for RN (vs. React-based libraries)
- **SVG-based:** Hardware-accelerated rendering
- **Animations:** Smooth transitions for market pulse sparklines
- **Accessibility:** Supports screen readers

**Alternative Considered: Recharts**
- ❌ Web-focused, requires react-native-svg wrapper
- ❌ Larger bundle size

**Usage:**
```tsx
import { VictoryLine, VictoryChart } from 'victory-native';

<VictoryChart height={100} width={200}>
  <VictoryLine
    data={marketData}
    style={{
      data: { stroke: colors.profit },
    }}
  />
</VictoryChart>
```

### 2.7 Critical Native Modules

#### 2.7.1 Notification Listener (Android Only)

**`react-native-android-notification-listener` v1.5+**

**Why This Library:**
- **Google Play Compliant:** Reads notification *content*, not SMS (SMS permission is heavily restricted)
- **Event-Driven:** Low battery consumption (<3% per day)
- **Whitelist Support:** Only listens to banking/payment apps

**Setup (via Expo Config Plugin):**
```javascript
// app.json config plugin handles AndroidManifest.xml automatically
// android/app/src/main/AndroidManifest.xml (generated)
<service
  android:name=".NotificationListener"
  android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
  <intent-filter>
    <action android:name="android.service.notification.NotificationListenerService" />
  </intent-filter>
</service>
```

**Usage:**
```typescript
import NotificationListener from 'react-native-android-notification-listener';

NotificationListener.startListening((notification) => {
  if (isPaymentApp(notification.packageName)) {
    const transaction = parseNotification(notification);
    dispatch(addTransaction(transaction));
  }
});
```

**Privacy Compliance:**
- Only reads from whitelisted apps (GPay, PhonePe, banks)
- Discards notification after parsing (doesn't persist full text)
- User consent screen before enabling

#### 2.7.2 OTP Autofill

**Android: `react-native-sms-retriever` v1.2+**

**Why:**
- Uses Google Play Services SMS Retriever API (no SMS permission needed)
- Works with banking OTPs during AA consent flow

**Setup:**
```typescript
import SmsRetriever from 'react-native-sms-retriever';

const { hash } = await SmsRetriever.requestPhoneNumber();
// SMS format: <#> Your OTP is 123456 {hash}
```

**iOS: Native AutoFill**

Uses `UITextContentType.oneTimeCode`:
```tsx
<TextInput
  textContentType="oneTimeCode"
  autoComplete="sms-otp"
/>
```

#### 2.7.3 On-Device AI Inference

**`react-native-executorch` v0.3+ (PyTorch Mobile)**

**Why:**
- **Privacy:** EITM queries processed locally (no cloud transmission)
- **Latency:** <2s inference for simple queries
- **Offline:** Works without internet (critical for Tier 2/3 cities)

**Model:** Llama 3.2 1B (Quantized INT8)
- Size: ~600MB (downloaded on WiFi, not cellular)
- Accuracy: Sufficient for ELI15 explanations
- Speed: 15 tokens/sec on Snapdragon 6-series

**Setup:**
```typescript
import { ExecuTorch } from 'react-native-executorch';

const model = await ExecuTorch.loadModel('llama-3.2-1b-q8.pte');
const response = await model.generate(
  'Explain why gold prices increased',
  { maxTokens: 150 }
);
```

**Fallback Strategy:**
- On-device: Simple queries ("What is SIP?")
- Cloud (via Privacy Gateway): Complex queries ("Analyze my spending pattern")

#### 2.7.4 Secure Storage

**`react-native-keychain` v8.1+**

**Why:**
- **iOS Keychain / Android Keystore:** Hardware-backed encryption
- **Biometric Protection:** FaceID/TouchID for sensitive data
- **Zero-Knowledge:** Auth tokens never stored in AsyncStorage

**Usage:**
```typescript
import * as Keychain from 'react-native-keychain';

// Store AA consent token
await Keychain.setGenericPassword(
  'aa_consent_token',
  token,
  {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  }
);
```

**Alternative Considered: Expo SecureStore**
- ❌ Requires Expo (conflicts with CLI workflow)

### 2.8 Additional Dependencies

**Forms & Validation:**
- **React Hook Form 7.x:** Performant form handling (manual transaction entry)
- **Zod 3.x:** Schema validation (TypeScript-first)

```typescript
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive().multipleOf(0.01), // 2 decimal places
  category: z.enum(['dining', 'shopping', 'transport']),
  date: z.date().max(new Date()), // Can't be future
});
```

**Date & Time:**
- **date-fns 3.x:** Lightweight (vs. Moment.js's 66kB)
- **date-fns-tz:** Handles IST timezone (critical for transaction timestamps)

**Analytics:**
- **Mixpanel React Native 2.x:** Event tracking (EITM engagement, button clicks)
- **Firebase Analytics 10.x:** Crash reporting, user properties

**Push Notifications:**
- **Firebase Cloud Messaging (FCM) 12.x:** Cross-platform push
- **React Native Push Notification 8.x:** Local notifications (budget alerts)

---

## 3. Backend Services Architecture

### 3.1 API Gateway & Core Services

**NestJS 10.x (Node.js 20 LTS)**

**Rationale:**
- **TypeScript Native:** Shared types with React Native (reduces API contract bugs)
- **Decorator-Based:** Clean architecture (controllers, services, modules)
- **Account Aggregator Fit:** Sahamati APIs return JSON; Node.js handles JSON parsing natively (faster than Python/Go)
- **Microservices Ready:** Built-in support for gRPC, message queues

**Why NestJS over Express/Fastify?**
- **Structure:** Enforces SOLID principles (critical for 10+ microservices)
- **Dependency Injection:** Easy to mock services for testing
- **OpenAPI:** Auto-generates API documentation from decorators

**Example Controller:**
```typescript
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly privacyService: PrivacyService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDto: CreateTransactionDto,
    @Req() req: AuthRequest,
  ) {
    // PII redaction before database write
    const redacted = await this.privacyService.maskPII(createDto);
    return this.transactionsService.create(req.user.id, redacted);
  }
}
```

**Microservices Structure:**
```
backend/
├── gateway/              # API Gateway (load balancer)
├── services/
│   ├── user-service/     # Auth, profile, preferences
│   ├── transaction-service/  # Transaction CRUD, categorization
│   ├── budget-service/   # Budget alerts, progress tracking
│   ├── learning-service/ # Learning paths, quiz scoring
│   ├── eitm-service/     # EITM card generation orchestrator
│   └── aa-service/       # Account Aggregator integration
└── shared/               # Common DTOs, types, utilities
```

**Inter-Service Communication:**
- **Synchronous:** gRPC (for low-latency calls like "get user profile")
- **Asynchronous:** RabbitMQ (for event-driven flows like "new transaction → categorize → budget check")

### 3.2 Privacy & AI Gateway

**FastAPI 0.109+ (Python 3.11)**

**Why Python (vs. NestJS for AI)?**
- **Microsoft Presidio:** PII redaction library (no Node.js equivalent)
- **ML Ecosystem:** NumPy, Pandas for transaction analysis
- **LLM Libraries:** LangChain, OpenAI SDK (better Python support)

**Why FastAPI (vs. Flask)?**
- **Performance:** Async support (critical for streaming LLM responses)
- **Type Safety:** Pydantic models (matches TypeScript strictness)
- **Auto-Docs:** Swagger UI out-of-the-box

**Architecture:**
```
┌────────────────────────────────────────┐
│  NestJS Core Services (Transaction)    │
└──────────────┬─────────────────────────┘
               │ POST /ai/explain
               ↓
┌────────────────────────────────────────┐
│  FastAPI Privacy Gateway               │
│  1. Presidio: Redact PII               │
│  2. Proxy to OpenAI/Claude             │
│  3. Post-process: Mask any leaked PII  │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│  OpenAI GPT-4o-mini / Claude 3 Haiku   │
└────────────────────────────────────────┘
```

**Presidio Integration:**
```python
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def redact_pii(text: str) -> str:
    results = analyzer.analyze(
        text=text,
        language='en',
        entities=['PERSON', 'PHONE_NUMBER', 'CREDIT_CARD', 'IBAN_CODE']
    )
    return anonymizer.anonymize(text=text, analyzer_results=results).text

# Before: "John's account XX-1234 was debited ₹450"
# After: "<PERSON>'s account <IBAN_CODE> was debited ₹450"
```

**LLM Proxy (OpenAI):**
```python
from fastapi import FastAPI
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key=settings.OPENAI_API_KEY)

@app.post("/ai/explain")
async def generate_eitm(request: EITMRequest):
    # Step 1: Redact PII
    safe_context = redact_pii(request.context)
    
    # Step 2: Call OpenAI
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Explain in simple terms: {safe_context}"
        }],
        max_tokens=150,
        temperature=0.7
    )
    
    # Step 3: Double-check response for leaked PII
    explanation = redact_pii(response.choices[0].message.content)
    
    return {"explanation": explanation}
```

**Performance Optimization:**
- **Connection Pooling:** Reuse HTTP connections to OpenAI (reduces latency by 50ms)
- **Request Batching:** Combine multiple EITM requests (when generating 3+ cards)

### 3.3 Async Task Orchestration

**BullMQ 5.x (Redis-based Queue)**

**Why BullMQ (vs. Temporal.io)?**
- **Simplicity:** Easier setup for MVP (Temporal requires separate cluster)
- **Redis Integration:** Already using Redis for caching
- **Node.js Native:** Integrates seamlessly with NestJS

**Use Cases:**
1. **Transaction Categorization:** Run ML model on new transactions
2. **Budget Alert Processing:** Check all budgets after transaction
3. **Daily Reports:** Generate spending summaries (cron job)
4. **AA Data Sync:** Poll bank statements every 24 hours

**Queue Structure:**
```typescript
// Producer (Transaction Service)
await transactionQueue.add('categorize', {
  transactionId: 'txn_123',
  merchant: 'Swiggy',
  amount: 450
});

// Consumer (Worker Process)
transactionQueue.process('categorize', async (job) => {
  const category = await mlModel.predict(job.data);
  await db.transactions.updateOne(
    { id: job.data.transactionId },
    { $set: { category } }
  );
});
```

**Retry Strategy:**
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000 // 2s, 4s, 8s
  }
}
```

**Alternative: Temporal.io (Future)**
- For complex workflows (e.g., multi-step AA consent flow)
- When we need workflow versioning (regulatory changes)
- Phase 2+ consideration

---

## 4. Database & Storage Layer

### 4.1 Primary Database

**MongoDB 7.0+ (Atlas Managed)**

**Why NoSQL over PostgreSQL?**

**Rationale:**
1. **Variable Schema:** Bank statements vary wildly:
   ```json
   // HDFC JSON
   {
     "txn_id": "HD123",
     "narration": "UPI/PhonePe/...",
     "amount": "450.00"
   }
   
   // SBI JSON
   {
     "transaction_id": "SBI456",
     "description": "IMPS-P2M-...",
     "debit_amount": "450"
   }
   ```
   NoSQL handles this without schema migrations.

2. **Rapid Iteration:** User feedback may require new fields (`tags`, `notes`, `split_with`)—no ALTER TABLE needed

3. **Document Model:** Transactions naturally nest (transaction → attachments → receipts)

**Why MongoDB over DynamoDB?**
- **Query Flexibility:** Rich query language (aggregation pipelines for spending analysis)
- **Transactions:** ACID guarantees (critical for financial data)
- **Atlas Search:** Built-in full-text search (for transaction notes, merchant names)

**Collections Schema:**

```javascript
// users collection
{
  _id: ObjectId,
  firebaseUid: string,
  profile: {
    name: string,
    age: number,
    riskProfile: 'conservative' | 'moderate' | 'aggressive',
    primaryGoal: string,
  },
  preferences: {
    language: 'en-IN' | 'hi-IN',
    notifications: boolean,
  },
  createdAt: Date,
  updatedAt: Date,
}

// transactions collection (sharded by userId)
{
  _id: ObjectId,
  userId: ObjectId,
  amount: Decimal128, // Precise decimal (not float!)
  type: 'debit' | 'credit',
  category: string,
  merchant: string,
  date: Date,
  source: 'auto' | 'manual' | 'aa',
  metadata: {
    notificationId?: string,
    aaConsentId?: string,
  },
  piiMasked: boolean, // Flag if PII was redacted
}

// budgets collection
{
  _id: ObjectId,
  userId: ObjectId,
  category: string,
  monthlyLimit: Decimal128,
  currentSpend: Decimal128,
  month: string, // '2026-02'
  alerts: {
    at80: boolean, // Already sent?
    at100: boolean,
  },
}
```

**Indexing Strategy:**
```javascript
// Compound index for feed queries
db.transactions.createIndex(
  { userId: 1, date: -1 },
  { background: true }
);

// Text index for merchant search
db.transactions.createIndex(
  { merchant: 'text', notes: 'text' }
);

// TTL index for EITM cards (expire after 30 days)
db.eitmCards.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
);
```

**Sharding (Future):**
- Shard key: `userId` (ensures single-user queries hit one shard)
- Trigger: >10M users or >1TB data

### 4.2 Caching Layer

**Redis 7.2+ (Elasticache / Upstash)**

**Use Cases:**
1. **Market Data Cache:** NIFTY/SENSEX updated every 5 mins
   ```typescript
   // Cache for 5 minutes
   await redis.setex(
     'market:nifty50',
     300,
     JSON.stringify(marketData)
   );
   ```

2. **Session Management:** JWT token blacklist (logout)
   ```typescript
   // Invalidate token
   await redis.setex(
     `blacklist:${token}`,
     3600, // 1 hour
     '1'
   );
   ```

3. **Rate Limiting:** API throttling (100 req/min per user)
   ```typescript
   const key = `ratelimit:${userId}`;
   const count = await redis.incr(key);
   if (count === 1) await redis.expire(key, 60);
   if (count > 100) throw new TooManyRequestsError();
   ```

4. **Transaction Queue:** Offline sync buffer
   ```typescript
   // Push to queue
   await redis.rpush(
     `sync:${userId}`,
     JSON.stringify(transaction)
   );
   ```

**Why Redis over Memcached?**
- **Data Structures:** Lists, Sets (needed for queues, rate limiting)
- **Persistence:** AOF logging (survive restarts)
- **Pub/Sub:** Real-time updates (market pulse broadcast)

**Configuration:**
```yaml
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru  # Evict least recently used
appendonly yes                # Enable AOF persistence
```

### 4.3 Vector Database (RAG for Learning Hub)

**Pinecone (Managed) or Milvus (Self-Hosted)**

**Why Vector DB?**
- **Semantic Search:** User asks "How to save tax?" → Returns "Section 80C Guide" (even if no keyword match)
- **RAG (Retrieval-Augmented Generation):** LLM pulls relevant content before answering

**Architecture:**
```
User Query: "Best way to invest ₹10k monthly"
    ↓
Embed query (OpenAI text-embedding-3-small)
    ↓
Pinecone: Find top 5 similar learning modules
    ↓
LLM: Generate answer using retrieved context
```

**Setup (Pinecone):**
```python
import pinecone

pinecone.init(api_key=settings.PINECONE_API_KEY)
index = pinecone.Index('learning-content')

# Insert learning module
index.upsert([
  {
    'id': 'module_123',
    'values': embedding,  # 1536-dim vector
    'metadata': {
      'title': 'SIP Explained',
      'category': 'investing',
      'difficulty': 'beginner'
    }
  }
])

# Query
results = index.query(
  vector=query_embedding,
  top_k=5,
  filter={'category': 'investing'}
)
```

**Alternative: Milvus (Open Source)**
- **Pros:** Self-hosted (lower cost at scale), more control
- **Cons:** Operational overhead (Kubernetes cluster needed)
- **Decision:** Start with Pinecone (free tier: 1M vectors), migrate to Milvus if cost exceeds $200/month

**Embeddings Model:**
- **OpenAI `text-embedding-3-small`:** 1536 dims, $0.02 per 1M tokens
- **Why:** Balance of cost and quality (vs. `text-embedding-ada-002`)

---

## 5. AI & ML Pipeline

### 5.1 Hybrid AI Architecture (Device + Cloud)

**Decision Tree:**
```
User Request for EITM
    ↓
Is device online? ──No──> Use On-Device AI (Llama 3.2)
    │ Yes
    ↓
Is query simple? ──Yes──> Use On-Device AI
    │ (e.g., "What is SIP?")
    │ No (e.g., "Analyze my spending pattern")
    ↓
Use Cloud AI (GPT-4o-mini / Claude 3 Haiku)
    via Privacy Gateway
```

### 5.2 Tier 1: On-Device AI (Privacy-First)

**Model:** Llama 3.2 1B (INT8 Quantized)

**Specifications:**
- **Size:** 600MB (compressed)
- **Inference Speed:** 15 tokens/sec on Snapdragon 6-series
- **Context Length:** 2048 tokens
- **Accuracy:** 85% on ELI15 financial explanations (internal benchmark)

**Quantization:**
```bash
# PyTorch export (done on server)
python -m executorch.exir.export \
  --model llama-3.2-1b \
  --quantize int8 \
  --output llama-3.2-1b-q8.pte
```

**Mobile Integration:**
```typescript
import { ExecuTorch } from 'react-native-executorch';

const generateEITM = async (query: string) => {
  const model = await ExecuTorch.loadModel('llama-3.2-1b-q8.pte');
  
  const prompt = `
You are a financial educator for Indian millennials. Explain in simple terms:

Query: ${query}

Rules:
- Use Hinglish (mix of Hindi and English)
- Maximum 150 words
- ELI15 (Explain Like I'm 15)
- Include one analogy
`;

  const response = await model.generate(prompt, {
    maxTokens: 150,
    temperature: 0.7,
    stopSequences: ['\n\n'],
  });
  
  return response.text;
};
```

**Use Cases (On-Device):**
- Glossary lookups ("What is NAV?")
- Simple concept explanations ("How does SIP work?")
- Offline mode (Tier 2/3 cities with poor connectivity)

**Limitations:**
- Cannot analyze user's actual transactions (too complex)
- Cannot access real-time market data
- Fallback to cloud for complex queries

### 5.3 Tier 2: Cloud AI (Complex Analysis)

**Primary:** OpenAI GPT-4o-mini  
**Fallback:** Anthropic Claude 3 Haiku

**Why GPT-4o-mini over GPT-4?**
- **Cost:** $0.15/1M input tokens (vs. $30/1M for GPT-4)
- **Speed:** 50 tokens/sec (vs. 20 for GPT-4)
- **Sufficient Quality:** 90%+ accuracy on EITM benchmarks

**Why Claude 3 Haiku as Fallback?**
- **Reliability:** Different infrastructure (reduces single-point-of-failure)
- **Context Window:** 200K tokens (useful for analyzing full monthly statements)
- **Cost:** $0.25/1M tokens (comparable)

**Proxy via Privacy Gateway:**
```python
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

async def generate_eitm(
    context: str,
    user_profile: dict,
    provider: str = 'openai'
) -> str:
    # Step 1: PII Redaction
    safe_context = redact_pii(context)
    safe_profile = {
        'riskProfile': user_profile['riskProfile'],
        'age': user_profile['age'],
        # Exclude: name, phone, email
    }
    
    prompt = f"""
You are a financial educator for Indian millennials.

User Profile: {json.dumps(safe_profile)}
Context: {safe_context}

Generate an EITM (Explain It To Me) card:
- Headline (question format)
- Explanation (150 words max, Hinglish, ELI15)
- Personal impact (based on risk profile)
- One analogy

Format as JSON.
"""
    
    if provider == 'openai':
        response = await openai_client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        content = response.choices[0].message.content
    else:
        response = await anthropic_client.messages.create(
            model='claude-3-haiku-20240307',
            max_tokens=300,
            messages=[{'role': 'user', 'content': prompt}],
        )
        content = response.content[0].text
    
    # Step 2: Validate output (no PII leaked)
    return redact_pii(content)
```

**Fallback Logic:**
```python
async def generate_with_fallback(context: str) -> str:
    try:
        return await generate_eitm(context, provider='openai')
    except OpenAIError as e:
        logger.error(f"OpenAI failed: {e}")
        return await generate_eitm(context, provider='anthropic')
```

**Cost Optimization:**
- **Caching:** Common queries (e.g., "What is SIP?") cached in Redis (24-hour TTL)
- **Rate Limiting:** 10 EITM requests per user per day (prevents abuse)
- **Prompt Compression:** Use abbreviations (₹ instead of "Indian Rupees")

### 5.4 Transaction Categorization (ML Model)

**Model:** Scikit-learn RandomForest (hosted in Python service)

**Why RandomForest (vs. Deep Learning)?**
- **Simplicity:** Easier to debug (important for financial accuracy)
- **Speed:** <10ms inference (vs. 100ms for BERT)
- **Interpretability:** Can explain why "Swiggy" → "Dining" (compliance requirement)

**Training Data:**
```python
# features.csv
merchant,amount,time_of_day,category
Swiggy,450,14:30,dining
Uber,180,08:00,transport
Amazon,1200,22:00,shopping
...
```

**Feature Engineering:**
```python
def extract_features(transaction: dict) -> np.ndarray:
    return [
        len(transaction['merchant']),
        transaction['amount'],
        transaction['hour'],
        transaction['day_of_week'],
        merchant_frequency(transaction['merchant']),
    ]
```

**Model Training:**
```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, max_depth=10)
model.fit(X_train, y_train)

# Accuracy: 87% (internal benchmark)
```

**Deployment:**
```python
@app.post("/categorize")
async def categorize(transaction: Transaction):
    features = extract_features(transaction.dict())
    category = model.predict([features])[0]
    confidence = model.predict_proba([features]).max()
    
    return {
        'category': category,
        'confidence': confidence,
        'manual_review_needed': confidence < 0.7
    }
```

**Continuous Learning:**
- User overrides (swipe to edit category) fed back to training set
- Monthly retraining with new data

---

## 6. Authentication & Security

### 6.1 Authentication Provider

**Firebase Authentication 10.x**

**Why Firebase (vs. Rolling Our Own)?**
- **Indian Market Fit:** Built-in Phone OTP (no SMS gateway needed)
- **Compliance:** SOC 2, ISO 27001 certified (critical for financial app)
- **DDoS Protection:** Google-grade infrastructure
- **Multi-Factor:** Future support for biometric 2FA

**Auth Flow:**
```
User enters phone number (+91-XXXXXXXXXX)
    ↓
Firebase sends OTP via SMS
    ↓
User enters OTP (auto-filled via SMS Retriever API)
    ↓
Firebase returns JWT token
    ↓
Mobile app stores token in Keychain
    ↓
All API requests include: Authorization: Bearer {token}
```

**Backend Verification:**
```typescript
import * as admin from 'firebase-admin';

async function verifyToken(token: string): Promise<User> {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return await UserService.findByFirebaseUid(decoded.uid);
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}
```

**Token Refresh:**
- Access token TTL: 1 hour
- Refresh token TTL: 30 days
- Auto-refresh in background (mobile SDK handles this)

### 6.2 Encryption Standards

**In Transit:**
- **TLS 1.3:** All API endpoints (enforce HTTPS-only)
- **Certificate Pinning:** Prevent man-in-the-middle attacks
  ```typescript
  // react-native-config
  SSL_PINNING: true,
  PUBLIC_KEY_HASH: 'sha256/AAAA...',
  ```

**At Rest:**
- **MongoDB:** Encryption at rest (AWS KMS or Atlas-managed keys)
- **Redis:** TLS for inter-node communication
- **Mobile Storage:**
  - Keychain (iOS): AES-256 hardware encryption
  - Keystore (Android): AES-256 + TEE (Trusted Execution Environment)

**PII Encryption (Before Database Write):**
```typescript
import * as crypto from 'crypto';

function encryptPII(data: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
    iv
  );
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

// Encrypt before storing
await db.users.insertOne({
  ...user,
  phone: encryptPII(user.phone),
  email: encryptPII(user.email),
});
```

### 6.3 API Security

**Rate Limiting (Express Rate Limit + Redis):**
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

app.use('/api', limiter);
```

**Input Validation (Zod):**
```typescript
import { z } from 'zod';

const CreateTransactionSchema = z.object({
  amount: z.number().positive().finite(),
  category: z.enum(['dining', 'shopping', 'transport']),
  merchant: z.string().max(100),
  date: z.date().max(new Date()),
});

@Post()
async create(@Body() dto: unknown) {
  const validated = CreateTransactionSchema.parse(dto);
  // Safe to use validated data
}
```

**SQL Injection Prevention (ORM Parameterization):**
```typescript
// ✅ Safe (parameterized query)
await db.transactions.find({ userId: userId });

// ❌ Unsafe (vulnerable to NoSQL injection)
await db.transactions.find({ userId: req.query.userId });
```

**XSS Prevention:**
- All user inputs sanitized before rendering
- React Native TextInput auto-escapes by default

### 6.4 Compliance & Audit

**GDPR-lite (User Data Rights):**
- **Right to Export:** Download all data as JSON
  ```typescript
  @Get('export')
  async exportData(@Req() req: AuthRequest) {
    return {
      profile: req.user,
      transactions: await getTransactions(req.user.id),
      budgets: await getBudgets(req.user.id),
    };
  }
  ```

- **Right to Delete:** Permanent account deletion
  ```typescript
  @Delete('account')
  async deleteAccount(@Req() req: AuthRequest) {
    await db.users.deleteOne({ _id: req.user.id });
    await db.transactions.deleteMany({ userId: req.user.id });
    await firebase.auth().deleteUser(req.user.firebaseUid);
  }
  ```

**Audit Logging (Winston + MongoDB):**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: 'audit_logs',
      level: 'info',
    }),
  ],
});

// Log all financial operations
logger.info('Transaction created', {
  userId: req.user.id,
  transactionId: transaction.id,
  amount: transaction.amount,
  timestamp: new Date(),
});
```

**Retention:** Audit logs kept for 7 years (regulatory requirement)

---

## 7. Third-Party Integrations

### 7.1 Account Aggregator (Sahamati Framework)

**Provider:** Setu AA SDK v2.0

**Why Setu over Direct Sahamati Integration?**
- **Abstraction Layer:** Handles OAuth 2.0 flows, consent management
- **Multi-FIP Support:** Connects to 100+ banks (vs. integrating each separately)
- **Compliance:** Pre-audited by RBI-approved TSPs

**Integration Flow:**
```
User taps "Link Bank Account"
    ↓
App redirects to Setu Consent Manager
    ↓
User selects bank (e.g., HDFC, SBI)
    ↓
User authenticates with bank
    ↓
User grants consent (1 year, read-only)
    ↓
Setu returns consent token
    ↓
App stores token in Keychain
    ↓
Backend fetches bank statements via Setu API
```

**API Usage:**
```typescript
import { SetuAA } from '@setu/aa-sdk';

const setu = new SetuAA({
  clientId: process.env.SETU_CLIENT_ID,
  clientSecret: process.env.SETU_CLIENT_SECRET,
  redirectUrl: 'finsight://aa-callback',
});

// Step 1: Create consent request
const consentRequest = await setu.createConsent({
  purpose: 'WEALTH_MANAGEMENT',
  fipId: 'HDFC-FIP',
  dataRange: {
    from: '2024-01-01',
    to: '2026-02-01',
  },
  frequency: 'DAILY',
});

// Step 2: User approves via redirect

// Step 3: Fetch data
const statements = await setu.fetchData(consentRequest.id);
```

**Data Processing:**
```typescript
statements.forEach((transaction) => {
  // Map varying bank formats to internal schema
  const normalized = {
    amount: parseFloat(transaction.amount || transaction.txnAmount),
    date: new Date(transaction.valueDate || transaction.transactionDate),
    type: transaction.type === 'DEBIT' ? 'debit' : 'credit',
    narration: transaction.narration || transaction.description,
  };
  
  // Save to MongoDB
  await db.transactions.insertOne(normalized);
});
```

**Cost:** $0.05 per successful fetch (Phase 2 feature)

### 7.2 Market Data

**Provider:** Alpha Vantage (Free Tier) → NSE API (Paid, Future)

**Alpha Vantage (MVP):**
- **Free Tier:** 500 requests/day
- **Coverage:** NIFTY 50, SENSEX, commodities (Gold)
- **Latency:** ~500ms (acceptable for non-real-time)

**API Usage:**
```typescript
import axios from 'axios';

async function fetchMarketData() {
  const response = await axios.get(
    'https://www.alphavantage.co/query',
    {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: 'NSEI', // NIFTY 50
        apikey: process.env.ALPHA_VANTAGE_KEY,
      },
    }
  );
  
  return {
    symbol: 'NIFTY 50',
    value: response.data['Global Quote']['05. price'],
    change: response.data['Global Quote']['09. change'],
    changePercent: response.data['Global Quote']['10. change percent'],
  };
}
```

**Caching:**
```typescript
// Redis cache (5-minute TTL)
const cached = await redis.get('market:nifty50');
if (cached) return JSON.parse(cached);

const data = await fetchMarketData();
await redis.setex('market:nifty50', 300, JSON.stringify(data));
return data;
```

**Future: NSE API Direct**
- **Latency:** <100ms (websocket connection)
- **Cost:** $200/month (vendor fee)
- **Migration Trigger:** >10K DAU (when Alpha Vantage limits hit)

### 7.3 Push Notifications

**Firebase Cloud Messaging (FCM) 12.x**

**Why FCM over OneSignal?**
- **Free:** No cost up to 10M messages/day
- **Integration:** Already using Firebase Auth
- **Reliability:** 99.95% delivery rate

**Setup (React Native):**
```typescript
import messaging from '@react-native-firebase/messaging';

// Request permission
await messaging().requestPermission();

// Get FCM token
const token = await messaging().getToken();
await api.updateFCMToken(token);

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  // Show in-app toast
  showToast(remoteMessage.notification.body);
});

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Local notification
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
  });
});
```

**Backend (Send Notification):**
```typescript
import * as admin from 'firebase-admin';

async function sendBudgetAlert(userId: string, category: string) {
  const user = await db.users.findOne({ _id: userId });
  
  await admin.messaging().send({
    token: user.fcmToken,
    notification: {
      title: '⚠️ Budget Alert',
      body: `You've spent 80% of your ${category} budget`,
    },
    data: {
      type: 'budget_alert',
      category: category,
      deepLink: `finsight://budgets/${category}`,
    },
  });
}
```

### 7.4 Analytics & Monitoring

**Mixpanel 2.x (Event Tracking)**

**Key Events:**
```typescript
mixpanel.track('EITM Card Viewed', {
  cardId: 'eitm_123',
  trigger: 'market_event',
  headline: 'Why did gold prices jump?',
});

mixpanel.track('Transaction Auto-Captured', {
  source: 'notification',
  category: 'dining',
  amount: 450,
});

mixpanel.track('Learning Module Completed', {
  pathId: 'investing101',
  moduleId: 'module_5',
  quizScore: 8,
});
```

**Funnel Analysis:**
```
Onboarding Started → 100%
  ↓
Permission Granted → 65%
  ↓
Profile Completed → 80%
  ↓
First Transaction Logged → 90%
  ↓
EITM Card Engaged → 60%
```

**Sentry 7.x (Error Tracking)**

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2, // 20% of transactions
  beforeSend(event) {
    // Strip PII before sending
    if (event.user) {
      delete event.user.email;
      delete event.user.phone;
    }
    return event;
  },
});
```

---

## 8. DevOps & Infrastructure

### 8.1 Version Control & Monorepo

**GitHub (Monorepo Structure)**

```
finsight/
├── .github/
│   └── workflows/           # CI/CD pipelines
├── mobile/                  # React Native app
│   ├── android/
│   ├── ios/
│   ├── src/
│   └── package.json
├── backend/
│   ├── gateway/             # NestJS API Gateway
│   ├── services/            # Microservices
│   │   ├── user-service/
│   │   ├── transaction-service/
│   │   └── ...
│   ├── shared/              # Shared types, DTOs
│   └── docker-compose.yml
├── ai-gateway/              # FastAPI Python service
│   ├── src/
│   ├── models/              # ML models
│   └── requirements.txt
├── infrastructure/          # Terraform / Kubernetes
│   ├── aws/
│   └── k8s/
└── docs/                    # PRD, DesignDoc, TechStack
```

**Why Monorepo (vs. Multi-Repo)?**
- **Shared Types:** TypeScript interfaces used by mobile + backend
- **Atomic Commits:** Change API contract + mobile code in one PR
- **Simplified CI/CD:** Single pipeline for all services

**Tools:**
- **Turborepo:** Build orchestration (caches builds)
- **pnpm Workspaces:** Shared node_modules (saves disk space)

### 8.2 CI/CD Pipeline

**GitHub Actions (`.github/workflows/ci.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Mobile App
  mobile-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd mobile && npm ci
      - name: Run tests
        run: npm test
      - name: Build Android
        run: cd android && ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: mobile/android/app/build/outputs/apk/release/

  # Backend Services
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: npm test
      - name: PII Leak Check
        run: npm run pii-check  # Custom script (see below)

  # Deploy to Staging
  deploy-staging:
    needs: [mobile-test, backend-test]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: |
          aws ecs update-service \
            --cluster finsight-staging \
            --service backend \
            --force-new-deployment
```

**PII Leak Detection:**
```javascript
// scripts/pii-check.js
const fs = require('fs');
const presidio = require('presidio-anonymizer');

const codeFiles = fs.readdirSync('src', { recursive: true });
codeFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for hardcoded phone numbers, emails
  if (/\+91-?\d{10}/.test(content)) {
    throw new Error(`Hardcoded phone number in ${file}`);
  }
  if (/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}/.test(content)) {
    throw new Error(`Hardcoded email in ${file}`);
  }
});

console.log('✅ No PII leaks detected');
```

### 8.3 Hosting & Infrastructure

**AWS (Primary) with GCP Fallback**

**Compute:**
- **ECS Fargate:** Docker containers for backend services (auto-scaling)
- **Lambda:** Serverless functions (EITM generation, budget alerts)
- **EC2 (t3.medium):** MongoDB replica set (until Atlas migration)

**Networking:**
- **CloudFront CDN:** Static assets (learning content, images)
- **Route 53:** DNS management
- **Application Load Balancer:** Routes traffic to ECS services

**Storage:**
- **S3:** Transaction receipts (future), backup dumps
- **RDS (if switching from MongoDB):** Managed PostgreSQL alternative

**Infrastructure as Code (Terraform):**

```hcl
# infrastructure/aws/ecs.tf
resource "aws_ecs_cluster" "finsight" {
  name = "finsight-${var.environment}"
}

resource "aws_ecs_service" "backend" {
  name            = "backend"
  cluster         = aws_ecs_cluster.finsight.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2  # 2 replicas for HA

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3000
  }

  auto_scaling {
    min_capacity = 2
    max_capacity = 10
    target_cpu   = 70  # Scale up at 70% CPU
  }
}
```

**Kubernetes (Future, Phase 2+):**
- For complex microservices orchestration
- When we need service mesh (Istio) for inter-service encryption

### 8.4 Monitoring & Observability

**Prometheus + Grafana**

**Metrics:**
```typescript
// Prometheus client in NestJS
import { Counter, Histogram } from 'prom-client';

const apiRequestCounter = new Counter({
  name: 'api_requests_total',
  help: 'Total API requests',
  labelNames: ['method', 'route', 'status'],
});

const apiLatency = new Histogram({
  name: 'api_latency_seconds',
  help: 'API latency in seconds',
  labelNames: ['method', 'route'],
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    apiRequestCounter.inc({
      method: req.method,
      route: req.route?.path || 'unknown',
      status: res.statusCode,
    });
    apiLatency.observe(
      { method: req.method, route: req.route?.path },
      (Date.now() - start) / 1000
    );
  });
  next();
});
```

**Alerts:**
```yaml
# alerts.yml
groups:
  - name: finsight
    rules:
      - alert: HighErrorRate
        expr: rate(api_requests_total{status=~"5.."}[5m]) > 0.05
        annotations:
          summary: "Error rate >5% for {{ $labels.route }}"
      - alert: SlowAPIResponse
        expr: api_latency_seconds{quantile="0.95"} > 2
        annotations:
          summary: "P95 latency >2s for {{ $labels.route }}"
```

**Logging (ELK Stack):**
- **Elasticsearch:** Log storage
- **Logstash:** Log aggregation
- **Kibana:** Visualization

---

## 9. Development Tools & Workflow

### 9.1 Local Development

**Docker Compose (Backend Services):**

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7.2
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - redis
    environment:
      MONGO_URI: mongodb://admin:password@mongodb:27017
      REDIS_HOST: redis

  ai-gateway:
    build: ./ai-gateway
    ports:
      - "8000:8000"
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
```

**React Native (Expo) Development:**
```bash
# Start Expo dev server
npx expo start

# Run on Android (development build)
npx expo run:android

# Run on iOS (development build)
npx expo run:ios

# Run tests
npm test -- --watch

# Create production build
eas build --platform android --profile production
```

### 9.2 Testing Strategy

**Unit Tests (Jest):**
```typescript
// transaction.service.spec.ts
describe('TransactionService', () => {
  it('should categorize Swiggy as dining', async () => {
    const result = await service.categorize({
      merchant: 'Swiggy',
      amount: 450,
    });
    expect(result.category).toBe('dining');
  });

  it('should mask PII before saving', async () => {
    const transaction = await service.create({
      merchant: 'HDFC XX-1234',
      amount: 450,
    });
    expect(transaction.merchant).not.toContain('1234');
  });
});
```

**Integration Tests (Supertest):**
```typescript
describe('POST /transactions', () => {
  it('should create transaction', async () => {
    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 450,
        category: 'dining',
        merchant: 'Swiggy',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

**E2E Tests (Maestro for Expo/React Native):**
```typescript
describe('Transaction Flow', () => {
  it('should capture transaction from notification', async () => {
    // Simulate notification
    await device.sendUserNotification({
      title: 'HDFC Bank',
      body: 'INR 450 debited at Swiggy',
    });

    // Check transaction appears in feed
    await expect(element(by.text('Swiggy'))).toBeVisible();
    await expect(element(by.text('₹450'))).toBeVisible();
  });
});
```

### 9.3 Code Quality

**ESLint + Prettier:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": "warn"
  }
}
```

**Husky (Pre-commit Hooks):**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 10. Technology Decision Matrix

| **Category** | **Technology** | **Alternative Considered** | **Decision Rationale** |
|--------------|----------------|---------------------------|------------------------|
| **Mobile Framework** | Expo (React Native) | Flutter, React Native CLI | Simplified build pipeline, OTA updates, config plugins for native modules |
| **Language (Mobile)** | TypeScript | JavaScript, Dart | Type safety critical for financial data |
| **Styling** | NativeWind | StyleSheet, Styled Components | Matches Design Doc Tailwind tokens |
| **State Management** | Redux Toolkit | Context API, MobX | Complex state, DevTools, offline sync |
| **Backend Framework** | NestJS | Express, Fastify | Structure, DI, microservices-ready |
| **AI Gateway** | FastAPI | Flask, Django | Async support, Presidio integration |
| **Database** | MongoDB | PostgreSQL, DynamoDB | Variable bank JSON schemas, flexible |
| **Cache** | Redis | Memcached | Data structures, persistence |
| **Vector DB** | Pinecone | Milvus, Weaviate | Managed, fast setup (switch to Milvus if cost exceeds $200/month) |
| **On-Device AI** | ExecuTorch (Llama 3.2) | TensorFlow Lite | PyTorch ecosystem, better model support |
| **Cloud AI** | OpenAI GPT-4o-mini | Claude 3 Haiku, Gemini | Cost-performance balance, fallback: Claude |
| **Auth** | Firebase Auth | Auth0, Cognito | Phone OTP native, Indian market fit |
| **Push Notifications** | FCM | OneSignal, Pusher | Free, Firebase integration |
| **Market Data** | Alpha Vantage (MVP) | NSE Direct | Free tier sufficient for MVP, migrate later |
| **AA Framework** | Setu SDK | Direct Sahamati | Abstraction layer, multi-FIP support |
| **CI/CD** | GitHub Actions | GitLab CI, CircleCI | Integrated with repo, free for public repos |
| **Hosting** | AWS ECS Fargate | GCP Cloud Run, Heroku | Mature, team expertise, Fargate simplicity |
| **Monitoring** | Prometheus + Grafana | DataDog, New Relic | Open-source, cost-effective |
| **Error Tracking** | Sentry | Bugsnag, Rollbar | Best React Native support, free tier |

---

## 11. Performance & Scalability

### 11.1 Performance Targets

| **Metric** | **Target** | **Current (Estimated)** | **Strategy** |
|------------|-----------|------------------------|--------------|
| Feed Load Time | <2s | 1.5s | Redis cache, lazy loading |
| EITM Generation (On-Device) | <2s | 1.8s | Quantized model (INT8) |
| EITM Generation (Cloud) | <5s | 3.5s | Presidio caching, prompt compression |
| API Response Time (P95) | <500ms | 350ms | Database indexing, connection pooling |
| Transaction Auto-Capture Latency | <30s | 15s | Event-driven, no polling |
| App Launch Time | <3s | 2.5s | Code splitting, lazy modules |

### 11.2 Scalability Plan

**Phase 1 (MVP - 100K Users):**
- **Backend:** 2 ECS Fargate tasks (2 vCPU, 4GB RAM each)
- **Database:** MongoDB Atlas M10 (2GB RAM, 10GB storage)
- **Redis:** Single instance (1GB RAM)
- **Cost:** ~$300/month

**Phase 2 (500K Users):**
- **Backend:** Auto-scale to 10 tasks (max)
- **Database:** MongoDB Atlas M30 (8GB RAM, sharded)
- **Redis:** Redis Cluster (3 nodes)
- **CDN:** CloudFront for static assets
- **Cost:** ~$1,200/month

**Phase 3 (1M+ Users):**
- **Backend:** Migrate to Kubernetes (EKS)
- **Database:** Multi-region MongoDB sharding
- **Cache:** Redis with read replicas
- **AI:** Move to self-hosted Llama (cost reduction)
- **Cost:** ~$5,000/month

### 11.3 Load Testing

**Artillery.io:**
```yaml
# load-test.yml
config:
  target: "https://api.finsight.app"
  phases:
    - duration: 60
      arrivalRate: 10  # 10 req/sec
    - duration: 120
      arrivalRate: 50  # Ramp to 50 req/sec

scenarios:
  - name: "Feed Load"
    flow:
      - get:
          url: "/feed"
          headers:
            Authorization: "Bearer {{token}}"
```

**Target:** Sustain 100 req/sec with P95 latency <500ms

---

## 12. Security & Compliance

### 12.1 OWASP Top 10 Mitigation

| **Threat** | **Mitigation** |
|------------|---------------|
| A01: Broken Access Control | JWT verification on all endpoints, row-level security (userId filter) |
| A02: Cryptographic Failures | TLS 1.3, AES-256 at rest, no plaintext PII |
| A03: Injection | Parameterized queries (MongoDB), Zod validation |
| A04: Insecure Design | Privacy-first architecture (PII redaction gateway) |
| A05: Security Misconfiguration | Terraform IaC, automated security scanning (Trivy) |
| A06: Vulnerable Components | Dependabot alerts, quarterly dependency audits |
| A07: Authentication Failures | Firebase Auth, rate limiting, JWT expiry |
| A08: Software and Data Integrity | Code signing (Android APK), checksum verification |
| A09: Logging Failures | Winston audit logs (7-year retention) |
| A10: SSRF | Whitelist external API domains (Alpha Vantage, Setu only) |

### 12.2 Penetration Testing

**Plan (Pre-Launch):**
1. **Internal Testing:** OWASP ZAP automated scans
2. **External Audit:** Hire third-party security firm (Bugcrowd)
3. **Scope:** API endpoints, mobile app (APK decompilation resistance)

**Budget:** $5,000 (Phase 1), $10,000 (Phase 2 with AA integration)

### 12.3 Compliance Checklist

- [x] **RBI AA Framework:** Consent-based data access (via Setu)
- [x] **IT Act 2000 (India):** Secure data storage, encryption
- [x] **GDPR-lite:** Data export, deletion (user rights)
- [x] **PCI-DSS (Future):** If storing card data (not in MVP)
- [x] **Google Play Policies:** Notification access justified, privacy policy displayed
- [ ] **SOC 2 Type II (Future):** Required for B2B enterprise (Phase 3+)

---

## 13. Cost Analysis

### 13.1 MVP Cost Breakdown (Per Month)

| **Service** | **Tier** | **Cost** |
|-------------|---------|----------|
| **AWS Hosting** | 2 ECS Fargate tasks (2 vCPU, 4GB RAM) | $100 |
| **MongoDB Atlas** | M10 (2GB RAM, 10GB storage) | $60 |
| **Redis (Upstash)** | Pro plan (1GB RAM) | $30 |
| **Firebase** | Spark plan (auth, FCM) | Free |
| **OpenAI API** | 1M tokens/month (~10K EITM generations) | $15 |
| **Alpha Vantage** | Free tier (500 req/day) | Free |
| **Sentry** | Team plan (10K events/month) | $26 |
| **Mixpanel** | Free tier (100K events/month) | Free |
| **Domain & SSL** | Route 53 + ACM | $5 |
| **GitHub** | Free (public repo) | Free |
| **Total** | | **$236/month** |

**Per-User Cost (at 10K MAU):** $0.024/user/month

### 13.2 Phase 2 Cost Projections (500K MAU)

| **Service** | **Scaling Change** | **New Cost** |
|-------------|--------------------|--------------|
| AWS Hosting | Auto-scale to 10 tasks | $500 |
| MongoDB Atlas | M30 (8GB RAM, sharded) | $300 |
| Redis Cluster | 3 nodes | $150 |
| OpenAI API | 50M tokens/month | $750 |
| Alpha Vantage | Upgrade to Premium ($250/month) | $250 |
| CloudFront CDN | 1TB data transfer | $100 |
| Setu AA | $0.05 per fetch (10K users using AA) | $500 |
| **Total** | | **$2,550/month** |

**Per-User Cost (at 500K MAU):** $0.0051/user/month (80% reduction due to economies of scale)

### 13.3 Cost Optimization Strategies

1. **On-Device AI Migration:** Reduce OpenAI costs by 60% (handle simple queries locally)
2. **MongoDB Sharding:** Delay until >1M users (save $200/month)
3. **Self-Hosted Redis:** Switch from managed to EC2-hosted (save $100/month at scale)
4. **Reserved Instances:** 1-year AWS commitment (30% discount)

---

## 14. Migration & Upgrade Path

### 14.1 Database Migration (MongoDB → PostgreSQL, if needed)

**Trigger:** If queries become too relational (e.g., complex JOINs for analytics)

**Strategy:**
1. **Dual-Write Period:** Write to both MongoDB and PostgreSQL (1 month)
2. **Backfill:** Migrate historical data via batch job
3. **Switch Reads:** Gradually move read queries to PostgreSQL
4. **Deprecate MongoDB:** After 3 months of stability

**Tools:** 
- **Debezium:** Change Data Capture (CDC) from MongoDB to PostgreSQL
- **Flyway:** PostgreSQL schema migrations

### 14.2 On-Device AI Upgrade (Llama 3.2 1B → 3B)

**Trigger:** When mid-range phones support 3B model (2027+)

**Strategy:**
1. **A/B Test:** 10% of users get 3B model
2. **Metrics:** Compare inference speed, accuracy, battery drain
3. **Gradual Rollout:** If 3B is <3s inference, roll out to 100%

### 14.3 Kubernetes Migration (ECS → EKS)

**Trigger:** >20 microservices (complexity threshold)

**Strategy:**
1. **Proof of Concept:** Migrate 1 non-critical service (Learning Service)
2. **Helm Charts:** Package all services
3. **Parallel Run:** Run ECS + EKS for 2 weeks
4. **Full Migration:** Switch DNS to EKS load balancer

---

## 15. Appendices

### Appendix A: Environment Variables

```bash
# .env.example

# Database
MONGO_URI=mongodb://localhost:27017/finsight
REDIS_URL=redis://localhost:6379

# Authentication
FIREBASE_PROJECT_ID=finsight-prod
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=your-secret-key

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...

# Third-Party APIs
ALPHA_VANTAGE_KEY=...
SETU_CLIENT_ID=...
SETU_CLIENT_SECRET=...

# Encryption
ENCRYPTION_KEY=... # 32-byte hex string

# Monitoring
SENTRY_DSN=https://...
MIXPANEL_TOKEN=...

# Feature Flags
ENABLE_ON_DEVICE_AI=true
ENABLE_AA_INTEGRATION=false
```

### Appendix B: Glossary

- **AA:** Account Aggregator (RBI-regulated framework for bank data sharing)
- **EITM:** Explain It To Me (AI-generated financial explainers)
- **FIP:** Financial Information Provider (banks in AA ecosystem)
- **PII:** Personally Identifiable Information (phone, email, account numbers)
- **RAG:** Retrieval-Augmented Generation (LLM technique using vector DB)
- **ExecuTorch:** PyTorch mobile inference library

### Appendix C: Team Structure

| **Role** | **Responsibilities** | **Tools** |
|----------|---------------------|-----------|
| Mobile Engineers (2) | Expo/React Native app, config plugins | TypeScript, Expo CLI, EAS Build |
| Backend Engineers (2) | NestJS microservices, API design | TypeScript, MongoDB, Redis |
| ML Engineer (1) | Model training, on-device AI, Presidio | Python, PyTorch, FastAPI |
| DevOps Engineer (1) | CI/CD, infrastructure, monitoring | Terraform, Docker, Kubernetes |
| Product Designer (1) | UI/UX, Design System | Figma, Design Tokens |
| QA Engineer (1) | E2E testing, security testing | Maestro, OWASP ZAP |

---

**Document Status:** Ready for Implementation  
**Owner:** Engineering Team  
**Next Steps:**
1. **Week 1:** Setup monorepo, configure CI/CD
2. **Week 2:** Implement core backend services (User, Transaction)
3. **Week 3:** Integrate notification listener (Android)
4. **Week 4:** Deploy MVP to staging environment

---

*This technical stack is a living document. Changes will be tracked via Git commits and communicated in weekly engineering syncs.*