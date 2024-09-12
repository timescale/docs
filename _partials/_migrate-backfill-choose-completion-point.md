
When you have uploaded the roles and relational data to your target <Variable name="SERVICE"/>, you write to both
the source and target until you reach completion point. Completion point is the moment when you can safely backfill
time-series data to hypertables in your <Variable name="SERVICE"/> with no data loss. After dual-writes have been
executing for a while, the target hypertable contains data in the following time ranges:

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/hypertable_backfill_consistency.png"
alt="Hypertable dual-write ranges"
/>

- **Late-arriving data**: measurements which have a timestamp in the past, but are not yet written to the target. For
  example from IOT devices with intermittent connectivity issues. The window of late-arriving data is between the
  present moment, and maximum lateness.

- **Consistency range**: the range in which there are no missing writes, and all data has arrived, This is the period
  between `missing writes` and `late-arriving data`.

- **Missing writes**: the period of time in which not all writes have made it into the target hypertable. This period
  starts when the first writer begins dual-writing, and ends when the last writer begins dual-writing.

The length of these ranges is defined by the properties of your app, there is no one-size-fits-all way to do this.

Completion point must be the same type as the `time` column of the hypertables to be backfilled. For instance, a
`TIMESTAMPTZ` time column may be `2025-08-10T12:00:00.00Z`. If your hypertables have different types for the time
column, backfill each hypertable independently using the correct type.  
