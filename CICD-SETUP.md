# CI/CD Setup Guide for UDST Tools

This project is configured to automatically build and deploy to Firebase when you push changes to the main branch on GitHub.

## How it works

The workflow does the following:

1. Triggers on push to main or master branch
2. Checks out the code
3. Sets up Node.js
4. Installs dependencies
5. Builds the project
6. Deploys to Firebase Hosting

## Setup Instructions

To set up the automated deployment, follow these steps:

### 1. Generate a Firebase CI token

```bash
firebase login:ci
```

This will open a browser window for authentication. After authenticating, it will display a token.

### 2. Add secrets to your GitHub repository

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

   - `FIREBASE_SERVICE_ACCOUNT`: The CI token you obtained from the previous step
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID (`udst-tools` based on your configuration)

### 3. Push to GitHub

After setting up the secrets, every time you push to the main branch, your project will automatically build and deploy to Firebase.

## Manual Deployment

You can still deploy manually using:

```bash
npm run build
firebase deploy
```

## Troubleshooting

If the automated deployment fails:

1. Check the GitHub Actions logs for errors
2. Verify that your secrets are correctly set up
3. Try running the build and deploy steps locally to ensure everything works

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting GitHub Action](https://github.com/FirebaseExtended/action-hosting-deploy)
