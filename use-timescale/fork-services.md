---
title: Back up, fork, and recover services
excerpt: Tiger Cloud backs up your data, making sure you always have something to fall back on for disaster recovery
products: [cloud]
keywords: [backups, restore]
tags: [recovery, failures]
---

import CLIFORKS from "versionContent/_partials/_devops-cli-service-forks.mdx";

# Fork $SERVICE_SHORT

Modern development is highly iterative. Developers and AI agents need safe spaces to test changes before deploying them
to production. Forkable $SERVICE_SHORTs make this natural and easy. Spin up a branch, run your test, throw it away, or
merge it back.

Forks are a powerful way to share production-scale data safely. BI and data science teams often need access to real
datasets to build models or generate insights. With forkable $SERVICE_SHORTs, you easily create instant, zero-copy
branches of a production $SERVICE_SHORT that is isolated from production, but contains all the data needed for
analysis. You share this fork with your analytics teams in seconds. This dramatically reduces friction getting insights
from live data. Forks are fully independent. Changes to the fork don't affect the parent $SERVICE_SHORT, you can query 
them, run migrations, add indexes, or test new features.

## What is a fork?

A fork is an exact copy of your database at a specific point in time, with its own independent data and configuration, 
including:
- All database data and schema
- Configuration settings (which can be customized during fork creation)
- An independent `tsdbadmin` user with a new password





## Create a development fork

<CLIFORKS />


[console]: https://console.cloud.timescale.com/dashboard/services
[ha-replicas]: /about/use-timescale/:currentVersion:/ha-replicas/
[pricing-and-account-management]: /about/:currentVersion:/pricing-and-account-management/
[wal]: https://www.postgresql.org/docs/current/wal-intro.html
[support]: https://www.timescale.com/contact/
[pitr]: /use-timescale/:currentVersion:/backup-restore/point-in-time-recovery/
[rapid-recovery]: /use-timescale/:currentVersion:/ha-replicas/#rapid-recovery
[cross-region]: /use-timescale/:currentVersion:/backup-restore#enable-cross-region-backup
[create-fork]: /use-timescale/:currentVersion:/backup-restore#create-a-point-in-time-recovery-fork
