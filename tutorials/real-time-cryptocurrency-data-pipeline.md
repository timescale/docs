---
title: Build a Real-Time Cryptocurrency Data Pipeline with TimescaleDB and Python
excerpt: Create a real-time cryptocurrency data pipeline using TimescaleDB and Python
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, data pipeline]
---


# Build a Real-Time Cryptocurrency Data Pipeline with TimescaleDB and Python

This tutorial shows you how to create a real-time cryptocurrency data pipeline using TimescaleDB and Python. You'll fetch price data from the CoinGecko API, store it in a TimescaleDB hypertable, and set up continuous aggregates for efficient OHLCV (Open, High, Low, Close, Volume) queries.

## Before you begin

1. Install TimescaleDB on your PostgreSQL instance.
2. Install Python 3.7 or later.
3. Install the required Python libraries:
   ```
   pip install psycopg2 requests
   ```

## Costs

This tutorial uses the following billable components of TimescaleDB:

- TimescaleDB database storage
- Continuous aggregates

To generate a cost estimate based on your projected usage, use the [TimescaleDB pricing calculator](https://www.timescale.com/products/pricing/).

## Set up your development environment

1. Clone the project repository:
   ```
   git clone https://github.com/example/crypto-pipeline.git
   ```
2. Navigate to the project directory:
   ```
   cd crypto-pipeline
   ```

## Create a TimescaleDB hypertable

1. Connect to your TimescaleDB instance.
2. Run the following SQL commands to create a table and convert it to a hypertable:

   ```sql
   CREATE TABLE IF NOT EXISTS crypto_prices (
       time TIMESTAMPTZ NOT NULL,
       coin_id VARCHAR(100) NOT NULL,
       price_usd NUMERIC NOT NULL
   );

   SELECT create_hypertable('crypto_prices', 'time', 
                            chunk_time_interval => INTERVAL '1 day',
                            if_not_exists => TRUE);
   ```

## Set up data compression

To optimize storage for older data, set up compression:

```sql
ALTER TABLE crypto_prices SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'coin_id'
);

SELECT add_compression_policy('crypto_prices', INTERVAL '14 days');
```

## Create continuous aggregates

Create continuous aggregates for OHLCV data at different time scales:

```sql
CREATE MATERIALIZED VIEW crypto_ohlcv_5min
WITH (timescaledb.continuous) AS
SELECT time_bucket('5 minutes', time) AS bucket,
       coin_id,
       FIRST(price_usd, time) AS open,
       MAX(price_usd) AS high,
       MIN(price_usd) AS low,
       LAST(price_usd, time) AS close,
       COUNT(*) AS volume
FROM crypto_prices
GROUP BY bucket, coin_id;

-- Repeat for 1-hour and 1-day intervals
```

## Write the Python script

Create a new file named `crypto_pipeline.py` and add the following code:

```python
import psycopg2
import requests
import time
from datetime import datetime

# Database connection parameters
DB_NAME = "crypto_data"
DB_USER = "your_username"
DB_PASSWORD = "your_password"
DB_HOST = "localhost"
DB_PORT = "5432"

# CoinGecko API parameters
BASE_URL = "https://api.coingecko.com/api/v3"
BATCH_SIZE = 250  # CoinGecko allows up to 250 coins per request

def setup_timescaledb():
    """Set up TimescaleDB tables and continuous aggregates."""
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    cur = conn.cursor()
    
    # Create table and hypertable
    cur.execute("""
    CREATE TABLE IF NOT EXISTS crypto_prices (
        time TIMESTAMPTZ NOT NULL,
        coin_id VARCHAR(100) NOT NULL,
        price_usd NUMERIC NOT NULL
    );
    SELECT create_hypertable('crypto_prices', 'time', 
                             chunk_time_interval => INTERVAL '1 day',
                             if_not_exists => TRUE);
    """)
    
    # Set up compression
    cur.execute("""
    ALTER TABLE crypto_prices SET (
        timescaledb.compress,
        timescaledb.compress_segmentby = 'coin_id'
    );
    SELECT add_compression_policy('crypto_prices', INTERVAL '14 days');
    """)
    
    # Create continuous aggregates
    cur.execute("""
    CREATE MATERIALIZED VIEW crypto_ohlcv_5min
    WITH (timescaledb.continuous) AS
    SELECT time_bucket('5 minutes', time) AS bucket,
           coin_id,
           FIRST(price_usd, time) AS open,
           MAX(price_usd) AS high,
           MIN(price_usd) AS low,
           LAST(price_usd, time) AS close,
           COUNT(*) AS volume
    FROM crypto_prices
    GROUP BY bucket, coin_id;
    """)
    
    # Add similar statements for 1-hour and 1-day intervals
    
    conn.commit()
    cur.close()
    conn.close()

def get_all_coin_ids():
    """Fetch all available coin IDs from CoinGecko."""
    response = requests.get(f"{BASE_URL}/coins/list")
    coins = response.json()
    return [coin['id'] for coin in coins]

def fetch_prices(coin_ids):
    """Fetch prices for a batch of coin IDs."""
    ids_param = ','.join(coin_ids)
    response = requests.get(f"{BASE_URL}/simple/price?ids={ids_param}&vs_currencies=usd")
    return response.json()

def insert_prices(prices, timestamp):
    """Insert price data into TimescaleDB."""
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    cur = conn.cursor()
    
    for coin_id, price_data in prices.items():
        cur.execute(
            "INSERT INTO crypto_prices (time, coin_id, price_usd) VALUES (%s, %s, %s)",
            (timestamp, coin_id, price_data['usd'])
        )
    
    conn.commit()
    cur.close()
    conn.close()

def main():
    """Main function to run the data pipeline."""
    setup_timescaledb()
    all_coin_ids = get_all_coin_ids()
    
    while True:
        timestamp = datetime.utcnow()
        
        for i in range(0, len(all_coin_ids), BATCH_SIZE):
            batch = all_coin_ids[i:i+BATCH_SIZE]
            prices = fetch_prices(batch)
            insert_prices(prices, timestamp)
            print(f"Inserted batch {i//BATCH_SIZE + 1} of {len(all_coin_ids)//BATCH_SIZE + 1}")
            
            time.sleep(1.5)  # Respect API rate limits
        
        print(f"Completed full update at {timestamp}. Waiting for next cycle...")
        time.sleep(300)  # Wait for 5 minutes before the next full update

if __name__ == "__main__":
    main()
```

## Run the script

1. Replace the database connection parameters in the script with your actual TimescaleDB connection details.
2. Run the script:
   ```
   python crypto_pipeline.py
   ```

The script will continuously fetch cryptocurrency price data and insert it into your TimescaleDB instance.

## Clean up

To avoid incurring charges to your TimescaleDB account for resources used in this tutorial:

1. Stop the Python script.
2. Delete the `crypto_prices` table and associated continuous aggregates from your TimescaleDB instance.

## What's next

- Learn more about [TimescaleDB continuous aggregates](https://docs.timescale.com/latest/using-timescaledb/continuous-aggregates).
- Explore [advanced TimescaleDB features](https://docs.timescale.com/latest/using-timescaledb/advanced-features) for time-series data.
- Build a dashboard to visualize your cryptocurrency data using tools like Grafana or Tableau.
