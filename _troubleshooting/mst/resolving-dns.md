---
title: Problem resolving DNS
section: troubleshooting
products: [mst]
topics: [networking]
keywords: [networking]
tags: [tshoot, connect, networking]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

Managed Service for TimescaleDB services require a DNS record. When you launch a
new service the DNS record is created, and it can take some time for the new
name to propagate to DNS servers around the world.

If you move an existing service to a new Cloud provider or region, the service
is rebuilt in the new region in the background. When the service has been
rebuilt in the new region, the DNS records are updated. This could cause a short
interruption to your service while the DNS changes are propagated.

If you are unable to resolve DNS, wait a few minutes and try again.
