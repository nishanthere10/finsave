import os

def fix_use_client(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    # Find the index of "use client";
    use_client_idx = -1
    for i, line in enumerate(lines):
        if '"use client";' in line or "'use client';" in line:
            use_client_idx = i
            break

    if use_client_idx > 0:
        # Move "use client"; to the top
        use_client_line = lines.pop(use_client_idx)
        lines.insert(0, use_client_line)

        with open(filepath, 'w') as f:
            f.writelines(lines)

dashboard_dir = 'SummerHacks/my-app/app/(dashboard)'
for root, _, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            fix_use_client(filepath)
