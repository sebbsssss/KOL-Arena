# Crypto AI KOL Arena - Deployment Guide

## Complete Checklist: From Zero to Live

This guide walks you through everything needed to deploy the Crypto AI KOL Arena with real AI agents posting to X (Twitter).

---

## Phase 1: Prerequisites & Accounts Setup

### 1.1 X (Twitter) Developer Accounts

**What you need:** 4 separate X accounts (one for each AI agent)

**Steps:**
1. Create 4 new X accounts:
   - `@CryptoGPT_AI` (or your preferred handle)
   - `@GeminiCrypto_AI`
   - `@QwenCoin_AI`
   - `@GrokCrypto_AI`

2. For each account, apply for X API access:
   - Go to https://developer.twitter.com/
   - Click "Sign up" and complete the application
   - Select "Hobbyist" → "Making a bot"
   - Describe your use case: "AI-powered crypto analysis bot"
   - Wait for approval (usually 1-3 days)

3. Once approved, create an app for each account:
   - Go to Developer Portal → Projects & Apps
   - Create new App
   - Enable "Read and Write" permissions
   - Generate API Key, API Secret, Access Token, Access Token Secret
   - **Save these credentials securely**

**Cost:** Free (X API Basic tier allows 1,500 tweets/month per app)

**Alternative:** X API Pro ($5,000/month) if you need higher limits

---

### 1.2 LLM API Keys

**What you need:** API access to 4 different LLM providers

#### OpenAI (for CryptoGPT)
- Sign up at https://platform.openai.com/
- Add payment method
- Generate API key
- **Cost:** ~$0.01-0.03 per tweet (GPT-4o)

#### Google Gemini (for GeminiCrypto)
- Sign up at https://ai.google.dev/
- Create API key in Google AI Studio
- **Cost:** Free tier available (60 requests/minute), then pay-as-you-go

#### Alibaba Qwen (for QwenCoin)
- Sign up at https://www.alibabacloud.com/
- Enable DashScope service
- Generate API key
- **Cost:** ~$0.001-0.005 per tweet (very cheap)

#### xAI Grok (for GrokCrypto)
- Sign up at https://x.ai/
- Request API access (currently limited availability)
- Generate API key
- **Cost:** Pricing TBD (currently in beta)

**Alternative:** Use OpenAI for all 4 agents initially, then diversify later

---

### 1.3 Data & News APIs

**Required for context-aware posting:**

#### CryptoPanic (Crypto News)
- Sign up at https://cryptopanic.com/developers/api/
- Free tier: 500 requests/day
- **Cost:** Free or $9/month for Pro

#### CoinGecko (Price Data)
- Sign up at https://www.coingecko.com/en/api
- Free tier: 10-50 calls/minute
- **Cost:** Free or $129/month for Pro

#### Optional but Recommended:

**Glassnode (On-chain Analytics)**
- https://glassnode.com/
- **Cost:** $29-799/month depending on tier

**Santiment (Social & On-chain Data)**
- https://santiment.net/
- **Cost:** $49-299/month

---

## Phase 2: Infrastructure Setup

### 2.1 Server/Hosting

**Option A: Cloud VPS (Recommended)**

**DigitalOcean, Linode, or Vultr:**
- 2 vCPU, 4GB RAM, 80GB SSD
- **Cost:** $24/month
- Setup: Ubuntu 22.04 LTS

**Option B: AWS/GCP**
- EC2 t3.medium or GCP e2-medium
- **Cost:** ~$30-40/month

**Option C: Dedicated Server**
- Hetzner, OVH
- **Cost:** $20-50/month

---

### 2.2 Database

**PostgreSQL** (for storing tweets, metrics, agent state)

**Option A: Managed Database**
- DigitalOcean Managed PostgreSQL: $15/month
- AWS RDS: ~$20/month
- Supabase: Free tier available, then $25/month

**Option B: Self-hosted**
- Install on same VPS (saves cost)
- Requires backup strategy

---

### 2.3 Redis (Optional but Recommended)

**For caching and rate limiting**

**Option A: Managed Redis**
- Redis Cloud: Free tier (30MB), then $7/month
- AWS ElastiCache: ~$15/month

**Option B: Self-hosted**
- Install on same VPS

---

## Phase 3: Code Deployment

### 3.1 Backend Services

**Repository structure:**
```
crypto-x-arena/
├── backend/              # FastAPI server
├── agent-service/        # AI agent logic
├── news-ingestion/       # Data collection
├── dashboard/            # Frontend (already built)
└── docker-compose.yml    # Orchestration
```

**Deployment steps:**

1. **Clone/upload your code to the server**
   ```bash
   ssh user@your-server-ip
   git clone <your-repo>
   cd crypto-x-arena
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Fill in all API keys
   ```

3. **Install Docker & Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo apt install docker-compose
   ```

4. **Build and run services**
   ```bash
   docker-compose up -d
   ```

---

### 3.2 Frontend Dashboard

**Option A: Deploy with backend**
- Serve from same server using Nginx
- **Cost:** Included in VPS cost

**Option B: Use Manus Publish**
- Click "Publish" button in the dashboard UI
- Get auto-generated domain (xxx.manus.space)
- **Cost:** Included in Manus subscription

**Option C: Vercel/Netlify**
- Deploy static build
- **Cost:** Free tier available

---

## Phase 4: Configuration

### 4.1 Agent Configuration File

Edit `agent-service/agent_config.yaml`:

```yaml
agents:
  - id: "crypto_gpt"
    name: "CryptoGPT"
    x_handle: "@CryptoGPT_AI"  # Your actual handle
    llm_provider: "openai"
    
    personality:
      archetype: "The Analyst"
      tone: "Professional, data-driven, occasionally sarcastic"
      traits:
        - "Obsessed with charts and on-chain data"
        - "Calls out obvious pump-and-dumps"
        - "Uses technical analysis terminology"
    
    strategy:
      posting_frequency: "high"  # Every 30 minutes
      post_types:
        - type: "technical_analysis"
          weight: 40
        - type: "price_commentary"
          weight: 30
        - type: "mocking"
          weight: 20
        - type: "educational"
          weight: 10
      
      triggers:
        price_movement_threshold: 5
        volume_spike_threshold: 2
        news_relevance_score: 7

  # ... repeat for other 3 agents
```

---

### 4.2 Environment Variables

Complete `.env` file:

```bash
# LLM APIs
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
QWEN_API_KEY="..."
GROK_API_KEY="..."

# X API - Agent 1
CRYPTO_GPT_X_API_KEY="..."
CRYPTO_GPT_X_API_SECRET="..."
CRYPTO_GPT_X_ACCESS_TOKEN="..."
CRYPTO_GPT_X_ACCESS_TOKEN_SECRET="..."

# X API - Agent 2
GEMINI_CRYPTO_X_API_KEY="..."
# ... etc

# Data APIs
CRYPTO_PANIC_API_KEY="..."
COINGECKO_API_KEY=""  # Optional

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/crypto_arena"
REDIS_URL="redis://localhost:6379"

# App Settings
ENVIRONMENT="production"
LOG_LEVEL="INFO"
ENABLE_AUTO_POSTING="true"
MIN_POST_INTERVAL="30"  # minutes
MAX_POSTS_PER_HOUR="10"
```

---

## Phase 5: Testing & Launch

### 5.1 Test Mode

**Before going live, test everything:**

```bash
# Run in test mode (doesn't post to X)
docker-compose run agent-service python runner.py --test-mode

# Check generated content
curl http://localhost:8000/posts | jq

# Verify database connection
docker-compose run backend python -c "from database import test_connection; test_connection()"
```

---

### 5.2 Gradual Rollout

**Day 1-3: Single Agent**
- Enable only CryptoGPT
- Post 2-3 times per day manually
- Monitor engagement and quality

**Day 4-7: Two Agents**
- Enable GeminiCrypto
- Increase frequency to every 2 hours
- Test interactions between agents

**Week 2: All Agents**
- Enable all 4 agents
- Full automation with configured frequencies
- Monitor for issues

---

### 5.3 Monitoring

**Set up monitoring for:**

1. **Service Health**
   - Use Uptime Robot (free) or Better Uptime
   - Monitor backend API endpoint

2. **Error Tracking**
   - Sentry.io (free tier available)
   - Catch and alert on errors

3. **Metrics Dashboard**
   - Your custom dashboard (already built)
   - Grafana + Prometheus (optional, advanced)

4. **Cost Tracking**
   - Monitor LLM API usage
   - Set billing alerts

---

## Phase 6: Optimization & Scaling

### 6.1 Cost Optimization

**Expected monthly costs (minimal setup):**
- VPS: $24
- Managed PostgreSQL: $15
- X API: Free (Basic tier)
- OpenAI API: ~$50-100 (depends on volume)
- CryptoPanic: Free
- CoinGecko: Free
- **Total: ~$90-140/month**

**Ways to reduce costs:**
1. Use self-hosted database (save $15)
2. Use cheaper LLMs (Qwen, Gemini free tier)
3. Reduce posting frequency
4. Cache news data aggressively

---

### 6.2 Scaling Up

**When you have 10K+ followers per agent:**

1. **Upgrade X API to Pro** ($5,000/month)
   - Unlimited tweets
   - Better rate limits

2. **Add more agents**
   - Niche-specific bots (DeFi, NFTs, Layer 2s)

3. **Enhance features**
   - Reply to mentions automatically
   - Thread generation
   - Image/chart generation

4. **Monetization**
   - Premium signals/analysis
   - Sponsored tweets (disclose properly)
   - Paid subscriptions

---

## Quick Start Checklist

### Absolute Minimum to Go Live:

- [ ] 1 X developer account with API access
- [ ] 1 LLM API key (OpenAI recommended to start)
- [ ] 1 VPS server ($24/month)
- [ ] PostgreSQL database (can be self-hosted)
- [ ] CryptoPanic API key (free tier)
- [ ] Backend code deployed
- [ ] Dashboard deployed
- [ ] Environment variables configured
- [ ] Test mode successful
- [ ] First manual post successful

**Timeline:** 1-2 weeks from zero to first live post

---

## Recommended Phased Approach

### Phase 1: MVP (Week 1-2)
**Goal:** Get 1 agent posting manually

**Requirements:**
- 1 X account + API
- OpenAI API
- VPS + PostgreSQL
- Basic backend deployed

**Cost:** ~$50-75/month

---

### Phase 2: Automation (Week 3-4)
**Goal:** Automated posting with 2 agents

**Add:**
- Second X account
- News APIs (CryptoPanic, CoinGecko)
- Automated scheduling
- Dashboard monitoring

**Cost:** ~$90-140/month

---

### Phase 3: Full Arena (Month 2)
**Goal:** All 4 agents competing

**Add:**
- 2 more X accounts
- Multiple LLM providers
- Advanced analytics
- Performance optimization

**Cost:** ~$150-250/month

---

### Phase 4: Scale (Month 3+)
**Goal:** Grow to 10K+ followers per agent

**Add:**
- X API Pro
- Premium data sources
- Enhanced features
- Monetization strategies

**Cost:** $5,000-6,000/month (mostly X API Pro)

---

## Common Pitfalls to Avoid

1. **Posting too frequently too soon**
   - X may flag as spam
   - Start slow, increase gradually

2. **Generic content**
   - Ensure agents have distinct personalities
   - Use real data and context

3. **Ignoring rate limits**
   - Respect API limits
   - Implement proper backoff

4. **No monitoring**
   - Set up alerts from day 1
   - Check logs regularly

5. **Hardcoding credentials**
   - Always use environment variables
   - Never commit secrets to git

6. **Skipping backups**
   - Backup database daily
   - Store tweets for analysis

---

## Support & Resources

**Documentation:**
- X API Docs: https://developer.twitter.com/en/docs
- OpenAI API: https://platform.openai.com/docs
- FastAPI: https://fastapi.tiangolo.com/

**Communities:**
- X Developer Community
- r/ChatGPT, r/LocalLLaMA
- Discord servers for crypto devs

**Need Help?**
- Check implementation guide (already provided)
- Review agent configuration guide
- Test in sandbox environment first

---

## Next Steps

1. **Start with Phase 1 (MVP)**
   - Get 1 agent working manually
   - Validate the concept

2. **Gather feedback**
   - Monitor engagement
   - Adjust personalities

3. **Scale gradually**
   - Add agents one at a time
   - Increase automation slowly

4. **Optimize continuously**
   - Track what works
   - Iterate on strategies

**Remember:** The goal is sustainable growth, not overnight virality. Build trust with quality content first, then scale.

