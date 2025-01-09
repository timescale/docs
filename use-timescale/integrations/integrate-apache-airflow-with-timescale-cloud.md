---
title: Integrate Apache Airflow with Timescale Cloud
excerpt: How to install the psql client for PostgreSQL
products: [cloud, mst, self_hosted]
keywords: [connect, integrate, apache, airflow]
---

# Integrate Apache Airflow with $CLOUD_LONG

Apache Airflow® is a platform created by the community to programmatically author,
schedule and monitor workflows.

This page shows you how to use a Python connector to integrate Apache Airflow with $CLOUD_LONG.

## Prerequisites

To integrate Apache Airflow with $CLOUD_LONG, you must first:

*   [Create a Timescale Cloud service][create-a-service-in-timescale]

  Note the connection details you can get by clicking `Download the config`, you need them for this integration.

*   [Create a Table in Timescale Cloud service][create-a-table-in-timescale]
*   [Install Apache Airflow][install-apache-airflow]
*   Ensure that your Airflow instance has network access to connect to $CLOUD_LONG.

## Install Required Libraries

1. Install the `psycopg2` library to enable PostgreSQL connections.

    ```bash
    pip install psycopg2-binary
    ```

1.  Install the `apache-airflow-providers-postgres` library to enable PostgreSQL connection type in Apache Airflow Web UI.

    ```bash
    pip install apache-airflow-providers-postgres
    ```

## Create an Airflow Connection

1.  Run Apache Airflow locally by running the command:

    ```bash
    airflow standalone
    ```

1. Visit `localhost:8080` in your browser to open the Airflow Web UI. In the Airflow web UI, navigate to **Admin** > **Connections**.
1. Click the **+** button to add a new connection.
1. Set the following fields:

   *  **Connection Id**: `timescale_cloud`
   *  **Connection Type**: `Postgres`
   *  **Host**: Your $CLOUD_LONG service hostname
   *  **Database**: Your $CLOUD_LONG service database name
   *  **Login**: Your $CLOUD_LONG service username
   *  **Password**: Your $CLOUD_LONG service password
   *  **Port**: Your $CLOUD_LONG service port

  You can refer to the config downloaded earlier to get the `Host`, `Database`, `Login` (username), `Password` and `Port` details.

## Create a DAG to Insert Data into Timescale Cloud Service

1.  Create a new dags directory if it does not exist already.

    ```bash
    cd ~/Airflow
    mkdir dags
    ```

1. Create a new DAG file in your Airflow `dags` directory, for example, `timescale_dag.py`.

    ```python
    from airflow import DAG
    from airflow.operators.python_operator import PythonOperator
    from airflow.hooks.postgres_hook import PostgresHook
    from datetime import datetime

    def insert_data_to_timescale():
        hook = PostgresHook(postgres_conn_id='timescale_cloud')
        conn = hook.get_conn()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO company (symbol, name) VALUES (%s, %s)",
                ('new_company_symbol', 'New Company Name'))
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
    Note: This DAG uses the `company` table created in [Create a Table in Timescale Cloud service][create-a-table-in-timescale].

## Test the Integration

1.  In the Airflow web UI, navigate to **DAGs**.
1.  Search for `timescale_dag` in the **Search DAGs** field. Click on the **Trigger DAG** button on the upper right corner of the screen that has a "play" icon.
1.  To verify that the data appears in $CLOUD_LONG:
    1.  In the [Timescale Console][console], navigate to your service and click on **SQL editor**. Run the following query: `SELECT symbol, name FROM company;`. You should be able to see new rows inserted in the table.

### Notes

*   Consider using VPCs, security groups, and IAM roles to secure your setup.

By following these steps, you can successfully integrate Timescale Cloud with Apache Airflow and create a data pipeline.


[create-a-service-in-timescale]: /getting-started/:currentVersion:/services/
[create-a-table-in-timescale]: /getting-started/:currentVersion:/tables-hypertables/#create-regular-postgresql-tables-for-relational-data
[install-apache-airflow]: https://airflow.apache.org/docs/apache-airflow/stable/start.html
[console]: https://console.cloud.timescale.com/