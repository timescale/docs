---
api_name: month_normalize()
excerpt: Normalize a monthly metric based on number of days in month
topics: [hyperfunctions]
keywords: [hyperfunctions, Toolkit, normalization]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.10.1
    stable: 1.16.0
hyperfunction:
  type: one-step operation
---

# month_normalize() <Tag type="toolkit" content="Toolkit" />

Normalize the provided metric based on reference date and days.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`metric`|`float8`||
|`reference_date`|`TIMESTAMPTZ`|Timestamp to normalize the metric with|
|`days`|`float8`|Optional, defaults to 365.25/12 if none provided|

### Sample usage

Get the normalized value for a metric of 1000, and a reference date of January
1, 2021:

```sql
SELECT month_normalize(1000,'2021-01-01 00:00:00+03'::timestamptz)
```

The output looks like this:

```sql
month_normalize
----------------------
981.8548387096774
```
