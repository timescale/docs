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
products: [cloud, mst, self_hosted]
---

# month_normalize() <Tag type="toolkit" content="Toolkit" />

Translate a metric to a standard month. A standard month is calculated as the exact number of days in a year divided by the number of months in a year, so 365.25/12 = 30.4375. `month_normalize()` divides a metric by the number of days in the corresponding calendar month and multiplies it by 30.4375. 

This enables you to compare metrics for different months and decide which one performed better, objectively. For example, in the following table that summarizes the number of sales for three months, January has the highest number of total sales:

| Month | Sales |
|-------|-------|
| Jan   | 3000  |
| Feb   | 2900  |
| Mar   | 2900  |

When you normalize the sales metrics, you get the following result, showing that February in fact performed better:

| Month | Normalized sales  |
|-------|-------------------|
| Jan   | 2945.56           |
| Feb   | 3152.46           |
| Mar   | 2847.38           |


### Samples

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

### Required arguments

|Name|Type|Description|
|-|-|-|
|`metric`|`float8`||
|`reference_date`|`TIMESTAMPTZ`|Timestamp to normalize the metric with|
|`days`|`float8`|Optional, defaults to 365.25/12 if none provided|


