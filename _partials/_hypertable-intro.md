$CLOUD_LONG supercharges your real-time analytics by letting you run complex queries continuously, with near-zero latency. Under the hood, this is achieved by using hypertables—$PG tables that automatically partition your time-series data by time and optionally by space. When you run a query, $CLOUD_LONG identifies the correct partition and runs the query on it, instead of going through the entire table. 

![Hypertable structure](https://assets.timescale.com/docs/images/hypertable-structure.png)

Hypertables offer the following benefits:

- **Efficient data management with [automated partitioning by time][chunk-size]**: $CLOUD_LONG splits your data into chunks that hold data from a specific time range. For example, one day or one week. You can configure this range to better suit your needs.

- **Better performance with [strategic indexing][hypertable-indexes]**: an index on time in the descending order is automatically created when you create a hypertable. You can create additional indexes, including unique indexes, on other columns. 

- **Faster queries with [chunk skipping][chunk-skipping]**: $CLOUD_LONG skips the chunks that are irrelevant in the context of your query, dramatically reducing the time and resources needed to fetch results. Even more—you can enable chunk skipping on non-partitioning columns.

- **Advanced data analysis with [hyperfunctions][hyperfunctions]**: $CLOUD_LONG enables you to efficiently process, aggregate, and analyze significant volumes of data while maintaining high performance.

To top it all, there is no added complexity—you interact with hypertables in the same way as you would with regular $PG tables. All the optimization magic happens behind the scenes.

<Highlight type="note">

Inheritance is not supported for hypertables and may lead to unexpected behavior.

</Highlight>

[chunk-skipping]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/
[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
[chunk-size]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/#optimize-hypertable-chunk-intervals/
[hypertable-indexes]: /use-timescale/:currentVersion:/hypertables/hypertables-and-unique-indexes/


