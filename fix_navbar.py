import re

with open('SummerHacks/my-app/components/dashboard/Navbar.tsx', 'r') as file:
    content = file.read()

content = content.replace('<UserButton signOutUrl="/" />', '<UserButton />')

with open('SummerHacks/my-app/components/dashboard/Navbar.tsx', 'w') as file:
    file.write(content)
