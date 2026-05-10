import os
import re

def fix_components(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply all copy replacements
    content = content.replace("bg-card/50 backdrop-blur-sm", "bg-[#1E2026] text-[#EAECEF]")
    content = content.replace("border-border", "border-[#3A3F45]")
    content = content.replace("shadow-md shadow-black/5", "shadow-xl")
    content = content.replace("text-foreground", "text-[#EAECEF]")
    content = content.replace("text-muted-foreground", "text-[#848E9C]")
    content = content.replace("text-accent", "text-[#F0B90B]")
    content = content.replace("text-destructive", "text-[#F6465D]")

    with open(filepath, 'w') as f:
        f.write(content)

dashboard_dir = 'SummerHacks/my-app/app/(dashboard)'
for root, _, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            fix_components(filepath)
