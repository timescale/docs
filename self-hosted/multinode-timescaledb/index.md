---
title: Multi-node
excerpt: Learn about using multi-node TimescaleDB to scale your database horizontally, including setup, authentication, configuration, and managing your cluster 
keywords: [multi-node, scaling]
seo:
  robots: noindex
---

import MultiNodeDeprecation from "versionContent/_partials/_multi-node-deprecation.mdx";

<MultiNodeDeprecation />

# Multi-node

If you have a larger workload, you might need more than one $TIMESCALE_DB
instance. $TIMESCALE_DB multi-node allows you to run and manage multiple instances,
giving you faster data ingest, and more responsive and efficient queries.

*   [Learn about multi-node][about-multi-node] to understand how it works
    before you begin using it.
*   Set up [multi-node][multi-node-setup] in a self-hosted environment.
*   Set up [authentication][password-config] for your cluster
*   [Configure][configuration] your cluster
*   [Administer][multi-node-administration] your cluster
*   [Grow or shrink][multi-node-grow-shrink] your cluster
*   Set up [high availability][multi-node-ha] (HA) for your cluster
*   [Maintain][multi-node-maintenance] your multi-node environment

[about-multi-node]: /self-hosted/:currentVersion:/multinode-timescaledb/about-multinode/
[multi-node-administration]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-administration/
[password-config]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-auth/
[configuration]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-config/
[multi-node-grow-shrink]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-grow-shrink/
[multi-node-ha]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-ha/
[multi-node-maintenance]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-maintenance/
[multi-node-setup]: /self-hosted/:currentVersion:/multinode-timescaledb/multinode-setup/
