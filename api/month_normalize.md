---
api_name: month_normalize()
excerpt: Normalization metric based on reference date and days 
license: community
toolkit: true
api_experimental: true
topic: hyperfunctions
tags: [normalization, hyperfunctions]
api_category: hyperfunctions
hyperfunction_toolkit: true
---
## month_normalize()

Normalize the provided metric based on reference date and days.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`metric`|`float8`||
|`reference_date`|`TIMESTAMPTZ`|Timestamp to normalize the metric with|
|`days`|`float8`|Optional, defaults to 365.25/12 if none provided|

### Sample usage

Get the normalized value for a metric of 1000, and a reference date of January 1, 2021:

```sql
SELECT toolkit_experimental.month_normalize(1000,'2021-01-01 00:00:00+03'::timestamptz
```

The output looks like this:

```
month_normalize
----------------------
981.8548387096774
```
