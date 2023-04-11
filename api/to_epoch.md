---
api_name: to_epoch()
excerpt: Converts a date to a Unix epoch time
topics: [hyperfunctions]
keywords: [hyperfunctions, Toolkit, normalization]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.6.0
    stable: 1.16.0
hyperfunction:
  type: one-step operation
---

# to_epoch() <Tag type="toolkit" content="Toolkit" />

Given a timestamptz, returns the number of seconds since January 1, 1970 (the Unix epoch).

### Required arguments

|Name|Type|Description|
|-|-|-|
|`date`|`TIMESTAMPTZ`|Timestamp to use to calculate epoch|

### Sample usage

Convert a date to a Unix epoch time:

```sql
SELECT to_epoch('2021-01-01 00:00:00+03'::timestamptz);
```

The output looks like this:

```sql
  to_epoch
------------
 1609448400
```
