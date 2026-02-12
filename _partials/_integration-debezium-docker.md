
1. **Run Zookeeper in Docker**

   In another Terminal window, run the following command:
   ```bash
   docker run -it --rm --name zookeeper -p 2181:2181 -p 2888:2888 -p 3888:3888 quay.io/debezium/zookeeper:3.0
   ```
   Check the output log to see that zookeeper is running.
   
1. **Run Kafka in Docker**

   In another Terminal window, run the following command:
   ```bash
   docker run -it --rm --name kafka -p 9092:9092 --link zookeeper:zookeeper quay.io/debezium/kafka:3.0
   ```
   Check the output log to see that Kafka is running.


1. **Run Kafka Connect in Docker**

   In another Terminal window, run the following command:
   ```bash
   docker run -it --rm --name connect \
   -p 8083:8083 \
   -e GROUP_ID=1 \
   -e CONFIG_STORAGE_TOPIC=accounts \
   -e OFFSET_STORAGE_TOPIC=offsets \
   -e STATUS_STORAGE_TOPIC=storage \
   --link kafka:kafka \
   --link timescaledb:timescaledb \
   quay.io/debezium/connect:3.0
   ``` 
   Check the output log to see that Kafka Connect is running.


1. **Register the Debezium $PG source connector**

   Update the `<properties>` for the `<debezium-user>` you created in your $SELF_LONG instance in the following command. 
   Then run the command in another Terminal window:
   ```bash
   curl -X POST http://localhost:8083/connectors \
   -H "Content-Type: application/json" \
   -d '{
      "name": "timescaledb-connector",  
      "config": {
         "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
         "database.hostname": "timescaledb",
         "database.port": "5432",
         "database.user": "<debezium-user>",
         "database.password": "<debezium-password>",
         "database.dbname" : "postgres",
         "topic.prefix": "accounts",
         "plugin.name": "pgoutput",
         "schema.include.list": "public,_timescaledb_internal",
         "transforms": "timescaledb",
         "transforms.timescaledb.type": "io.debezium.connector.postgresql.transforms.timescaledb.TimescaleDb",
         "transforms.timescaledb.database.hostname": "timescaledb",
         "transforms.timescaledb.database.port": "5432",
         "transforms.timescaledb.database.user": "<debezium-user>",
         "transforms.timescaledb.database.password": "<debezium-password>",
         "transforms.timescaledb.database.dbname": "postgres"
      }
   }'
   ```

1. **Verify `timescaledb-source-connector` is included in the connector list**

   1. Check the tasks associated with `timescaledb-connector`: 
      ```bash
      curl -i -X GET -H "Accept:application/json" localhost:8083/connectors/timescaledb-connector
      ```
      You see something like:
      ```bash
      {"name":"timescaledb-connector","config":
      { "connector.class":"io.debezium.connector.postgresql.PostgresConnector",
      "transforms.timescaledb.database.hostname":"timescaledb",
      "transforms.timescaledb.database.password":"debeziumpassword","database.user":"debezium",
      "database.dbname":"postgres","transforms.timescaledb.database.dbname":"postgres",
      "transforms.timescaledb.database.user":"debezium",
      "transforms.timescaledb.type":"io.debezium.connector.postgresql.transforms.timescaledb.TimescaleDb",
      "transforms.timescaledb.database.port":"5432","transforms":"timescaledb",
      "schema.include.list":"public,_timescaledb_internal","database.port":"5432","plugin.name":"pgoutput",
      "topic.prefix":"accounts","database.hostname":"timescaledb","database.password":"debeziumpassword",
      "name":"timescaledb-connector"},"tasks":[{"connector":"timescaledb-connector","task":0}],"type":"source"}
      ```

1. **Verify `timescaledb-connector` is running**

   1. Open the Terminal window running Kafka Connect. When the connector is active, you see something like the following: 

      ```bash
      2025-04-30 10:40:15,168 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal._hyper_1_1_chunk' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,168 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal.bgw_job_stat' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,175 INFO   Postgres|accounts|streaming  SignalProcessor started. Scheduling it every 5000ms   [io.debezium.pipeline.signal.SignalProcessor]
      2025-04-30 10:40:15,175 INFO   Postgres|accounts|streaming  Creating thread debezium-postgresconnector-accounts-SignalProcessor   [io.debezium.util.Threads]
      2025-04-30 10:40:15,175 INFO   Postgres|accounts|streaming  Starting streaming   [io.debezium.pipeline.ChangeEventSourceCoordinator]
      2025-04-30 10:40:15,176 INFO   Postgres|accounts|streaming  Retrieved latest position from stored offset 'LSN{0/1FCE570}'   [io.debezium.connector.postgresql.PostgresStreamingChangeEventSource]
      2025-04-30 10:40:15,176 INFO   Postgres|accounts|streaming  Looking for WAL restart position for last commit LSN 'null' and last change LSN 'LSN{0/1FCE570}'   [io.debezium.connector.postgresql.connection.WalPositionLocator]
      2025-04-30 10:40:15,176 INFO   Postgres|accounts|streaming  Initializing PgOutput logical decoder publication   [io.debezium.connector.postgresql.connection.PostgresReplicationConnection]
      2025-04-30 10:40:15,189 INFO   Postgres|accounts|streaming  Obtained valid replication slot ReplicationSlot [active=false, latestFlushedLsn=LSN{0/1FCCFF0}, catalogXmin=884]   [io.debezium.connector.postgresql.connection.PostgresConnection]
      2025-04-30 10:40:15,189 INFO   Postgres|accounts|streaming  Connection gracefully closed   [io.debezium.jdbc.JdbcConnection]
      2025-04-30 10:40:15,204 INFO   Postgres|accounts|streaming  Requested thread factory for component PostgresConnector, id = accounts named = keep-alive   [io.debezium.util.Threads]
      2025-04-30 10:40:15,204 INFO   Postgres|accounts|streaming  Creating thread debezium-postgresconnector-accounts-keep-alive   [io.debezium.util.Threads]
      2025-04-30 10:40:15,216 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal.bgw_policy_chunk_stats' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,216 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for 'public.accounts' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,217 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal.bgw_job_stat_history' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,217 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal._hyper_1_1_chunk' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,217 INFO   Postgres|accounts|streaming  REPLICA IDENTITY for '_timescaledb_internal.bgw_job_stat' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns   [io.debezium.connector.postgresql.PostgresSchema]
      2025-04-30 10:40:15,219 INFO   Postgres|accounts|streaming  Processing messages   [io.debezium.connector.postgresql.PostgresStreamingChangeEventSource]
      ```

   1. Watch the events in the accounts topic on your $SELF_LONG instance. 
   
      In another Terminal instance, run the following command:  

      ```bash
      docker run -it --rm --name watcher --link zookeeper:zookeeper --link kafka:kafka quay.io/debezium/kafka:3.0 watch-topic -a -k accounts 
      ```

      You see the topics being streamed. For example:

      ```bash
      status-task-timescaledb-connector-0	{"state":"RUNNING","trace":null,"worker_id":"172.17.0.5:8083","generation":31}
      status-topic-timescaledb.public.accounts:connector-timescaledb-connector	{"topic":{"name":"timescaledb.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009337985}}
      status-topic-accounts._timescaledb_internal.bgw_job_stat:connector-timescaledb-connector	{"topic":{"name":"accounts._timescaledb_internal.bgw_job_stat","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338118}}
      status-topic-accounts._timescaledb_internal.bgw_job_stat:connector-timescaledb-connector	{"topic":{"name":"accounts._timescaledb_internal.bgw_job_stat","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338120}}
      status-topic-accounts._timescaledb_internal.bgw_job_stat_history:connector-timescaledb-connector	{"topic":{"name":"accounts._timescaledb_internal.bgw_job_stat_history","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338243}}
      status-topic-accounts._timescaledb_internal.bgw_job_stat_history:connector-timescaledb-connector	{"topic":{"name":"accounts._timescaledb_internal.bgw_job_stat_history","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338245}}
      status-topic-accounts.public.accounts:connector-timescaledb-connector	{"topic":{"name":"accounts.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338250}}
      status-topic-accounts.public.accounts:connector-timescaledb-connector	{"topic":{"name":"accounts.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338251}}
      status-topic-accounts.public.accounts:connector-timescaledb-connector	{"topic":{"name":"accounts.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338251}}
      status-topic-accounts.public.accounts:connector-timescaledb-connector	{"topic":{"name":"accounts.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338251}}
      status-topic-accounts.public.accounts:connector-timescaledb-connector	{"topic":{"name":"accounts.public.accounts","connector":"timescaledb-connector","task":0,"discoverTimestamp":1746009338251}}
      ["timescaledb-connector",{"server":"accounts"}]	{"last_snapshot_record":true,"lsn":33351024,"txId":893,"ts_usec":1746009337290783,"snapshot":"INITIAL","snapshot_completed":true}
      status-connector-timescaledb-connector	{"state":"UNASSIGNED","trace":null,"worker_id":"172.17.0.5:8083","generation":31}
      status-task-timescaledb-connector-0	{"state":"UNASSIGNED","trace":null,"worker_id":"172.17.0.5:8083","generation":31}
      status-connector-timescaledb-connector	{"state":"RUNNING","trace":null,"worker_id":"172.17.0.5:8083","generation":33}
      status-task-timescaledb-connector-0	{"state":"RUNNING","trace":null,"worker_id":"172.17.0.5:8083","generation":33}
      ```
