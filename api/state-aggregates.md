---
title: State aggregates
excerpt: Track time in states
keywords: [states, hyperfunctions, Toolkit]
---

# State aggregates

This section includes functions used to measure the time spent in a relatively small number of states.

For these hyperfunctions, you need to install the [TimescaleDB Toolkit][install-toolkit] PostgreSQL extension.

## Notes on state_agg and timeline_agg

`timeline_agg` supports all hyperfunctions that operate on StateAggs, in addition
to some additional functions that need a full state timeline.

All `state_agg` and `timeline_agg` hyperfunctions support both string (`TEXT`) and integer (`BIGINT`) states. 
You can't mix different types of states within a single aggregate.
Integer states are useful when the state value is a foreign key representing a row in another table that stores all possible states.

## Hyperfunctions

<hyperfunctionTable
    hyperfunctionFamily='state aggregates'
    includeExperimental
    sortByType
/>

[install-toolkit]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
