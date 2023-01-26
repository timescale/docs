---
api_name: histogram()
excerpt: Partition the dataset into buckets and get the number of counts in each bucket
topics: [hyperfunctions]
keywords: [histogram, hyperfunctions]
api:
  license: apache
  type: function
  version:
    stable: 0.5.0
hyperfunction:
  type: one-step aggregate
---

# histogram()

The `histogram()` function represents the distribution of a set of
values as an array of equal-width buckets. It partitions the dataset
into a specified number of buckets (`nbuckets`) ranging from the
inputted `min` and `max` values.

The return value is an array containing `nbuckets`+2 buckets, with the
middle `nbuckets` bins for values in the stated range, the first
bucket at the head of the array for values under the lower `min` bound,
and the last bucket for values greater than or equal to the `max` bound.
Each bucket is inclusive on its lower bound, and exclusive on its upper
bound. Therefore, values equal to the `min` are included in the bucket
starting with `min`, but values equal to the `max` are in the last bucket.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `value` | ANY VALUE | A set of values to partition into a histogram |
| `min` | NUMERIC | The histogram's lower bound used in bucketing (inclusive) |
| `max` | NUMERIC | The histogram's upper bound used in bucketing (exclusive) |
| `nbuckets` | INTEGER | The integer value for the number of histogram buckets (partitions) |

### Sample usage

A simple bucketing of device's battery levels from the `readings` dataset:

```sql
SELECT device_id, histogram(battery_level, 20, 60, 5)
FROM readings
GROUP BY device_id
LIMIT 10;
```

The expected output:

```sql
 device_id  |          histogram
------------+------------------------------
 demo000000 | {0,0,0,7,215,206,572}
 demo000001 | {0,12,173,112,99,145,459}
 demo000002 | {0,0,187,167,68,229,349}
 demo000003 | {197,209,127,221,106,112,28}
 demo000004 | {0,0,0,0,0,39,961}
 demo000005 | {12,225,171,122,233,80,157}
 demo000006 | {0,78,176,170,8,40,528}
 demo000007 | {0,0,0,126,239,245,390}
 demo000008 | {0,0,311,345,116,228,0}
 demo000009 | {295,92,105,50,8,8,442}
```
