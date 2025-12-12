When you create a $HYPERTABLE using [CREATE TABLE ... WITH ...][hypertable-create-table], the default partitioning 
column is automatically the first column with a timestamp data type. Also, $TIMESCALE_DB creates a 
[columnstore policy][add_columnstore_policy] that automatically converts your data to the $COLUMNSTORE, after an interval equal to the value of the [chunk_interval][create_table_arguments], defined through `compress_after` in the policy. This columnar format enables fast scanning and 
aggregation, optimizing performance for analytical workloads while also saving significant storage space. In the 
$COLUMNSTORE conversion, $HYPERTABLE chunks are compressed by up to 98%, and organized for efficient, large-scale queries.

You can customize this policy later using [alter_job][alter_job_samples]. However, to change `after` or 
`created_before`, the compression settings, or the $HYPERTABLE the policy is acting on, you must 
[remove the columnstore policy][remove_columnstore_policy] and [add a new one][add_columnstore_policy].

You can also manually [convert chunks][convert_to_columnstore] in a $HYPERTABLE to the $COLUMNSTORE.

[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
[create_table_arguments]: /api/:currentVersion:/hypertable/create_table/#arguments
[alter_job_samples]: /api/:currentVersion:/jobs-automation/alter_job/#samples
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
