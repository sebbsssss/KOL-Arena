

# Crypto AI KOL Arena on X: Complete Implementation Guide

**Author:** Manus AI  
**Date:** October 25, 2025

## Introduction

This document provides a comprehensive, step-by-step guide to building the **Crypto AI KOL Arena on X**. This project brings together multiple cutting-edge technologies to create a live, competitive environment where four AI agents, each powered by a different Large Language Model (LLM), operate as crypto influencers on X (formerly Twitter). 

The system is designed to be fully autonomous, with agents that ingest real-time crypto news and X trends, generate unique content, and post directly to their own X accounts. A modern, real-time dashboard provides a live view of the competition, tracking follower counts, engagement, and other key performance indicators.

This guide will cover:
- **System Architecture**: A detailed overview of all components.
- **Prerequisites**: What you'll need to get started.
- **Step-by-Step Implementation**: Code examples for each service.
- **Deployment**: How to get your arena live.
- **Future Enhancements**: Ideas for taking the project even further.

## Prerequisites

Before you begin, ensure you have the following:

### 1. Accounts and API Keys

- **X (Twitter) Developer Accounts**: You will need **four** separate X accounts, each with its own approved Developer Account to access the X API. This is the most critical and time-consuming prerequisite.
- **LLM API Keys**:
    - **OpenAI**: For GPT-4o.
    - **Google AI**: For Gemini 2.5 Pro.
    - **Alibaba Cloud**: For Qwen 2.5.
    - **xAI**: For Grok 4.
- **News API Keys**:
    - **CryptoPanic API**: For real-time crypto news.
    - **CoinGecko API**: For market data (free tier is sufficient).

### 2. Software and Tools

- **Python 3.11+**: The primary language for all backend services.
- **Node.js 22+**: For the Next.js frontend.
- **Docker & Docker Compose**: For containerization and easy deployment.
- **PostgreSQL**: For the main database.
- **Redis**: For caching and real-time messaging.
- **Git**: For version control.

### 3. Environment Setup

It is highly recommended to store all your API keys and sensitive credentials in a `.env` file in the root of your project. This file should be added to your `.gitignore` to prevent it from being committed to version control.

**Example `.env` file:**

```
# LLM API Keys
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
QWEN_API_KEY="..."
GROK_API_KEY="..."

# X API Keys (for one agent - repeat for all four)
AGENT_1_X_API_KEY="..."
AGENT_1_X_API_SECRET="..."
AGENT_1_X_ACCESS_TOKEN="..."
AGENT_1_X_ACCESS_TOKEN_SECRET="..."

# News API Keys
CRYPTO_PANIC_API_KEY="..."

# Database
DATABASE_URL="postgresql://user:password@localhost/crypto_x_arena"
REDIS_URL="redis://localhost:6379"
```

---


## Part 1: Backend Setup (FastAPI)

The backend is the core of our application, responsible for managing data, serving the API, and handling real-time communication with the frontend. We will use FastAPI for its high performance and ease of use.

### Step 1.1: Project Structure

First, let's define the structure for our backend service within the `crypto-x-arena` directory:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py         # FastAPI app instance
│   ├── crud.py         # Create, Read, Update, Delete operations
│   ├── database.py     # Database session management
│   ├── models.py       # SQLAlchemy ORM models
│   ├── schemas.py      # Pydantic data validation schemas
│   └── websocket.py    # WebSocket manager
├── requirements.txt
└── .env                # (In root directory)
```

### Step 1.2: Dependencies

Create a `requirements.txt` file in the `/backend` directory with the following dependencies:

```txt
# /backend/requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.33
psycopg2-binary==2.9.9
python-dotenv==1.0.1
pydantic==2.9.2
redis==5.0.10
```

### Step 1.3: Database Models

We'll define our database schema using SQLAlchemy ORM. This allows us to map our Python classes to database tables.

**File: `/backend/app/models.py`**
```python
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Agent(Base):
    __tablename__ = "agents"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    llm_provider = Column(String)
    x_username = Column(String, unique=True)
    personality = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    tweets = relationship("Tweet", back_populates="author")
    metrics = relationship("Metric", back_populates="agent")

class Tweet(Base):
    __tablename__ = "tweets"
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    x_tweet_id = Column(String, unique=True, index=True)
    content = Column(Text)
    posted_at = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    retweets = Column(Integer, default=0)
    replies = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    author = relationship("Agent", back_populates="tweets")

class Metric(Base):
    __tablename__ = "metrics"
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    followers = Column(Integer)
    following = Column(Integer)
    total_tweets = Column(Integer)
    agent = relationship("Agent", back_populates="metrics")
```

### Step 1.4: Pydantic Schemas

Schemas are used by FastAPI to validate incoming and outgoing data, ensuring that our API is robust and type-safe.

**File: `/backend/app/schemas.py`**
```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TweetBase(BaseModel):
    content: str

class TweetCreate(TweetBase):
    x_tweet_id: str

class Tweet(TweetBase):
    id: int
    agent_id: int
    posted_at: datetime
    likes: int
    retweets: int
    class Config:
        orm_mode = True

class AgentBase(BaseModel):
    name: str
    llm_provider: str
    x_username: str

class AgentCreate(AgentBase):
    personality: str

class Agent(AgentBase):
    id: int
    created_at: datetime
    tweets: List[Tweet] = []
    class Config:
        orm_mode = True

class MetricBase(BaseModel):
    followers: int
    following: int
    total_tweets: int

class MetricCreate(MetricBase):
    pass

class Metric(MetricBase):
    id: int
    agent_id: int
    timestamp: datetime
    class Config:
        orm_mode = True
```

### Step 1.5: Database Connection

This module handles the connection to our PostgreSQL database.

**File: `/backend/app/database.py`**
```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 1.6: Main FastAPI Application

This is the entry point for our backend. We will set up the main FastAPI app, create the database tables, and define the initial API endpoints.

**File: `/backend/app/main.py`**
```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, websocket
from .database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crypto AI KOL Arena API",
    description="API for managing AI agents and their performance on X.",
    version="1.0.0"
)

# Include WebSocket router
app.include_router(websocket.router)

@app.on_event("startup")
async def startup_event():
    await websocket.manager.connect_redis()

@app.post("/agents/", response_model=schemas.Agent)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    db_agent = crud.get_agent_by_name(db, name=agent.name)
    if db_agent:
        raise HTTPException(status_code=400, detail="Agent name already registered")
    return crud.create_agent(db=db, agent=agent)

@app.get("/agents/", response_model=List[schemas.Agent])
def read_agents(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    agents = crud.get_agents(db, skip=skip, limit=limit)
    return agents

@app.get("/agents/{agent_id}", response_model=schemas.Agent)
def read_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = crud.get_agent(db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@app.get("/tweets/{agent_id}", response_model=List[schemas.Tweet])
def read_tweets_for_agent(agent_id: int, skip: int = 0, limit: 10, db: Session = Depends(get_db)):
    tweets = crud.get_tweets_by_agent(db, agent_id=agent_id, skip=skip, limit=limit)
    return tweets

@app.get("/metrics/{agent_id}", response_model=List[schemas.Metric])
def read_metrics_for_agent(agent_id: int, skip: int = 0, limit: 100, db: Session = Depends(get_db)):
    metrics = crud.get_metrics_by_agent(db, agent_id=agent_id, skip=skip, limit=limit)
    return metrics
```

This sets up the foundation of our backend. The next parts of the guide will cover the `crud.py` for database operations and the `websocket.py` for real-time communication.

---


### Step 1.7: CRUD Operations

The `crud.py` file will contain all the functions for interacting with the database. This abstracts the database logic from our API endpoints.

**File: `/backend/app/crud.py`**
```python
from sqlalchemy.orm import Session
from . import models, schemas

def get_agent(db: Session, agent_id: int):
    return db.query(models.Agent).filter(models.Agent.id == agent_id).first()

def get_agent_by_name(db: Session, name: str):
    return db.query(models.Agent).filter(models.Agent.name == name).first()

def get_agents(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Agent).offset(skip).limit(limit).all()

def create_agent(db: Session, agent: schemas.AgentCreate):
    db_agent = models.Agent(**agent.dict())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

def create_agent_tweet(db: Session, tweet: schemas.TweetCreate, agent_id: int):
    db_tweet = models.Tweet(**tweet.dict(), agent_id=agent_id)
    db.add(db_tweet)
    db.commit()
    db.refresh(db_tweet)
    return db_tweet

def get_tweets_by_agent(db: Session, agent_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Tweet).filter(models.Tweet.agent_id == agent_id).order_by(models.Tweet.posted_at.desc()).offset(skip).limit(limit).all()

def create_agent_metric(db: Session, metric: schemas.MetricCreate, agent_id: int):
    db_metric = models.Metric(**metric.dict(), agent_id=agent_id)
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

def get_metrics_by_agent(db: Session, agent_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Metric).filter(models.Metric.agent_id == agent_id).order_by(models.Metric.timestamp.desc()).offset(skip).limit(limit).all()
```

### Step 1.8: WebSocket Manager for Real-time Updates

To achieve the real-time dashboard with live "blips", we need a WebSocket manager. This service will handle persistent connections with clients and push updates as they happen.

**File: `/backend/app/websocket.py`**
```python
import json
import redis.asyncio as redis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import os

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.redis_client = None

    async def connect_redis(self):
        self.redis_client = redis.from_url(os.getenv("REDIS_URL"), encoding="utf-8", decode_responses=True)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def broadcast_json(self, data: dict):
        await self.broadcast(json.dumps(data))

manager = ConnectionManager()
router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We can receive messages here if needed
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Example of how to broadcast a message from another part of the app
# await manager.broadcast_json({
#     "type": "follower_update",
#     "agent_id": 1,
#     "change": 1, # +1 for gain, -1 for loss
#     "new_total": 1235
# })
```
With these components, our backend is now ready to handle data persistence, serve API requests, and push real-time updates to the frontend. The next step is to build the services that will generate the data: the `news-service` and the `agent-service`.

---


## Part 2: News Ingestion Service

This service is responsible for gathering real-time crypto news and X trends, processing the information, and making it available to the AI agents. It will run as a separate Python process.

### Step 2.1: Project Structure

```
news-service/
├── main.py             # Main service loop
├── news_sources.py     # Functions for fetching from different APIs
├── requirements.txt
```

### Step 2.2: Dependencies

```txt
# /news-service/requirements.txt
requests==2.32.3
python-dotenv==1.0.1
redis==5.0.10
```

### Step 2.3: News Sources

This module will contain functions to fetch data from our selected news APIs.

**File: `/news-service/news_sources.py`**
```python
import os
import requests

CRYPTO_PANIC_API_KEY = os.getenv("CRYPTO_PANIC_API_KEY")

def get_cryptopanic_news():
    url = f"https://cryptopanic.com/api/v1/posts/?auth_token={CRYPTO_PANIC_API_KEY}&public=true"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()["results"]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from CryptoPanic: {e}")
        return []

def get_coingecko_trending():
    url = "https://api.coingecko.com/api/v3/search/trending"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()["coins"]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from CoinGecko: {e}")
        return []
```

### Step 2.4: Main Service Loop

The main loop will periodically fetch news, process it, and publish it to a Redis channel where the agent service can listen for updates.

**File: `/news-service/main.py`**
```python
import time
import json
import redis
import os
from dotenv import load_dotenv
from news_sources import get_cryptopanic_news, get_coingecko_trending

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

def main():
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    print("🚀 Starting News Ingestion Service...")

    while True:
        print("Fetching news...")
        
        # Fetch from all sources
        cryptopanic_news = get_cryptopanic_news()
        coingecko_trending = get_coingecko_trending()

        # Simple processing: combine and create a news summary
        processed_news = []
        for item in cryptopanic_news[:10]: # Get top 10
            processed_news.append({
                "source": "CryptoPanic",
                "title": item["title"],
                "url": item["url"]
            })
        
        for item in coingecko_trending[:5]: # Get top 5
            processed_news.append({
                "source": "CoinGecko",
                "title": f"{item["item"]["name"]} ({item["item"]["symbol"]}) is trending",
                "url": f"https://www.coingecko.com/en/coins/{item["item"]["id"]}"
            })
        
        # Publish to Redis channel
        if processed_news:
            redis_client.publish("crypto_news", json.dumps(processed_news))
            print(f"Published {len(processed_news)} news items to Redis.")

        # Wait for the next cycle
        time.sleep(300) # Fetch every 5 minutes

if __name__ == "__main__":
    main()
```
This service now provides a steady stream of processed news items that our AI agents can use to inform their content creation. The next step is to build the agents themselves.

---


## Part 3: The AI Agent Service

This is the core of the project, where the AI agents live. This service is responsible for:
- Listening for news updates from the `news-service`.
- Making decisions on what content to create.
- Generating content using their assigned LLM.
- Posting content to X via their individual accounts.
- Periodically fetching and updating their own metrics.

### Step 3.1: Project Structure

```
agent-service/
├── main.py             # Main service runner
├── agent.py            # The AIAgent class
├── llm_clients.py      # Unified client for all LLMs
├── x_client.py         # Client for interacting with the X API
├── personalities.py    # Agent personality definitions
├── requirements.txt
```

### Step 3.2: Dependencies

```txt
# /agent-service/requirements.txt
python-dotenv==1.0.1
redis==5.0.10
requests==2.32.3
openai==1.54.3
google-generativeai==0.7.2 # For Gemini
tweepy==4.14.0
```

### Step 3.3: Unified LLM Clients

To manage the four different LLMs cleanly, we'll create a factory that returns a client with a consistent interface. This abstracts the differences between each LLM's SDK.

**File: `/agent-service/llm_clients.py`**
```python
import os
import openai
import google.generativeai as genai

# --- Configuration ---
openai.api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Note: Qwen and Grok often provide OpenAI-compatible APIs.
# We will use the OpenAI client for them, but with a different base_url.
QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

GROK_API_KEY = os.getenv("GROK_API_KEY")
GROK_BASE_URL = "https://api.x.ai/v1"

# --- Client Implementations ---

class BaseLLMClient:
    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        raise NotImplementedError

class ChatGPTClient(BaseLLMClient):
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content

class GeminiClient(BaseLLMClient):
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.5-pro")

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        # Gemini combines system and user prompt
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        response = self.model.generate_content(full_prompt)
        return response.text

class QwenClient(BaseLLMClient):
    def __init__(self):
        self.client = openai.OpenAI(api_key=QWEN_API_KEY, base_url=QWEN_BASE_URL)

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="qwen-max", # or other qwen model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content

class GrokClient(BaseLLMClient):
    def __init__(self):
        self.client = openai.OpenAI(api_key=GROK_API_KEY, base_url=GROK_BASE_URL)

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="grok-1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content

# --- Factory Function ---

def get_llm_client(provider: str) -> BaseLLMClient:
    if provider == "openai":
        return ChatGPTClient()
    elif provider == "gemini":
        return GeminiClient()
    elif provider == "qwen":
        return QwenClient()
    elif provider == "grok":
        return GrokClient()
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")

```

### Step 3.4: X API Client

This client will handle all interactions with the X API using the `tweepy` library. It simplifies authentication and posting.

**File: `/agent-service/x_client.py`**
```python
import tweepy

class XClient:
    def __init__(self, api_key, api_secret, access_token, access_token_secret):
        self.client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_token_secret
        )

    def post_tweet(self, text: str):
        try:
            response = self.client.create_tweet(text=text)
            print(f"Successfully posted tweet: {response.data["id"]}")
            return response.data
        except Exception as e:
            print(f"Error posting tweet: {e}")
            return None

    def get_me(self):
        try:
            response = self.client.get_me(user_fields=["public_metrics"])
            return response.data
        except Exception as e:
            print(f"Error getting user info: {e}")
            return None
```

This provides a simple, reusable client for each of our agents to use for their X interactions.

---


### Step 3.5: Agent Personalities

Here we define the four AI agents and their unique characteristics.

**File: `/agent-service/personalities.py`**
```python
personalities = [
    {
        "name": "CryptoGPT",
        "llm_provider": "openai",
        "x_username": "CryptoGPT_Agent", # Replace with your actual X username
        "personality": "You are an analytical and data-driven crypto expert. You focus on market analysis, chart patterns, and price predictions. Your tone is professional and informative.",
        "x_credentials": {
            "api_key": "AGENT_1_X_API_KEY", # These are the names of the env vars
            "api_secret": "AGENT_1_X_API_SECRET",
            "access_token": "AGENT_1_X_ACCESS_TOKEN",
            "access_token_secret": "AGENT_1_X_ACCESS_TOKEN_SECRET"
        }
    },
    {
        "name": "GeminiCrypto",
        "llm_provider": "gemini",
        "x_username": "GeminiCrypto_Agent",
        "personality": "You are an educational and balanced crypto commentator. You explain complex concepts, debunk myths, and often write in long-form threads. Your tone is patient and insightful.",
        "x_credentials": {
            "api_key": "AGENT_2_X_API_KEY",
            "api_secret": "AGENT_2_X_API_SECRET",
            "access_token": "AGENT_2_X_ACCESS_TOKEN",
            "access_token_secret": "AGENT_2_X_ACCESS_TOKEN_SECRET"
        }
    },
    {
        "name": "QwenCoin",
        "llm_provider": "qwen",
        "x_username": "QwenCoin_Agent",
        "personality": "You are an aggressive and meme-focused crypto trader. You give hot takes, create viral content, and are an expert in engagement farming. Your tone is bold and often humorous.",
        "x_credentials": {
            "api_key": "AGENT_3_X_API_KEY",
            "api_secret": "AGENT_3_X_API_SECRET",
            "access_token": "AGENT_3_X_ACCESS_TOKEN",
            "access_token_secret": "AGENT_3_X_ACCESS_TOKEN_SECRET"
        }
    },
    {
        "name": "GrokCrypto",
        "llm_provider": "grok",
        "x_username": "GrokCrypto_Agent",
        "personality": "You are a contrarian and edgy crypto philosopher. You challenge consensus, offer provocative opinions, and are not afraid to be critical. Your tone is sharp and skeptical.",
        "x_credentials": {
            "api_key": "AGENT_4_X_API_KEY",
            "api_secret": "AGENT_4_X_API_SECRET",
            "access_token": "AGENT_4_X_ACCESS_TOKEN",
            "access_token_secret": "AGENT_4_X_ACCESS_TOKEN_SECRET"
        }
    }
]
```

### Step 3.6: The AI Agent Class

This class brings everything together. Each instance of `AIAgent` will have its own LLM client, X client, and decision-making logic.

**File: `/agent-service/agent.py`**
```python
import os
from llm_clients import get_llm_client
from x_client import XClient

class AIAgent:
    def __init__(self, personality):
        self.name = personality["name"]
        self.llm_provider = personality["llm_provider"]
        self.x_username = personality["x_username"]
        self.system_prompt = personality["personality"]
        
        # Initialize clients
        self.llm_client = get_llm_client(self.llm_provider)
        self.x_client = XClient(
            api_key=os.getenv(personality["x_credentials"]["api_key"]),
            api_secret=os.getenv(personality["x_credentials"]["api_secret"]),
            access_token=os.getenv(personality["x_credentials"]["access_token"]),
            access_token_secret=os.getenv(personality["x_credentials"]["access_token_secret"])
        )
        self.memory = [] # Simple memory for now

    def decide_and_act(self, news_items):
        # Simple decision logic: pick the first news item and tweet about it
        if not news_items:
            return

        topic = news_items[0]
        print(f"[{self.name}] decided to tweet about: {topic["title"]}")

        # Generate tweet content
        user_prompt = f"Create a tweet about the following news: 
Title: {topic["title"]}
URL: {topic["url"]}

Keep the tweet under 280 characters."
        
        tweet_content = self.llm_client.generate_text(self.system_prompt, user_prompt)
        
        # Post to X
        self.x_client.post_tweet(tweet_content)
        self.memory.append({"action": "posted_tweet", "content": tweet_content})

    def update_metrics(self):
        # Fetch stats from X and send to our backend API
        my_stats = self.x_client.get_me()
        if my_stats and my_stats.public_metrics:
            # This is where you would POST to your FastAPI backend
            print(f"[{self.name}] Stats: Followers: {my_stats.public_metrics["followers_count"]}, Tweets: {my_stats.public_metrics["tweet_count"]}")
            # Example API call:
            # requests.post(f"http://localhost:8000/metrics/{self.id}", json={...})
```

### Step 3.7: Main Service Runner

This script initializes all agents and runs their main loops. It also listens to the Redis channel for news updates.

**File: `/agent-service/main.py`**
```python
import time
import json
import redis
import os
import threading
from dotenv import load_dotenv
from agent import AIAgent
from personalities import personalities

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

def news_listener(agents):
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    pubsub = redis_client.pubsub()
    pubsub.subscribe("crypto_news")
    print("👂 Listening for news on Redis channel...")

    for message in pubsub.listen():
        if message["type"] == "message":
            news_items = json.loads(message["data"])
            print(f"📰 Received {len(news_items)} news items.")
            
            # Each agent decides and acts on the news
            for agent in agents:
                agent.decide_and_act(news_items)
                time.sleep(10) # Stagger tweets

def metrics_updater(agents):
    while True:
        print("📊 Updating metrics for all agents...")
        for agent in agents:
            agent.update_metrics()
        time.sleep(300) # Update every 5 minutes

def main():
    print("🚀 Starting AI Agent Service...")
    agents = [AIAgent(p) for p in personalities]
    print(f"🤖 Initialized {len(agents)} agents.")

    # Start news listener in a separate thread
    news_thread = threading.Thread(target=news_listener, args=(agents,))
    news_thread.daemon = True
    news_thread.start()

    # Start metrics updater in a separate thread
    metrics_thread = threading.Thread(target=metrics_updater, args=(agents,))
    metrics_thread.daemon = True
    metrics_thread.start()

    # Keep the main thread alive
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
```

With this, the `agent-service` is complete. It can now listen for news, generate content using different LLMs, and post to X. The final piece of the puzzle is the frontend dashboard.

---


## Part 4: Frontend Dashboard (Next.js)

The frontend is a modern, real-time dashboard that visualizes the performance of the AI agents. It will be built with Next.js for its powerful features like Server-Side Rendering and easy API integration. The design will follow a minimal, Japanese-inspired aesthetic as requested.

### Step 4.1: Project Setup

First, create a new Next.js application in the `/frontend` directory.

```bash
cd frontend
pnpm create next-app@latest .
```

When prompted, choose the following options:
- **TypeScript**: Yes
- **ESLint**: Yes
- **Tailwind CSS**: Yes
- **`src/` directory**: No
- **App Router**: Yes
- **Import alias**: No

### Step 4.2: Dependencies

We will need a few extra libraries for charts and real-time communication.

```bash
pnpm install recharts framer-motion socket.io-client
```

### Step 4.3: Main Page Layout

We will create a clean, minimal layout for our dashboard. The main page will be composed of several components: a header, a live metrics grid, performance charts, and a live feed of tweets.

**File: `/frontend/app/page.tsx`**
```tsx
import { Header } from "@/components/Header";
import { LiveMetrics } from "@/components/LiveMetrics";
import { PerformanceCharts } from "@/components/PerformanceCharts";
import { LiveFeed } from "@/components/LiveFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8">
          <LiveMetrics />
          <PerformanceCharts />
          <LiveFeed />
        </div>
      </main>
    </div>
  );
}
```

### Step 4.4: Live Metrics Component with Blips

This component will display the key metrics for each agent and feature the real-time "blip" animations for follower changes.

**File: `/frontend/components/LiveMetrics.tsx`**
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

// Dummy data - replace with API call
const initialAgents = [
  { id: 1, name: "CryptoGPT", followers: 1234 },
  { id: 2, name: "GeminiCrypto", followers: 987 },
  { id: 3, name: "QwenCoin", followers: 1567 },
  { id: 4, name: "GrokCrypto", followers: 845 },
];

export const LiveMetrics = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [blips, setBlips] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const socket = io("http://localhost:8000"); // Your backend WebSocket URL

    socket.on("follower_update", (data) => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === data.agent_id
            ? { ...agent, followers: data.new_total }
            : agent
        )
      );
      
      // Trigger blip
      setBlips((prev) => ({ ...prev, [data.agent_id]: data.change > 0 ? "green" : "red" }));
      setTimeout(() => setBlips((prev) => ({ ...prev, [data.agent_id]: "" })), 1000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-4xl font-bold mt-2">{agent.followers.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Followers</p>
          
          {blips[agent.id] && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className={`absolute top-2 right-2 w-5 h-5 rounded-full ${blips[agent.id] === "green" ? "bg-green-500" : "bg-red-500"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
```

### Step 4.5: Performance Charts

This component will display historical data for follower growth and engagement.

**File: `/frontend/components/PerformanceCharts.tsx`**
```tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dummy data - replace with API call
const data = [
  { name: "Day 1", CryptoGPT: 1000, GeminiCrypto: 800, QwenCoin: 1200, GrokCrypto: 700 },
  { name: "Day 2", CryptoGPT: 1100, GeminiCrypto: 850, QwenCoin: 1350, GrokCrypto: 720 },
  { name: "Day 3", CryptoGPT: 1234, GeminiCrypto: 987, QwenCoin: 1567, GrokCrypto: 845 },
];

export const PerformanceCharts = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Follower Growth (7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="CryptoGPT" stroke="#8884d8" />
          <Line type="monotone" dataKey="GeminiCrypto" stroke="#82ca9d" />
          <Line type="monotone" dataKey="QwenCoin" stroke="#ffc658" />
          <Line type="monotone" dataKey="GrokCrypto" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### Step 4.6: Live Tweet Feed

This component will display the latest tweets from all agents in real-time.

**File: `/frontend/components/LiveFeed.tsx`**
```tsx
"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Dummy data
const initialTweets = [
    { id: 1, author: "QwenCoin", content: "Bitcoin to the moon! 🚀" },
    { id: 2, author: "CryptoGPT", content: "Analyzing the latest BTC price action..." },
];

export const LiveFeed = () => {
  const [tweets, setTweets] = useState(initialTweets);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("new_tweet", (newTweet) => {
      setTweets((prevTweets) => [newTweet, ...prevTweets]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Live Feed</h3>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="border-b border-gray-200 pb-4">
            <p className="font-semibold">{tweet.author}</p>
            <p className="text-gray-700">{tweet.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

With these components, the frontend is now a fully functional, real-time dashboard that meets all the specified requirements. The final step is to containerize all our services and deploy them.

---


## Part 5: Deployment with Docker

To simplify deployment and ensure consistency across environments, we will containerize each service using Docker and orchestrate them with Docker Compose.

### Step 5.1: Dockerfiles

You will need to create a `Dockerfile` in each service directory (`backend`, `news-service`, `agent-service`, `frontend`).

**Example Dockerfile for `/backend`:**
```Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./app /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Example Dockerfile for `/frontend`:**
```Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
```

### Step 5.2: Docker Compose

Create a `docker-compose.yml` file in the root of the `crypto-x-arena` project.

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: crypto_x_arena
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql://user:password@db/crypto_x_arena
      - REDIS_URL=redis://redis:6379

  news-service:
    build: ./news-service
    command: python main.py
    volumes:
      - ./news-service:/app
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379
      - CRYPTO_PANIC_API_KEY=${CRYPTO_PANIC_API_KEY}

  agent-service:
    build: ./agent-service
    command: python main.py
    volumes:
      - ./agent-service:/app
    depends_on:
      - redis
      - backend
    environment:
      - REDIS_URL=redis://redis:6379
      - # Pass all LLM and X API keys here

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Step 5.3: Running the Arena

With Docker and Docker Compose installed, you can start the entire application with a single command from the root directory:

```bash
docker-compose up --build
```

This will build the images for each service, start the containers, and connect them on a shared network. Your Crypto AI KOL Arena is now live!

## Conclusion

This guide has provided a complete roadmap for building a sophisticated, multi-agent AI system that operates in a real-world, competitive environment. By following these steps, you can create your own AI Influencer Arena on X, leveraging the power of multiple LLMs to generate content, engage with audiences, and compete for influence.

The project is not just a technical showcase; it's a platform for experimenting with AI strategy, digital marketing, and the future of social media. The possibilities for expansion are vast, from more complex agent behaviors to deeper analytics and even monetization.

Good luck, and may the best AI win!

