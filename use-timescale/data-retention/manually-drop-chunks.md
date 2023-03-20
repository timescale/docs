---
title: Manually drop chunks
excerpt: Manually drop chunks from your hypertable based on time value
products: [cloud, mst, self_hosted]
keywords: [data retention]
tags: [drop, delete]
---

# Manually drop chunks

Drop chunks manually by time value. For example, drop chunks containing data
older than 30 days.

<Highlight type="note">
Dropping chunks manually is a one-time operation. To automatically drop chunks
as they age, set up a
[data retention policy](/use-timescale/latest/data-retention/create-a-retention-policy/).
</Highlight>

## Drop chunks older than a certain date

To drop chunks older than a certain date, use the [`drop_chunks`][drop_chunks]
function. Supply the name of the hypertable to drop chunks from, and a time
interval beyond which to drop chunks.

For example, to drop chunks with data older than 24 hours:

```sql
SELECT drop_chunks('conditions', INTERVAL '24 hours');
```

## Drop chunks between 2 dates

You can also drop chunks between 2 dates. For example, drop chunks with data
between 3 and 4 months old.

Supply a second `INTERVAL` argument for the `newer_than` cutoff:

```sql
SELECT drop_chunks(
  'conditions',
  older_than => INTERVAL '3 months',
  newer_than => INTERVAL '4 months'
)
```

## Drop chunks in the future

You can also drop chunks in the future, for example to correct data with the
wrong timestamp. For example, to drop all chunks more than 3 months in the
future:

```sql
SELECT drop_chunks(
  'conditions',
  newer_than => now() + INTERVAL '3 months'
);
```

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks/
