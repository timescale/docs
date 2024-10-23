---
title: Import data from MySQL
excerpt: Import data into a Timescale Cloud service from a MySQL database
products: [cloud]
keywords: [data migration]
tags: [import, mysql]
---

import ImportPrerequisites from "versionContent/_partials/_migrate_import_prerequisites.mdx";
import SetupConnectionString from "versionContent/_partials/_migrate_import_setup_connection_strings_parquet.mdx";


# Import data from MySQL

MySQL is an open-source relational database management system (RDBMS).

This page shows you how to import data into your $SERVICE_LONG from database running on MySQL 
version 8 or earlier.

## Prerequisites

<ImportPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur while your data is
  being copied. This space is proportional to the amount of new uncompressed data being written to
  the $SERVICE_LONG during migration. A general rule of thumb is between 100GB and 500GB.

For faster data transfer, best practice is for your source database, target $SERVICE_SHORT, and 
the system running the data import are in the same region .

## Import data into your $SERVICE_SHORT

To import data from a MySQL database:

<Procedure>

1. **Setup the connection string for your target $SERVICE_SHORT**

    <SetupConnectionString />

1. **Setup the connection string for your source database**

   ```bash
   SOURCE="mysql://<mysql_username>:<mysql_password>@<mysql_host>:<mysql_port>/<mysql_database>?sslmode=require"
   ```
   where:

   - `<mysql_username>`: your MySQL username
   - `<mysql_password>`: Your MySQL password
   - `<mysql_host>`: the MySQL server hostname or IP address
   - `<mysql_port>`: the MySQL server port, the default is 3306
   - `<mysql_database>`: the name of your MySQL database

1. **Import your data**

    On your data import machine, run the following command:

    ```docker
    docker run -it ghcr.io/dimitri/pgloader:latest pgloader 
    --no-ssl-cert-verification \
    "$SOURCE" \
    "$TARGET"
    ```
   
1. **Verify the data was imported correctly into your $SERVICE_SHORT**   

</Procedure>

And that is it, you have imported your data from MySQL.


[install-docker]: https://docs.docker.com/engine/install/
