# TigerData Cloud API Reference

A comprehensive RESTful API for managing TigerData Cloud Platform resources including VPCs, services, and read replicas.

## Overview

**API Version:** 1.0.0  
**Base URL:** `https://api.tigerdata.com/public/v1`  
**Development URL:** `https://console.dev.timescale.com/public/api/v1`  
**Local Development URL:** `http://localhost:8080/public/api/v1`

## Authentication

The TigerData Cloud API uses HTTP Basic Authentication. Include your access key and secret key in the Authorization header.

### Basic Authentication
```http
Authorization: Basic <base64(access_key:secret_key)>
```

### Example
```bash
# Using cURL
curl -X GET "https://api.tigerdata.com/public/v1/projects/{project_id}/services" \
  -H "Authorization: Basic $(echo -n 'your_access_key:your_secret_key' | base64)"
```

### Error Responses
- **401 Unauthorized:** Invalid or missing credentials
- **403 Forbidden:** Insufficient permissions

## Common Parameters

### Path Parameters
- `project_id` (string): The unique identifier of the project (e.g., "rp1pz7uyae")
- `service_id` (string): The unique identifier of the service (e.g., "d1k5vk7hf2")
- `vpc_id` (string): The unique identifier of the VPC (e.g., "1234567890")
- `replica_set_id` (string): The unique identifier of the read replica set (e.g., "alb8jicdpr")
- `peering_id` (string): The unique identifier of the VPC peering connection (e.g., "1234567890")

## VPC Management

Virtual Private Clouds (VPCs) provide network isolation for your TigerData services.

### List All VPCs

```http
GET /projects/{project_id}/vpcs
```

Lists all Virtual Private Clouds in a project.

**Response:** `200 OK`
```json
[
  {
    "id": "1234567890",
    "name": "my-production-vpc",
    "cidr": "10.0.0.0/16",
    "region_code": "google-europe-west1"
  }
]
```

### Create a VPC

```http
POST /projects/{project_id}/vpcs
```

Creates a new Virtual Private Cloud.

**Request Body:**
```json
{
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "google-europe-west1"
}
```

**Response:** `201 Created`
```json
{
  "id": "1234567890",
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "google-europe-west1"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request parameters

### Get a VPC

```http
GET /projects/{project_id}/vpcs/{vpc_id}
```

Retrieves details of a specific VPC.

**Response:** `200 OK`
```json
{
  "id": "1234567890",
  "name": "my-production-vpc",
  "cidr": "10.0.0.0/16",
  "region_code": "google-europe-west1"
}
```

**Error Responses:**
- `404 Not Found`: VPC not found

### Rename a VPC

```http
POST /projects/{project_id}/vpcs/{vpc_id}/rename
```

Updates the name of a specific VPC.

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
  "region_code": "google-europe-west1"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: VPC not found

### Delete a VPC

```http
DELETE /projects/{project_id}/vpcs/{vpc_id}
```

Deletes a specific VPC.

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found`: VPC not found

## VPC Peering

Manage peering connections between VPCs across different accounts and regions.

### List VPC Peerings

```http
GET /projects/{project_id}/vpcs/{vpc_id}/peerings
```

Retrieves all VPC peering connections for a given VPC.

**Response:** `200 OK`
```json
[
  {
    "id": "1234567890",
    "peer_account_id": "acc-12345",
    "peer_region_code": "aws-us-east-1",
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

Creates a new VPC peering connection.

**Request Body:**
```json
{
  "peer_account_id": "acc-12345",
  "peer_region_code": "aws-us-east-1",
  "peer_vpc_id": "1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": "1234567890",
  "peer_account_id": "acc-12345",
  "peer_region_code": "aws-us-east-1",
  "peer_vpc_id": "1234567890",
  "provisioned_id": "1234567890",
  "status": "pending"
}
```

### Get VPC Peering

```http
GET /projects/{project_id}/vpcs/{vpc_id}/peerings/{peering_id}
```

Retrieves details of a specific VPC peering connection.

### Delete VPC Peering

```http
DELETE /projects/{project_id}/vpcs/{vpc_id}/peerings/{peering_id}
```

Deletes a specific VPC peering connection.

**Response:** `204 No Content`

## Service Management

Manage database services including TimescaleDB, PostgreSQL, and Vector databases.

### List All Services

```http
GET /projects/{project_id}/services
```

Retrieves all services within a project.

**Response:** `200 OK`
```json
[
  {
    "service_id": "d1k5vk7hf2",
    "project_id": "rp1pz7uyae",
    "name": "my-production-db",
    "region_code": "google-europe-west1",
    "service_type": "TIMESCALEDB",
    "status": "READY",
    "created": "2024-01-15T10:30:00Z",
    "initial_password": "a-very-secure-initial-password",
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

Creates a new database service. This is an asynchronous operation.

**Request Body:**
```json
{
  "name": "my-production-db",
  "service_type": "TIMESCALEDB",
  "region_code": "google-europe-west1",
  "replica_count": 1,
  "cpu_millis": 1000,
  "memory_gbs": 4
}
```

**Response:** `202 Accepted`
```json
{
  "service_id": "d1k5vk7hf2",
  "project_id": "rp1pz7uyae",
  "name": "my-production-db",
  "region_code": "google-europe-west1",
  "service_type": "TIMESCALEDB",
  "status": "QUEUED",
  "created": "2024-01-15T10:30:00Z",
  "initial_password": "a-very-secure-initial-password"
}
```

**Service Types:**
- `TIMESCALEDB`: TimescaleDB service
- `POSTGRES`: PostgreSQL service
- `VECTOR`: Vector database service

**Error Responses:**
- `400 Bad Request`: Invalid service configuration

### Get a Service

```http
GET /projects/{project_id}/services/{service_id}
```

Retrieves details of a specific service.

**Response:** `200 OK`
```json
{
  "service_id": "d1k5vk7hf2",
  "project_id": "rp1pz7uyae",
  "name": "my-production-db",
  "region_code": "google-europe-west1",
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
  "metadata": {
    "environment": "PROD"
  },
  "endpoint": {
    "host": "my-service.com",
    "port": 5432
  },
  "connection_pooler": {
    "endpoint": {
      "host": "pooler.my-service.com",
      "port": 5432
    }
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

Deletes a specific service. This is an asynchronous operation.

**Response:** `202 Accepted`

**Error Responses:**
- `404 Not Found`: Service not found

### Resize a Service

```http
POST /projects/{project_id}/services/{service_id}/resize
```

Changes CPU and memory allocation for a service.

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

Sets a new master password for the service.

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

Sets the environment type for the service.

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
  "message": "Action completed successfully."
}
```

### Configure High Availability

```http
POST /projects/{project_id}/services/{service_id}/setHA
```

Changes the HA configuration for a service. This is an asynchronous operation.

**Request Body:**
```json
{
  "sync_replica_count": 1,
  "replica_count": 2
}
```

**Response:** `202 Accepted`

### Connection Pooler Management

#### Enable Connection Pooler

```http
POST /projects/{project_id}/services/{service_id}/enablePooler
```

Activates the connection pooler for a service.

**Response:** `200 OK`
```json
{
  "message": "Action completed successfully."
}
```

#### Disable Connection Pooler

```http
POST /projects/{project_id}/services/{service_id}/disablePooler
```

Deactivates the connection pooler for a service.

**Response:** `200 OK`

### Service VPC Operations

#### Attach Service to VPC

```http
POST /projects/{project_id}/services/{service_id}/attachToVPC
```

Associates a service with a VPC.

**Request Body:**
```json
{
  "vpc_id": "1234567890"
}
```

**Response:** `202 Accepted`

**Error Responses:**
- `409 Conflict`: Service already attached to a VPC

#### Detach Service from VPC

```http
POST /projects/{project_id}/services/{service_id}/detachFromVPC
```

Disassociates a service from its VPC.

**Request Body:**
```json
{
  "vpc_id": "1234567890"
}
```

**Response:** `202 Accepted`

### Fork a Service

```http
POST /projects/{project_id}/services/{service_id}/forkService
```

Creates a new, independent service by taking a snapshot of an existing one.

**Request Body:**
```json
{
  "name": "forked-customer-db"
}
```

**Response:** `202 Accepted`
```json
{
  "service_id": "new-service-id",
  "name": "forked-customer-db",
  "forked_from": {
    "project_id": "rp1pz7uyae",
    "service_id": "d1k5vk7hf2",
    "is_standby": false
  },
  "status": "CONFIGURING"
}
```

## Read Replica Sets

Manage read replicas for improved read performance and geographical distribution.

### List Read Replica Sets

```http
GET /projects/{project_id}/services/{service_id}/replicaSets
```

Retrieves all read replica sets associated with a primary service.

**Response:** `200 OK`
```json
[
  {
    "id": "alb8jicdpr",
    "name": "reporting-replica-1",
    "status": "active",
    "nodes": 2,
    "cpu_millis": 250,
    "memory_gbs": 0.5,
    "metadata": {
      "environment": "PROD"
    },
    "endpoint": {
      "host": "replica.my-service.com",
      "port": 5432
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

Creates a new read replica set. This is an asynchronous operation.

**Request Body:**
```json
{
  "name": "my-reporting-replica",
  "nodes": 2,
  "cpu_millis": 250,
  "memory_gbs": 0.5
}
```

**Response:** `202 Accepted`
```json
{
  "id": "alb8jicdpr",
  "name": "my-reporting-replica",
  "status": "creating",
  "nodes": 2,
  "cpu_millis": 250,
  "memory_gbs": 0.5
}
```

### Delete a Read Replica Set

```http
DELETE /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}
```

Deletes a specific read replica set. This is an asynchronous operation.

**Response:** `202 Accepted`

### Resize a Read Replica Set

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/resize
```

Changes resource allocation for a read replica set.

**Request Body:**
```json
{
  "cpu_millis": 500,
  "memory_gbs": 1.0,
  "nodes": 3
}
```

**Response:** `202 Accepted`

### Read Replica Connection Pooler

#### Enable Replica Pooler

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/enablePooler
```

Activates the connection pooler for a read replica set.

**Response:** `200 OK`

#### Disable Replica Pooler

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/disablePooler
```

Deactivates the connection pooler for a read replica set.

**Response:** `200 OK`

### Set Replica Environment

```http
POST /projects/{project_id}/services/{service_id}/replicaSets/{replica_set_id}/setEnvironment
```

Sets the environment type for a read replica set.

**Request Body:**
```json
{
  "environment": "PROD"
}
```

**Response:** `200 OK`

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
  "cpu_millis": 250,
  "memory_gbs": 0.5,
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

The API uses standard HTTP status codes and returns error details in JSON format.

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

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Development Environment**: More lenient rate limits for testing
- **Production Environment**: Strict rate limits for stability
- **Local Development**: No rate limits applied

When rate limits are exceeded, the API returns `429 Too Many Requests` with retry information in the response headers.

## Support and Contact

For API support and questions:
- **Support**: [TigerData Support](https://www.tigerdata.com/contact)
- **License**: [Terms of Service](https://www.tigerdata.com/legal/terms)
- **Documentation**: This API reference follows the OpenAPI 3.0.3 specification