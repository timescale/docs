---
title: About TimescaleDB hyperfunctions
excerpt: Learn about TimescaleDB hyperfunctions that help with data analysis
keywords: [hyperfunctions, Toolkit, analytics]
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# About Timescale hyperfunctions

Timescale hyperfunctions are a specialized set of functions that allow you to
analyze time-series data. You can use hyperfunctions to analyze anything you
have stored as time-series data, including IoT devices, IT systems, marketing
analytics, user behavior, financial metrics, and cryptocurrency.

Hyperfunctions allow you to perform critical time-series queries quickly,
analyze time-series data, and extract meaningful information. They aim to
identify, build, and combine all of the functionality SQL needs to perform
time-series analysis into a single extension.

Some hyperfunctions are included in the default TimescaleDB product. For
additional hyperfunctions, you need to install the
[Timescale Toolkit][install-toolkit] PostgreSQL extension.

## Hyperfunctions available with TimescaleDB and Timescale Toolkit

Here is a list of all the hyperfunctions provided by Timescale. Hyperfunctions
marked 'Toolkit' require an installation of Timescale Toolkit. Hyperfunctions
marked 'experimental' are still under development.

<Experimental />

### Approximate count distincts

<hyperfunctionTable
 hyperfunctionFamily='approximate count distinct'
 includeExperimental
 sortByType
/>

### Saturating math

<hyperfunctionTable
 hyperfunctionFamily='saturating math'
 includeExperimental
 sortByType
/>

### Statistical aggregates

<hyperfunctionTable
 hyperfunctionFamily='statistical aggregates'
 includeExperimental
 sortByType
/>

### Financial analysis

<hyperfunctionTable
    hyperfunctionFamily='financial analysis'
    includeExperimental
    sortByType
/>

### Gapfilling and interpolation

<hyperfunctionTable
 hyperfunctionFamily='gapfilling and interpolation'
 includeExperimental
 sortByType
/>

### Percentile approximation

<hyperfunctionTable
 hyperfunctionFamily='percentile approximation'
 includeExperimental
 sortByType
/>

### Metric aggregation

<hyperfunctionTable
 hyperfunctionFamily='metric aggregation'
 includeExperimental
 sortByType
/>

### Time-weighted averages

<hyperfunctionTable
 hyperfunctionFamily='time-weighted averages'
 includeExperimental
 sortByType
/>

### Downsample

<hyperfunctionTable
 hyperfunctionFamily='downsample'
 includeExperimental
 sortByType
/>

### Frequency analysis

<hyperfunctionTable
 hyperfunctionFamily='frequency analysis'
 includeExperimental
 sortByType
/>

For more information about each of the API calls listed in this table, see our [hyperfunction API documentation][api-hyperfunctions].

## Function pipelines

Function pipelines are an experimental feature, designed to radically improve
the developer ergonomics of analyzing data in PostgreSQL and SQL, by applying
principles from functional programming and popular tools like Python's Pandas,
and PromQL.

SQL is the best language for data analysis, but it is not perfect, and at times
can get quite unwieldy. For example, this query gets data from the last day from
the measurements table, sorts the data by the time column, calculates the delta
between the values, takes the absolute value of the delta, and then takes the
sum of the result of the previous steps:

```SQL
SELECT device_id,
sum(abs_delta) as volatility
FROM (
 SELECT device_id,
abs(val - lag(val) OVER last_day) as abs_delta
FROM measurements
WHERE ts >= now()-'1 day'::interval) calc_delta
GROUP BY device_id;
```

You can express the same query with a function pipeline like this:

```SQL
SELECT device_id,
 timevector(ts, val) -> sort() -> delta() -> abs() -> sum() as volatility
FROM measurements
WHERE ts >= now()-'1 day'::interval
GROUP BY device_id;
```

Function pipelines are completely SQL compliant, meaning that any tool that
speaks SQL is able to support data analysis using function pipelines.

For more information about how function pipelines work, read our
[blog post][blog-function-pipelines].

## Toolkit feature development

Timescale Toolkit features are developed in the open. As features are developed
they are categorized as experimental, beta, stable, or deprecated. This
documentation covers the stable features, but more information on our
experimental features in development can be found in the
[Toolkit repository][gh-docs].

## Contribute to Timescale Toolkit

We want and need your feedback! What are the frustrating parts of analyzing
time-series data? What takes far more code than you feel it should? What runs
slowly, or only runs quickly after many rewrites? We want to solve
community-wide problems and incorporate as much feedback as possible.

*   Join the [discussion][gh-discussions].
*   Check out the [proposed features][gh-proposed].
*   Explore the current [feature requests][gh-requests].
*   Add your own [feature request][gh-newissue].

[api-hyperfunctions]: /api/:currentVersion:/hyperfunctions
[blog-function-pipelines]: https://www.timescale.com/blog/function-pipelines-building-functional-programming-into-postgresql-using-custom-operators/
[gh-discussions]: https://github.com/timescale/timescale-analytics/discussions
[gh-docs]: https://github.com/timescale/timescale-analytics/tree/main/docs
[gh-newissue]: https://github.com/timescale/timescale-analytics/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=
[gh-proposed]: https://github.com/timescale/timescale-analytics/labels/proposed-feature
[gh-requests]: https://github.com/timescale/timescale-analytics/labels/feature-request
[install-toolkit]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/install-toolkit
