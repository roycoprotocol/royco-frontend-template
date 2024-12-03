# Sync Repository with Royco Template

This README provides step-by-step instructions to set up template synchronization with the Royco Frontend Template repository.

## Setup Instructions

1. First, create the required directory structure in your repository's root directory:

   ```bash
   mkdir -p .github/workflows
   ```

2. Copy the `action-sync-template.yml` from the parent directory to the workflows folder:

   ```bash
   cp ../action-sync-template.yml .github/workflows/
   ```

   Note: The action-sync-template.yml is already provided in the parent directory and contains the necessary GitHub Action configuration for hourly synchronization with the Royco template.

3. Verify the file structure looks like this in your root directory:

   ```
   .github/
   └── workflows/
       └── action-sync-template.yml
   ```

4. Commit and push the changes to GitHub:
   ```bash
   git add .github/workflows/action-sync-template.yml
   git commit -m "feat: add template sync workflow"
   git push origin main
   ```

## What does this do?

The workflow configured in `action-sync-template.yml` will:

- Run automatically every hour
- Check for updates in the Royco Frontend Template repository
- If updates are found, it will sync your repository while preserving your `.github` directory
- Changes will be committed and pushed automatically

## Troubleshooting

If you encounter any issues:

1. Ensure the workflow file is properly placed in `.github/workflows/`
2. Check if your repository has the necessary GitHub Actions permissions
3. Verify that the main branch is set as your default branch

For more details about the sync process, you can check the workflow file contents or view the Actions tab in your GitHub repository.
