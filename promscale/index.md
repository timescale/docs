# Promscale
Promscale allows you to extract more meaningful insights from your metrics data.
It is an open source long-term store for Prometheus data designed for analytics.
Promscale is built on top of TimescaleDB, and is a horizontally scalable and
operationally mature platform for Prometheus data that uses PromQL and SQL to
allow you to ask any question, create any dashboard, and achieve greater
visibility into your systems.

Promscale has consistently been one of the only long-term stores for Prometheus
data that continues to maintain top performance. It received a 100% compliance
test score each time, with no cross-cutting concerns, from PromLab's [PromQL
Compliance Test Suite][promlabs].

For more information about Promscale, see our [blog post][promscale-blog], or
check out the [demo][promscale-demo]. If you have any questions, you can join
the Promscale channel on the [TimescaleDB Community Slack][slack].

## Promscale architecture
Prometheus writes data to the Promscale Connector using its `remote_write`
interface. The Connector writes data to TimescaleDB. PromQL queries can be
directed to the Connector, or to the Prometheus instance, which then reads data
from the Connector using the `remote_read` interface. The Connector then fetches
data from TimescaleDB. SQL queries can be directed to TimescaleDB directly.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-arch.png" alt="Promscale architecture diagram"/>

For a detailed description of this architecture, see our [design
document][design-doc].


[promscale-blog]: https://blog.timescale.com/blog/promscale-analytical-platform-long-term-store-for-prometheus-combined-sql-promql-postgresql/
[promscale-demo]: https://youtu.be/FWZju1De5lc
[slack]: https://slack.timescale.com/
[promlabs]: https://promlabs.com/promql-compliance-test-results/2020-12-01/promscale
[design-doc]: https://docs.google.com/document/d/1e3mAN3eHUpQ2JHDvnmkmn_9rFyqyYisIgdtgd3D1MHA/edit?usp=sharing
