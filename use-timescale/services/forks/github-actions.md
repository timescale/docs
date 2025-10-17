---
title: Forking with GitHub Actions
excerpt: Automate database fork creation in CI/CD workflows for testing, pull request validation, and ephemeral environments
products: [cloud]
keywords: [forks, github actions, CI/CD, automation, testing]
tags: [forks, github, ci/cd, devops, automation]
---

# Forking with GitHub Actions

The [Tiger Data Fork Service action][github-action] enables you to automate database fork creation in your GitHub workflows. This is ideal for:

- Testing pull requests against production-like data
- Running integration tests on isolated database copies
- Creating ephemeral test environments
- Validating [migrations and upgrades][upgrades] before applying to production

## Installation

The action is available on the [GitHub Actions Marketplace][github-action]. Add it to your workflow YAML files to start forking databases as part of your CI/CD pipeline.

## Example: Pull request testing with automatic cleanup

This workflow demonstrates a common pattern: forking a database when a pull request is opened, running tests against the fork, and automatically cleaning up when the workflow completes.

```yaml
name: Test on Fork
on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fork Database
        id: fork
        uses: timescale/fork-service@v1
        with:
          project_id: ${{ secrets.TIGERDATA_PROJECT_ID }}
          service_id: ${{ secrets.TIGERDATA_SERVICE_ID }}
          api_key: ${{ secrets.TIGERDATA_API_KEY }}
          fork_strategy: last-snapshot
          cleanup: true
          name: pr-${{ github.event.pull_request.number }}

      - name: Run Integration Tests
        env:
          DATABASE_URL: postgresql://tsdbadmin:${{ steps.fork.outputs.initial_password }}@${{ steps.fork.outputs.host }}:${{ steps.fork.outputs.port }}/tsdb?sslmode=require
        run: |
          npm install
          npm test

      - name: Run Migrations
        env:
          DATABASE_URL: postgresql://tsdbadmin:${{ steps.fork.outputs.initial_password }}@${{ steps.fork.outputs.host }}:${{ steps.fork.outputs.port }}/tsdb?sslmode=require
        run: npm run migrate
```

## Key features

### Automatic cleanup

Set `cleanup: true` to automatically delete the forked service when the workflow completes. This prevents orphaned test databases and keeps costs down.

For more control over cleanup timing, use the [Tiger Data Delete Service action][delete-action] to delete forks on your own schedule.

### Fork strategies

Choose the best strategy for your use case:

- **`last-snapshot`**: Fastest option, uses the most recent automatic backup (ideal for CI/CD)
- **`now`**: Creates a new snapshot before forking (most up-to-date data)
- **`timestamp`**: Fork from a specific point in time (requires `target_time` parameter)

See [Fork strategies, limitations, and trade-offs][strategies-and-limitations] for detailed guidance on when to use each option.

### Connection outputs

The action outputs all [connection details][connection-details] needed to connect to your fork:

- `host`: Database hostname
- `port`: Database port
- `initial_password`: Initial password for the `tsdbadmin` user
- `service_id`: The forked service ID
- `name`: The forked service name

Use these outputs with `steps.<step-id>.outputs.<output-name>` to construct connection strings.

## API key management

Store your Tiger API key as a GitHub Actions secret:

1. Navigate to your repository settings
2. Go to `Secrets and variables` > `Actions`
3. Create a new secret named `TIGERDATA_API_KEY`
4. Set the value to your API key in format `publicKey:secretKey`

<Highlight type="important">

Never commit API keys directly to your repository. Always use GitHub Actions secrets or other secure secret management solutions.

</Highlight>

## Complete reference

For the full list of inputs, outputs, and configuration options, see the [Tiger Data Fork Service action on GitHub Marketplace][github-action].

Additional GitHub Actions for Tiger Cloud:
- [Tiger Data Delete Service][delete-action] - Delete services programmatically

## Next steps

- [Quick start guide][quickstart] - Get started with forking using other methods
- [Fork strategies, limitations, and trade-offs][strategies-and-limitations] - Choosing the right strategy and understanding constraints
- [Service Forks overview][forks-overview] - Complete guide to forking

[github-action]: https://github.com/marketplace/actions/tiger-data-fork-service
[delete-action]: https://github.com/marketplace/actions/tiger-data-delete-service
[forks-overview]: /use-timescale/:currentVersion:/services/forks/
[quickstart]: /use-timescale/:currentVersion:/services/forks/quickstart/
[strategies-and-limitations]: /use-timescale/:currentVersion:/services/forks/strategies/
[connection-details]: /integrations/:currentVersion:/find-connection-details/
[upgrades]: /use-timescale/:currentVersion:/upgrades/
