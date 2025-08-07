* This works for $PG databases only as source. $TIMESCALE_DB is not yet supported.

* The source must be running $PG 13 or later.

* Schema changes must be co-ordinated.

  Make compatible changes to the schema in your $SERVICE_LONG first, then make
  the same changes to the source $PG instance.

* Ensure that the source $PG instance and the target $SERVICE_LONG have the same extensions installed.

  $LIVESYNC_CAP does not create extensions on the target. If the table uses
  column types from an extension, first create the extension on the
  target $SERVICE_LONG before syncing the table.

* There is WAL volume growth on the source $PG instance during large table copy.

* Continuous Aggregates Invalidation

  LiveSync uses `session_replication_role=replica` during data replication,
  which prevents table triggers from firing. This includes the internal
  triggers that mark continuous aggregates as invalid when underlying data
  changes.

  If you have continuous aggregates on your target database, they do not
  automatically refresh for data inserted during the migration. This limitation
  only applies to data below the continuous aggregate's materialization
  watermark (i.e. backfilled data). New rows synced above the continuous
  aggregate watermark are used correctly when refreshing.

  This can lead to:

  - Missing data in continuous aggregates for the migration period.
  - Stale aggregate data.
  - Queries returning incomplete results.

  If the continuous aggregate exists in the source database, best
  practice is to add it to the live-sync publication. If it only exists on the
  target database, manually refresh the continuous aggregate using the `force`
  option of [refresh_continuous_aggregate][refresh-caggs].

[refresh-caggs]: /api/latest/continuous-aggregates/refresh_continuous_aggregate/#sample-usage
