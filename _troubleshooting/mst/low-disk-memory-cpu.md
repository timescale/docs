---
title: Service is running low on disk, memory, or CPU
section: troubleshooting
products: [mst]
topics: [performance]
errors:
  - language: text
    message: |-
      Your Managed Service for TimescaleDB service, in project "ExampleAccount", is running low on
      CPU. Running low on CPU affects performance and could affect service
      availability. Please either optimize your usage pattern or reduce the workload,
      and consider upgrading to a larger plan to avoid service outage.
keywords: [disk, memory, CPU]
tags: [mst, resources, performance, disk, memory, CPU]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

When your database reaches 90% of your allocated disk, memory, or CPU resources,
an automated message with the text above is sent to your email address.

You can resolve this by logging in to your Managed Service for TimescaleDB
account and increasing your available resources. From the Managed Service for
TimescaleDB Dashboard, select the service that you want to increase resources
for. In the `Overview` tab, locate the `Service Plan` section, and click
`Upgrade Plan`. Select the plan that suits your requirements, and click
`Upgrade` to enable the additional resources.

If you run out of resources regularly, you might need to consider using your
resources more efficiently. Consider enabling [compression][howto-compression],
using [continuous aggregates][howto-caggs], or
[configuring data retention][howto-dataretention] to reduce the amount of
resources your database uses.

[howto-compression]: /use-timescale/:currentVersion:/compression
[howto-caggs]: /use-timescale/:currentVersion:/continuous-aggregates
[howto-dataretention]: /use-timescale/:currentVersion:/data-retention
