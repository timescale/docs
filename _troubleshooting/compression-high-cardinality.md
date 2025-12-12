---
title: Low compression rate
section: troubleshooting
products: [cloud, mst, self_hosted]
topics: [hypertables, compression, hypercore]
apis:
  - [compression, hypercore]
keywords: [hypertables, compression, hypercore]
tags: [hypertables, compression, hypercore]
---

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same
   action is applied?
* Copy this comment at the top of every troubleshooting page
-->

Low compression rates are often caused by [high cardinality][cardinality-blog] of the segment key. This means that the column you selected for grouping the rows during compression has too many unique values. This makes it impossible to group a lot of rows in a batch. To achieve better compression results, choose a segment key with lower cardinality. 

[cardinality-blog]: https://www.timescale.com/blog/what-is-high-cardinality
