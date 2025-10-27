import os
import yaml
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
from llm_clients import get_llm_client
from x_client import XClient

class EnhancedAIAgent:
    """
    Enhanced AI Agent that uses configuration files for personality and strategy.
    This allows easy customization without code changes.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.id = config["id"]
        self.name = config["name"]
        self.llm_provider = config["llm_provider"]
        self.model = config.get("model", "default")
        self.x_username = config["x_username"]
        
        # Load personality and strategy from config
        self.personality = config["personality"]
        self.system_prompt = config["system_prompt"]
        self.strategy = config["strategy"]
        
        # Initialize clients
        self.llm_client = get_llm_client(self.llm_provider)
        self.x_client = XClient(
            api_key=os.getenv(f"{self.id.upper()}_X_API_KEY"),
            api_secret=os.getenv(f"{self.id.upper()}_X_API_SECRET"),
            access_token=os.getenv(f"{self.id.upper()}_X_ACCESS_TOKEN"),
            access_token_secret=os.getenv(f"{self.id.upper()}_X_ACCESS_TOKEN_SECRET")
        )
        
        # Memory and performance tracking
        self.memory = []
        self.recent_posts = []  # Track to avoid repetition
        self.performance_metrics = {
            "total_posts": 0,
            "total_engagement": 0,
            "best_performing_type": None
        }
    
    def decide_action(self, context: Dict[str, Any]) -> str:
        """
        Decide what action to take based on current context and strategy.
        
        Args:
            context: Dict containing news, market data, trends, etc.
        
        Returns:
            Action to take: "post", "reply", "retweet", "wait"
        """
        triggers = self.strategy.get("triggers", {})
        
        # Check if any trigger conditions are met
        if context.get("price_change", 0) > triggers.get("price_movement_threshold", 5):
            return "post"
        
        if context.get("volume_spike", 1) > triggers.get("volume_spike_threshold", 2):
            return "post"
        
        if context.get("news_relevance", 0) > triggers.get("news_relevance_score", 7):
            return "post"
        
        # Check for special triggers based on agent personality
        if self.id == "grok_crypto":
            fear_greed = context.get("fear_greed_index", 50)
            if fear_greed > 75 or fear_greed < 25:
                return "post"
        
        if self.id == "gemini_crypto" and context.get("misinformation_detected"):
            return "post"
        
        if self.id == "qwen_coin" and context.get("meme_opportunity"):
            return "post"
        
        # Default: wait for better opportunity
        return "wait"
    
    def select_post_type(self) -> Dict[str, Any]:
        """
        Select what type of post to create based on weighted strategy.
        
        Returns:
            Dict with post type and template
        """
        post_types = self.strategy["post_types"]
        
        # Calculate total weight
        total_weight = sum(pt["weight"] for pt in post_types)
        
        # Weighted random selection
        rand = random.uniform(0, total_weight)
        current = 0
        
        for post_type in post_types:
            current += post_type["weight"]
            if rand <= current:
                template = random.choice(post_type["templates"])
                return {
                    "type": post_type["type"],
                    "template": template
                }
        
        # Fallback
        return {
            "type": post_types[0]["type"],
            "template": post_types[0]["templates"][0]
        }
    
    def generate_post_content(self, context: Dict[str, Any]) -> str:
        """
        Generate post content using LLM with personality and context.
        
        Args:
            context: Current market context, news, trends
        
        Returns:
            Generated tweet content
        """
        # Select post type and template
        post_info = self.select_post_type()
        template = post_info["template"]
        
        # Build context-aware prompt
        user_prompt = f"""
Context:
- Current trending: {context.get('trending_topics', [])}
- Latest news: {context.get('latest_news', 'No major news')}
- Market sentiment: {context.get('sentiment', 'neutral')}
- BTC price: ${context.get('btc_price', 'N/A')}
- Price change 24h: {context.get('price_change_24h', 'N/A')}%

Your task:
Create a tweet following this template: "{template}"

Guidelines:
- Stay true to your personality: {self.personality['archetype']}
- Tone: {self.personality['tone']}
- Use real data from the context above
- Make it engaging and authentic
- Keep under 280 characters
- Don't just hype—provide actual insight or entertainment value

Generate the tweet now:
"""
        
        # Call LLM
        tweet_content = self.llm_client.generate_text(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt
        )
        
        # Clean up and validate
        tweet_content = tweet_content.strip()
        if len(tweet_content) > 280:
            tweet_content = tweet_content[:277] + "..."
        
        return tweet_content
    
    def should_post_now(self) -> bool:
        """
        Check if agent should post based on time and frequency settings.
        
        Returns:
            True if should post, False otherwise
        """
        if not self.recent_posts:
            return True
        
        last_post_time = self.recent_posts[-1]["timestamp"]
        time_since_last = datetime.now() - last_post_time
        
        # Frequency-based cooldown
        frequency = self.strategy.get("posting_frequency", "medium")
        cooldowns = {
            "very_high": timedelta(minutes=15),
            "high": timedelta(minutes=30),
            "medium": timedelta(hours=1),
            "low": timedelta(hours=2)
        }
        
        return time_since_last > cooldowns.get(frequency, timedelta(hours=1))
    
    def post_tweet(self, content: str) -> bool:
        """
        Post tweet to X and track performance.
        
        Args:
            content: Tweet content
        
        Returns:
            True if successful, False otherwise
        """
        try:
            result = self.x_client.post_tweet(content)
            
            if result:
                # Track post
                self.recent_posts.append({
                    "content": content,
                    "timestamp": datetime.now(),
                    "tweet_id": result.get("id")
                })
                
                # Keep only recent posts (last 24 hours)
                cutoff = datetime.now() - timedelta(hours=24)
                self.recent_posts = [
                    p for p in self.recent_posts 
                    if p["timestamp"] > cutoff
                ]
                
                self.performance_metrics["total_posts"] += 1
                return True
        except Exception as e:
            print(f"[{self.name}] Error posting tweet: {e}")
        
        return False
    
    def analyze_performance(self) -> Dict[str, Any]:
        """
        Analyze agent's performance and suggest strategy adjustments.
        
        Returns:
            Performance analysis and recommendations
        """
        # This would fetch actual engagement data from X API
        # For now, return structure
        return {
            "total_posts": self.performance_metrics["total_posts"],
            "avg_engagement": self.performance_metrics.get("avg_engagement", 0),
            "best_post_type": self.performance_metrics.get("best_performing_type"),
            "recommendations": []
        }


class AgentManager:
    """
    Manages multiple agents and coordinates their actions.
    """
    
    def __init__(self, config_path: str = "agent_config.yaml"):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.agents = [
            EnhancedAIAgent(agent_config) 
            for agent_config in self.config["agents"]
        ]
        
        self.global_settings = self.config.get("global_settings", {})
    
    def get_market_context(self) -> Dict[str, Any]:
        """
        Gather current market context from various data sources.
        
        Returns:
            Dict with market data, news, sentiment, etc.
        """
        # This would fetch real data from APIs
        # For now, return mock structure
        return {
            "btc_price": 50000,
            "price_change_24h": 3.5,
            "volume_spike": 1.2,
            "sentiment": "bullish",
            "fear_greed_index": 65,
            "trending_topics": ["Bitcoin", "ETF", "DeFi"],
            "latest_news": "Bitcoin breaks $50K resistance",
            "news_relevance": 8,
            "meme_opportunity": False,
            "misinformation_detected": False
        }
    
    def run_cycle(self):
        """
        Run one decision-making cycle for all agents.
        """
        context = self.get_market_context()
        
        for agent in self.agents:
            # Decide action
            action = agent.decide_action(context)
            
            if action == "post" and agent.should_post_now():
                # Generate and post content
                content = agent.generate_post_content(context)
                success = agent.post_tweet(content)
                
                if success:
                    print(f"[{agent.name}] Posted: {content[:50]}...")
            else:
                print(f"[{agent.name}] Waiting for better opportunity...")


# Usage example
if __name__ == "__main__":
    manager = AgentManager("agent_config.yaml")
    
    # Run continuous loop
    import time
    while True:
        manager.run_cycle()
        time.sleep(300)  # Run every 5 minutes

