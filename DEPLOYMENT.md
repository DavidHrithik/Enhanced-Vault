# Deployment Guide

## Azure Web App Deployment

This application is configured to deploy to an Azure Web App using GitHub Actions.

### Prerequisites

To successfully deploy, you must configure the `AZURE_CREDENTIALS` secret in your GitHub repository.

1.  **Generate Credentials**: Run the following command in the Azure CLI (replace `{subscription-id}` and `{resource-group}` with your actual values):

    ```bash
    az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth
    ```

2.  **Add Secret to GitHub**:
    *   Go to your GitHub repository.
    *   Navigate to **Settings** > **Secrets and variables** > **Actions**.
    *   Click **New repository secret**.
    *   Name: `AZURE_CREDENTIALS`
    *   Value: Paste the entire JSON output from the command above.
    *   Click **Add secret**.

### Pipelines

*   **GitHub Actions**: The primary deployment workflow is defined in `.github/workflows/main_CTS-VibeAppso41013-3.yml`.
*   **Azure Pipelines**: `azure-pipelines.yml` is also present but may require additional configuration for the deployment stage.
