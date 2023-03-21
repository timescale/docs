---
title: Approximate count distincts
excerpt: Estimate the number of distinct values in a large dataset
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, approximate count distincts]
---

# Approximate count distincts

Approximate count distincts are typically used to find the number of unique
values, or cardinality, in a large dataset. When you calculate cardinality in a
dataset, the time it takes to process the query is proportional to how large the
dataset is. So if you wanted to find the cardinality of a dataset that contained
only 20 entries, the calculation would be very fast. Finding the cardinality of
a dataset that contains 20 million entries, however, can take a significant
amount of time and compute resources. Approximate count distincts do not
calculate the exact cardinality of a dataset, but rather estimate the number of
unique values, to reduce memory consumption and improve compute time by avoiding
spilling the intermediate results to the secondary storage.
