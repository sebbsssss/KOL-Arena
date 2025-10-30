from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

# Assumes an x_client.XClient with search_recent, get_user, get_user_tweets methods exists
from x_client import XClient


@dataclass
class AccountCandidate:
    user_id: str
    username: str
    display_name: str
    followers: int
    avg_engagement: float
    engagement_to_followers_ratio: float
    last_tweet_time: Optional[datetime]
    topics_matched: List[str]
    score: float


class XDiscovery:
    """
    Discover and rank key accounts on X (Crypto Twitter) for targeted engagement.
    """

    def __init__(self, x_client: XClient):
        self.x = x_client

    def _estimate_engagement(self, tweets: List[Dict[str, Any]], lookback: int = 10) -> float:
        if not tweets:
            return 0.0
        recent = tweets[:lookback]
        totals: List[int] = []
        for t in recent:
            likes = int(t.get("like_count", 0))
            rts = int(t.get("retweet_count", 0))
            replies = int(t.get("reply_count", 0))
            totals.append(likes + rts + replies)
        return sum(totals) / max(1, len(totals))

    def _recency(self, tweets: List[Dict[str, Any]]) -> Optional[datetime]:
        if not tweets:
            return None
        ts = tweets[0].get("created_at")
        if isinstance(ts, datetime):
            return ts
        # fallback: try parse RFC3339
        try:
            return datetime.fromisoformat(ts.replace("Z", "+00:00"))  # type: ignore
        except Exception:
            return None

    def search_and_rank_accounts(
        self,
        topics: List[str],
        min_followers: int = 10_000,
        min_avg_engagement: int = 50,
        engagement_to_followers_ratio: float = 0.003,
        recency_hours: int = 12,
        limit: int = 50,
    ) -> List[AccountCandidate]:
        """
        Search for users tweeting about topics, then rank by engagement and quality heuristics.
        """
        seen_users: Dict[str, AccountCandidate] = {}
        cutoff = datetime.utcnow() - timedelta(hours=recency_hours)

        for topic in topics:
            # Search recent tweets for the topic
            tweets = self.x.search_recent(query=topic, max_results=100)
            for t in tweets:
                author_id = t.get("author_id")
                if not author_id:
                    continue
                if author_id in seen_users:
                    seen_users[author_id].topics_matched.append(topic)
                    continue

                user = self.x.get_user(user_id=author_id)
                if not user:
                    continue

                followers = int(user.get("public_metrics", {}).get("followers_count", 0))
                if followers < min_followers:
                    continue

                user_tweets = self.x.get_user_tweets(user_id=author_id, max_results=20)
                avg_eng = self._estimate_engagement(user_tweets)
                if avg_eng < min_avg_engagement:
                    continue

                ratio = avg_eng / max(1, followers)
                last_time = self._recency(user_tweets)
                if last_time and last_time < cutoff:
                    continue

                candidate = AccountCandidate(
                    user_id=author_id,
                    username=user.get("username", ""),
                    display_name=user.get("name", ""),
                    followers=followers,
                    avg_engagement=avg_eng,
                    engagement_to_followers_ratio=ratio,
                    last_tweet_time=last_time,
                    topics_matched=[topic],
                    score=0.0,
                )
                seen_users[author_id] = candidate

        # Score and sort
        candidates = list(seen_users.values())
        for c in candidates:
            ratio_score = min(1.0, c.engagement_to_followers_ratio / engagement_to_followers_ratio)
            followers_score = min(1.0, c.followers / 100_000)
            topicality_score = min(1.0, len(set(c.topics_matched)) / 5)
            c.score = 0.5 * ratio_score + 0.3 * followers_score + 0.2 * topicality_score

        candidates.sort(key=lambda x: x.score, reverse=True)
        return candidates[:limit]


