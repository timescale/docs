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

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

When your database reaches 90% of your allocated disk, memory, or CPU resources,
an automated message with the text above is sent to your email address.

You can resolve this by logging in to your $MST_LONG
account and changing your plan to increase your available resources:

<Procedure>

1. From the $MST_LONG Dashboard, select the $MST_SERVICE_SHORT that you want to increase resources
for.
1. Click `Service Settings` > `Service summary` > `Change Plan`. 
1. Select the suitable plan and click `Change Plan`.

</Procedure>

If you run out of resources regularly, you might need to consider using your
resources more efficiently. Consider enabling [hypercore][setup-hypercore],
using [continuous aggregates][caggs], or
[configuring data retention][data-retention] to reduce the amount of
resources your database uses.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates
[data-retention]: /use-timescale/:currentVersion:/data-retention
[setup-hypercore]: /use-timescale/:currentVersion:/hypercore/real-time-analytics-in-hypercore/
