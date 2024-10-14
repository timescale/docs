---
title: Import data from MySQL
excerpt: Import data into a Timescale Cloud service from an MySQL database
products: [cloud]
keywords: [data migration]
tags: [import, mysql]
---

# Import data from MySQL

## Prerequisites

Before you start, make sure you have:

- Docker installed and running on your computer
- We use pgloader to copy data from MySQL to PostgreSQL. At present, pgloader only supports MySQL version 8 or earlier.
- Ensure the source database, target database, and the system executing the import are in the same region for faster data transfer.
- Have your MySQL and PostgreSQL connection details ready

## Prepare the source connection string

Replace Placeholders with source MySQL config

- <mysql_username> : Your MySQL username
- <mysql_password> : Your MySQL password
- <mysql_host> : MySQL server hostname or IP
- <mysql_port> : MySQL server port (usually 3306)
- <mysql_database> : Name of your MySQL database

```bash
SOURCE="mysql://<mysql_username>:<mysql_password>@<mysql_host>:<mysql_port>/<mysql_database>?sslmode=require"
```

## Prepare the target connection string

Replace Placeholders with target Timescale service config

- <TIMESCALE_DB_PASSWORD> : Timescale service password
- <TIMESCALE_SERVICE_HOST> : Timescale service host
- <TIMESCALE_SERVICE_PORT> : Timescale service port

```bash
TARGET="postgres://tsdbadmin:<TIMESCALE_DB_PASSWORD>@<TIMESCALE_SERVICE_HOST>:<TIMESCALE_SERVICE_PORT>/tsdb?sslmode=require"
```

## Run the Import Command


```docker
docker run -it ghcr.io/dimitri/pgloader:latest pgloader 
--no-ssl-cert-verification \
"$SOURCE" \
"$TARGET"
```

