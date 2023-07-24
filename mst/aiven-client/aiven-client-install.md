---
title: Aiven Client for Managed Service for TimescaleDB
excerpt: Install and configure Aiven Command Line tool for Managed Service for TimescaleDB.
products: [mst]
---

# Aiven Client for fully managed services

Aiven Client is a command line tool for fully managed services. To use Aiven
Client you need to first create an authentication token and then configure it to
connect to your Managed Service for TimescaleDB using the command line.

## Create an authentication token in Managed Service for TimescaleDB

To connect to Managed Service for TimecaleDB using Aiven Client you need to
create an authentication token.

<Procedure>

### Creating an authentication token in Managed Service for TimescaleDB

1.  Sign in to your Managed Service for TimescaleDB portal.
1.  Click `User Information` in the top right corner.
1.  In the `User Profile` page, navigate to the `Authentication`tab.
1.  Click `Generate Token`.
1.  In the `Generate access token` dialog, type a descriptive name for the
    token and leave the rest of the fields blank.
1.  Copy the generated authentication token and save it.

</Procedure>

## Install the Aiven Client

[Aiven Client][aiven-github] is provided as a Python package, so you can install
it on a Linux, MacOS, or Windows system using `pip`, if you have already
installed Python.

Use this command:

```bash
pip install aiven-client
```

For more information about installing the Aiven Client, see the
[Aiven][aiven-github] documentation.

## Configure Aiven Client to connect to Managed Service for TimescaleDB

To access Managed Service for TimescaleDB with the Aiven Client, you need an
authentication token. Aiven Client uses this authentication token to access your
services on Managed Service for TimescaleDB.

<Procedure>

### Configuring Aiven Client to connect to Managed Service for TimescaleDB

1.  Change to the install directory that contains the configuration files:

    ```bash
    cd ~/.config/aiven/
    ```

1.  Open the `aiven-credentials.json` using any editor and update these
    lines with your Managed Service for TimescaleDB `User email`, and the
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

    This command shows a list of all your projects:

    ```bash
     PROJECT_NAME       DEFAULT_CLOUD            CREDIT_CARD
     =============     =======================   ===================
     project-xxxx      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
     project-yyyy      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
     project-zzzz      timescale-aws-us-east-1   xxxx-xxxx-xxxx-xxxx
    ```

</Procedure>

[aiven-github]: https://github.com/aiven/aiven-client
