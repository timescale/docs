# Data analysis and hyperfunctions
TimescaleDB provides hyperfunctions to help you query and analyze time-series
data quickly.

*   [Learn about hyperfunctions][about-hyperfunctions]: what they are, why you
    should use them, and how they work
*   Install the [Toolkit extension][install-toolkit] to access all TimescaleDB
    hyperfunctions
*   Write your data analysis queries more simply with
    [function pipelines][about-pipelines]
*   Use hyperfunctions to perform several types of data analysis:
    *   Count the number of distinct items in your dataset with the
        [approximate count distinct functions][hyperfunctions-approx-count-distinct]
    *   Calculate descriptive statistics, including standard deviation,
        kurtosis, and covariance, with the
        [statistical aggregate functions][hyperfunctions-stats-agg]
    *   Calculate time-weighted averages for unevenly sampled data with the
        [time-weighted average functions][hyperfunctions-time-weighted-averages]
    *   Work with data that has gaps using the
        [gapfilling and interpolation functions][hyperfunctions-gapfilling]
    <!-- Add when downsampling graduates from experimental
        *   Downsample data with the
            [downsampling functions][hyperfunctions-downsampling]
    -->
    *   Calculate percentiles with the
        [approximate percentile functions][hyperfunctions-approximate-percentile]
    *   Analyze counter and gauge data with the
        [counter and gauge aggregation functions][hyperfunctions-counteragg]
    <!-- Add when frequency graduates from experimental
        *   Find the frequency of values and analyze data in state fields with the
            [frequency analysis functions][hyperfunctions-frequency]
    -->

<highlight type="note">
Some hyperfunctions are included with TimescaleDB by default. To get additional
hyperfunctions, 
[install the Timescale Toolkit extension](/timescaledb/latest/how-to-guides/hyperfunctions/install-toolkit/).
To see which functions are included by default, see the
[list of hyperfunctions](timescaledb/latest/how-to/guides/hyperfunctions/list-of-hyperfunctions/).
</highlight>

For more information about hyperfunctions, read the
[hyperfunctions blog post][hyperfunctions-blog].

[about-hyperfunctions]: /how-to-guides/hyperfunctions/about-hyperfunctions
[about-pipelines]: /how-to-guides/hyperfunctions/function-pipelines
[hyperfunctions-approx-count-distinct]: /how-to-guides/hyperfunctions/approx-count-distincts
[hyperfunctions-approximate-percentile]: /how-to-guides/hyperfunctions/percentile-approx/approximate-percentile/
[hyperfunctions-blog]: https://blog.timescale.com/blog/time-series-analytics-for-postgresql-introducing-the-timescale-analytics-project/
[hyperfunctions-counteragg]: /how-to-guides/hyperfunctions/counter-aggregation/counter-aggs/
[hyperfunctions-gapfilling]: /how-to-guides/hyperfunctions/gapfilling-interpolation
[hyperfunctions-stats-agg]: /how-to-guides/hyperfunctions/stats-aggs/
[hyperfunctions-time-weighted-averages]: /how-to-guides/hyperfunctions/time-weighted-averages
[install-toolkit]: /how-to-guides/hyperfunctions/install-toolkit
