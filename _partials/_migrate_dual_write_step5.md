## 5. Determine the completion point `T`

After dual-writes have been executing for a while, the target hypertable will
contain data in three time ranges: missing writes, late-arriving data, and the
"consistency" range

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/hypertable_backfill_consistency.png"
alt="Hypertable dual-write ranges"
/>

### Missing writes

If the application is made up of multiple writers, and these writers did not
all simultaneously start writing into the target hypertable, there is a period
of time in which not all writes have made it into the target hypertable. This
period starts when the first writer begins dual-writing, and ends when the last
writer begins dual-writing.

### Late-arriving data

Some applications have late-arriving data: measurements which have a timestamp
in the past, but which weren't written yet (for example from devices which had
intermittent connectivity issues). The window of late-arriving data is between
the present moment, and the maximum lateness.

### Consistency range

The consistency range is the range in which there are no missing writes, and in
which all data has arrived, that is between the end of the missing writes range
and the beginning of the late-arriving data range.

The length of these ranges is defined by the properties of the application,
there is no one-size-fits-all way to determine what they are.

### Completion point

The completion point `T` is an arbitrarily chosen time in the consistency range.
It is the point in time to which data can safely be backfilled, ensuring that
there is no data loss.

The completion point should be expressed as the type of the `time` column of
the hypertables to be backfilled. For instance, if you're using a `TIMESTAMPTZ`
`time` column, then the completion point may be `2023-08-10T12:00:00.00Z`. If
you're using a `BIGINT` column it may be `1695036737000`.

If you are using a mix of types for the `time` columns of your hypertables, you
must determine the completion point for each type individually, and backfill
each set of hypertables with the same type independently from those of other
types.

