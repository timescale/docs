---
title: Time-weighted averages and integrals
excerpt: Calculate time-weighted averages and integrals for unevenly sampled data
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, time-weighted]
---

# Time-weighted averages and integrals

Time weighted averages and integrals are used in cases where a time series is
not evenly sampled. Time series data points are often evenly spaced, for
example every 30 seconds, or every hour. But sometimes data points are recorded
irregularly, for example if a value has a large change, or changes quickly.
Computing an average using data that is not evenly sampled is not always useful.

For example, if you have a lot of ice cream in freezers, you need to make sure
the ice cream stays within a 0-10℉ (-20 to -12℃) temperature range. The
temperature in the freezer can vary if folks are opening and closing the door,
but the ice cream only has a problem if the temperature is out of range
for a long time. You can set your sensors in the freezer to sample every five
minutes while the temperature is in range, and every 30 seconds while the
temperature is out of range. If the results are generally stable, but with some
quick moving transients, an average of all the data points weights the transient
values too highly. A time weighted average weights each value by the duration
over which it occurred based on the points around it, producing much more
accurate results.

Time weighted integrals are useful when you need a time-weighted sum of
irregularly sampled data. For example, if you bill your users based on
irregularly sampled CPU usage, you need to find the total area under the graph
of their CPU usage. You can use a time-weighted integral to find the total
CPU-hours used by a user over a given time period.

*   For more information about how time-weighted averages work, read our
    [time-weighted averages blog][blog-timeweight].
*   For more information about time-weighted average API calls, see the
    [hyperfunction API documentation][hyperfunctions-api-timeweight].

[blog-timeweight]: https://blog.timescale.com/blog/what-time-weighted-averages-are-and-why-you-should-care/
[hyperfunctions-api-timeweight]: /api/:currentVersion:/hyperfunctions/time-weighted-calculations/time_weight/
