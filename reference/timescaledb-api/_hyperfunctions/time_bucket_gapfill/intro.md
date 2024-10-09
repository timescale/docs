---
section: hyperfunction
subsection: time_bucket_gapfill()
---

Aggregate data by time interval, while filling in gaps of missing data.

`time_bucket_gapfill` works similarly to [`time_bucket`][time_bucket], but adds
gapfilling capabilities. The other functions in this group must be used in the
same query as `time_bucket_gapfill`. They control how missing values are treated.

<Highlight type="important">
`time_bucket_gapfill` must be used as a top-level expression in a query or
subquery. You cannot, for example, nest `time_bucket_gapfill` in another
function (such as `round(time_bucket_gapfill(...))`), or cast the result of the
gapfilling call. If you need to cast, you can use `time_bucket_gapfill` in a
subquery, and let the outer query do the type cast.
</Highlight>

[time_bucket]: /api/latest/hyperfunctions/time_bucket/
