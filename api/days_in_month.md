---
api_name: days_in_month()
excerpt: Calculates days in month given a timestamptz
topics: [hyperfunctions]
keywords: [hyperfunctions, toolkit, normalization]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.6.0
hyperfunction:
  type: one-step operation
---

## days_in_month() <tag type="toolkit" content="Toolkit" /><tag type="experimental" content="Experimental" />

Given a timestamptz, returns how many days are in that month.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`date`|`TIMESTAMPTZ`|Timestamp to use to calculate how many days in the month|

### Sample usage

Calculate how many days in the month of January 1, 2022:

```sql
SELECT toolkit_experimental.days_in_month('2021-01-01 00:00:00+03'::timestamptz)
```

The output looks like this:

```sql
days_in_month
----------------------
31
```
