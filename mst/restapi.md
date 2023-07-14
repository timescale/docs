---
title: Using REST API in Managed Service for TimescaleDB
excerpt: Use REST API in Managed Service for TimescaleDB for integration and automation
products: [mst]
keywords: [REST API, API, integration]
---

# Using REST API in Managed Service for TimescaleDB

Managed Service for TimescaleDB has an API for integration and automation tasks.
For information about using the endpoints, see the [API Documentation][aiven-api].
MST offers an HTTP API with token authentication and JSON-formatted data. You
can use the API for all the tasks that can be performed using the web console.
To get started you need to first create an authentication token, and then use
the token in the header to use the API endpoints.

<Procedure>

## Creating an authentication token in Managed Service for TimescaleDB

1.  Sign in to your Managed Service for TimescaleDB portal.
1.  Click `User Information` in the top right corner.
1.  In the `User Profile` page, navigate to the `Authentication`tab.
1.  Click `Generate Token`.
1.  In the `Generate access token` dialog, type a descriptive name for the
    token and leave the rest of the fields blank.
1.  Copy the generated authentication token and save it.

</Procedure>

<Procedure>

### Using cURL to get your details

1.  Set the environment variable `MST_API_TOKEN` with the access token that you generate:

    ```bash
    export MST_API_TOKEN="access token"
    ```

1.  To get the details about the current user session using the `/me` endpoint:

    ```bash
    curl -s -H "Authorization: aivenv1 $MST_API_TOKEN" https://api.aiven.io/v1/me|json_pp
    ```

    The output looks similar to this:

    ```bash
    {
        "user": {
            "auth": [],
            "create_time": "string",
            "features": { },
            "intercom": {},
            "invitations": [],
            "project_membership": {},
            "project_memberships": {},
            "projects": [],
            "real_name": "string",
            "state": "string",
            "token_validity_begin": "string",
            "user": "string",
            "user_id": "string"
        }
    }
    ```

</Procedure>

[aiven-api]: https://api.aiven.io/doc/
