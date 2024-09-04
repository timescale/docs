---
title: Queries fail when defining continuous aggregates but work on regular tables
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates]
errors:
  - language: sql
    message: |-
      ERROR:  invalid continuous aggregate view
      SQL state: 0A000
apis:
  - [continuous aggregates, CREATE MATERIALIZED VIEW (Continuous Aggregate)]
keywords: [continuous aggregates]
tags: [continuous aggregates, query]
---

import CaggsFunctionSupport from 'versionContent/_partials/_caggs-function-support.mdx';

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

Continuous aggregates don't work on all queries. If you are using a function
that continuous aggregates do not support, you see the error above.

TimescaleDB doesn't support window functions on continuous aggregates.
In versions earlier than 2.7, it doesn't support any
[non-parallelizable SQL aggregates][postgres-parallel-agg].

<CaggsFunctionSupport />

[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
