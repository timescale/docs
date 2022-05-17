# ORDER BY
By default, in PostgreSQL and therefore TimescaleDB, the results from a basic
`SELECT` query are unordered. You must include the [`ORDER BY`][orderby-postgres]
clause to guarantee the order of your results. When you use `ORDER BY`, you need
to specify the columns to order the results on then, optionally, give the
ordering direction, either ascending or descending. If you don't specify the
order direction for your columns, the default ordering is ascending.

When you query time-series data, you need ordered results. Time occurs linearly
and by nature is chronological. When you analyze and understand time-series
data, you need to retain that order on time. To effectively analyze time-series
data in TimescaleDB, the `ORDER BY` clause is necessary.

## Syntax
Single column ordering: sort all rows of data based on the values in the
specified column:

```sql
ORDER BY <column_name> <optional ASC or DESC>
```

Multiple column ordering: the results are sorted by the specified columns one
after another, so order matters:

```sql
ORDER BY <column_name> <optional ASC or DESC>, <column_name> <optional ASC or DESC>, …
```

<highlight type="note">
Sorting operations are costly if indexes do not exist for the exact columns and
ordering specified by the query. If sorting by multiple columns proves to be slow,
look at an EXPLAIN plan for `Sort` nodes which indicate sorting that is taking
place after the data is retrieved.
</highlight>

## Examples
For example, if you have this raw  data:

```sql
stock_data:
| row_id | time | group | price | 
| - | - | - | - |
| 1 | 2022-01-01 | b | 261.12 | 
| 2 | 2022-01-02 | a | 200.88 | 
| 3 | 2022-01-01 | a | 200.88 | 
| 4 | 2022-01-02 | b | 382.76 | 
| 5 | 2022-01-02 | b | 129.45 | 
| 6 | 2022-01-01 | a |   72.70 | 
```

You can create a query like this that orders time. Notice that the results are
ordered by ascending which is the default:

```sql
SELECT * FROM stock_data
ORDER BY time
```

Results:

```sql
| row_id | time | group | price | 
| - | - | - | - |
| 1 | 2022-01-01 | b | 261.12 | 
| 3 | 2022-01-01 | a | 200.88 |
| 6 | 2022-01-01 | a |   72.70 | 
| 2 | 2022-01-02 | a | 200.88 | 
| 4 | 2022-01-02 | b | 382.76 | 
| 5 | 2022-01-02 | b | 129.45 | 
```

Or you can sort on multiple columns and specify descending:

```sql
SELECT * FROM stock_data
ORDER BY group DESC, price, time
```

Results:

```sql
| row_id | time | group | price | 
| - | - | - | - |
| 4 | 2022-01-02 | b | 382.76 |
| 1 | 2022-01-01 | b | 261.12 |
| 5 | 2022-01-02 | b | 129.45 | 
| 3 | 2022-01-01 | a | 200.88 |
| 2 | 2022-01-02 | a | 200.88 |
| 6 | 2022-01-01 | a |   72.70 |
```

Here's a more realistic example:

```sql
weather_station_data: 
| weather_station_id | weather_station_location | time | temperature | humidity |
| - | - | - | - | - |
| 6 | Harrisburgh | 2022-03-23 12:00:00 | 49.4 | 65 |
| 6 | Harrisburgh | 2022-03-23 10:00:00 | 47.8 | 67 |
| 14 | Pittsburgh | 2022-03-23 12:00:00 | 52.1 | 32 |
.
.
.
```

When you analyze weather station data across multiple cities, you need to order
the station's readings by their time, and possibly location, to get the most
recent weather readings. In fact, for most time-series data applications, `time`
is usually sorted descending so that the most recent data is displayed first:

```sql
SELECT * FROM weather_station_data
ORDER BY time DESC, weather_station
```

Results:

```sql
| weather_station_id | weather_station_location | time | temperature | humidity |
| - | - | - | - | - |
| 1 | Allentown | 2022-03-23 12:00:00 | 48.1 | 53 |
| 2 | Altoona | 2022-03-23 12:00:00 | 49.2 | 67 |
| 3 | Clearfield | 2022-03-23 12:00:00 | 47.9 | 56 |
. 
. 
. 
```

The results display the most recent weather readings ordered by the weather
station location alphabetically.

## Next steps
For more information about the `ORDER BY` clause and how to use it within
PostgreSQL, see the [PostgreSQL documentation][[orderby-postgres]].
Additionally, for more examples of how to use `ORDER BY` in your queries, check
out these Timescale documentation sections:

<!---
Include links to examples in docs here
-->

[orderby-postgres]: https://www.postgresql.org/docs/current/queries-order.html
