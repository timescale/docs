import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";
import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";

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
       tsdb.hypertable
    );
    ```

    <CreateHypertablePolicyNote />

</Procedure>

[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
