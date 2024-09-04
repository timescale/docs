---
title: Hypertable retention policy isn't applying to continuous aggregates
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [continuous aggregates, data retention]
apis:
  - [data retention, add_retention_policy()]
keywords: [continuous aggregates, data retention]
tags: [continuous aggregates, data retention]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

A retention policy set on a hypertable does not apply to any continuous
aggregates made from the hypertable. This allows you to set different retention
periods for raw and summarized data. To apply a retention policy to a continuous
aggregate, set the policy on the continuous aggregate itself.
