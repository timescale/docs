---
title: "Set up Tiger Cloud REST API and create your first service"
excerpt: "Configure secure authentication and create a new database service using the Tiger Cloud REST API"
keywords:
  - authentication
  - service creation
  - API setup
  - security
tags:
  - setup
  - security
  - services
  - authentication
---

import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";

# Get started with Tiger Cloud REST API

[$CLOUD_LONG REST API][rest-api-reference] is a comprehensive RESTful API you use to manage Tiger Cloud resources including VPCs, services, and read 
replicas.

This page shows you how to set up secure authentication for the TigerData Cloud REST API and create your first service. 

## Prerequisites

<RESTPrereqs />
- A Command-line tool for REST calls
- Network connectivity to Tiger Cloud REST API endpoints

## Configure secure authentication

$CLOUD_LONG REST API uses HTTP Basic Authentication with access keys and secret keys. All API requests must include
proper authentication headers.

<Procedure> 

1. **Set up API credentials**

    1. In $CONSOLE [copy your project ID][get-project-id] and store it securely using an environment variable:
   
      ```bash
      export TIGERDATA_PROJECT_ID="your-project-id"
      ```

   1. In $CONSOLE [create your client credentials][create-client-credentials] and store them securely using environment variables:

      ```bash
      export TIGERDATA_ACCESS_KEY="Public key"
      export TIGERDATA_SECRET_KEY="Secret key"
      ```

1. **Configure API endpoint**

    Set the API base URL for your environment:
    
    ```bash
    export API_BASE_URL="https://console.cloud.timescale.com/public/api/v1"
    ```

1. **Perform health check and test your connection to $CLOUD_LONG REST API**

    Test the API connection using a simple health check request:

    ```bash
    curl -X GET "${API_BASE_URL}/healthcheck" \
      -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)"
    ```
    
    Expected response:
    ```json
    {
      "status": "healthy",
      "timestamp": "2024-01-15T10:30:00Z"
    }
    ```

1. **Validate authentication**

    Test authentication by listing existing services:
    
    ```bash
    curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services" \
      -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)" \
      -H "Content-Type: application/json"
    ```

</Procedure>

Successful authentication returns a JSON array of services (may be empty for new projects).

## Create your first service

Create a new database service using the Tiger Cloud REST API with secure configuration.

<Procedure>

1. **Define the service creation payload in a JSON file**
   ```bash
   cat > service-config.json << 'EOF'
   {
     "name": "my-first-service",
     "service_type": "TIMESCALEDB",
     "region_code": "us-east-1",
     "replica_count": 1,
     "cpu_millis": 1000,
     "memory_gbs": 4
   }
   EOF
   ```

1. **Submit service creation request**

   1. Create the service using the POST endpoint:
      ```bash
      curl -X POST "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services" \
        -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)" \
        -H "Content-Type: application/json" \
        -d @service-config.json
      ```

   2. Save the service ID from the response:
      ```bash
      # Extract service_id from the JSON response
      export SERVICE_ID="extracted-service-id-from-response"
      ```

    The API returns HTTP 202 (Accepted) for service creation requests, indicating the operation is asynchronous.

1. **Monitor service creation progress**

   1. Check service status periodically:
      ```bash
      curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services/${SERVICE_ID}" \
        -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)" \
        -H "Content-Type: application/json"
      ```

   2. Wait for status to change from `CONFIGURING` to `READY`:
      - `QUEUED`: Service creation request is queued
      - `CONFIGURING`: Service is being provisioned
      - `READY`: Service is available for use
      - `UNSTABLE`: Service encountered issues during creation

    Service creation typically completes within 5-10 minutes depending on the configuration.

</Procedure>

## Security best practices

Follow these security guidelines when working with the Tiger Cloud REST API:

- **Credential management**
  - Store API credentials as environment variables, not in code
  - Use credential rotation policies for production environments
  - Limit credential scope to minimum required permissions
  - Never commit credentials to version control systems

- **Network security**
  - Use HTTPS endpoints exclusively for API communication
  - Implement proper certificate validation in your HTTP clients
  - Consider IP allowlisting for production API access
  - Monitor API access logs for suspicious activity

- **Access control**
  - Create dedicated service accounts for automated API access
  - Use principle of least privilege for API key permissions
  - Regularly audit and review API access patterns
  - Implement proper session management for interactive applications

- **Data protection**
  - Encrypt sensitive data before API transmission when applicable
  - Use secure storage for service connection strings and passwords
  - Implement proper backup and recovery procedures for created services
  - Follow data residency requirements for your region


[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials