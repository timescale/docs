---
title: Hierarchical continuous aggregate fails with incompatible bucket width
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates, time buckets]
errors:
  - language: sql
    message: |-
      ERROR:  cannot create continuous aggregate with incompatible bucket width
      DETAIL:  Time bucket width of "<BUCKET>" [1 year] should be multiple of the time bucket width of "<BUCKET>" [1 day].
apis:
  - [create_materialized_view, refresh_continuous_aggregate()]
keywords: [continuous aggregates, hierarchical, time buckets]
tags: [continuous aggregates, time buckets, hierarchical continuous aggregates]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

If you attempt to create a hierarchical continuous aggregate, you must use
compatible time buckets. You can't create a continuous aggregate with a
fixed-width time bucket on top of a continuous aggregate with a variable-width
time bucket. For more information, see the restrictions section in
[hierarchical continuous aggregates][h-caggs-restrictions].

[h-caggs-restrictions]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/#restrictions
