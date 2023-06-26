---
title: postgis PostgreSQL extension
excerpt: Use the postgis extension with your Timescale service
products: [cloud]
keywords: [services, settings, extensions, postgis]
tags: [extensions, postgis]
---

# The `postgis` extension

The `postgis` PostgreSQL extension provides storing, indexing and querying
geographic data. It helps in spatial data analysis, the study of patterns,
anomalies, and theories within spatial or geographical data.

For more information about these fuctions and the options available, see the
[PostGIS documentation] [postgis-docs].

## Use the `postgis` extension to analyze geospatial data

The `postgis` PostgreSQL extension allows you to conduct complex analyses
of your geospatial time-series data. Timescale understands that you have a multitude of data
challenges and helps you discover when things happened, and where they occurred.

<Procedure>

### Using the `postgis` extension to analyze geospatial data

1.  Install the `postgis` extension:

    ```sql
    CREATE EXTENSION postgis;
    ```

1.  You can confirm if the extension is installed using the `\dx` command.
    The extensions that are instlled is listed:

    ```sql
                                                            List of installed extensions
            Name         | Version |   Schema   |                                      Description                                      
    ---------------------+---------+------------+---------------------------------------------------------------------------------------
     pg_stat_statements  | 1.10    | public     | track planning and execution statistics of all SQL statements executed
     pgcrypto            | 1.3     | public     | cryptographic functions
     plpgsql             | 1.0     | pg_catalog | PL/pgSQL procedural language
     postgis             | 3.3.3   | public     | PostGIS geometry and geography spatial types and functions
     timescaledb         | 2.11.0  | public     | Enables scalable inserts and complex queries for time-series data (Community Edition)
     timescaledb_toolkit | 1.16.0  | public     | Library of analytical hyperfunctions,     time-series pipelining, and other SQL utilities
    (6 rows)

1.  Create a table named `covid_location`, where, `location` is a `GEOGRAPHY`
    type column that stores GPS coordinates using the 4326/WGS84 coordinate
    system, and `time` records the time the GPS coordinate was logged for a
    specific `state_id`:

    ```sql
       CREATE TABLE covid_location (
        time TIMESTAMPTZ NOT NULL,
        state_id INT NOT NULL,
        location GEOGRAPHY(POINT, 4326),
        cases INT NOT NULL,
        deaths INT NOT NULL 
        );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time` column
    using the `create_hypertable()` function provided by Timescale. You must
    provide the name of the table and the column in that table that holds the
    timestamp data to use for partitioning:

    ```sql
        SELECT create_hypertable('covid_location', 'time');
    ```

1.  Create an index to support efficient queries by `state_id`:

    ```sql
        CREATE INDEX ON covid_location (state_id, time DESC);
    ```

1.  Insert the values in the `covid_location` table, where the longitude and
    latitude coordinates of New Jerssey is (-73.935242 40.730610), and New York
    are (-74.871826 39.833851):

    ```sql
       INSERT INTO covid_location VALUES
        ('2023-06-28 20:00:00',34,'POINT(-74.871826 39.833851)',5,2),
        ('2023-06-28 20:00:00',36,'POINT(-73.935242 40.730610)',7,1),
        ('2023-06-29 20:00:00',34,'POINT(-74.871826 39.833851)',14,0),
        ('2023-06-29 20:00:00',36,'POINT(-73.935242 40.730610)',12,1),
        ('2023-06-30 20:00:00',34,'POINT(-74.871826 39.833851)',10,4);
    ```

1.  To fetch all cases of a specific state during a specific period, use:

    ```sql
     SELECT * FROM covid_location 
     WHERE state_id = 34 AND time BETWEEN '2023-06-28 00:00:00' AND '2023-06-30 23:59:59';
     ```

    The data you get back looks a bit like this:

    ```sql
                         time          | state_id |                      location                      | cases | deaths 
    ------------------------+----------+----------------------------------------------------+-------+--------
     2023-06-28 20:00:00+00 |       34 | 0101000020E61000005C7347FFCBB752C0535E2BA1BBEA4340 |     5 |      2
     2023-06-29 20:00:00+00 |       34 | 0101000020E61000005C7347FFCBB752C0535E2BA1BBEA4340 |    14 |      0
     2023-06-30 20:00:00+00 |       34 | 0101000020E61000005C7347FFCBB752C0535E2BA1BBEA4340 |    10 |      4
    (3 rows)
    ```

1.  To fetch the latest logged cases of all states using the
    [Timescale SkipScan][skip-scan] feature, replace `<Interval_Time>` with the
    number of days between the day you are running the query and the day in the table,
    in this case 30, June, 2023:

    ```sql
        SELECT DISTINCT ON (state_id) state_id, ST_AsText(location) AS location 
        FROM covid_location 
        WHERE time > now() - INTERVAL '<Interval_Time>' 
        ORDER BY state_id, 
        time DESC;
    ```

    The `ST_AsText(location)` function converts the binary geospatial data into
    human-readable format. The data you get back looks a bit like this:

    ```sql
            state_id |          location           
        ----------+-----------------------------
               34 | POINT(-74.871826 39.833851)
        (1 row)

    ```

1.  To fetch all cases and states that were within 10000 meters of Manhattan at
    any time:

     ```sql
        SELECT DISTINCT cases, state_id 
        FROM covid_location 
        WHERE ST_DWithin(
          location, 
          ST_GeogFromText('POINT(-73.9851 40.7589)'), 
          10000
       );
    ```

    The data you get back looks a bit like this:

    ```sql
         cases | state_id 
        -------+----------
             7 |       36
            12 |       36
        (2 rows)
    ```

</Procedure>

[postgis-docs]: https://www.postgis.net
[skip-scan]: /use-timescale/:currentVersion:/query-data/skipscan/
