# Graphify Cheat Sheet

Since `graphify` is an AI agent skill, you don't need to run terminal commands yourself. Instead, you just tell the AI what to do using these simple text triggers. 

Here are the key commands to remember:

## 1. Generating & Updating the Graph
- **/graphify** — Runs the full extraction pipeline on your current directory.
- **/graphify <path> --update** — Use this when you've written new code or added new files. It updates the graph quickly by only scanning what changed, saving time and tokens.
- **/graphify add <url>** — Drops a link (like an API doc, GitHub issue, or tutorial) straight into your graph's knowledge base.

## 2. Exploring the Graph
- **/graphify query "<question>"** — Uses the graph structure to answer complex architectural questions. (e.g. `/graphify query "How does authentication flow from frontend to backend?"`)
- **/graphify path "<Component A>" "<Component B>"** — Finds the exact connections between two different parts of the system. Perfect for seeing how a frontend button click reaches a specific backend database.
- **/graphify explain "<Node Name>"** — Gives you a plain-language summary of what a specific file, function, or concept does based on its connections in the graph.

**The Golden Rule:** Whenever you come back to this project after a few days, or if you bring in external docs, just say **/graphify --update** to keep our architectural map perfectly in sync!
