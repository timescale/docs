---
api_name: hyperloglog
excerpt: Aggregate data into a hyperloglog for approximate counting
license: community
toolkit: true
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'approximate count distinct'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: aggregate
---

# hyperloglog()  <tag type="toolkit">Toolkit</tag><tag type="experimental">Experimental"</tag>
The `hyperloglog` function constructs and returns a hyperloglog with at least
the specified number of buckets over the given values.

For more information about approximate count distinct functions, see the
[hyperfunctions documentation][hyperfunctions-approx-count-distincts].

## Required arguments

|Name|Type|Description|
|-|-|-|
|buckets|integer|Number of buckets in the digest. Rounded up to the next power of 2, must be between 16 and 2^18.|
|value|AnyElement| Column to count distinct elements. The type must have an extended, 64-bit, hash function.|

Increasing the `buckets` argument usually provides more accuracy at the expense
of more storage.

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
SELECT hyperloglog(64, weights) FROM samples;
```

Alternatively, you can build a view from the aggregate that you can pass to
other `tdigest` functions:

``` sql
CREATE VIEW digest AS SELECT hyperloglog(64, data) FROM samples;
```


[hyperfunctions-approx-count-distincts]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/approx-count-distincts/
