# Real time aggregates

Real-time aggregates (released with TimescaleDB 1.7) build on continuous aggregates' ability to increase query speed and optimize storage. Learn what's new, details about how they work, and how to get started.

One constant across all time-series use cases is data: metrics, logs, events, sensor readings; IT and application performance monitoring, SaaS applications, IoT, martech, fintech, and more.  Lots (and lots) of data. What’s more, it typically arrives continuously.

This need to handle large volumes of constantly generated data motivated some of our earliest TimescaleDB architectural decisions, such as its use of automated time-based partitioning and local-only indexing to achieve high insert rates.  And last year, we added type-specific columnar compression to significantly shrink the overhead involved in storing all of this data (often by 90% or higher – see our technical description and benchmarking results).

And another key capability in TimescaleDB, which is the focus of this post, has been continuous aggregates, which we first introduced in TimescaleDB 1.3.  Continuous aggregates allow one to specify a SQL query that continually processes raw data into a so-called materialized table.  

Continuous aggregates are somewhat similar to materialized views in databases, but unlike a materialized view (as in PostgreSQL), continuous aggregates do not need to be refreshed manually; the view will be refreshed automatically in the background as new data is added, or old data is modified. Additionally, TimescaleDB does not need to re-calculate all of the data on every refresh. Only new and/or invalidated data will be calculated. And since this re-aggregation is automatic – it executes as a background job at regular intervals – this process doesn’t add any maintenance burden to your database.

This is where most database or streaming systems that offer continuous aggregates or continuous queries give up.  We knew we could do better.

Enter Real-Time Aggregation, introduced in TimescaleDB 1.7 (see our release blog).

Quick Background on Continuous Aggregates
The benefit of continuous aggregations are two fold:

Query performance.  By executing queries against pre-calculated results, rather than the underlying raw data,  continuous aggregates can significantly improve query performance.
Storage savings with downsampling. Continuous aggregates are often combined with data retention policies for better storage management.  Raw data can be continually aggregated into a materialized table, and dropped after it reaches a certain age.  So the database may only store some fixed period of raw data (say, one week), yet store aggregate data for much longer.
Consider the following example, collecting system metrics around CPU usage and storing it in a CPU metrics hypertable, where each row includes a timestamp, hostname, and 3 metrics around CPU usage (usage_user, usage_system, usage_iowait).  

We collect these statistics every second per server.

            time              | hostname |     usage_user     |    usage_system     |    usage_iowait
-------------------------------+----------+--------------------+---------------------+---------------------
2020-05-06 02:32:34.627143+00 | host0    | 0.5378765249290502 |  0.2958572490961302 | 0.10685818344495246
2020-05-06 02:32:34.627143+00 | host1    | 0.3175958910709298 |  0.7874926624954846 | 0.16615243032654803
2020-05-06 02:32:34.627143+00 | host2    | 0.4788377981501064 | 0.18277343256546175 |  0.7183967491020162


So a query that wants to compute the per-hourly histogram of usage consumption over the course of 7 days for 10 servers will process 10 servers * 60 seconds * 60 minutes * 24 hours * 7 days= 6,048,000 rows of data.

On the other hand, if we pre-compute a histogram per hour, then the same query on the continuous aggregate table will only need to process 10 servers * 24 hours * 7 days = 1680 rows of data.

But pre-computed results in the continuous aggregate view will lag behind the latest data, as the materialization only runs at scheduled intervals.  So, both to more cheaply handle out-of-order data and to avoid excessive load, there is typically some refresh lag between the raw data and when it’s materialized.  In fact, this refresh lag is configurable in TimescaleDB, such that the continuous aggregation engine will not materialize data that’s newer than the refresh lag.  

(Slightly more specifically, if we compute aggregations across some time bucket, such as hourly, then each hourly interval has a start time and end time.  TimescaleDB will only materialize data when its corresponding aggregation interval’s end time is older than the refresh lag. So, if we are doing hourly rollups with 30 minute refresh lag, then we’d only perform the materialized aggregation from, say, 2:00am - 3:00am after 2:30pm.)

So, on one hand, using a continuous aggregate view has cut down the amount of data we process at query time by 3600x (i.e., from more than 6 million rows to fewer than 2000).  But, in this view, we’re often missing the last hour or so of data.

While you could just make the refresh lag smaller and smaller to workaround this problem, it comes at the cost of higher and higher load; unless these aggregates are recomputed on every new insert (expensive!), they’re fundamentally always stale.

Introducing Real-Time Aggregation
With real-time aggregation, when you query a continuous aggregate view, rather than just getting the pre-computed aggregate from the materialized table, the query will transparently combine this pre-computed aggregate with raw data from the hypertable that’s yet to be materialized.  And, by combining raw and materialized data in this way, you get accurate and up-to-date results, while still enjoying the speedups that come from pre-computing a large portion of the result.

Let’s return to the example above.  Recall that when we created hourly rollups, we set the refresh lag to 30 minutes, so our continuous aggregate view will lag behind by 30-90 minutes.

But, when querying a view that supports real-time aggregation, the single query as before for hourly data across the past week will process and combine the results from two tables:

Materialized table: 10 servers * (22 hours + 24 hours * 6 days) = 1660 rows
Raw data: 10 servers * 60 seconds * 90 minutes = 54,000 rows  
So now, with these “back of the envelope” calculations, we’ve processed a total of 55,660 rows, still well below the 6 million from before. Moreover, the last 90 minutes of data are more likely to already be memory resident for even better performance, given the database page caching already happening for recent data.

Diagram showing how data moves to a materialized table as it ages and continuous aggregate queries execute, and how real-time aggregates combine this data with newer, not yet materialized data
Real-time aggregates allow you to query your pre-calculated data and newer, not yet materialized "raw" data
The above illustration shows this in practice. The database internally maintains a completion threshold as metadata, which records the point-in-time to which all previous records from the raw table have been materialized.  This completion threshold lags behind the refresh lag we discussed earlier, and gets updated by the database engine whenever a background task updates the materialized view.

(In fact, it’s a bit more complicated given TimescaleDB’s ability to handle late data that gets written after some time region has already been materialized, i.e., behind the completion threshold.  But we’re going to ignore how TimescaleDB tracks invalidation regions in this post.)

So now when processing our query covering the interval , the database engine will conceptually take a UNION ALL between results from the materialized table starting at now() - interval '7 days' up to the completion threshold, with results from the raw table from the completion threshold up to now().

But rather than just describe this behavior, let’s walk through a concrete example and compare our query times without continuous aggregates, with vanilla continuous aggregates, and with real-time aggregation enabled.

These capabilities were developed by Timescale engineers: Sven Klemm, Matvey Arye, Gayathri Ayyapan, David Kohn, and Josh Lockerman.

Testing Real-Time Aggregation
In the following, I’ve created a TimescaleDB 1.7 instance via Timescale Cloud (specially, an “basic-100-compute-optimized” instance with PostgreSQL 12, 4 vCPU, and 100GB SSD storage), and then created the following hypertable:

$ psql postgres://tsdbadmin@tsdb-bb8e760-internal-90d0.a.timescaledb.io:26479/defaultdb?sslmode=require

=> CREATE TABLE cpu (
      time TIMESTAMPTZ,
      hostname TEXT,
      usage_user FLOAT,
      usage_system FLOAT,
      usage_iowait FLOAT
   );

=> SELECT create_hypertable ('cpu', 'time',
      chunk_time_interval => interval '1d');


I’m now going to load the hypertable with 14 days of synthetic data (which is created with the following INSERT statement):

=> INSERT INTO cpu (
   SELECT time, hostname, random(), random(), random()
      FROM generate_series(NOW() - interval '14d', NOW(), '1s') AS time
      CROSS JOIN LATERAL (
         SELECT 'host' || host_id::text AS hostname
            FROM generate_series(0,9) AS host_id
      ) h
   );


Okay, so that inserted 12,096,010 rows of synthetic data into our hypertable of the following format, stretching from 2:32am UTC on April 22 to 2:32am UTC on May 6:

=> SELECT * FROM cpu ORDER BY time DESC LIMIT 3;

             time              | hostname |     usage_user     |    usage_system     |    usage_iowait     
-------------------------------+----------+--------------------+---------------------+---------------------
 2020-05-06 02:32:34.627143+00 | host0    | 0.5378765249290502 |  0.2958572490961302 | 0.10685818344495246
 2020-05-06 02:32:34.627143+00 | host1    | 0.3175958910709298 |  0.7874926624954846 | 0.16615243032654803
 2020-05-06 02:32:34.627143+00 | host2    | 0.4788377981501064 | 0.18277343256546175 |  0.7183967491020162


=> SELECT min(time) AS start, max(time) AS end FROM cpu;

-[ RECORD 1 ]------------------------
start | 2020-04-22 02:32:34.627143+00
end   | 2020-05-06 02:32:34.627143+00


Let’s now create a continuous aggregate view on this table with hourly histograms:

=> CREATE VIEW cpu_1h
   WITH (timescaledb.continuous,
         timescaledb.refresh_lag = '30m',
         timescaledb.refresh_interval = '30m')
   AS
      SELECT
         time_bucket('1 hour', time) AS hour,
         hostname,
         histogram(usage_user, 0.0, 1.0, 5) AS hist_usage_user,
         histogram(usage_system, 0.0, 1.0, 5) AS hist_usage_system,
         histogram(usage_iowait, 0.0, 1.0, 5) AS hist_usage_iowait
      FROM cpu
      GROUP BY hour, hostname;


By default, queries to this view use these real-time aggregation features.  If you want to disable real-time aggregation, set materialized_only = true when creating the view or by later ALTERing the view.  (See API docs here.)

Now, the job scheduling framework will start to asynchronously process this view, which we can see in our informational view.  (You can also manually force the materialization to occur if needed.)  
=> SELECT * FROM timescaledb_information.continuous_aggregate_stats;

- [ RECORD 1 ]
view_name              | cpu_1h
completed_threshold    | 2020-05-06 02:00:00+00
invalidation_threshold | 2020-05-06 02:00:00+00
job_id                 | 1000
last_run_started_at    | 2020-05-06 02:34:08.300524+00
last_successful_finish | 2020-05-06 02:34:09.04923+00
last_run_status        | Success
job_status             | Scheduled
last_run_duration      | 00:00:00.748706
next_scheduled_run     | 2020-05-06 03:04:09.04923+00
total_runs             | 17
total_successes        | 17
total_failures         | 0
total_crashes          | 0



From this data, we see that the materialized view includes data up to 2:00am on May 6, while from above we’ve learned that the raw data goes up to 2:32am.

Let’s try our query directly on the raw table, and use an EXPLAIN ANALYZE to both show the database plan, as well as actually execute the query and collect timing information.  (Note that in many use cases, one would offset queries from now() - <some interval>. But to ensure that we use identical datasets in our subsequent analysis, we explicitly select the interval offset from the dataset’s last timestamp.)

=> EXPLAIN (ANALYZE, COSTS OFF)
   SELECT
      time_bucket('1 hour', time) AS hour,
      hostname,
      histogram(usage_user, 0.0, 1.0, 5) AS hist_usage_user,
      histogram(usage_system, 0.0, 1.0, 5) AS hist_usage_system,
      histogram(usage_iowait, 0.0, 1.0, 5) AS hist_usage_iowait
   FROM cpu
   WHERE time > '2020-05-06 02:32:34.627143+00'::timestamptz - interval '7 days'
   GROUP BY hour, hostname
   ORDER BY hour DESC;

QUERY PLAN             
----------------------------------------------------------------
 Finalize GroupAggregate (actual time=1859.306..1862.331 rows=1690 loops=1)
   Group Key: (time_bucket('01:00:00'::interval, cpu."time")), cpu.hostname
   ->  Gather Merge (actual time=1841.735..1849.604 rows=1881 loops=1)
         Workers Planned: 2
         Workers Launched: 2
         ->  Sort (actual time=1194.162..1194.222 rows=627 loops=3)
               Sort Key: (time_bucket('01:00:00'::interval, cpu."time")) DESC, cpu.hostname
               Sort Method: quicksort  Memory: 25kB
               Worker 0:  Sort Method: quicksort  Memory: 274kB
               Worker 1:  Sort Method: quicksort  Memory: 274kB
               ->  Partial HashAggregate (actual time=1193.198..1193.594 rows=627 loops=3)
                     Group Key: time_bucket('01:00:00'::interval, cpu."time"), cpu.hostname
                     ->  Parallel Custom Scan (ChunkAppend) on cpu (actual time=9.840..716.952 rows=2016000 loops=3)
                           Chunks excluded during startup: 7
                           ->  Parallel Seq Scan on _hyper_1_14_chunk (actual time=14.751..199.098 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_13_chunk (actual time=14.749..201.100 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_12_chunk (actual time=0.025..182.591 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_11_chunk (actual time=0.031..182.812 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_10_chunk (actual time=0.035..183.918 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_9_chunk (actual time=0.019..184.416 rows=864000 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                           ->  Parallel Seq Scan on _hyper_1_8_chunk (actual time=0.823..91.605 rows=386225 loops=2)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                                 Rows Removed by Filter: 45775
                           ->  Parallel Seq Scan on _hyper_1_15_chunk (actual time=0.022..20.277 rows=91550 loops=1)
                                 Filter: ("time" > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))

 Planning Time: 1.917 ms
 Execution Time: 1921.753 ms


Note that TimescaleDB’s constraint exclusion excluded 7 of the chunks from being queried given the WHERE predicate (as the query was for the last 7 days of the 14 day dataset), then processed the query on the remaining 8 chunks (performing a scan over 6,048,000 rows) using two parallel workers.  The query in total took just over 1.9 seconds.

Now let’s try the query on our materialized table, first turning off real-time aggregation just for this experiment:

=> ALTER VIEW cpu_1h set (timescaledb.materialized_only = true);


First, let’s look at the table definition, which defines a SELECT on the materialized view with the specified GROUP BYs.  But we also see that each of the histograms calls “finalize_agg.”  TimescaleDB doesn’t precisely pre-compute and store the exact answer that’s specified in the query, but rather a partial aggregate that is then “finalized” at query time, which will allow for greater parallelization and rebucketing at query time (in a future release).

 \d+ cpu_1h;

                                          View "public.cpu_1h"
      Column       |           Type           | Collation | Nullable | Default | Storage  | Description
-------------------+--------------------------+-----------+----------+---------+----------+-------------
 hour              | timestamp with time zone |           |          |         | plain    |
 hostname          | text                     |           |          |         | extended |
 hist_usage_user   | integer[]                |           |          |         | extended |
 hist_usage_system | integer[]                |           |          |         | extended |
 hist_usage_iowait | integer[]                |           |          |         | extended |

View definition:
 SELECT _materialized_hypertable_2.hour,
    _materialized_hypertable_2.hostname,
    _timescaledb_internal.finalize_agg('histogram(double precision,double precision,double precision,integer)'::text, NULL::name, NULL::name, '{{pg_catalog,float8},{pg_catalog,float8},{pg_catalog,float8},{pg_catalog,int4}}'::name[], _materialized_hypertable_2.agg_3_3, NULL::integer[]) AS hist_usage_user,
    _timescaledb_internal.finalize_agg(...) AS hist_usage_system,
    _timescaledb_internal.finalize_agg(...) AS hist_usage_iowait
   FROM _timescaledb_internal._materialized_hypertable_2
  GROUP BY _materialized_hypertable_2.hour, _materialized_hypertable_2.hostname;


Now let’s run the query with vanilla continuous aggregates enabled:

=> EXPLAIN (ANALYZE, COSTS OFF)
   SELECT * FROM cpu_1h
   WHERE hour > '2020-05-06 02:32:34.627143+00'::timestamptz - interval '7 days'
   ORDER BY hour DESC;

QUERY PLAN
----------------------------------------------------------------
 Sort (actual time=3.218..3.312 rows=1670 loops=1)
   Sort Key: _materialized_hypertable_2.hour DESC
   Sort Method: quicksort  Memory: 492kB
   ->  HashAggregate (actual time=1.943..2.891 rows=1670 loops=1)
         Group Key: _materialized_hypertable_2.hour, _materialized_hypertable_2.hostname
         ->  Custom Scan (ChunkAppend) on _materialized_hypertable_2 (actual time=0.064..0.688 rows=1670 loops=1)
               Chunks excluded during startup: 1
               ->  Seq Scan on _hyper_2_17_chunk (actual time=0.063..0.590 rows=1670 loops=1)
                     Filter: (hour > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))
                     Rows Removed by Filter: 270

 Planning Time: 0.645 ms
 Execution Time: 3.461 ms


Just 4 milliseconds, after a scan of 1,670 rows in the materialized hypertable.  And let’s look at the most recent 3 rows returned for a specific host:

=> SELECT hour, hostname, hist_usage_user
    FROM cpu_1h
    WHERE hour > '2020-05-06 02:32:34.627143+00'::timestamptz - interval '7 days'         
       AND hostname = 'host0'
    ORDER BY hour DESC LIMIT 3;

          hour          | hostname |      hist_usage_user      
------------------------+----------+---------------------------
 2020-05-06 01:00:00+00 | host0    | {0,781,676,712,719,712,0}
 2020-05-06 00:00:00+00 | host0    | {0,736,714,776,689,685,0}
 2020-05-05 23:00:00+00 | host0    | {0,714,759,715,692,720,0}


Note that the last record is from the 1:00am - 2:00am hour.

Now let’s re-enable real-time aggregation and try the same query, first showing how the real-time aggregation is defined as a UNION ALL between the materialized and raw data.

=> ALTER VIEW cpu_1h set (timescaledb.materialized_only = false);

=> \d+ cpu_1h;

                                          View "public.cpu_1h"
      Column       |           Type           | Collation | Nullable | Default | Storage  | Description
-------------------+--------------------------+-----------+----------+---------+----------+-------------
 hour              | timestamp with time zone |           |          |         | plain    |
 hostname          | text                     |           |          |         | extended |
 hist_usage_user   | integer[]                |           |          |         | extended |
 hist_usage_system | integer[]                |           |          |         | extended |
 hist_usage_iowait | integer[]                |           |          |         | extended |

View definition:
 SELECT _materialized_hypertable_2.hour,
    _materialized_hypertable_2.hostname,
    _timescaledb_internal.finalize_agg(...) AS hist_usage_user,
    _timescaledb_internal.finalize_agg(...) AS hist_usage_system,
    _timescaledb_internal.finalize_agg(...) AS hist_usage_iowait
   FROM _timescaledb_internal._materialized_hypertable_2
  WHERE _materialized_hypertable_2.hour < COALESCE(_timescaledb_internal.to_timestamp(_timescaledb_internal.cagg_watermark(1)), '-infinity'::timestamp with time zone)
  GROUP BY _materialized_hypertable_2.hour, _materialized_hypertable_2.hostname
UNION ALL
 SELECT time_bucket('01:00:00'::interval, cpu."time") AS hour,
    cpu.hostname,
    histogram(cpu.usage_user, 0.0::double precision, 1.0::double precision, 5) AS hist_usage_user,
    histogram(cpu.usage_system, 0.0::double precision, 1.0::double precision, 5) AS hist_usage_system,
    histogram(cpu.usage_iowait, 0.0::double precision, 1.0::double precision, 5) AS hist_usage_iowait
   FROM cpu
  WHERE cpu."time" >= COALESCE(_timescaledb_internal.to_timestamp(_timescaledb_internal.cagg_watermark(1)), '-infinity'::timestamp with time zone)
  GROUP BY (time_bucket('01:00:00'::interval, cpu."time")), cpu.hostname;


=> EXPLAIN (ANALYZE, COSTS OFF)
   SELECT * FROM cpu_1h
   WHERE hour > '2020-05-06 02:32:34.627143+00'::timestamptz - interval '7 days'
   ORDER BY hour DESC;

QUERY PLAN               
----------------------------------------------------------------
 Sort (actual time=20.871..21.055 rows=1680 loops=1)
   Sort Key: _materialized_hypertable_2.hour DESC
   Sort Method: quicksort  Memory: 495kB
   ->  Append (actual time=1.842..20.536 rows=1680 loops=1)
         ->  HashAggregate (actual time=1.841..2.789 rows=1670 loops=1)
               Group Key: _materialized_hypertable_2.hour, _materialized_hypertable_2.hostname
               ->  Custom Scan (ChunkAppend) on _materialized_hypertable_2 (actual time=0.105..0.580 rows=1670 loops=1)
                     Chunks excluded during startup: 1
                     ->  Index Scan using _hyper_2_17_chunk__materialized_hypertable_2_hour_idx on _hyper_2_17_chunk (actual time=0.104..0.475 rows=1670 loops=1)
                           Index Cond: ((hour < COALESCE(_timescaledb_internal.to_timestamp(_timescaledb_internal.cagg_watermark(1)), '-infinity'::timestamp with time zone)) AND (hour > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval)))
         ->  HashAggregate (actual time=17.641..17.655 rows=10 loops=1)
               Group Key: time_bucket('01:00:00'::interval, cpu."time"), cpu.hostname
               ->  Custom Scan (ChunkAppend) on cpu (actual time=0.165..12.297 rows=19550 loops=1)
                     Chunks excluded during startup: 14
                     ->  Index Scan using _hyper_1_15_chunk_cpu_time_idx on _hyper_1_15_chunk (actual time=0.163..9.723 rows=19550 loops=1)
                           Index Cond: ("time" >= COALESCE(_timescaledb_internal.to_timestamp(_timescaledb_internal.cagg_watermark(1)), '-infinity'::timestamp with time zone))
                           Filter: (time_bucket('01:00:00'::interval, "time") > ('2020-05-06 02:32:34.627143+00'::timestamp with time zone - '7 days'::interval))

 Planning Time: 3.532 ms
 Execution Time: 22.905 ms



Still very fast at just over 26 milliseconds (scanning 1,670 materialized rows and 19,550 raw rows), and now the results:

=> SELECT hour, hostname, hist_usage_user
   FROM cpu_1h
WHERE hour > '2020-05-06 02:32:34.627143+00'::timestamptz - interval '7 days'
      AND hostname = 'host0'
   ORDER BY hour DESC LIMIT 3;

          hour          | hostname |      hist_usage_user      
------------------------+----------+---------------------------
 2020-05-06 02:00:00+00 | host0    | {0,384,388,385,400,398,0}
 2020-05-06 01:00:00+00 | host0    | {0,781,676,712,719,712,0}
 2020-05-06 00:00:00+00 | host0    | {0,736,714,776,689,685,0}




Unlike when we were processing the materialized table without the real-time aggregation, we have up-to-date data with data from the 2:00 - 3:00am hour.  This is because the materialized table didn’t have data from the last hour, while the real-time aggregation was able to compute that result from the raw data at query time.  You can also notice that there is less data in the final row (namely, each histogram bucket has about half the counts as the prior rows), as this final row was the aggregation of 32 minutes of raw data, not a full hour.

You can also observe these two stages of real-time aggregation in the above query plan:  the materialized hypertable is processed in the first section via Custom Scan (ChunkAppend) on _materialized_hypertable_2, while the underlying raw hypertable is processed in the second section via Custom Scan (ChunkAppend) on cpu, and each processes only before or after the offset specified by the completion threshold (shown with  _timescaledb_internal.cagg_watermark(1) in the plan).

So, in summary:  a complete, up-to-date aggregate over the data, both at a fraction of the latency of querying the raw data, and avoiding the excessive overhead of schemes that update materalizations through per-row or per-statement triggers.

Query Type	Latency	Freshness
Raw Data	1924 ms	Up-to-date
Continuous Aggregates	4 ms	Lags up to 90 minutes
Real-Time Aggregation	26 ms	Up-to-date
Continuous aggregates and real-time aggregation for the win!

Conclusions
What motivated us to build TimescaleDB is the firm belief that time-series use cases need a best-in-class, flexible time-series database, with advanced capabilities specifically designed for time-series workloads.  We developed real-time aggregation for time-series use cases such as devops monitoring, real-time analytics, and IoT, where fast queries over high-volume workloads and accurate, real-time results really matter.

Real-time aggregation joins a number of advanced capabilities in TimescaleDB around data lifecycle management and time-series analytics, including automated data retention, data reordering, native compression, downsampling, and traditional continuous aggregates.

And, there’s still much more to come. Keep an eye out for our much-anticipated TimescaleDB 2.0 release, which introduces horizontal scaling to TimescaleDB for terabyte to petabyte workloads.

Want to check out real-time aggregation?
Ready to dig in? Check out our docs.
Upgrading to TimescaleDB 1.7?  See Timescale Cloud instructions and self-managed instructions.
Brand new to TimescaleDB?  Get started here.
If you have any questions along the way, we’re always available via our community Slack (we’re @mike and @sven , come say hi 👋).

And, if you are interested in keeping up-to-date with future TimescaleDB releases, sign up for our Release Notes.  It’s low-traffic, we promise.

Until next time, keep it real!
