---
title: stats_agg()
excerpt: A subfamily of hyperfunctions for performing common 1D and 2D statistical analyses
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
summarizes: [api, hyperfunctions, statistical aggregates, stats_agg]
---

import TwoStepAggregation from "versionContent/_partials/_2-step-aggregation.mdx";

# `stats_agg()` functions <tag type="toolkit" content="Toolkit" />

The `stats_agg()` functions are part of the statistical aggregate family of
hyperfunctions. They perform statistical calculations on 1D and 2D continuous
data. Calculations include linear regression, standard deviation, average, and
more.

To make them easier to work with in [window functions][window-functions] and
[continuous aggregates][continuous-aggregates], these functions use the two-step
aggregation pattern.

## Two-step aggregation

<TwoStepAggregation />

## 1D and 2D statistical aggregates

Both one-dimensional (1D) and two-dimensional (2D) aggregates are supported. 1D
aggregates are computed for a single variable. 2D aggregates are computed over
two variables. 2D aggregates are also known as regression aggregates because
they perform linear regression on the two variables.

All 1D aggregates are available for each of the 2D variables separately, the
accessors are denoted by `_y` or `_x` following the accessor name.

<HyperfunctionReference aggregate="stats_agg()" />

## Aggregate function

This is the first step for performing any statistical aggregate calculations.
Use `stats_agg` to create an intermediate aggregate from your data. This
intermediate form can then be used by any accessor on this page to compute a
final result.

## Accessor functions

Accessors operate on the intermediate form produced by the aggregate to give you
a final result.

List the accessors with:

*   Function name
*   Type of accessor (1D or 2D)
*   Function description
*   Whether the function is stable or experimental

Click on a function to get:

*   Parameters
*   Return type
*   Code examples

## Rollup functions

Rollups combine multiple aggregates into a larger aggregate.

## Mutator functions

Mutators

[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[window-functions]: https://www.postgresql.org/docs/current/tutorial-window.html
