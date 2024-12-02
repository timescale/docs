## IoT recipes

This section contains recipes for IoT issues:

### Work with columnar IoT data

Narrow and medium width tables are a great way to store IoT data. A lot of reasons are outlined in
[Designing Your Database Schema: Wide vs. Narrow Postgres Tables][blog-wide-vs-narrow].

One of the key advantages of narrow tables is that the schema does not have to change when you add new
sensors. Another big advantage is that each sensor can sample at different rates and times. This helps
support things like hysteresis, where new values are written infrequently unless the value changes by a
certain amount.

#### Narrow table format example

Working with narrow table data structures presents a few challenges. In the IoT world one concern is that
many data analysis approaches - including machine learning as well as more traditional data analysis -
require that your data is resampled and synchronized to a common time basis. Fortunately, TimescaleDB provides
you with [hyperfunctions][hyperfunctions] and other tools to help you work with this data. 

An example of a narrow table format is:

| ts                      | sensor_id | value |
|-------------------------|-----------|-------|
| 2024-10-31 11:17:30.000 | 1007      | 23.45 |

Typically you would couple this with a sensor table:

| sensor_id | sensor_name  | units                    |
|-----------|--------------|--------------------------|
| 1007      | temperature  | degreesC                 |
| 1012      | heat_mode    | on/off                   |
| 1013      | cooling_mode | on/off                   | 
| 1041      | occupancy    | number of people in room |

A medium table retains the generic structure but adds columns of various types so that you can
use the same table to store float, int, bool, or even JSON (jsonb) data:

| ts                      | sensor_id | d     | i    | b    | t    | j    |
|-------------------------|-----------|-------|------|------|------|------|
| 2024-10-31 11:17:30.000 | 1007      | 23.45 | null | null | null | null |
| 2024-10-31 11:17:47.000 | 1012      | null  | null | TRUE | null | null |
| 2024-10-31 11:18:01.000 | 1041      | null  | 4    | null | null | null |

To remove all-null entries, use an optional constraint such as:

```sql
    CONSTRAINT at_least_one_not_null
        CHECK ((d IS NOT NULL) OR (i IS NOT NULL) OR (b IS NOT NULL) OR (j IS NOT NULL) OR (t IS NOT NULL))
```

#### Get the last value of every sensor

There are several ways to get the latest value of every sensor. The following examples use the
structure defined in [Narrow table format example][setup-a-narrow-table-format] as a reference:

- [SELECT DISTINCT ON][select-distinct-on]
- [JOIN LATERAL][join-lateral]

##### SELECT DISTINCT ON

If you have a list of sensors, the easy way to get the latest value of every sensor is to use 
`SELECT DISTINCT ON`:

```sql
WITH latest_data AS (
    SELECT DISTINCT ON (sensor_id) ts, sensor_id, d
    FROM iot_data
    WHERE d is not null
      AND ts > CURRENT_TIMESTAMP - INTERVAL '1 week'  -- important
    ORDER BY sensor_id, ts DESC
)
SELECT
    sensor_id, sensors.name, ts, d
FROM latest_data
LEFT OUTER JOIN sensors ON latest_data.sensor_id = sensors.id
WHERE latest_data.d is not null
ORDER BY sensor_id, ts; -- Optional, for displaying results ordered by sensor_id
```

The common table expression (CTE) used above is not strictly necessary. However, it is an elegant way to join 
to the sensor list to get a sensor name in the output.  If this is not something you care about,
you can leave it out:

```sql
SELECT DISTINCT ON (sensor_id) ts, sensor_id, d
    FROM iot_data
    WHERE d is not null
      AND ts > CURRENT_TIMESTAMP - INTERVAL '1 week'  -- important
    ORDER BY sensor_id, ts DESC
```

It is important to take care when down-selecting this data. In the previous examples,
the time that the query would scan back was limited. However, if there any sensors that have either 
not reported in a long time or in the worst case, never reported, this query devolves to a full table scan.  
In a database with 1000+ sensors and 41 million rows, an unconstrained query takes over an hour.

#### JOIN LATERAL

An alternative to [SELECT DISTINCT ON][select-distinct-on] is to use a `JOIN LATERAL`. By selecting your entire 
sensor list from the sensors table rather than pulling the IDs out using `SELECT DISTINCT`, `JOIN LATERAL` can offer 
some improvements in performance:

```sql
SELECT sensor_list.id, latest_data.ts, latest_data.d
FROM sensors sensor_list
    -- Add a WHERE clause here to downselect the sensor list, if you wish
LEFT JOIN LATERAL (
    SELECT ts, d
    FROM iot_data raw_data
    WHERE sensor_id = sensor_list.id
    ORDER BY ts DESC
    LIMIT 1
) latest_data ON true
WHERE latest_data.d is not null -- only pulling out float values ("d" column) in this example
  AND latest_data.ts > CURRENT_TIMESTAMP - interval '1 week' -- important
ORDER BY sensor_list.id, latest_data.ts;
```

Limiting the time range is important, especially if you have a lot of data. Best practice is to use these 
kinds of queries for dashboards and quick status checks. To query over a much larger time range, encapsulate 
the previous example into a materialized query that refreshes infrequently, perhaps once a day.

Shoutout to **Christopher Piggott** for this recipe.

[blog-wide-vs-narrow]: https://www.timescale.com/learn/designing-your-database-schema-wide-vs-narrow-postgres-tables
[setup-a-narrow-table-format]: /tutorials/:currentVersion:/cookbook/#narrow-table-format-example
[select-distinct-on]: /tutorials/:currentVersion:/cookbook/#select-distinct-on
[join-lateral]: /tutorials/:currentVersion:/cookbook/#join-lateral
[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
