This table summarizes aggregate function support in continuous aggregates:

|Function, clause, or feature|TimescaleDB 2.6 and earlier|TimescaleDB 2.7 and above|
|-|-|-|
|Parallelizable aggregate functions|✅|✅|
|Non-parallelizable aggregate functions|❌|✅|
|Ordered-set aggregates|❌|✅|
|Hypothetical-set aggregates|❌|✅|
|`DISTINCT` in aggregate functions|❌|✅|
|`FILTER` in aggregate functions|❌|✅|
|`ORDER BY` in aggregate functions|❌|✅|

<highlight type="note">
Note that `ORDER BY` is supported within the PostgreSQL
[ordered-set aggregates](https://www.postgresql.org/docs/current/functions-aggregate.html).
It is not yet supported in general.
</highlight>
