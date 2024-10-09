---
section: hyperfunction
subsection: freq_agg()
---

### Get the 5 most common values from a table

This test uses a table of randomly generated data. The values used are the
integer square roots of a random number in the range 0 to 400.

```sql
CREATE TABLE value_test(value INTEGER);
INSERT INTO value_test SELECT floor(sqrt(random() * 400)) FROM generate_series(1,100000);
```

This returns the 5 most common values seen in the table:

```sql
SELECT topn(
    toolkit_experimental.freq_agg(0.05, value), 
    5) 
FROM value_test;
```

The output for this query:

```sql
 topn 
------
   19
   18
   17
   16
   15
```

### Generate a table with frequencies of the most commonly seen values in a dataset

This test uses a table of randomly generated data. The values used are the integer
square roots of a random number in the range (0,400).

```sql
CREATE TABLE value_test(value INTEGER);
INSERT INTO value_test SELECT floor(sqrt(random() * 400)) FROM generate_series(1,100000);
```

Return values that represent more than 5% of the input:

```sql
SELECT value, min_freq, max_freq
FROM into_values(
    (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test));
```

The output for this query looks like this, with some variation due to randomness:

```sql
 value | min_freq | max_freq 
-------+----------+----------
    19 |  0.09815 |  0.09815
    18 |  0.09169 |  0.09169
    17 |  0.08804 |  0.08804
    16 |  0.08248 |  0.08248
    15 |  0.07703 |  0.07703
    14 |  0.07157 |  0.07157
    13 |  0.06746 |  0.06746
    12 |  0.06378 |  0.06378
    11 |  0.05565 |  0.05595
    10 |  0.05286 |  0.05289
```

## Advanced use

You can adjust the following advanced options to suit your data distribution:

### Estimated skew

`mcv_agg` assumes that the data is skewed. In other words, some values are more
frequent than others. The degree of skew is defined by the `s` parameter of a
[zeta distribution][zeta-distribution].

The default value of `1.1` works on data with this distribution or a more
extreme one:

|N|Minimum percentage of all values represented by the top N (approximate)|
|-|-|
|5|20%|
|10|25%|
|20|30%|
|50|36%|
|100|40%|

[zeta-distribution]: https://en.wikipedia.org/wiki/Zeta_distribution
