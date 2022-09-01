---
title: Statistical aggregates
excerpt: Calculate aggregate statistics from a dataset
keywords: [statistics, hyperfunctions, toolkit]
---

import TwoStepAggregation from "versionContent/_partials/_2-step-aggregation.mdx";

# Statistical aggregates

This family of functions

This family of common statistical aggregates are defined in the [TimescaleDB
Toolkit][install-toolkit] PostgreSQL extension. They provide a superset of
functionality available with [PostgreSQL statistical aggregates][pg-stats-aggs].

In order to make them easier to work with in window functions and [continuous
aggregates][continuous-aggs-concept], they are provided in a slightly different
form from those in PostgreSQL. Their design follows the [two-step aggregates
design pattern][two-step-aggs-concept] well established in the Toolkit for
efficiency and flexibility. An aggregate exposes a summary form to the user
which can then have multiple accessors.

Both one-dimensional (1D) and two-dimensional (2D) aggregates are supported. 1D
aggregates are computed for a single variable. 2D aggregates are computed over
two variables. 2D aggregates are also known as regression aggregates because
they perform linear regression on the two variables.

All 1D aggregates are available for each of the 2D variables separately, the
accessors are denoted by `_y` or `_x` following the accessor name.

<TwoStepAggregation />
