import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";

[$REST_LONG][rest-api-reference] is a comprehensive RESTful API you use to manage $CLOUD_LONG resources
including VPCs, $SERVICE_SHORTs, and read replicas.

This page shows you how to set up secure authentication for the $REST_LONG and create your first $SERVICE_SHORT.

## Prerequisites

<RESTPrereqs />

* Install [curl][curl].


## Configure secure authentication

$REST_LONG uses HTTP Basic Authentication with access keys and secret keys. All API requests must include
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

1. **Test your authenticated connection to $REST_LONG by listing the $SERVICE_SHORTs in the current $PROJECT_LONG**

    ```bash
    curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services" \
      -u "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" \
      -H "Content-Type: application/json"
    ```

   This call returns something like:
    - No $SERVICE_SHORTs:
      ```terminaloutput
      []%
      ```
    - One or more $SERVICE_SHORTs:

      ```terminaloutput
      [{"service_id":"a59clooxoe","project_id":"c8nmagk8zh","name":"events",
      "region_code":"eu-central-1","addons":"time-series",
      "created":"2025-09-09T08:37:15.816443Z","paused":false,"status":"READY",
      "resources":[{"id":"101228","spec":{"cpu_millis":500,"memory_gbs":2,"volume_type":""}}],
      "metadata":{"environment":"DEV"},"endpoint":{"host":"oh.yeah.tsdb.cloud.timescale.com",
      "port":12345}}] 
      ```

</Procedure>


## Create your first $SERVICE_LONG

Create a new $SERVICE_SHORT using the $REST_LONG:

<Procedure>

1. **Create a $SERVICE_SHORT using the POST endpoint**
   ```bash
   curl -X POST "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services" \
     -u "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
        "name": "my-first-service",  
        "addons": ["time-series"],  
        "region_code": "us-east-1",  
        "replica_count": 1,  
        "cpu_millis": "1000",
        "memory_gbs": "4"
        }'
   ```
   $CLOUD_LONG creates a Development environment for you. That is, no delete protection, high-availability, spooling or
   read replication. You see something like:
   ```terminaloutput
   {
     "service_id":"asdfasdfasdf","project_id":"asdasdfasf","name":"my-first-service",
     "region_code":"us-east-1", "addons":"time-series",
     "created":"2025-09-09T09:24:31.997767396Z", "paused":false,"status":"READY",
     "resources":[{"id":"101240",
     "spec":{"cpu_millis":1000,"memory_gbs":4,"volume_type":""}}],
     "metadata":{"environment":"PROD"},
     "endpoint":{"host":"oh.yeah.tsdb.cloud.timescale.com","port":123435},
     "initial_password":"very-secret",
     "ha_replicas":{"sync_replica_count":0,"replica_count":1}
   } 
   ```

1. Save `service_id` from the response to a variable:

   ```bash
   # Extract service_id from the JSON response
   export SERVICE_ID="service_id-from-response"
   ```

1. **Check the configuration for the $SERVICE_SHORT**

  ```bash
    curl -X GET "${API_BASE_URL}/projects/${TIGERDATA_PROJECT_ID}/services/${SERVICE_ID}" \
      -u "${TIGERDATA_ACCESS_KEY}:${TIGERDATA_SECRET_KEY}" \
      -H "Content-Type: application/json"
  ```
You see something like:
  ```terminaloutput
    {"service_id":"tgrservice","project_id":"tgrproject","name":"my-first-service","region_code":"us-east-1",
    "addons":"time-series","created":"2025-09-30T12:08:54.438785Z","paused":false,"status":"READY",
    "resources":[{"id":"102879","spec":{"cpu_millis":1000,"memory_gbs":4,"volume_type":""}}],
    "metadata":{"environment":"DEV"},"endpoint":{"host":"ohhhh.yeahhhhh.tsdb.cloud.timescale.com","port":33867},
    "ha_replicas":{"sync_replica_count":0,"replica_count":1}}  
  ```

</Procedure>

And that is it, you are ready to use the [$REST_LONG][rest-api-reference] to manage your
$SERVICE_SHORTs in $CLOUD_LONG.

## Security best practices

Follow these security guidelines when working with the $REST_LONG:

- **Credential management**
    - Store API credentials as environment variables, not in code
    - Use credential rotation policies for production environments
    - Never commit credentials to version control systems

- **Network security**
    - Use HTTPS endpoints exclusively for API communication
    - Implement proper certificate validation in your HTTP clients

- **Data protection**
    - Use secure storage for service connection strings and passwords
    - Implement proper backup and recovery procedures for created services
    - Follow data residency requirements for your region


[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[curl]: https://curl.se/