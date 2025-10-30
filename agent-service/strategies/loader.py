import os
from typing import Any, Dict

import yaml


def load_growth_strategies(path: str | None = None) -> Dict[str, Any]:
    """
    Load growth strategies YAML into a dictionary.
    """
    default_path = os.path.join(os.path.dirname(__file__), "growth_strategies.yaml")
    strategies_path = path or default_path
    with open(strategies_path, "r") as f:
        return yaml.safe_load(f)


def get_playbook(strategies: Dict[str, Any], domain: str, playbook_key: str) -> Dict[str, Any]:
    """
    Retrieve a specific playbook, e.g., domain="web3", playbook_key="reply_guy_ct".
    """
    domain_obj = strategies.get(domain, {})
    playbook = domain_obj.get(playbook_key)
    if not playbook:
        raise KeyError(f"Playbook not found: {domain}.{playbook_key}")
    return playbook


