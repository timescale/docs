---
title: Authentication Failed when launching SAML application
section: troubleshooting
products: [mst]
topics: [authentication]
errors:
  - language: bash
    message: |-
      Authentication Failed
      Login failed.  Please contact your account administrator for more details.
keywords: [authentication, SAML, Okta]
tags: [mst]
---

You might see this error when launching MST SAML application:

   ```bash
   Authentication Failed

   Login failed.  Please contact your account administrator for more details.
   ```

Check Okta authentication in MST console if `Enable IdP login` and
`Enable authentication method` are enabled.
