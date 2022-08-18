---
api_name: days_in_month()
excerpt: Calculates days in month given a timestamptz
license: community
toolkit: true
api_experimental: true
topic: hyperfunctions
tags: [normalization, hyperfunctions]
api_category: hyperfunctions
hyperfunction_toolkit: true
---
## days_in_month()

Given a timestamptz, returns how many days are in that month.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`date`|`TIMESTAMPTZ`|Timestamp to use to calculate how many days in the month|

### Sample usage

Calculate how many days in the month of January 1st, 2022:

```sql
SELECT toolkit_experimental.days_in_month('2021-01-01 00:00:00+03'::timestamptz)
```

The output looks like this:

```
days_in_month
----------------------
31
```
