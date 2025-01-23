
The following table summarizes the aggregate functions supported in continuous aggregates:

|Function, clause, or feature|TimescaleDB 2.6 and earlier|TimescaleDB 2.7, 2.8, and 2.9|TimescaleDB 2.10 and later|
|-|-|-|-|
|Parallelizable aggregate functions|✅|✅|✅|
|[non-parallelizable SQL aggregates][postgres-parallel-agg]|❌|✅|✅|
|`ORDER BY`|❌|✅|✅|
|Ordered-set aggregates|❌|✅|✅|
|Hypothetical-set aggregates|❌|✅|✅|
|`DISTINCT` in aggregate functions|❌|✅|✅|
|`FILTER` in aggregate functions|❌|✅|✅|
|`FROM` clause supports `JOINS`|❌|❌|✅|


DISTINCT works in aggregate functions not in the query definition. For example, for the table:

```sql
CREATE TABLE public.candle(
symbol_id uuid                     NOT NULL,
symbol    text                     NOT NULL,
"time"    timestamp with time zone NOT NULL,
open      double precision         NOT NULL,
high      double precision         NOT NULL,
low       double precision         NOT NULL,
close     double precision         NOT NULL,
volume    double precision         NOT NULL
);

```
- The following works:
  ```sql
  CREATE MATERIALIZED VIEW candles_start_end
  WITH (timescaledb.continuous) AS
  SELECT time_bucket('1 hour', "time"), COUNT(DISTINCT symbol), first(time, time) as first_candle, last(time, time) as last_candle
  FROM candle
  GROUP BY 1;
  ```
- This does not:
  ```sql
  CREATE MATERIALIZED VIEW candles_start_end
  WITH (timescaledb.continuous) AS
  SELECT DISTINCT ON (symbol)
  symbol,symbol_id, first(time, time) as first_candle, last(time, time) as last_candle
  FROM candle
  GROUP BY symbol_id;
  ```

[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
