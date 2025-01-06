---
title: Integrate Apache Airflow with Timescale Cloud
excerpt: How to install the psql client for PostgreSQL
products: [cloud, mst, self_hosted]
keywords: [connect, inetgrate, apache, airflow]
---

# Integrate Apache Airflow with $CLOUD_LONG

Apache Airflow® is a platform created by the community to programmatically author, 
schedule and monitor workflows.

This page shows you how to use a Python connector to integrate Apache Airflow with $CLOUD_LONG.

## Prerequisites

To integrate Apache Airflow with $CLOUD_LONG, you must first:

- [Create a Timescale Cloud service][create-a-service-in-timescale]

  Note the connection details, you need them for this integration.
- [Install Apache Airflow][install-apache-airflow]
- ANAGHA: Anything else we need? 

## Install Required Libraries

1. Install the `psycopg2` library to enable PostgreSQL connections.

```bash
pip install psycopg2-binary
```

## Create an Airflow Connection

1. In the Airflow web UI, navigate to **Admin** > **Connections**.
2. Click the **+** button to add a new connection.
3. Set the following fields:
  - **Conn Id**: `timescale_db`
  - **Conn Type**: `Postgres`
  - **Host**: Your TimescaleDB hostname
  - **Schema**: Your database name
  - **Login**: Your username
  - **Password**: Your password
  - **Port**: `5432`

## Create a DAG to Insert Data into TimescaleDB

1. Create a new DAG file in your Airflow `dags` directory, for example, `timescale_dag.py`.

```python
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.hooks.postgres_hook import PostgresHook
from datetime import datetime

def insert_data_to_timescale():
    hook = PostgresHook(postgres_conn_id='timescale_db')
    conn = hook.get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO your_table (your_column) VALUES (%s)", ('your_value',))
    conn.commit()
    cursor.close()
    conn.close()

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1),
    'retries': 1,
}

dag = DAG('timescale_dag', default_args=default_args, schedule_interval='@daily')

insert_task = PythonOperator(
    task_id='insert_data',
    python_callable=insert_data_to_timescale,
    dag=dag,
)
```

## Test the Integration

1. Trigger the DAG manually from the Airflow web UI.
2. Verify that the data appears in TimescaleDB.

### Notes

- Ensure that your Airflow instance has network access to connect to TimescaleDB.
- Consider using VPCs, security groups, and IAM roles to secure your setup.

By following these steps, you can successfully integrate Timescale Cloud with Apache Airflow and create a data pipeline.


[create-a-service-in-timescale]: /getting-started/:currentVersion:/services/
[install-apache-airflow]: https://airflow.apache.org/docs/apache-airflow/stable/start.html
