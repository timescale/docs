# NFT schema design and ingestion
A properly designed database schema is essential to efficiently store and analyze data. In this tutorial, we work 
with NFT time-series data that has multiple supporting relational tables. 

To help you get familiar with NFT data, let’s consider some of the questions that could be answered with data:

* Which collections have the highest trading volume?
* What’s the number of daily transactions of a given collection/asset?
* Which collections have the most trading volume in Ether (ETH)?
* Which account made the most NFT trades?
* How are the mean and median sale prices correlated?

One theme which is consistent across all these questions is that most of the insights generated revolve around the 
sale itself or the aggregation of sales. Hence, we need to create a schema which focuses on the *time-series* aspect of 
the data. We also want to make sure that JOIN-ing supporting tables is easy, so you can make queries that touch 
both the time-series and the relational tables. Thanks to TimescaleDB’s PostgreSQL foundation and full-SQL support, 
we can easily combine time-series and relational tables during our analysis.

## Tables and field descriptions

TimescaleDB hypertable:
* **nft_sales**: successful NFT transactions

Relational tables (regular PostgreSQL tables):
* **assets**: unique NFT items
* **collections**: NFT collections
* **accounts**: NFT trading accounts/users


### nft_sales

| Data field       | Description                     |
|------------------|---------------------------------|
| id               | OpenSea ID (unique)             |
| time             | Time of the sale                |
| asset_id         | ID of the NFT, FK: assets(id)   |
| collection_id    | ID of the collection this NFT belongs to, FK: collections(id))
| auction_type     | Auction type ('dutch', 'english', 'min_price') |
| contract_address | Address of the smart contract   |
| quantity         | NFT quantity sold               |
| payment_symbol   | Payment symbol (usually ETH, depends on the blockchain where the NFT is minted) |
| total_price      | Total price paid for the NFT    |
| seller_account   | Seller's account, FK: accounts(id) |
| from_account     | Account used to transfer from, FK: accounts(id) |
| to_account       | Account used to transfer to, FK: accounts(id) |
| winner_account   | Buyer's account, FK: accounts(id) |

The `nft_sales` table holds information about successful sale transactions in time-series form

One row represents one successful sale event on the OpenSea platform

`id` is a unique field provided by the OpenSea API

`total_price` is the price paid for the NFT(s) in ETH (or other cryptocurrency payment symbol available on OpenSea)

`quantity` indicates how many NFTs were sold in the transaction (can be more than 1)

`auction_type` is NULL by default unless the transaction happened as part of an auction

`asset_id` and `collection_id` fields can be used to JOIN the supporting relational tables


### assets

| Data field       | Description                            |
|------------------|----------------------------------------|
| id               | OpenSea ID (PK)                        |
| name             | Name of the NFT                        |
| description      | Description of the NFT                 |
| contract_date    | Creation date of the smart contract    |
| url              | OpenSea URL of the NFT                 |
| owner_id         | ID of the NFT owner account, FK: accounts(id) |
| details          | Other extra data fields (JSONB)        |

The `assets` table contains information about the assets (NFTs) that have been in the transactions.

One row represents a unique NFT asset on the OpenSea platform.

`name` is the name of the NFT, not unique

`id` is the primary key and provided by the OpenSea API

One asset can be referenced from multiple transactions (traded multiple times)


### collections

| Data field       | Description               |
|------------------|---------------------------------|
| id               | Auto-increment (PK)             |
| slug             | Slug of the collection (unique) |
| name             | Name of the collection          |
| url              | OpenSea url of the collection   |
| details          | Other extra data fields (JSONB) |

The `collections` table holds information about the NFT collections.

One row represents a unique NFT collection

One collection includes multiple unique NFTs (that are in the `assets` table)

`slug` is a unique identifier of the collection


### accounts

| Data field       | Description               |
|------------------|---------------------------------|
| id               | Auto-increment (PK)             |
| user_name        | OpenSea user name               |
| address          | Account address, unique         |
| details          | Other extra data fields (JSONB) |

The `accounts` table includes the accounts that have participated in at least one transaction from the nft_sales table.

One row represents one unique account on the OpenSea platform

`address` is never NULL and it’s unique

`user_name` is NULL unless it’s been submitted on the OpenSea profile by the user


## Schema
The data types used in the schema have been determined based on our research and hands-on experience working with 
the OpenSea API and the data pulled from OpenSea. First, let’s run the following SQL commands to create the 
schema (you can also download and run the schema.sql file from 
our [NFT Starter Kit GitHub repository](https://github.com/timescale/nft-starter-kit)).

```sql
CREATE TABLE collections (
   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   slug TEXT UNIQUE,
   name TEXT,
   url TEXT,
   details JSONB
);

CREATE TABLE accounts (
   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   user_name TEXT,
   address TEXT UNIQUE NOT NULL,
   details JSONB
);

CREATE TABLE assets (
   id BIGINT PRIMARY KEY,
   name TEXT,
   collection_id BIGINT REFERENCES collections (id), -- collection
   description TEXT,
   contract_date TIMESTAMP WITH TIME ZONE,
   url TEXT UNIQUE,
   img_url TEXT,
   owner_id BIGINT REFERENCES accounts (id), -- account
   details JSONB
);

CREATE TYPE auction AS ENUM ('dutch', 'english', 'min_price');
CREATE TABLE nft_sales (
   id BIGINT,
   "time" TIMESTAMP WITH TIME ZONE,
   asset_id BIGINT REFERENCES assets (id), -- asset
   collection_id BIGINT REFERENCES collections (id), -- collection
   auction_type auction,
   contract_address TEXT,
   quantity NUMERIC,
   payment_symbol TEXT,
   total_price DOUBLE PRECISION,
   seller_account BIGINT REFERENCES accounts (id), -- account
   from_account BIGINT REFERENCES accounts (id), -- account
   to_account BIGINT REFERENCES accounts (id), -- account
   winner_account BIGINT REFERENCES accounts (id), -- account
   CONSTRAINT id_time_unique UNIQUE (id, time)
);

SELECT create_hypertable('nft_sales', 'time');

CREATE INDEX idx_asset_id ON nft_sales (asset_id);
CREATE INDEX idx_collection_id ON nft_sales (collection_id);
CREATE INDEX idx_payment_symbol ON nft_sales (payment_symbol);
```

### Some notes on schema design

`BIGINT`’s storage size is 8 bytes in PostgreSQL (as opposed to `INT`’s 4 bytes) which is needed to make sure it 
doesn’t overflow.

For the `quantity` field we suggest using numeric or decimal (which works the same way in PostgreSQL) as the data 
type, because in some edge cases we experience transactions where the quantity was too big even for BIGINT.

`total_price` needs to be `double precision` because NFT prices often include many decimals, especially in the case 
of Ether (ETH) and similar cryptocurrencies which are infinitely divisible (functionally speaking).

We created an `ENUM` for `auction_type` as this value can only be 'dutch', 'english', or 'min_price', representing 
the different types of auctions used to sell an NFT.

We decided to not store all the data fields that are available from the OpenSea API, only those that we deem 
interesting or useful for future analysis. But still, we wanted to keep all of the unused data fields somewhat close, 
so we added a `details` JSONB column to each relational table that contains additional information about the 
record - e.g., it has `background_color` as a field for the assets.

Note: In our sample dataset provided below, we chose not to include the JSONB data to keep the size of the 
dataset easily managable.


## Ingest NFT data

Now that you have your database and schema created, let’s ingest some data to play with! You have two options to 
ingest NFT data for this tutorial:

### Option 1: Fetch data directly from OpenSea API

Use the script `ingest.py` included in the starter kit repo on GitHub, that will connect to the 
OpenSea API `/events` endpoint and fetch data from the specified time period (no API key required at the time of writing!).

1.  Download [ingestion script from Github](https://github.com/timescale/wip-crypto-starter/blob/main/ingest.py):
1.  Replace the following parameters with the connection details for your TimescaleDB database:
    ```python
    DB_NAME="tsdb"
    HOST="YOUR_HOST_URL"
    USER="tsdbadmin"
    PASS="YOUR_PASSWORD_HERE"
    PORT="PORT_NUMBER"
    ```
1.  Create a new Python virtual environment and install the requirements:
    ```bash
    virtualenv env && source env/bin/activate
    pip install -r requirements.txt
    ```
1.  Run the Python script:
    ```python
    python ingest.py
    ```

### Option 2: Download sample data

Alternatively, you can download and insert sample CSV files that contain NFT sales data from 1 October 2021 to 7 October 2021.

1.  Download sample [CSV files containing one week of sample data](https://assets.timescale.com/docs/downloads/nft_sample.zip):
1.  Connect to your database:
    ```bash
    psql -x "postgres://host:port/tsdb?sslmode=require"
    ```
    (If you’re using Timescale Cloud, simply follow the instructions under “How to Connect” which will give you a 
    customized command to run to connect directly to your database.)
1.  Uncompress the ZIP file then import the CSV files in this order (it can take a few minutes in total):
    ```bash
    \copy accounts FROM accounts.csv CSV HEADER;
    \copy collections FROM collections.csv CSV HEADER;
    \copy assets FROM assets.csv CSV HEADER;
    \copy nft_sales FROM nft_sales.csv CSV HEADER;
    ```  
