---
title: Tiger Cloud REST API reference
excerpt: A comprehensive RESTful API for managing Tiger Cloud resources including VPCs, services, and read replicas.
tags: [REST]
products: [cloud]
---

# $REST_LONG reference

A comprehensive RESTful API for managing $CLOUD_LONG resources including VPCs, services, and read replicas.

## Overview

**API Version:** 1.0.0  
**Base URL:** `https://console.cloud.tigerdata.com/public/api/v1`

## Authentication

The $REST_LONG uses HTTP Basic Authentication. Include your access key and secret key in the Authorization header.

### Basic Authentication
```http
Authorization: Basic <base64(access_key:secret_key)>
```

### Example
```bash
# Using cURL
curl -X GET "https://console.cloud.tigerdata.com/public/api/v1/projects/{project_id}/services" \
  -H "Authorization: Basic $(echo -n 'your_access_key:your_secret_key' | base64)"
```

## Service Management

You use this endpoint to create a Tiger Cloud service with one of more of the following addons:

- `time-series`: a Tiger Cloud service optimized for real-time analytics. For time-stamped data like events,
  prices, metrics, sensor readings, or any information that changes over time.
- `ai`: a Tiger Cloud service instance with vector extensions.

To have multiple addons when you create a new service, set `"addons": ["time-series", "ai"]`. To create a 
vanilla Postgres instance, set `addons` to an empty list `[]`.

### List All Services

```http
GET /projects/{project_id}/services
```

Retrieve all services within a project.

**Response:** `200 OK`
```json
[
  {
    "service_id": "p7zm9wqqii",
    "project_id": "jz22xtzemv",
    "name": "my-production-db",
    "region_code": "eu-central-1",
    "service_type": "TIMESCALEDB",
    "status": "READY",
    "created": "2024-01-15T10:30:00Z",
    "paused": false,
    "resources": [
      {
        "id": "resource-1",
        "spec": {
          "cpu_millis": 1000,
          "memory_gbs": 4,
          "volume_type": "gp2"
        }
      }
    ],
    "endpoint": {
      "host": "my-service.com",
      "port": 5432
    }
  }
]
```

### Create a Service

```http
POST /projects/{project_id}/services
```

Create a new Tiger Cloud service. This is an asynchronous operation.

**Request Body:**
```json
{
  "name": "test-2",
  "addons": ["time-series"],
  "region_code": "eu-central-1",
  "cpu_millis": 1000,
  "memory_gbs": 4
}
```

**Response:** `202 Accepted`
```json
{
  "service_id": "p7zm9wqqii",
  "project_id": "jz22xtzemv",
  "name": "test-2",
  "region_code": "eu-central-1",
  "service_type": "TIMESCALEDB",
  "created": "2025-09-04T20:46:46.265680278Z",
  "paused": false,
  "status": "READY",
  "resources": [
      {
          "id": "100927",
          "spec": {
              "cpu_millis": 1000,
              "memory_gbs": 4,
              "volume_type": ""
          }
      }
  ],
  "metadata": {
      "environment": "PROD"
  },
  "endpoint": {
      "host": "p7zm8wqqii.jz4qxtzemv.tsdb.cloud.timescale.com",
      "port": 35482
  },
  "initial_password": "oamv8ch9t4ar2j8g"
}
```

**Service Types:**
- `TIMESCALEDB`: a Tiger Cloud service instance optimized for real-time analytics service For time-stamped data like events,
   prices, metrics, sensor readings, or any information that changes over time
- `POSTGRES`: a vanilla Postgres instance
- `VECTOR`: a Tiger Cloud service instance with vector extensions

### Get a Service

```http
GET /projects/{project_id}/services/{service_id}
```

Retrieve details of a specific service.

**Response:** `200 OK`
```json
{
  "service_id": "p7zm9wqqii",
  "project_id": "jz22xtzemv",
  "name": "test-2",
  "region_code": "eu-central-1",
  "service_type": "TIMESCALEDB",
  "created": "2025-09-04T20:46:46.26568Z",
  "paused": false,
  "status": "READY",
  "resources": [
      {
          "id": "100927",
          "spec": {
              "cpu_millis": 1000,
              "memory_gbs": 4,
              "volume_type": ""
          }
      }
  ],
  "metadata": {
      "environment": "DEV"
  },
  "endpoint": {
      "host": "p7zm8wqqii.jz4qxtzemv.tsdb.cloud.timescale.com",
      "port": 35482
  }
}
```

**Service Status:**
- `QUEUED`: Service creation is queued
- `DELETING`: Service is being deleted
- `CONFIGURING`: Service is being configured
- `READY`: Service is ready for use
- `DELETED`: Service has been deleted
- `UNSTABLE`: Service is in an unstable state
- `PAUSING`: Service is being paused
- `PAUSED`: Service is paused
- `RESUMING`: Service is being resumed
- `UPGRADING`: Service is being upgraded
- `OPTIMIZING`: Service is being optimized

### Delete a Service

```http
DELETE /projects/{project_id}/services/{service_id}
```

Delete a specific service. This is an asynchronous operation.

**Response:** `202 Accepted`

### Resize a Service

```http
POST /projects/{project_id}/services/{service_id}/resize
```

Change CPU and memory allocation for a service.

**Request Body:**
```json
{
  "cpu_millis": 2000,
  "memory_gbs": 8
}
```

**Response:** `202 Accepted`

### Update Service Password

```http
POST /projects/{project_id}/services/{service_id}/updatePassword
```

Set a new master password for the service.

**Request Body:**
```json
{
  "password": "a-very-secure-new-password"
}
```

**Response:** `204 No Content`

### Set Service Environment

```http
POST /projects/{project_id}/services/{service_id}/setEnvironment
```

Set the environment type for the service.

**Request Body:**
```json
{
  "environment": "PROD"
}
```

**Environment Values:**
- `PROD`: Production environment
- `DEV`: Development environment

**Response:** `200 OK`
```json
{
    "message": "Environment set successfully"
}
```

### Configure High Availability

```http
POST /projects/{project_id}/services/{service_id}/setHA
```

Change the HA configuration for a service. This is an asynchronous operation.

**Request Body:**
```json
{
  "replica_count": 1
}
```

**Response:** `202 Accepted`

### Stop a Service

```http
POST /projects/{project_id}/services/{service_id}/stop
```

Stop a running service. This is an asynchronous operation.

**Response:** `202 Accepted`
```json
{
  "service_id": "p7zm9wqqii",
  "project_id": "jz22xtzemv",
  "name": "test-2",
  "region_code": "eu-central-1",
  "service_type": "TIMESCALEDB",
  "created": "2025-09-04T20:46:46.26568Z",
  "paused": false,
  "status": "PAUSING",
  "resources": [
      {
          "id": "100927",
          "spec": {
              "cpu_millis": 1000,
              "memory_gbs": 4,
              "volume_type": ""
          }
      }
  ],
  "endpoint": {
      "host": "p7zm8wqqii.jz4qxtzemv.tsdb.cloud.timescale.com",
      "port": 35482
  }
}
```

### Start a Service

```http
POST /projects/{project_id}/services/{service_id}/start
```

Start a stopped service. This is an asynchronous operation.

**Response:** `202 Accepted`
```json
{
  "service_id": "p7zm9wqqii",
  "project_id": "jz22xtzemv",
  "name": "test-2",
  "region_code": "eu-central-1",
  "service_type": "TIMESCALEDB",
  "created": "2025-09-04T20:46:46.26568Z",
  "paused": false,
  "status": "RESUMING",
  "resources": [
      {
          "id": "100927",
          "spec": {
              "cpu_millis": 1000,
              "memory_gbs": 4,
              "volume_type": ""
          }
      }
  ],
  "endpoint": {
      "host": "p7zm8wqqii.jz4qxtzemv.tsdb.cloud.timescale.com",
      "port": 35482
  }
}
```

### Connection Pooler Management

#### Enable Connection Pooler

```http
POST /projects/{project_id}/services/{service_id}/enablePooler
```

Activate the connection pooler for a service.

**Response:** `200 OK`
```json
{
  "message": "Connection pooler enabled successfully"
}
```

#### Disable Connection Pooler

```http
POST /projects/{project_id}/services/{service_id}/disablePooler
```

Deactivate the connection pooler for a service.

**Response:** `200 OK`
```json
{
  "message": "Connection pooler disabled successfully"
}
```

### Fork a Service

```http
POST /projects/{project_id}/services/{service_id}/forkService
```

Create a new, independent service by taking a snapshot of an existing one.

**Request Body:**
```json
{
    "name": "fork-test2",
    "region_code": "eu-central-1",
    "cpu_millis": 1000,
    "memory_gbs": 4
}
```

**Response:** `202 Accepted`
```json
{
    "service_id": "otewd3pem2",
    "project_id": "jz22xtzemv",
    "name": "fork-test2",
    "region_code": "eu-central-1",
    "service_type": "TIMESCALEDB",
    "created": "2025-09-04T20:54:09.53380732Z",
    "paused": false,
    "status": "READY",
    "resources": [
        {
            "id": "100929",
            "spec": {
                "cpu_millis": 1000,
                "memory_gbs": 4,
                "volume_type": ""
            }
        }
    ],
    "forked_from": {
        "project_id": "jz22xtzemv",
        "service_id": "p7zm9wqqii",
        "is_standby": false
    },
    "initial_password": "ph33bl5juuri5gem"
}
```

## Read Replica Sets

Manage read replicas for improved read performance.

### List Read Replica Sets

```http
GET /projects/{project_id}/services/{service_id}/replicaSets
```

Retrieve all read replica sets associated with a primary service.

**Response:** `200 OK`
```json
[
  {
    "id": "l5alxb3s2g",
    "name": "replica-set-test2",
    "status": "active",
    "nodes": 1,
    "cpu_millis": 1000,
    "memory_gbs": 4,
    "endpoint": {
        "host": "l5alxb3s2g.jz4qxtzemv.tsdb.cloud.timescale.com",
        "port": 38448
    },
    "connection_pooler": {
        "endpoint": {
            "host": "l5alxb3s2g.jz4qxtzemv.tsdb.cloud.timescale.com",
            "port": 38543
        }
    },
    "metadata": {
        "environment": "DEV"
    }
  }
]
```

**Replica Set Status:**
- `creating`: Replica set is being created
- `active`: Replica set is active and ready
- `resizing`: Replica set is being resized
- `deleting`: Replica set is being deleted
- `error`: Replica set encountered an error

### Create a Read Replica Set

```http
POST /projects/{project_id}/services/{service_id}/replicaSets
```

Create a new read replica set. This is an asynchronous operation.

**Request Body:**
```json
{
  "name": "replica-set-test2",
  "cpu_millis": 1000,
  "memory_gbs": 4,
  "nodes": 1
}
```

**Response:** `202 Accepted`
```json
{
  "id": "dsldm715t2",
  "name": "replica-set-test2",
  "status": "active",
  "nodes": 1,
  "cpu_millis": 1000,
  "memory_gbs": 4
}
```

### Delete a Read Replica Set

```http
DELETE /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}
```

Delete a specific read replica set. This is an asynchronous operation.

**Response:** `202 Accepted`

### Resize a Read Replica Set

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/resize
```

Change resource allocation for a read replica set. This operation is async.

**Request Body:**
```json
{
  "cpu_millis": 500,
  "memory_gbs": 2,
  "nodes": 2
}
```

**Response:** `202 Accepted`
```json
{
    "message": "Replica set resize request accepted"
}
```

### Read Replica Set Connection Pooler

#### Enable Replica Set Pooler

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/enablePooler
```

Activate the connection pooler for a read replica set.

**Response:** `200 OK`
```json
{
  "message": "Connection pooler enabled successfully"
}
```

#### Disable Replica Set Pooler

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/disablePooler
```

Deactivate the connection pooler for a read replica set.

**Response:** `200 OK`
```json
{
  "message": "Connection pooler disabled successfully"
}
```

### Set Replica Set Environment

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/setEnvironment
```

Set the environment type for a read replica set.

**Request Body:**
```json
{
  "environment": "PROD"
}
```

**Response:** `200 OK`
```json
{
  "message": "Environment set successfully"
}
```

## VPC Management

Virtual Private Clouds (VPCs) provide network isolation for your TigerData services.

### List All VPCs

```http
GET /projects/{project_id}/vpcs
```

List all Virtual Private Clouds in a project.

**Response:** `200 OK`
```json
[
  {
    "id": "1234567890",
    "name": "my-production-vpc",
    "cidr": "10.0.0.0/16",
    "region_code": "eu-central-1"
  }
]
```

### Create a VPC

```http
POST /projects/{project_id}/vpcs
```

Create a new VPC.

**Request Body:**
```json
{
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "eu-central-1"
}
```

**Response:** `201 Created`
```json
{
  "id": "1234567890",
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "eu-central-1"
}
```

### Get a VPC

```http
GET /projects/{project_id}/vpcs/{vpc_id}
```

Retrieve details of a specific VPC.

**Response:** `200 OK`
```json
{
  "id": "1234567890",
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "eu-central-1"
}
```

### Rename a VPC

```http
POST /projects/{project_id}/vpcs/{vpc_id}/rename
```

Update the name of a specific VPC.

**Request Body:**
```json
{
  "name": "my-renamed-vpc"
}
```

**Response:** `200 OK`
```json
{
  "id": "1234567890",
  "name": "my-renamed-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "eu-central-1"
}
```

### Delete a VPC

```http
DELETE /projects/{project_id}/vpcs/{vpc_id}
```

Delete a specific VPC.

**Response:** `204 No Content`

## VPC Peering

Manage peering connections between VPCs across different accounts and regions.

### List VPC Peerings

```http
GET /projects/{project_id}/vpcs/{vpc_id}/peerings
```

Retrieve all VPC peering connections for a given VPC.

**Response:** `200 OK`
```json
[
  {
    "id": "1234567890",
    "peer_account_id": "acc-12345",
    "peer_region_code": "eu-central-1",
    "peer_vpc_id": "1234567890",
    "provisioned_id": "1234567890",
    "status": "active",
    "error_message": null
  }
]
```

### Create VPC Peering

```http
POST /projects/{project_id}/vpcs/{vpc_id}/peerings
```

Create a new VPC peering connection.

**Request Body:**
```json
{
  "peer_account_id": "acc-12345",
  "peer_region_code": "eu-central-1",
  "peer_vpc_id": "1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": "1234567890",
  "peer_account_id": "acc-12345",
  "peer_region_code": "eu-central-1",
  "peer_vpc_id": "1234567890",
  "provisioned_id": "1234567890",
  "status": "pending"
}
```

### Get VPC Peering

```http
GET /projects/{project_id}/vpcs/{vpc_id}/peerings/{peering_id}
```

Retrieve details of a specific VPC peering connection.

### Delete VPC Peering

```http
DELETE /projects/{project_id}/vpcs/{vpc_id}/peerings/{peering_id}
```

Delete a specific VPC peering connection.

**Response:** `204 No Content`

## Service VPC Operations

### Attach Service to VPC

```http
POST /projects/{project_id}/services/{service_id}/attachToVPC
```

Associate a service with a VPC.

**Request Body:**
```json
{
  "vpc_id": "1234567890"
}
```

**Response:** `202 Accepted`

### Detach Service from VPC

```http
POST /projects/{project_id}/services/{service_id}/detachFromVPC
```

Disassociate a service from its VPC.

**Request Body:**
```json
{
  "vpc_id": "1234567890"
}
```

**Response:** `202 Accepted`

## Data Models

### VPC Object
```json
{
  "id": "string",
  "name": "string",
  "cidr": "string",
  "region_code": "string"
}
```

### Service Object
```json
{
  "service_id": "string",
  "project_id": "string",
  "name": "string",
  "region_code": "string",
  "service_type": "TIMESCALEDB|POSTGRES|VECTOR",
  "created": "2024-01-15T10:30:00Z",
  "initial_password": "string",
  "paused": false,
  "status": "READY|CONFIGURING|QUEUED|...",
  "resources": [
    {
      "id": "string",
      "spec": {
        "cpu_millis": 1000,
        "memory_gbs": 4,
        "volume_type": "string"
      }
    }
  ],
  "metadata": {
    "environment": "PROD|DEV"
  },
  "endpoint": {
    "host": "string",
    "port": 5432
  },
  "connection_pooler": {
    "endpoint": {
      "host": "string",
      "port": 5432
    }
  }
}
```

### Peering Object
```json
{
  "id": "string",
  "peer_account_id": "string",
  "peer_region_code": "string",
  "peer_vpc_id": "string",
  "provisioned_id": "string",
  "status": "string",
  "error_message": "string"
}
```

### Read Replica Set Object

```json
{
  "id": "string",
  "name": "string",
  "status": "creating|active|resizing|deleting|error",
  "nodes": 2,
  "cpu_millis": 1000,
  "memory_gbs": 4,
  "metadata": {
    "environment": "PROD|DEV"
  },
  "endpoint": {
    "host": "string",
    "port": 5432
  },
  "connection_pooler": {
    "endpoint": {
      "host": "string",
      "port": 5432
    }
  }
}
```

## Error Handling

Tiger Cloud REST API uses standard HTTP status codes and returns error details in JSON format.

### Error Response Format
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error description"
}
```

### Common Error Codes
- `400 Bad Request`: Invalid request parameters or malformed JSON
- `401 Unauthorized`: Missing or invalid authentication credentials
- `403 Forbidden`: Insufficient permissions for the requested operation
- `404 Not Found`: Requested resource does not exist
- `409 Conflict`: Request conflicts with current resource state
- `500 Internal Server Error`: Unexpected server error

### Example Error Response
```json
{
  "code": "INVALID_REQUEST",
  "message": "The service_type field is required"
}
```
