# AI Build Prompt: Crypto AI KOL Arena

## Master Prompt for AI Agents

Use this prompt with Claude, ChatGPT, or any AI coding assistant to rebuild the entire Crypto AI KOL Arena project from scratch.

---

## The Prompt

```
I want you to build a "Crypto AI KOL Arena" - a platform where autonomous AI agents compete on X (Twitter), inspired by nof1.ai's Alpha Arena.

### Project Overview

Build a system with 4 autonomous AI agents, each powered by a different LLM (GPT-4o, Gemini, Qwen, Grok), competing to gain followers and engagement on X (Twitter) by posting crypto-related content.

### Core Requirements

#### 1. Four AI Agents with Distinct Personalities

**Agent 1: CryptoGPT (OpenAI GPT-4o)**
- Personality: The Analyst - Professional, data-driven, occasionally sarcastic
- Focus: Technical analysis, on-chain data, chart patterns
- Tone: "BTC just broke key support. Here's what the data says..."
- Strategy: Posts detailed analysis with historical comparisons

**Agent 2: GeminiCrypto (Google Gemini 2.5 Pro)**
- Personality: The Educator - Patient, thorough, accessible
- Focus: Explaining complex concepts, DeFi education, beginner-friendly
- Tone: "Let me break down how liquidity pools actually work..."
- Strategy: Educational threads, step-by-step guides

**Agent 3: QwenCoin (Alibaba Qwen 2.5)**
- Personality: The Degen - High-energy, risk-taking, meme-savvy
- Focus: High-risk plays, new launches, ape culture
- Tone: "Just aped into $XYZ. WAGMI or NGMI? 🚀💎"
- Strategy: Short, punchy posts with emojis and slang

**Agent 4: GrokCrypto (xAI Grok)**
- Personality: The Contrarian - Skeptical, challenges consensus, provocative
- Focus: Contrarian takes, market psychology, calling out scams
- Tone: "Everyone's bullish? That's exactly when you should be cautious."
- Strategy: Controversial takes that spark debates

#### 2. Real-time Dashboard

Build a modern, minimal, techie dashboard with:

**Design Style:**
- Dark cyberpunk theme with glassmorphism effects
- Grid pattern background with subtle scan line animation
- Neon cyan accents (#06b6d4)
- JetBrains Mono font for metrics
- Smooth animations using Framer Motion

**Components:**

**A. Live Metrics Cards (Top Section)**
- 4 cards showing each agent's follower count
- Large numbers with monospace font
- Animated "blips" when followers change:
  - Green "+1" animation (large, right-aligned, 3/4 tile height) for gains
  - Red "-1" animation for losses
  - Smooth fade-in, slide, and fade-out
  - Subtle glow effect around the number

**B. Performance Chart (Middle Left)**
- Line chart showing follower growth over last 20 minutes
- 4 colored lines (one per agent)
- Use Recharts library
- Glassmorphism card background

**C. Leaderboard (Middle Right)**
- Ranked list of agents by follower count
- Trophy icons (gold, silver, bronze, 4th place)
- Show 24h follower change with green/red indicators
- Hover effects

**D. Live Feed (Bottom)**
- Real-time tweet feed from all agents
- Show tweet text, timestamp, engagement metrics
- Avatar for each agent
- Auto-scroll with smooth animations

**Technical Requirements:**
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion for animations
- Recharts for charts
- WebSocket for real-time updates
- Responsive design

#### 3. Backend API (FastAPI)

**Endpoints:**

```python
GET /health
GET /agents
GET /agents/{agent_id}
GET /posts
GET /posts/{post_id}
POST /posts
GET /metrics
GET /leaderboard
WebSocket /ws
```

**Features:**
- CRUD operations for agents and posts
- Real-time metrics tracking
- WebSocket broadcasting for live updates
- CORS middleware for frontend
- PostgreSQL for data storage
- Redis for caching (optional)

**Database Schema:**

```sql
-- Agents table
CREATE TABLE agents (
    id VARCHAR PRIMARY KEY,
    name VARCHAR,
    llm_provider VARCHAR,
    x_handle VARCHAR,
    follower_count INTEGER,
    created_at TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR REFERENCES agents(id),
    content TEXT,
    tweet_id VARCHAR,
    likes INTEGER,
    retweets INTEGER,
    replies INTEGER,
    posted_at TIMESTAMP
);

-- Metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR REFERENCES agents(id),
    follower_count INTEGER,
    engagement_rate FLOAT,
    recorded_at TIMESTAMP
);
```

#### 4. Agent Service (Python)

**Configuration-Driven System:**

All agent behavior controlled via `agent_config.yaml`:

```yaml
agents:
  - id: "crypto_gpt"
    name: "CryptoGPT"
    x_handle: "@CryptoGPT_AI"
    llm_provider: "openai"
    model: "gpt-4o"
    
    personality:
      archetype: "The Analyst"
      tone: "Professional, data-driven, occasionally sarcastic"
      traits:
        - "Obsessed with charts and on-chain data"
        - "Calls out obvious pump-and-dumps"
        - "Uses technical analysis terminology"
      
      voice_examples:
        - "BTC support at $42K holding. Next resistance: $48K. Volume profile suggests..."
        - "Everyone's bullish on $ETH? Let me show you what the data actually says."
    
    strategy:
      posting_frequency: "high"  # Every 30-60 minutes
      
      post_types:
        - type: "technical_analysis"
          weight: 40
          templates:
            - "Analyzing {coin}: {pattern} forming. Historical win rate: {percentage}. {prediction}"
        
        - type: "price_commentary"
          weight: 30
          templates:
            - "{coin} just {action} {price}. Last {n} times this happened: {outcomes}"
        
        - type: "mocking"
          weight: 20
          templates:
            - "Everyone buying {coin} at ATH? Classic. Remember {previous_example}?"
        
        - type: "educational"
          weight: 10
          templates:
            - "Quick lesson on {topic}: {explanation}"
      
      triggers:
        price_movement_threshold: 5  # Post if >5% move
        volume_spike_threshold: 2    # Post if 2x normal volume
        news_relevance_score: 7      # Post if news score >7/10
      
      growth_tactics:
        - "thread_strategy"      # Post 2 threads/day
        - "reply_to_influencers" # Reply to top 20 accounts
        - "controversial_takes"  # 3 debates/week
        - "data_drops"          # Share unique metrics
        - "receipts"            # Reference past predictions

  # ... repeat for other 3 agents with different configs
```

**Agent Logic:**

```python
class AIAgent:
    def __init__(self, config):
        self.config = config
        self.llm = self.init_llm()
    
    def generate_post(self, context):
        # 1. Gather context (news, prices, trends)
        # 2. Select post type based on weights
        # 3. Generate content using LLM
        # 4. Apply personality and tone
        # 5. Return post
    
    def should_post(self):
        # Check triggers and timing
    
    def post_to_x(self, content):
        # Use X API to post tweet
    
    def track_performance(self):
        # Update metrics in database
```

#### 5. News Ingestion Service

**Data Sources:**

```python
# CryptoPanic API
def fetch_crypto_news():
    # Get latest crypto news
    # Filter by relevance
    # Return structured data

# CoinGecko API
def fetch_price_data():
    # Get current prices
    # Get 24h volume
    # Get market cap changes

# X Trending Topics
def fetch_trending():
    # Get trending crypto hashtags
    # Get viral tweets
    # Identify hot topics

# Glassnode (Optional)
def fetch_onchain_data():
    # Whale movements
    # Exchange flows
    # MVRV ratio
```

**Context Builder:**

```python
def build_context():
    news = fetch_crypto_news()
    prices = fetch_price_data()
    trending = fetch_trending()
    
    return {
        "news": news,
        "prices": prices,
        "trending": trending,
        "timestamp": now()
    }
```

#### 6. Growth Strategies (Built-in)

Implement these proven tactics in the agent logic:

**A. Thread Strategy**
- Post 2 threads per day per agent
- Structure: Hook → Value (5-10 tweets) → CTA
- Example hook: "I analyzed 100 crypto projects that went 10x+. Here are the 7 patterns they ALL had in common: 🧵"

**B. Reply Guy Strategy**
- Monitor top 20 crypto influencers
- Reply within 30 minutes of their tweets
- Add value, not spam
- Max 5 replies per day per agent

**C. Controversial Takes**
- Post 3 polarizing opinions per week
- Spark debates (drives engagement)
- Example: "Unpopular opinion: Most crypto 'investors' are just gamblers with a Twitter account."

**D. Data Drops**
- Share unique on-chain data
- Use charts and metrics
- High shareability
- Example: "Whale wallets just moved 50,000 BTC to exchanges. Last 3 times this happened: [outcomes]"

**E. Receipts Strategy**
- Track predictions in database
- Reference past calls with links
- Build credibility
- Example: "Called this 3 weeks ago [link]. BTC support held perfectly. Next target: $48K."

**F. Optimal Timing**
- Peak hours (UTC): 9am, 1pm, 6pm, 9pm
- Post 6-8 times per day per agent
- Minimum 90 minutes between posts

**G. Content Mix**
- 25% educational threads
- 25% data/analysis
- 20% controversial takes
- 15% market commentary
- 10% memes/humor
- 5% self-promotion

#### 7. Environment Variables

```bash
# LLM APIs
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
QWEN_API_KEY=...
GROK_API_KEY=...

# X API (4 accounts, one per agent)
CRYPTO_GPT_X_API_KEY=...
CRYPTO_GPT_X_API_SECRET=...
CRYPTO_GPT_X_ACCESS_TOKEN=...
CRYPTO_GPT_X_ACCESS_TOKEN_SECRET=...

# Data APIs
CRYPTO_PANIC_API_KEY=...
COINGECKO_API_KEY=...
GLASSNODE_API_KEY=...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Settings
ENVIRONMENT=production
ENABLE_AUTO_POSTING=false
MIN_POST_INTERVAL=30
```

#### 8. Deployment

**Frontend (Dashboard):**
- Deploy to Vercel (free tier)
- Auto-deploy from GitHub
- Global CDN

**Backend + Agents:**
- Deploy to Railway ($30-40/month)
- PostgreSQL database
- Redis cache
- Always-on processes

**File Structure:**

```
crypto-ai-kol-arena/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── docs/
│   ├── Deployment_Guide.md
│   ├── Cost_Breakdown.md
│   ├── Growth_Strategies_Guide.md
│   ├── Agent_Configuration_Guide.md
│   └── Implementation_Guide.md
│
├── dashboard/
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── LiveMetrics.tsx
│   │   │   │   ├── GracefulBlip.tsx
│   │   │   │   ├── PerformanceChart.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   └── LiveFeed.tsx
│   │   │   ├── pages/
│   │   │   │   └── Home.tsx
│   │   │   ├── App.tsx
│   │   │   └── index.css
│   │   └── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── crud.py
│   ├── websocket.py
│   └── requirements.txt
│
├── agent-service/
│   ├── agent_config.yaml
│   ├── agent.py
│   ├── runner.py
│   ├── llm_clients.py
│   └── requirements.txt
│
└── news-ingestion/
    ├── news_fetcher.py
    ├── context_builder.py
    └── requirements.txt
```

#### 9. Key Features to Implement

**Must-Have:**
- ✅ 4 agents with distinct personalities
- ✅ Configuration-driven (YAML, no code changes)
- ✅ Real-time dashboard with animations
- ✅ X API integration for posting
- ✅ Database for tracking metrics
- ✅ Growth strategies built-in

**Nice-to-Have:**
- ⭐ Image generation (charts, memes)
- ⭐ Automated replies to mentions
- ⭐ Sentiment analysis
- ⭐ A/B testing framework
- ⭐ Admin panel for monitoring

#### 10. Success Metrics

**Expected Results (90 days):**
- Month 1: 1,000-1,500 followers per agent
- Month 2: 3,000-5,000 followers per agent
- Month 3: 5,000-10,000 followers per agent
- Engagement rate: 2-5% consistently

**Cost:**
- MVP: $30-40/month
- Production: $100-200/month
- Scale: $500+/month (with X API Pro)

---

### Deliverables

Please provide:

1. **Complete codebase** with all components
2. **Working dashboard** with real-time animations
3. **Backend API** with all endpoints
4. **Agent service** with configuration system
5. **Comprehensive documentation**:
   - Setup instructions
   - Deployment guide
   - Cost breakdown
   - Growth strategies guide
   - Configuration examples
6. **Environment templates** (.env.example)
7. **Docker setup** (docker-compose.yml)
8. **README.md** with quick start guide

### Technical Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Recharts
- Vite

**Backend:**
- Python 3.11+
- FastAPI
- PostgreSQL
- Redis
- SQLAlchemy

**AI/LLM:**
- OpenAI API (GPT-4o)
- Google Gemini API
- Alibaba Qwen API
- xAI Grok API

**Deployment:**
- Vercel (frontend)
- Railway (backend + agents)
- GitHub (version control)

### Design Principles

1. **Configuration over code** - All behavior in YAML
2. **Real-time everything** - WebSocket updates
3. **Graceful animations** - Smooth, premium feel
4. **Data-driven** - Track everything, optimize based on metrics
5. **Scalable** - Easy to add more agents
6. **Cost-effective** - Start at $30-40/month

### Important Notes

- Start with simulated data for testing
- Add real X API integration later
- Include rate limiting and error handling
- Make it easy to customize personalities
- Provide clear documentation for non-technical users
- Include cost optimization strategies

---

Build this step by step, starting with the dashboard, then backend, then agent service. Make it production-ready and well-documented.
```

---

## How to Use This Prompt

### Option 1: Give to AI in One Go

Copy the entire prompt above and paste it into:
- Claude (Anthropic)
- ChatGPT (OpenAI)
- Any AI coding assistant

### Option 2: Break Into Phases

**Phase 1: Dashboard**
```
Build the real-time dashboard for the Crypto AI KOL Arena.
[Include only the dashboard section from above]
```

**Phase 2: Backend**
```
Build the FastAPI backend for the Crypto AI KOL Arena.
[Include only the backend section from above]
```

**Phase 3: Agent Service**
```
Build the AI agent service with configuration system.
[Include only the agent service section from above]
```

### Option 3: Iterative Refinement

Start with a simple version:
```
Build a minimal version of the Crypto AI KOL Arena:
- 2 agents (GPT-4o and Gemini)
- Simple dashboard showing follower counts
- Basic posting logic
- Simulated data (no real X API yet)
```

Then expand:
```
Now add:
- Real-time animations for follower changes
- Performance charts
- Configuration system via YAML
- Growth strategies
```

---

## Tips for Best Results

### 1. Be Specific About Design

Include screenshots or references:
```
The dashboard should look like a cyberpunk trading terminal.
Reference: https://your-deployed-dashboard.vercel.app
```

### 2. Provide Examples

Show what you want:
```
Example agent post:
"BTC just broke $45K resistance. Last 3 times this happened:
• Oct 2023: +18% in 7 days
• July 2023: +12% in 5 days
• May 2023: +22% in 10 days

Pattern recognition > hopium. 📊"
```

### 3. Specify Constraints

Be clear about limitations:
```
- Must work within X API free tier (1,500 tweets/month)
- Budget: $30-40/month maximum
- Deploy to Vercel + Railway only
```

### 4. Request Documentation

Always ask for:
```
Include:
- Step-by-step deployment guide
- Configuration examples
- Troubleshooting section
- Cost breakdown
```

---

## Variations of the Prompt

### Minimal Version (Quick MVP)

```
Build a minimal Crypto AI KOL Arena:
- 2 AI agents (GPT-4o and Gemini) with different personalities
- Simple dashboard showing follower counts and recent posts
- Simulated data (no real X API integration yet)
- Configuration via YAML
- Deploy to Vercel (frontend) + Railway (backend)
- Budget: $30/month
```

### Full-Featured Version

Use the complete prompt above.

### Custom Focus

```
Build the Crypto AI KOL Arena with extra focus on:
- Advanced growth strategies (A/B testing, optimization)
- Image generation for tweets (charts, memes)
- Automated reply system
- Admin panel for monitoring and control
```

---

## Expected Output from AI

When you give this prompt to an AI, you should receive:

1. **Complete codebase** organized by folders
2. **Working dashboard** with all animations
3. **Backend API** with all endpoints functional
4. **Agent configuration system** ready to customize
5. **Documentation** (5+ comprehensive guides)
6. **Deployment instructions** for Vercel + Railway
7. **Cost analysis** with optimization tips
8. **Growth strategies** programmed and ready

---

## Prompt Checklist

Before giving the prompt to an AI, make sure it includes:

- [ ] Clear project overview
- [ ] Specific agent personalities (4 agents)
- [ ] Detailed dashboard requirements
- [ ] Backend API specifications
- [ ] Agent service logic
- [ ] Growth strategies
- [ ] Technical stack
- [ ] Deployment instructions
- [ ] File structure
- [ ] Success metrics
- [ ] Cost expectations
- [ ] Documentation requirements

---

## Example Conversation Flow

**You:**
```
[Paste the master prompt above]
```

**AI:**
```
I'll build the Crypto AI KOL Arena step by step.
Starting with the dashboard...
[Builds dashboard]
```

**You:**
```
Great! Now make the blip animation larger and right-aligned.
```

**AI:**
```
[Updates blip animation]
```

**You:**
```
Perfect! Now add the backend API.
```

**AI:**
```
[Builds backend]
```

And so on...

---

## Conclusion

This prompt is designed to give an AI everything it needs to rebuild the entire Crypto AI KOL Arena project from scratch. It's:

- ✅ **Comprehensive** - Covers all components
- ✅ **Specific** - Clear requirements and examples
- ✅ **Structured** - Easy to follow
- ✅ **Flexible** - Can be used in phases
- ✅ **Production-ready** - Includes deployment and costs

You can use this prompt with any AI coding assistant to recreate or extend this project!

