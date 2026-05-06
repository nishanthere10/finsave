import os
import re

def fix_copy(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply all copy replacements
    content = content.replace("Escrow Logistics", "Staking Details")
    content = content.replace("If the protocol is bridged and telemetry confirms failure, the stake will be burnt.", "If you miss your goals, your staked amount will be forfeited.")
    content = content.replace("Run Autopsy", "Analyze My Spending")
    content = content.replace("Begin Autopsy", "Analyze My Spending")

    with open(filepath, 'w') as f:
        f.write(content)

dashboard_dir = 'SummerHacks/my-app/app/(dashboard)'
for root, _, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            fix_copy(filepath)
