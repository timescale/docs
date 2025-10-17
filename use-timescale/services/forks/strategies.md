---
title: Fork strategies, limitations, and trade-offs
excerpt: Understanding fork strategies, storage architectures, and important limitations when forking databases
products: [cloud]
keywords: [forks, strategies, limitations, storage, copy-on-write, CoW]
tags: [forks, strategies, limitations, tradeoffs]
---

# Fork strategies, limitations, and trade-offs

When forking databases, understanding the available strategies and their trade-offs helps you choose the right approach for your use case while being aware of current limitations.

## Fork strategies

Tiger Cloud offers three fork strategies, each optimized for different scenarios:

### `now` - Create fork at the current time

Creates a fresh fork of your database at the current time.

**Use when:**
- You need the absolute latest data
- Recent changes must be included in the fork

### `last-snapshot` - Uses existing snapshot or backup

Forks from the most recent automatic backup or snapshot. The frequency of these depends on your plan.

**Use when:**
- Pipelines where speed matters
- Slightly behind current data is acceptable
- You want the fastest possible fork creation

### `timestamp` - Point-in-time recovery

Forks from a specific point in time within your [retention period][pricing].

**Use when:**
- Disaster recovery from a known-good state
- Investigating issues that occurred at a specific time
- Testing "what-if" scenarios from historical data

**Retention periods for point-in-time recovery:**
- Free plan: 1 day
- Scale plan: 3 days
- Performance plan: 14 days
- Enterprise plan: 14 days


## Storage architecture differences

Fork creation speed varies based on your underlying storage architecture.

<Highlight type="note">

Tiger Data has developed a new Copy-on-Write storage architecture that is currently available on the free plan. We will slowly roll this out to paid plans but want to ensure absolute stability when we do so. 
</Highlight>

### Copy-on-Write (CoW) storage

- **Availability**: Free plan (rolling out to all paid plans)
- **Fork speed**: ~30-90 seconds, independent of database size
- **Mechanism**: Zero-copy storage level shared between forks and parent
- **Billing**: Pay only for blocks that diverge from parent (or nothing currently on free plan)

### Traditional storage

- **Availability**: Current default for paid plans
- **Fork speed**: Varies with database size (typically 5-20+ minutes)
- **Mechanism**: Backup restore + WAL replay
- **Billing**: Full database size billed immediately


### Plan restrictions

- **You cannot fork from paid plan to free plan**: Forks from Scale, Performance, or Enterprise plan services cannot target the free plan
- Free plan services can fork to any plan

## Service configuration

- **By default, match parent resources**: Omit resource parameters to inherit parent's allocation
- **Custom resources**: Specify `cpu_millis` and `memory_gbs` for dedicated resources (only on paid plans)
- **Underpowered forks**: Small compute allocations may slow data-intensive operations (only on free plan)


## Tiered storage billing

If you use [data tiering][data-tiering], tiered data is shared across forks also on traditional storage:

- Tiered chunks are only billed once, regardless of fork count
- Only new or modified chunks in a fork incur additional costs

For details, see [Replicas and forks with tiered data][tiered-forks].


## Next steps

- [Quick start guide][quickstart] - Create your first fork
- [Service Forks overview][forks-overview] - Complete guide to forking
- [GitHub Actions integration][github-actions] - Automate forking in CI/CD
- [Backup and recovery][backup-restore] - Using forks for disaster recovery
- [Data tiering with forks][tiered-forks] - Understanding shared storage mechanics

[quickstart]: /use-timescale/:currentVersion:/services/forks/quickstart/
[forks-overview]: /use-timescale/:currentVersion:/services/forks/
[github-actions]: /use-timescale/:currentVersion:/services/forks/github-actions/
[backup-restore]: /use-timescale/:currentVersion:/backup-restore/
[data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[tiered-forks]: /use-timescale/:currentVersion:/data-tiering/tiered-data-replicas-forks/
[pricing]: /about/:currentVersion:/pricing-and-account-management/
[connection-details]: /integrations/:currentVersion:/find-connection-details/
[upgrades]: /use-timescale/:currentVersion:/upgrades/
