import OldCreateHypertable from "versionContent/partials/_old-api-create-hypertable.mdx";
import HypertableIntro from "versionContent/partials/_tutorials_hypertable_intro.mdx";

## Optimize time-series data in hypertables

<HypertableIntro />

<Procedure>

1. To create a $HYPERTABLE to store the energy consumption data, call [CREATE TABLE][hypertable-create-table].

    ```sql
    CREATE TABLE "metrics"(
        created timestamp with time zone default now() not null,
        type_id integer                                not null,
        value   double precision                       not null
    ) WITH (
       tsdb.hypertable,
       tsdb.partition_column='time'
    );
    ```

    <OldCreateHypertable />

</Procedure>


[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[indexing]: /use-timescale/:currentVersion:/schema-management/indexing/
