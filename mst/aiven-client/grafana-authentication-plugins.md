---
title: Integrate authentication plugins in Grafana
excerpt: Configure Google, GitHub, or GitLab authentication plugins for Grafana
product: mst
---

# Grafana authentication plugins

Grafana supports multiple authentication plugins, in addition to
built-in username and password authentication.

On Managed Service for TimescaleDB, Grafana supports Google, GitHub, and
GitLab authentication.
You can configure authentication integration using the Aiven command-line client.

## Integrate Google authentication plugin

To integrate Google authentication with Grafana service on Managed
Service for TimecaleDB, you need to create your
[Google OAuth keys][google-oauth-keys], and make a note of your client
ID and client secret.

<procedure>

### Integrating Google authentication plugin

1.  In the Aiven Client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the Grafana service you want to
    integrate:

    ```bash
     avn switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the Grafana service
    that you want to integrate, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

1.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Integrate the plugin with your service using the `<CLIENT_ID>`, and
    `<CLIENT_SECRET>` from your Google developer console:

    ```bash
    avn service update -c auth_google.allowed_domains=<G-SUITE_DOMAIN>\
    -c auth_google.client_id=<CLIENT_ID>\
    -c auth_google.client_secret=<CLIENT_SECRET><SERVICE_NAME>
    ```

1.  Log in to Grafana with your service credentials.

1.  Navigate to `Configuration` → `Plugins` and verify that the
    Google OAuth application is listed as a plugin.

<highlight type="note">
When you allow sign-ups using `-c auth_google.allow_sign_up=true` option, by
default each new user is created with `viewer` permissions, and added to their
own newly created organizations. To specify different permissions, use
`-c user_auto_assign_org_role=ROLE_NAME`. To add all new users to the main
organization, use `-c user_auto_assign_org=true` option.
</highlight>

</procedure>

## Integrate GitHub authentication plugin

To integrate GitHub authentication with Grafana service on Managed Service
for TimecaleDB, you need to create your
[GitHub OAuth application][github-oauth-keys], and make a note of
your client ID and client secret.

<procedure>

### Integrating GitHub authentication plugin

1.  In the Aiven Client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the Grafana service you want to
    integrate:

    ```bash
     avn switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the Grafana service
    that you want to integrate, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

1.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Integrate the plugin with your service using the `<CLIENT_ID>`, and
    `<CLIENT_SECRET>` from your GitHub OAuth application:

    ```bash
    avn service update -c auth_github.client_id=<CLIENT_ID>\
    -c auth_github.client_secret=<CLIENT_SECRET> <SERVICE_NAME>
    
    ```

1.  Log in to Grafana with your service credentials.
1.  Navigate to `Configuration` → `Plugins`. The Plugins page lists
    GitHub OAuth application for the Grafana instance.

<highlight type="note">
When you allow sign-ups using `-c auth_github.allow_sign_up=true` option,
by default each new user is created with `viewer`permission and added to
their own newly created organizations. To specify different permissions,
use `-c user_auto_assign_org_role=ROLE_NAME`. To add all new users
to the main organization, use `-c user_auto_assign_org=true` option.
</highlight>

</procedure>

## Integrate GitLab authentication plugin

To integrate GitLab authentication with Grafana service on Managed
Service for TimecaleDB, you need to create your [GitLab OAuth
application][gitlab-oauth-keys], and make a note of your client ID, client
secret and GitLab groups.

If you use your own instance of GitLab instead of gitlab.com, then you need to
set the following:

*   auth_gitlab.api_url
*   auth_github.auth_url
*   auth_github.token_url

<procedure>

### Integrating GitLab authentication plugin

1.  In the Aiven Client, connect to your
    [Managed Service for TimescaleDB service][aiven-client-mst].

1.  Switch to the project that contains the Grafana service you want to
    integrate:

    ```bash
     avn project switch <PROJECT>
    ```

1.  List the services in the project, and make a note of the Grafana service
    that you want to integrate, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

1.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

1.  Integrate the plugin with your service using the `<CLIENT_ID>`,
    `<CLIENT_SECRET>`, and `<GITLAB_GROUPS>` from your GitLab OAuth application:

    ```bash
    avn service update -c auth_gitlab.client_id=<CLIENT_ID>\
    -c auth_gitlab.client_secret=<CLIENT_SECRET>\
    -c auth_gitlab.allowed_groups=<GITLAB_GROUPS> <SERVICE_NAME>
    
    ```

1.  Log in to Grafana with your service credentials.

1.  Navigate to `Configuration` → `Plugins`. The Plugins page lists
    GitLab OAuth application for the Grafana instance.

<highlight type="note">
When you allow sign-ups using `-c auth_gitlab.allow_sign_up=true` option,
by default each new user is created with `viewer`permission and added to
their own newly created organizations. To specify different permissions,
use `-c user_auto_assign_org_role=ROLE_NAME`. To add all new users
to the main organization, use `-c user_auto_assign_org=true` option.
</highlight>

</procedure>

[aiven-client-mst]: /mst/:currentVersion:/aiven-client/aiven-client-install
[google-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/google/
[github-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/github/
[gitlab-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/gitlab/
