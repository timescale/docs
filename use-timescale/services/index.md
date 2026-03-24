---
title: About Tiger Cloud services
excerpt: A Tiger Cloud service is a 100% Postgres database instance that you use as is, or extend with capabilities specific to your business needs. Learn more about services and available features
products: [cloud]
keywords: [services]
cloud_ui:
    path:
        - [services]
---

import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import ServiceIntro from "versionContent/_partials/_services-intro.mdx";

# About $SERVICE_LONGs

<CloudIntro />

<ServiceIntro />

## Learn more about $CLOUD_LONG

Read about $CLOUD_LONG features in the documentation:

*   Create your first [hypertable][hypertables-section].
*   Run your first query using [time_bucket()][time-bucket-info].
*   Trying more advanced time-series functions, starting with
    [gap filling][gap-filling-info] or [real-time aggregates][caggs].

## Keep testing during your free trial

You're now on your way to a great start with $CLOUD_LONG.

You have a $500 credit, 30-day free trial with $CLOUD_LONG to continue to
test your use case. Before the end of your trial, make sure you add your credit
card information. This ensures a smooth transition after your trial period
concludes.

If you have any questions, you can
[join our community Slack group][slack-info]
or [contact us][timescale-support] directly.

## Advanced configuration

$CLOUD_LONG is a versatile hosting service that provides a growing list of
advanced features for your $PG and time-series data workloads.

For more information about customizing your database configuration, see the
[Configuration section][configuration].

<Highlight type="note">

The [$TIMESCALE_DB Terraform provider][timescale_db-terraform-provider]
provides configuration management resources for $CLOUD_LONG. You can use it to
create, rename, resize, delete, and import $SERVICE_SHORTs. For more information about
the supported $SERVICE_SHORT configurations and operations, see the
[Terraform provider documentation][terraform-provider-documentation].

</Highlight>

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[configuration]: /use-timescale/:currentVersion:/configuration/
[gap-filling-info]: /use-timescale/:currentVersion:/query-data/advanced-analytic-queries#gap-filling
[hypertables-section]: /use-timescale/:currentVersion:/hypertables
[slack-info]: https://slack-login.timescale.com
[terraform-provider-documentation]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
[time-bucket-info]: /use-timescale/:currentVersion:/query-data/advanced-analytic-queries#time-bucket
[timescale-support]: https://www.tigerdata.com/contact
[timescale_db-terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/
