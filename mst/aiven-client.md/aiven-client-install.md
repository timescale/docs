---
title: Aiven Client for Managed Service for TimescaleDB
excerpt: Install and configure Aiven Command Line tool for fully managed services on AWS, Azure, or GCP.
product: mst
---

# Aiven Client for fully managed services

Aiven Client is a command line tool for fully managed services. To use Aiven
Client you need to first create an authentication token and then configure it to
connect to your Managed Service for TimescaleDB using the command line.

## Create an authentication token in Managed Service for TimescaleDB

To connect to Managed Service for TimecaleDB using Aiven Client you need to
create an authentication token.

<procedure>

1.  Login to your [Managed Service for TimescaleDB portal][mst-login].
1.  Click `User Information` icon in the top left corner.
1.  In the `User Profile` page, select the `Authentication`tab.
1.  Click the `Generate Token` button.
1.  In the `Generate access token` dialog, type a descriptive name for the
    token and leave the rest of the fields blank.
1.  Copy the generated authentication token and save it.

</procedure>

## Install and configure Aiven Client and connect to Managed Service for TimescaleDB

The `avn` utility is a Python package, so you can install using pip on a Linux,
MacOS or a Windows system which have Python installed, using `pip install
aiven-client` command. For more information about installaing Aiven Client, see
the [getting started][aiven-github] documentation.

### Configuring Aiven Client to connect to Managed Service for TimescaleDB

To access Managed Service for TimescaleDB you need an authentication token.
Aiven Client uses this authentication token to access your services on Managed
Service for TimescaleDB.

<procedure>

1.  Change to the install directory that contains the configuration files:

    ```bash
    cd ~/.config/aiven/
    ```

1.  Open the `aiven-credentials.json` using any editor and update the following
    lines with your Managed Service for TimescaleDB `User email` and
    `authentication token` that you generated :

    ```bash
    {
    "auth_token": "ABC1+123...TOKEN==",
    "user_email": "your.email@timescale.com"
    }
    ```

1.  Save the `aiven-credentials.json` file.

1.  To verify that you can access your services on Managed Service for
    TimescaleDB, type:

    ```bash
    avn project list
    ```

    A list of all your projects appear.

    ```bash
    
    PROJECT_NAME       DEFAULT_CLOUD            CREDIT_CARD
    =================  =======================  ===========
    internal-90d0      timescale-aws-us-east-1  N/A
    timescale-6d6d     timescale-aws-us-east-1  N/A
    docs-test-project  timescale-aws-us-east-1  N/A
    ```

</procedure>

[aiven-github]: https://github.com/aiven/aiven-client
[mst-login]: https://portal.managed.timescale.com