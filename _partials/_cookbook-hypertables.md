
## Hypertable recipes

This section contains recipes about hypertables.

### Remove duplicates from an existing hypertable

Looking to remove duplicates from an existing hypertable? One method is to run a `PARTITION BY` query to get
`ROW_NUMBER()` and then the `ctid` of rows where `row_number>1`. You then delete these rows.  However,
you need to check `tableoid` and `ctid`. This is because `ctid` is not unique and might be duplicated in
different chunks. The following code example took 17 hours to process a table with 40 million rows:

```sql
CREATE OR REPLACE FUNCTION deduplicate_chunks(ht_name TEXT, partition_columns TEXT, bot_id INT DEFAULT NULL)
    RETURNS TABLE
            (
                chunk_schema  name,
                chunk_name    name,
                deleted_count INT
            )
AS
$$
DECLARE
    chunk         RECORD;
    where_clause  TEXT := '';
    deleted_count INT;
BEGIN
    IF bot_id IS NOT NULL THEN
        where_clause := FORMAT('WHERE bot_id = %s', bot_id);
    END IF;

    FOR chunk IN
        SELECT c.chunk_schema, c.chunk_name
        FROM timescaledb_information.chunks c
        WHERE c.hypertable_name = ht_name
        LOOP
            EXECUTE FORMAT('
            WITH cte AS (
                SELECT ctid,
                       ROW_NUMBER() OVER (PARTITION BY %s ORDER BY %s ASC) AS row_num,
                       *
                FROM %I.%I
                %s
            )
            DELETE FROM %I.%I
            WHERE ctid IN (
                SELECT ctid
                FROM cte
                WHERE row_num > 1
            )
            RETURNING 1;
        ', partition_columns, partition_columns, chunk.chunk_schema, chunk.chunk_name, where_clause, chunk.chunk_schema,
                           chunk.chunk_name)
                INTO deleted_count;

            RETURN QUERY SELECT chunk.chunk_schema, chunk.chunk_name, COALESCE(deleted_count, 0);
        END LOOP;
END
$$ LANGUAGE plpgsql;


SELECT *
FROM deduplicate_chunks('nudge_events', 'bot_id, session_id, nudge_id, time', 2540);
```

Shoutout to **Mathias Ose** and **Christopher Piggott** for this recipe. 
 
