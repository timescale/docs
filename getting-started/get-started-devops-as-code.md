---
title: "DevOps as code with Tiger Cloud"
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

# DevOps as code with Tiger Cloud

[$CLOUD_LONG REST API][rest-api-reference] is a comprehensive RESTful API you use to manage Tiger Cloud resources including VPCs, services, and read 
replicas.

This page shows you how to set up secure authentication for the TigerData Cloud REST API and create your first service. 

## Prerequisites

<RESTPrereqs />

* Install [curl][curl].


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

1. **Configure the API endpoint**

    Set the base URL in your environment:
    
    ```bash
    export API_BASE_URL="https://console.cloud.timescale.com/public/api/v1"
    ```

1. **Test your authenticated connection to $CLOUD_LONG REST API by listing services**
 
    ```bash
    curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services" \
      -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)" \
      -H "Content-Type: application/json"
    ```

    This call returns something like:
    - No services:
      ```terminaloutput
      []%
      ```
    - One or more services:
   
      ```terminaloutput
      [{"service_id":"a59clooxoe","project_id":"c8nmagk8zh","name":"events",
      "region_code":"eu-central-1","service_type":"TIMESCALEDB",
      "created":"2025-09-09T08:37:15.816443Z","paused":false,"status":"READY",
      "resources":[{"id":"101228","spec":{"cpu_millis":500,"memory_gbs":2,"volume_type":""}}],
      "metadata":{"environment":"DEV"},"endpoint":{"host":"oh.yeah.tsdb.cloud.timescale.com",
      "port":12345}}] 
      ```

</Procedure>


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
      $CLOUD_LONG creates a production environment for you. You see something like:
      ```terminaloutput
      {
        "service_id":"asdfasdfasdf","project_id":"asdasdfasf","name":"my-first-service",
        "region_code":"us-east-1", "service_type":"TIMESCALEDB",
        "created":"2025-09-09T09:24:31.997767396Z", "paused":false,"status":"READY",
        "resources":[{"id":"101240",
        "spec":{"cpu_millis":1000,"memory_gbs":4,"volume_type":""}}],
        "metadata":{"environment":"PROD"},
        "endpoint":{"host":"oh.yeah.tsdb.cloud.timescale.com","port":123435},
        "initial_password":"very-secret",
        "ha_replicas":{"sync_replica_count":0,"replica_count":1}
      } 
      ```
       

   2. Save `service_id` from the response to a variable:
      ```bash
      # Extract service_id from the JSON response
      export SERVICE_ID="service_id-from-response"
      ```

1. **Change the environment from production to development**

  ```bash
  curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services/${SERVICE_ID}" \
    -H "Authorization: Basic $(echo -n "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" | base64)" \
    -H "Content-Type: application/json" \
    -d '{"environment": "DEV"}' 
  ```
  You see something like:
  ```terminaloutput
  {                                          
    "message": "Environment set successfully"
  }
  ```

</Procedure>

And that is it, you are ready to use the [$CLOUD_LONG REST API][rest-api-reference] to manage your 
$SERVICE_SHORTs in $CLOUD_LONG.

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
[curl]: https://curl.se/