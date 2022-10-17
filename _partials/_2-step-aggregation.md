## Two-step aggregation

This group of functions uses the two-step aggregation pattern.

Rather than calculating the final result in one step, you first create an
intermediate aggregate by using the aggregate function.

Then, use any of the accessors on the intermediate aggregate to calculate a
final result. You can also roll up multiple intermediate aggregates with the
rollup functions.

The two-step aggregation pattern has several advantages:

1.  More efficient because multiple accessors can reuse the same aggregate
1.  Easier to reason about performance, because aggregation is separate from
    final computation
1.  Easier to understand when calculations can be rolled up into larger
    intervals, especially in window functions and continuous aggregates
1.  Can perform retrospective analysis even when underlying data is dropped, because
    the intermediate aggregate stores extra information not available in the
    final result

To learn more, see the [blog post on two-step
aggregates][blog-two-step-aggregates].

[blog-two-step-aggregates]: https://www.timescale.com/blog/how-postgresql-aggregation-works-and-how-it-inspired-our-hyperfunctions-design-2/
