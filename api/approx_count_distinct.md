---
api_name: approx_count_distinct()
excerpt: Aggregate data into a hyperloglog for approximate counting without having to specify the number of buckets.
topics: [hyperfunctions]
tags: [hyperfunctions, approximate count distinct, distinct count, hyperloglog]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: approximate count distinct
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'approximate count distinct'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: aggregate
---

# approx_count_distinct()  <tag type="toolkit">Toolkit</tag>

The `approx_count_distinct` function constructs and returns a hyperloglog with a
default size appropriate for the majority of use cases.

For more information about approximate count distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

## Required arguments

|Name|Type|Description|
|-|-|-|
|value|AnyElement| Column to count distinct elements. The type must have an extended, 64-bit, hash function.|

## Returns

|Column|Type|Description|
|-|-|-|
|hyperloglog|hyperloglog|A hyperloglog object which can be passed to other hyperloglog APIs.|

<!---Any special notes about the returns-->

## Sample usage

This examples assumes you have a table called `samples`, that contains a column
called `weights` that holds DOUBLE PRECISION values. This command returns a
digest over that column:

``` sql
SELECT toolkit_experimental.approx_count_distinct(weights) FROM samples;
```

Alternatively, you can build a view from the aggregate that you can pass to
other `hyperloglog` functions:

``` sql
CREATE VIEW hll AS SELECT toolkit_experimental.approx_count_distinct(data) FROM samples;
```

[hyperfunctions-approx-count-distincts]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
