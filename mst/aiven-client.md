---
title: Aiven Client for Managed Service for TimescaleDB
excerpt: A Command Line tool for Managed Service for TimescaleDB.
products: [mst]
---

# Aiven Client for Managed Service for TimescaleDB

You can use Aiven Client to manage your services on Managed Service for TimescaleDB.

You can use the Aiven Client tool to:

*   Connect to Managed Service for TimescaleDB
*   Create a service
*   Create a fork
*   Add authentication plugins to your attached Grafana service

Instructions: 

- [Install and configure the Aiven client]
- [Fork services with Aiven client]
- [Configure Grafana authentication plugins]
- [Send Grafana emails]
- [Create a read-only replica with the Aiven client]

## Install and configure the Aiven client

Aiven Client is a command line tool for fully managed services. To use Aiven Client, you first need to create an authentication token. Then, you configure the client to connect to your Managed Service for TimescaleDB using the command line.

### Create an authentication token in Managed Service for TimescaleDB

To connect to Managed Service for TimescaleDB using Aiven Client, create an authentication token.

<Procedure>

#### Creating an authentication token in Managed Service for TimescaleDB

1.  In [MST Portal][mst-login], click `User Information` in the top right corner.
1.  In the `User Profile` page, navigate to the `Authentication`tab.
1.  Click `Generate Token`.
2.  In the `Generate access token` dialog, type a descriptive name for the token. Leave the rest of the fields blank.
3.  Copy the generated authentication token and save it.

</Procedure>

### Install the Aiven Client

The [Aiven Client][aiven-github] is provided as a Python package. If you've already installed Python, you can install the client on Linux, MacOS, or Windows systems using `pip`:

```bash
pip install aiven-client
```

For more information about installing the Aiven Client, see the [Aiven][aiven-github] documentation.

### Configure Aiven Client to connect to Managed Service for TimescaleDB

To access Managed Service for TimescaleDB with the Aiven Client, you need an authentication token. Aiven Client uses this to access your services on Managed Service for TimescaleDB.

<Procedure>

#### Configuring Aiven Client to connect to Managed Service for TimescaleDB

1.  Change to the install directory that contains the configuration files:

    ```bash
    cd ~/.config/aiven/
    ```

1.  Open the `aiven-credentials.json` using any editor and update these lines with your Managed Service for TimescaleDB `User email`, and the
    `authentication token` that you generated :

    ```bash
    {
      "auth_token": "ABC1+123...TOKEN==",
      "user_email": "your.email@timescale.com"
    }
    ```

1.  Save the `aiven-credentials.json` file.

1.  To verify that you can access your services on Managed Service for TimescaleDB, type:

    ```bash
    avn project list
    ```

    This command shows a list of all your projects:

    ```bash
     PROJECT_NAME       DEFAULT_CLOUD            CREDIT_CARD
     =============     =======================   ===================
     project-xxxx      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
     project-yyyy      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
     project-zzzz      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
    ```

</Procedure>

## Fork services with Aiven client

When you a fork a service, you create an exact copy of the service, including
the underlying database. You can use a fork of your service to:

*   Create a development copy of your production environment.
*   Set up a snapshot to analyze an issue or test an upgrade.
*   Create an instance in a different cloud, geographical location, or under
    a different plan.

For more information about projects, plans, and other details about
services,see [Services][about-mst].

<Procedure>

### Creating a fork of your service

1.  In the Aiven client, connect to your
    [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the service you want to fork:

    ```bash
     avn project switch <PROJECT>
    ```

3.  List the services in the project, and make a note of the service that you want to fork, listed under `SERVICE_NAME` column in the output.

    ```bash
     avn service list
    ```

4.  Get the details of the service that you want to fork:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Create the fork:

    ```bash
    avn service create <NAME_OF_FORK> --project <PROJECT_ID>\
    -t <SERVICE_TYPE> --plan <PLAN> --cloud <CLOUD_NAME>\
    -c service_to_fork_from=<NAME_OF_SERVICE_TO_FORK>
    ```

</Procedure>

### Example

To create a fork named `grafana-fork` for a service named `grafana` with these parameters:

*   PROJECT_ID: `project-fork`
*   CLOUD_NAME: `timescale-aws-us-east-1`
*   PLAN_TYPE: `dashboard-1`

```bash
   avn service create grafana-fork --project project-fork -t grafana --plan dashboard-1 --cloud timescale-aws-us-east-1  -c service_to_fork_from=grafana
```

You can switch to `project-fork` and view the newly created `grafana-fork` using:

```bash
   avn service list
```

## Configure Grafana authentication plugins

Grafana supports multiple authentication plugins, in addition to built-in username and password authentication.

On Managed Service for TimescaleDB, Grafana supports Google, GitHub, and GitLab authentication. You can configure authentication integration using the Aiven command-line client.

### Integrating the Google authentication plugin

To integrate Google authentication with Grafana service on Managed Service for TimescaleDB, you need to create your
[Google OAuth keys][google-oauth-keys]. Copy your client ID and client secret to a secure location.

<Procedure>

#### How to integrate the Google authentication plugin

1.  In the Aiven Client, connect to your
    [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the Grafana service you want to integrate:

    ```bash
     avn switch <PROJECT>
    ```

3.  List the services in the project. Make a note of the Grafana service that you want to integrate, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

4.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Integrate the plugin with your service using the `<CLIENT_ID>` and `<CLIENT_SECRET>` from your Google developer console:

    ```bash
    avn service update -c auth_google.allowed_domains=<G-SUITE_DOMAIN>\
    -c auth_google.client_id=<CLIENT_ID>\
    -c auth_google.client_secret=<CLIENT_SECRET><SERVICE_NAME>
    ```

6.  Log in to Grafana with your service credentials.

7.  Navigate to `Configuration` → `Plugins` and verify that the Google OAuth application is listed as a plugin.

<Highlight type="note">
When you allow sign-ups using the `-c auth_google.allow_sign_up=true` option, by default each new user is created with `viewer` permissions and added to their own newly created organizations. To specify different permissions, use `-c user_auto_assign_org_role=ROLE_NAME`. To add all new users to the main organization, use the  `-c user_auto_assign_org=true` option.
</Highlight>

</Procedure>

### Integrating the GitHub authentication plugin

To integrate GitHub authentication with Grafana service on Managed Service
for TimescaleDB, you need to create your [GitHub OAuth application][github-oauth-keys]. Store your client ID and client secret in a secure location.

<Procedure>

#### How to integrate the GitHub authentication plugin

1.  In the Aiven Client, connect to your [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the Grafana service you want to integrate:

    ```bash
     avn switch <PROJECT>
    ```

3.  List the services in the project, and make a note of the Grafana service
    that you want to integrate, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

4.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Integrate the plugin with your service using the `<CLIENT_ID>`, and
    `<CLIENT_SECRET>` from your GitHub OAuth application:

    ```bash
    avn service update -c auth_github.client_id=<CLIENT_ID>\
    -c auth_github.client_secret=<CLIENT_SECRET> <SERVICE_NAME>
    
    ```

6.  Log in to Grafana with your service credentials.
7.  Navigate to `Configuration` → `Plugins`. The Plugins page lists
    GitHub OAuth application for the Grafana instance.

<Highlight type="note">
When you allow sign-ups using the `-c auth_github.allow_sign_up=true` option, by default each new user is created with `viewer`permission and added to their own newly created organizations. To specify different permissions, use `-c user_auto_assign_org_role=ROLE_NAME`. To add all new users to the main organization, use the `-c user_auto_assign_org=true` option.
</Highlight>

</Procedure>

### Integrating the GitLab authentication plugin

To integrate the GitLab authentication with Grafana service on Managed Service for TimescaleDB, you need to create your [GitLab OAuth
application][gitlab-oauth-keys]. Copy  your client ID, client secret, and GitLab groups name to a secure location.

If you use your own instance of GitLab instead of gitlab.com, then you need to set the following:

*   auth_gitlab.api_url
*   auth_github.auth_url
*   auth_github.token_url

<Procedure>

#### How to integrate the GitLab authentication plugin

1.  In the Aiven Client, connect to your [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the Grafana service you want to integrate:

    ```bash
     avn project switch <PROJECT>
    ```

3.  List the services in the project. Note the Grafana service that you want to integrate, listed under `SERVICE_NAME` column in the output.

    ```bash
     avn service list
    ```

4.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Integrate the plugin with your service using the `<CLIENT_ID>`, `<CLIENT_SECRET>`, and `<GITLAB_GROUPS>` from your GitLab OAuth application:

    ```bash
    avn service update -c auth_gitlab.client_id=<CLIENT_ID>\
    -c auth_gitlab.client_secret=<CLIENT_SECRET>\
    -c auth_gitlab.allowed_groups=<GITLAB_GROUPS> <SERVICE_NAME>
    
    ```

6.  Log in to Grafana with your service credentials.

7.  Navigate to `Configuration` → `Plugins`. The Plugins page lists GitLab OAuth application for the Grafana instance.

<Highlight type="note">
When you allow sign-ups using the `-c auth_gitlab.allow_sign_up=true` option, by default each new user is created with `viewer`permission and added to their own newly created organizations. To specify different permissions, use `-c user_auto_assign_org_role=ROLE_NAME`. To add all new users to the main organization, use the `-c user_auto_assign_org=true` option.
</Highlight>

</Procedure>

## Send Grafana emails

Use the Aiven client to configure the Simple Mail Transfer Protocol (SMTP) server settings and send emails from Managed Service for
TimescaleDB for Grafana. This includes invite emails, reset password emails, and alert messages.

### Prerequisites

Before you begin, make sure you have:

*   (Optional): Made a note of these values in the SMTP server:
    `IP or hostname`, `SMTP server port`, `Username`, `Password`,
    `Sender email address`, and `Sender name`.

<Procedure>

### Configuring the SMTP server for Grafana service

1.  In the Aiven client, connect to your [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the Grafana service you want to integrate:

    ```bash
     avn project switch <PROJECT>
    ```

3.  List the services in the project. Note the Grafana service that you want to configure, listed under `SERVICE_NAME` column in the
    output.

    ```bash
     avn service list
    ```

4.  Get the details of the service that you want to integrate:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Configure the Grafana service using the SMTP values:

    ```bash
       avn service update --project <PROJECT> <SERVICE_NAME>\
       -c smtp_server.host=smtp.example.com \
       -c smtp_server.port=465 \
       -c smtp_server.username=emailsenderuser \
       -c smtp_server.password=emailsenderpass \
       -c smtp_server.from_address="grafana@yourcompany.com"
    ```

6.  [](#)<Optional /> Review all available custom options, and configure:

    ```bash
       avn service types -v
    ```

You can now send emails for your Grafana service on MST.

</Procedure>

## Create a read-only replica with Aiven client

Read-only replicas enable you to perform read-only queries against the replica and reduce the load on the primary server. They are also a
good way to optimize query response times across different geographical locations. You can achieve this by placing the replicas in different regions or even different cloud providers.

<Procedure>

### Creating a read-only replica of your service

1.  In the Aiven client, connect to your [Managed Service for TimescaleDB service][Install and configure the Aiven client].

2.  Switch to the project that contains the TimescaleDB service you want to create a read-only replica for:

    ```bash
    avn project switch <PROJECT>
    ```

3.  List the services in the project. Note the service for which you will create a read-only replica. You can find it listed under the `SERVICE_NAME` column in the output:

    ```bash
    avn service list
    ```

4.  Get the details of the service that you want to fork:

    ```bash
    avn service get <SERVICE_NAME>
    ```

5.  Create a read-only replica:

    ```bash
    avn service create <NAME_OF_REPLICA> --project <PROJECT_ID>\
    -t pg --plan <PLAN_TYPE> --cloud timescale-aws-us-east-1\
    -c pg_read_replica=true\
    -c service_to_fork_from=<NAME_OF_SERVICE_TO_FORK>\
    -c pg_version=11 -c variant=timescale
    ```

</Procedure>

### Example

To create a fork named `replica-fork` for a service named `timescaledb` with
these parameters:

*   PROJECT_ID: `fork-project`
*   CLOUD_NAME: `timescale-aws-us-east-1`
*   PLAN_TYPE: `timescale-basic-100-compute-optimized`

```bash
avn service create replica-fork --project fork-project\
-t pg --plan timescale-basic-100-compute-optimized\
--cloud timescale-aws-us-east-1 -c pg_read_replica=true\
-c service_to_fork_from=timescaledb -c\
pg_version=11 -c variant=timescale
```

You can switch to `project-fork` and view the newly created `replica-fork` using:

```bash
avn service list
```

[aiven-github]: https://github.com/aiven/aiven-client
[google-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/google/
[github-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/github/
[gitlab-oauth-keys]: https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-security/configure-authentication/gitlab/
[about-mst]: /mst/:currentVersion:/about-mst/
[Install and configure the Aiven client]: /mst/:currentVersion:/aiven-client/#install-and-configure-the-aiven-client
[Fork services with Aiven client]: /mst/:currentVersion:/aiven-client/#fork-services-with-aiven-client
[Configure Grafana authentication plugins]: /mst/:currentVersion:/aiven-client/#configure-grafana-authentication-plugins
[Send Grafana emails]: /mst/:currentVersion:/aiven-client/#send-grafana-emails
[Create a read-only replica with the Aiven client]: /mst/:currentVersion:/aiven-client/#create-a-read-only-replica-with-aiven-client

[Fork services with Aiven client]: /mst/:currentVersion:/aiven-client/#fork-services-with-aiven-client
[Configure Grafana authentication plugins]: /mst/:currentVersion:/aiven-client/#configure-grafana-authentication-plugins
[Send Grafana emails]: /mst/:currentVersion:/aiven-client/#send-grafana-emails
[mst-login]:https://portal.managed.timescale.com/login
