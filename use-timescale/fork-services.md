---
title: Back up, fork, and recover services
excerpt: Tiger Cloud backs up your data, making sure you always have something to fall back on for disaster recovery
products: [cloud]
price_plans: [performance, scale, enterprise]
keywords: [backups, restore]
tags: [recovery, failures]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import CLIFORKS from "versionContent/_partials/_devops-cli-service-forks.mdx";

# Fork $SERVICE_SHORTs

Modern development is highly iterative. Developers and AI agents need safe spaces to test changes before deploying them
to production. Forkable $SERVICE_SHORTs make this natural and easy. Spin up a branch, run your test, throw it away, or
merge it back.

A fork is an exact copy of a $SERVICE_SHORT at a specific point in time, with its own independent data and configuration,
including:
- The database data and schema
- Configuration
- An admin `tsdbadmin` user with a new password

Forks are fully independent. Changes to the fork don't affect the parent $SERVICE_SHORT, you can query
them, run migrations, add indexes, or test new features.

Forks are a powerful way to share production-scale data safely. BI and data science teams often need access to real
datasets to build models or generate insights. With forkable $SERVICE_SHORTs, you easily create instant, zero-copy
branches of a production $SERVICE_SHORT that is isolated from production, but contains all the data needed for
analysis. You share this fork with your analytics teams in seconds. This dramatically reduces friction getting insights
from live data. 

## Understand $SERVICE_SHORT forks

You use $SERVICE_SHORT forks for disaster recovery, CI/CD automation, and testing and development. For example, you 
can automatically test a major $PG upgrade on a fork before applying it to your production $SERVICE_SHORT. 

$CLOUD_LONG offers the following fork strategies:

- `now`: create a fresh fork of your database at the current time.
   Use when:
   - You need the absolute latest data
   - Recent changes must be included in the fork

- `last-snapshot`: fork from the most recent [automatic backup or snapshot][automatic-backups]. 
  Use when:
  - You want the fastest possible fork creation
  - Slightly behind current data is acceptable

- `timestamp` - fork from a specific point in time within your [retention period][pricing].
  Use when:
  - Disaster recovery from a known-good state
  - Investigating issues that occurred at a specific time
  - Testing "what-if" scenarios from historical data

The retention period for Point-in-time recovery and forking depends on your [pricing plan][pricing-plan-features].

### Fork creation speed

Fork creation speed depends on your pricing plan.

- Free plan: ~30-90 seconds. Uses a Copy-on-Write storage architecture with zero-copy between a fork and the parent.
- Paid plan: varies with the size of your $SERVICE_SHORT, typically 5-20+ minutes. Uses tradional storage architecture
   with backup restore + WAL replay.

### Billing

You can fork a service created in the free plan to a free or a paid plan. However, you cannot fork a service created in 
a paid plan to a free plan service. 

- High-performance storage:
  - Copy-on-Write: you are only billed for storage for the chunks that diverge from the parent $SERVICE_SHORT.
  - Traditional: you are billed for storage for the whole $SERVICE_SHORT.
- Object storage tier:
   - [Tiered data][data-tiering] is shared across forks using Copy-on-Write and traditional storage:
   - Chunks in tiered storage are only billed once, regardless of the number of forks
   - Only new or modified chunks in a fork incur additional costs

For details, see [Replicas and forks with tiered data][tiered-forks].

## Prerequisites

<IntegrationPrereqs />

## Manage forks using $CLI_LONG

<CLIFORKS />

## Manage forks using $CONSOLE_SHORT

To manage development forks:

<Procedure>

1.  In [$CONSOLE][console], from the `Services` list, ensure the $SERVICE_SHORT
    you want to recover has a status of `Running` or `Paused`.
1.  Navigate to `Operations` > `Service Management` and click `Fork service`.
1.  Configure the fork, then click `Fork service`.

    A fork of the $SERVICE_SHORT is created. The forked $SERVICE_SHORT shows in `Services` with a label 
    specifying which $SERVICE_SHORT it has been forked from.

    ![See the forked service](https://assets.timescale.com/docs/images/tsc-forked-service.webp)

1.  Update the connection strings in your app to use the fork.

</Procedure>

## Integrate $SERVICE_SHORT forks in your CI/CD pipeline

To fork your $SERVICE_LONG using GitHub actions:

<Procedure>

1. **Store your $CLOUD_LONG API key as a GitHub Actions secret**

   1. In [$CONSOLE_LONG][rest-api-credentials], click `Create credentials`.
   2. Save the `Public key` and `Secret key` locally, then click `Done`.
   1. In your GitHub repository, click `Settings`, open `Secrets and variables`, then click `Actions`.
   3. Click `New repository secret`, then set `Name` to `TIGERDATA_API_KEY`
   4. Set `Secret` to your $CLOUD_LONG API key in the following format `<Public key>:<Secret key>`, then click `Add secret`.

1. **Add the [GitHub Actions Marketplace][github-action] to your workflow YAML files**

   For example, the following workflow forks a $SERVICE_SHORT when a pull request is opened,
   running tests against the fork, then automatically cleans up.

    ```yaml
    name: Test on a service fork
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

    For the full list of inputs, outputs, and configuration options, see the [Tiger Data - Fork Service][github-action] in GitHub marketplace.

</Procedure>

[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /about/use-timescale/:currentVersion:/ha-replicas/
[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/
[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[support]: https://www.timescale.com/contact/
[pitr]: /use-timescale/:currentVersion:/backup-restore/point-in-time-recovery/
[rapid-recovery]: /use-timescale/:currentVersion:/ha-replicas/#rapid-recovery
[cross-region]: /use-timescale/:currentVersion:/backup-restore#enable-cross-region-backup
[create-fork]: /use-timescale/:currentVersion:/backup-restore#create-a-point-in-time-recovery-fork
[automatic-backups]: /use-timescale/:currentVersion:/backup-restore/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[tiered-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
[github-action]: https://github.com/marketplace/actions/tiger-data-fork-service
[delete-action]: https://github.com/marketplace/actions/tiger-data-delete-service
[connection-details]: /integrations/:currentVersion:/find-connection-details/
[upgrades]: /use-timescale/:currentVersion:/upgrades/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings