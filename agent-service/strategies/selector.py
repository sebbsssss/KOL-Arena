import random
from typing import Any, Dict, List


def choose_reply_angles(playbook: Dict[str, Any], k: int = 1) -> List[str]:
    """
    Randomly choose k reply angles from a playbook definition.
    """
    angles = playbook.get("reply_angles", []) or playbook.get("angles", [])
    if not angles:
        return []
    if k >= len(angles):
        return angles
    return random.sample(angles, k)


