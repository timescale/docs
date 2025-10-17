---
title: Fork a database - Quick start
excerpt: Get started quickly with Service forks using Console UI, CLI, GitHub Actions, or REST API
products: [cloud]
keywords: [forks, quickstart, getting started, tutorial]
tags: [forks, quickstart, tutorial]
---

# Fork a database - Quick start

This guide shows you how to create your first database fork using different methods. Choose the approach that best fits your workflow.

## Fork from Console

<Procedure>

1. In $CONSOLE_LONG, from the `Services` list, click the name of the $SERVICE_SHORT you want to fork. The $SERVICE_SHORT must have a status of `Running` or `Paused`.
1. Navigate to the `Operations` tab.
1. In the `Service management` section, click `Fork service`.
1. <Optional />To customize your fork's resources or configuration, click `Advanced options`. You can set different compute and storage options, separate from your original $SERVICE_SHORT.
1. Confirm by clicking `Fork service`.

The forked $SERVICE_SHORT appears in the `Services` dashboard with a label indicating its parent. Provisioning typically takes a few minutes, but can vary based on your [storage architecture][performance].

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-forked-service.webp"
alt="Fork a Tiger service"
/>

</Procedure>

## Fork with CLI

You can fork $SERVICE_SHORTs using the [Tiger CLI][tiger-cli]. For complete CLI documentation, see [Service management][service-management-cli].

```bash
tiger service fork <parent-service-id>
```

### Common CLI options

```bash
# Fork with a custom name
tiger service fork <parent-service-id> --name my-test-fork --now

# Fork with specific resources
tiger service fork <parent-service-id> --cpu-millis 1000 --memory-gbs 4 --now

# Fork to free tier with shared resources
tiger service fork <parent-service-id> --cpu-millis shared --memory-gbs shared --now
```

## Fork with GitHub Actions

Automate fork creation in your CI/CD workflows using the [Tiger Data Fork Service action][github-action].

### Basic example

```yaml
- name: Fork Database
  id: fork
  uses: timescale/fork-service@v1
  with:
    project_id: ${{ secrets.TIGERDATA_PROJECT_ID }}
    service_id: ${{ secrets.TIGERDATA_SERVICE_ID }}
    api_key: ${{ secrets.TIGERDATA_API_KEY }}
    fork_strategy: now
    cleanup: true
```

See the [GitHub Actions integration guide][github-actions-guide] for complete examples and configuration options.

## Choose your fork strategy

When creating a fork, you'll need to choose a strategy:

- **`last-snapshot`** - Fastest option, uses the most recent automatic backup (ideal for CI/CD)
- **`now`** - Creates a new snapshot before forking (most up-to-date data)
- **`timestamp`** - Fork from a specific point in time for disaster recovery

For detailed guidance on when to use each strategy, trade-offs, and limitations, see [Fork strategies, limitations, and trade-offs][strategies-and-limitations].

## What happens when you fork?

When you create a fork:

1. A new $SERVICE_SHORT is provisioned with the same configuration as the parent
2. Data is restored to the fork at your chosen point in time
3. The fork gets a new, independent `tsdbadmin` password
4. The fork appears in your services dashboard with a label showing its parent

The fork operates completely independently from its parent. Changes to one don't affect the other.

## Next steps

- [Fork strategies, limitations, and trade-offs][strategies-and-limitations] - Learn when to use each strategy and understand constraints
- [GitHub Actions integration][github-actions-guide] - Set up automated forking in CI/CD
- [Service Forks overview][forks-overview] - Complete guide to forking features

[tiger-cli]: /getting-started/:currentVersion:/run-tiger-cloud-cli/
[service-management-cli]: /use-timescale/:currentVersion:/services/service-management/#create-a-development-fork
[github-action]: https://github.com/marketplace/actions/tiger-data-fork-service
[github-actions-guide]: /use-timescale/:currentVersion:/services/forks/github-actions/
[strategies-and-limitations]: /use-timescale/:currentVersion:/services/forks/strategies/
[forks-overview]: /use-timescale/:currentVersion:/services/forks/
