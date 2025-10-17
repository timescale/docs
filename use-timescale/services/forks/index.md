---
title: Service Forks
excerpt: Create isolated copies of your Tiger database for testing, development, CI/CD, and point-in-time recovery
products: [cloud]
keywords: [forks, development, testing, CI/CD, point-in-time recovery]
tags: [forks, clone, copy, snapshot, branching]
cloud_ui:
    path:
        - [services, :serviceId, operations, management]
        - [create_services, fork, :serviceId]
---

# Service Forks

Service Forks allow you to create isolated copies of your Tiger $SERVICE_SHORT for testing, development, CI/CD pipelines, and disaster recovery. A fork is an exact copy of your database at a specific point in time, with its own independent data and configuration.

## What is a fork?

A fork creates a complete copy of your $SERVICE_SHORT, including:
- All database data and schema
- Configuration settings (which can be customized during fork creation)
- An independent `tsdbadmin` user with a new password

Once created, a fork operates independently from its parent. Changes to the fork don't affect the parent $SERVICE_SHORT, and vice versa. Forks appear in your services dashboard with a label indicating their parent $SERVICE_SHORT.

## Why fork a database?

Common use cases for database forks include:

- **Testing and development**:
    - Create isolated development environments from production data to test schema migrations and application changes safely.
    - Or share realistic datasets with your team without exposing production.

- **CI/CD automation**:
    - Spin up fresh database copies for each pull request using [GitHub Actions][github-action] and automatically clean up after workflows complete.
    - Run integration tests against production-like data or test any migrations before applying them to production.

- **Disaster recovery**:
    - Recover from destructive operations (accidental deletes, bad migrations) by using [point-in-time recovery][backup-restore] forks.

- **Major upgrades**:
    - Test [PostgreSQL major version upgrades][upgrades] on a fork before applying to production.
    - Estimate upgrade duration and identify potential issues.

## Getting started

Ready to create your first fork? See the [Quick start guide][quickstart] for step-by-step instructions using:
- Console UI
- Tiger CLI
- GitHub Actions

## Fork strategies and limitations

Tiger Cloud offers three fork strategies (`now`, `last-snapshot`, and `timestamp`), each with different trade-offs for speed, data freshness, and use case fit. Understanding these strategies along with important limitations helps you make informed decisions.

For detailed guidance on choosing strategies, storage architecture differences, tier restrictions, and cost considerations, see [Fork strategies, limitations, and trade-offs][performance].


## Key limitations to know

Before forking, be aware of these important constraints:

- Services must have a status of `Running` or `Paused` (not `In progress`)
- Fork passwords differ from the parent—[connection strings][connection-details] must be updated
- Forks capture a point-in-time snapshot—ongoing parent writes are not included

For complete details on limitations, tier restrictions, and resource constraints, see [Fork strategies, limitations, and trade-offs][performance].

## Next steps

- [Quick start guide][quickstart] - Create your first fork
- [Fork strategies, limitations, and trade-offs][performance] - Choosing the right approach for your use case
- [GitHub Actions integration][github-actions-guide] - Automate forks in CI/CD workflows
- [Service management][service-management] - Managing forks after creation
- [Backup and recovery][backup-restore] - Using forks for disaster recovery
- [Data tiering with forks][tiered-forks] - Understanding zero-copy mechanics

[quickstart]: /use-timescale/:currentVersion:/services/forks/quickstart/
[tiger-cli]: /getting-started/:currentVersion:/run-tiger-cloud-cli/
[service-management-cli]: /use-timescale/:currentVersion:/services/service-management/#create-a-development-fork
[service-management]: /use-timescale/:currentVersion:/services/service-management/
[backup-restore]: /use-timescale/:currentVersion:/backup-restore/
[pricing]: /about/:currentVersion:/pricing-and-account-management/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[tiered-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
[performance]: /use-timescale/:currentVersion:/services/forks/strategies/
[github-actions-guide]: /use-timescale/:currentVersion:/services/forks/github-actions/
[github-action]: https://github.com/marketplace/actions/tiger-data-fork-service
[upgrades]: /use-timescale/:currentVersion:/upgrades/
[connection-details]: /integrations/:currentVersion:/find-connection-details/
