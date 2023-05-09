This table summarizes aggregate function support in continuous aggregates:

|Function, clause, or feature|TimescaleDB 2.6 and earlier|TimescaleDB 2.7, 2.8, and 2.9|TimescaleDB 2.10 and later|
|-|-|-|-|
|Parallelizable aggregate functions|✅|✅|✅|
|Non-parallelizable aggregate functions|❌|✅|✅|
|`ORDER BY`|❌|✅|✅|
|Ordered-set aggregates|❌|✅|✅|
|Hypothetical-set aggregates|❌|✅|✅|
|`DISTINCT` in aggregate functions|❌|✅|✅|
|`FILTER` in aggregate functions|❌|✅|✅|
|`FROM` clause supports `JOINS`|❌|❌|✅|
