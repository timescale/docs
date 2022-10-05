---
title: Invalid RelayState when attempting an IdP-initiated
auth flow
section: troubleshooting
products: [mst]
topics: [authentication]
errors:
  - language: bash
    message: |- 
    Invalid RelayState
keywords: [authentication, SAML, Okta]
tags: [mst]
---

If you get the `Invalid RelayState`, then you are attempting an IdP-initiated
auth flow, for example by clicking the MST SAML app from the Okta UI.
Previously, MST did not support IdP-initiated flows, but now it is possible if
you set the `Default RelayState` in Okta to the corresponding console of your
account.
