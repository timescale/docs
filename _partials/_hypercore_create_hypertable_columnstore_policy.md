import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

1. **Enable $COLUMNSTORE on a $HYPERTABLE**

   For [efficient queries][secondary-indexes], remember to `segmentby` the column you will
   use most often to filter your data. For example:

    * **$HYPERTABLE_CAPs**:

      [Use `CREATE TABLE` for a $HYPERTABLE][hypertable-create-table]

       ```sql
       CREATE TABLE crypto_ticks (
         "time" TIMESTAMPTZ,
         symbol TEXT,
         price DOUBLE PRECISION,
         day_volume NUMERIC
       ) WITH (
         timescaledb.hypertable,
         timescaledb.segmentby='symbol', 
         timescaledb.orderby='time DESC'
       );
       ```
       <CreateHypertablePolicyNote />

    * **$CAGG_CAPs**
        1.  [Use `ALTER MATERIALIZED VIEW` for a $CAGG][compression_continuous-aggregate]:
         ```sql
         ALTER MATERIALIZED VIEW assets_candlestick_daily set (
            timescaledb.enable_columnstore = true, 
            timescaledb.segmentby = 'symbol');
         ``` 
         Before you say `huh`, a $CAGG is a specialized $HYPERTABLE.

        1. Add a policy to convert $CHUNKs to the $COLUMNSTORE at a specific time interval:

           Create a [columnstore_policy][add_columnstore_policy] that automatically converts $CHUNKs in a $HYPERTABLE to
           the $COLUMNSTORE at a specific time interval. For example:
           ``` sql
           CALL add_columnstore_policy('assets_candlestick_daily', after => INTERVAL '1d');
           ```

   $TIMESCALE_DB is optimized for fast updates on compressed data in the $COLUMNSTORE. To modify data in the
   $COLUMNSTORE, use standard SQL.

[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[compression_continuous-aggregate]: /api/:currentVersion:/continuous-aggregates/alter_materialized_view/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
