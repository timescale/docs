---
api_name: stats_agg()
excerpt: Aggregate statistical data into a statistical aggregate for further analysis
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: statistical aggregates
  type: aggregate
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: aggregate
---

import TwoStepAggregation from "versionContent/_partials/_2-step-aggregation.mdx";

# `stats_agg()` functions

The `stats_agg()` functions are part of the statistical aggregate family of
hyperfunctions. They perform statistical calculations on one- and two-dimensional
continuous
data. Calculations include linear regression, standard deviation, average, and more.

These hyperfunctions the two-step aggregation pattern. They use
`stats_agg()` as their first-step aggregation function.

<TwoStepAggregation />
