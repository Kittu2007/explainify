---
description: Delegate complex analysis/debugging to local Claude CLI
---
1. Identify if the task requires heavy reasoning, repository scanning, or debugging.
2. Ensure the local Claude CLI is ready or start it:
   ```
   claude --agent debugger --permission-mode auto --effort max
   ```
3. Pass the full user request or task description to the CLI.
4. Monitor the CLI's output for solutions or code snippets.
5. Apply the code changes and verify them using built-in tools.
6. Commit and push changes as needed.
