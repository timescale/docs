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

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Get started with Tiger Cloud REST API

[Tiger Cloud REST API][rest-api-reference] is a comprehensive RESTful API you use to manage Tiger Cloud resources including VPCs, services, and read 
replicas.

This page shows you how to set up secure authentication for the TigerData Cloud REST API and create your first service. 

## Prerequisites

<IntegrationPrereqs />

- An [API access key and secret key][rest-api-credentials]
- A Command-line tool for REST calls
- Network connectivity to Tiger Cloud REST API endpoints

## Configure secure authentication

Tiger Cloud REST API uses HTTP Basic Authentication with access keys and secret keys. All API requests must include
proper authentication headers.

<Procedure> 

1. **Set up API credentials**

   1. Obtain your API credentials from the TigerData Cloud console:
      - Access key: Your unique API identifier
      - Secret key: Your private authentication token
      - Project ID: The identifier for your TigerData project

   2. Store credentials securely using environment variables:
      ```bash
      export TIGERDATA_ACCESS_KEY="your-access-key"
      export TIGERDATA_SECRET_KEY="your-secret-key"
      export TIGERDATA_PROJECT_ID="your-project-id"
      ```

   3. Verify credential format:
      - Access key format: Alphanumeric string (typically 10-20 characters)
      - Secret key format: Base64-encoded string (typically 40-60 characters)
      - Project ID format: Alphanumeric string starting with project prefix

1. **Configure API endpoint**

    Set the appropriate API base URL for your environment:
    
    ```bash
    # Development environment (recommended for testing)
    export API_BASE_URL="https://console.dev.timescale.com/public/api/v1"
    
    # Production environment
    export API_BASE_URL="https://console.cloud.timescale.com/public/api/v1"
    
    # Local development (if running local server)
    export API_BASE_URL="http://localhost:8080/public/api/v1"
    ```

1. **Test API connection**

    Verify your authentication setup and API connectivity before creating resources.

1. **Perform health check**

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
     "region_code": "google-europe-west1",
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