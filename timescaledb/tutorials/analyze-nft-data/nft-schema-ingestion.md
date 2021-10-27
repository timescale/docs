# NFT schema design and ingestion
A properly designed database schema is essential to efficiently store and analyze data. This tutorial uses NFT time-series data with multiple supporting relational tables. 

To help you get familiar with NFT data, here are some of the questions that could be answered with this dataset:
* Which collections have the highest trading volume?
* What’s the number of daily transactions of a given collection or asset?
* Which collections have the most trading volume in Ether (ETH)?
* Which account made the most NFT trades?
* How are the mean and median sale prices correlated?

One theme across all these questions is that most of the insights are about the sale itself, or the aggregation of sales. 
So you need to create a schema which focuses on the time-series aspect of the data. It's also important to make sure that 
you can JOIN supporting tables, so you can more easily make queries that touch both the time-series and the relational 
tables. TimescaleDB's PostgreSQL foundation and full-SQL support allows you to easily combine time-series and relational 
tables during your analysis.

## Tables and field descriptions
You need these tables:

TimescaleDB hypertable:
* **nft_sales**: successful NFT transactions

Relational tables (regular PostgreSQL tables):
* **assets**: unique NFT items
* **collections**: NFT collections
* **accounts**: NFT trading accounts/users

### The nft_sales table
The `nft_sales` table contains information about successful sale transactions in time-series form. One row represents 
one successful sale event on the OpenSea platform.

* `id` field is a unique field provided by the OpenSea API.
* `total_price` field is the price paid for the NFTs in ETH (or other cryptocurrency payment symbol available on OpenSea). 
* `quantity` field indicates how many NFTs were sold in the transaction (can be more than 1). 
* `auction_type` field is NULL by default, unless the transaction happened as part of an auction.
* `asset_id` and `collection_id` fields can be used to JOIN the supporting relational tables.

| Data field | Description |
|---|---|
| id | OpenSea ID (unique) |
| time | Time of the sale |
| asset_id | ID of the NFT, FK: assets(id) |
| collection_id | ID of the collection this NFT belongs to, FK: collections(id)) |
| auction_type | Auction type ('dutch', 'english', 'min_price') |
| contract_address | Address of the smart contract |
| quantity | NFT quantity sold |
| payment_symbol | Payment symbol (usually ETH, depends on the blockchain where the NFT is minted) |
| total_price | Total price paid for the NFT |
| seller_account | Seller's account, FK: accounts(id) |
| from_account | Account used to transfer from, FK: accounts(id) |
| to_account | Account used to transfer to, FK: accounts(id) |
| winner_account | Buyer's account, FK: accounts(id) |

### The assets table
The `assets` table contains information about the assets (NFTs) that are in the transactions. One row represents a 
unique NFT asset on the OpenSea platform.

* `name` field is the name of the NFT, and is not unique.
* `id` field is the primary key, provided by the OpenSea API.
* One asset can be referenced from multiple transactions (traded multiple times).

| Data field | Description |
|---|---|
| id | OpenSea ID (PK) |
| name | Name of the NFT |
| description | Description of the NFT |
| contract_date | Creation date of the smart contract |
| url | OpenSea URL of the NFT |
| owner_id | ID of the NFT owner account, FK: accounts(id) |
| details | Other extra data fields (JSONB) |

### The collections table
The `collections` table holds information about the NFT collections. One row represents a unique NFT collection. 
One collection includes multiple unique NFTs (that are in the `assets` table).

* `slug` field is a unique identifier of the collection. 

| Data field | Description |
|---|---|
| id | Auto-increment (PK) |
| slug | Slug of the collection (unique) |
| name | Name of the collection |
| url | OpenSea url of the collection |
| details | Other extra data fields (JSONB) |


### The accounts table
The `accounts` table includes the accounts that have participated in at least one transaction from the nft_sales table. 
One row represents one unique account on the OpenSea platform.

* `address` is never NULL and it’s unique
* `user_name` is NULL unless it’s been submitted on the OpenSea profile by the user

| Data field | Description |
|---|---|
| id | Auto-increment (PK) |
| user_name | OpenSea user name |
| address | Account address, unique |
| details | Other extra data fields (JSONB) |

## Database schema
The data types used in the schema for this tutorial have been determined based on our research and hands-on experience 
working with the OpenSea API and the data pulled from OpenSea. Start by running these SQL commands to create the schema. 
Alternatively, you can download and run the `schema.sql` file from our [NFT Starter Kit GitHub repository][nft-starter-kit].
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

### Schema design
`BIGINT`’s storage size is 8 bytes in PostgreSQL (as opposed to `INT`’s 4 bytes) which is needed to make sure it 
doesn’t overflow.

For the `quantity` field we suggest using numeric or decimal (which works the same way in PostgreSQL) as the data 
type, because in some edge cases we experience transactions where the quantity was too big even for BIGINT.

`total_price` needs to be `double precision` because NFT prices often include many decimals, especially in the case 
of Ether (ETH) and similar cryptocurrencies which are, functionally, infinitely divisible.

We created an `ENUM` for `auction_type` as this value can only be 'dutch', 'english', or 'min_price', representing 
the different types of auctions used to sell an NFT.

We decided to not store all the data fields that are available from the OpenSea API, only those that we deem 
interesting or useful for future analysis. But we still wanted to keep all of the unused data fields somewhere close, 
so we added a `details` JSONB column to each relational table. This column contains additional information about the 
record. For example, it includes a `background_color` as a field for the assets.

Note: In our sample dataset, we chose not to include the JSONB data to keep the size of the 
dataset easily managable. If you want a dataset with the full JSON data included, you need to fetch the data directly 
from the OpenSea API (see below for steps). 

## Ingest NFT data
When you have your database and schema created, you can ingest some data to play with! You have two options to ingest 
NFT data for this tutorial. You can fetch data directly from the OpenSea API, or download sample data.

### Fetch data directly from the OpenSea API
To ingest data from the OpenSea API, you can use the `ingest.py` script included in the starter kit repository on GitHub. 
The scripts connects to the OpenSea API `/events` endpoint, and fetches data from the specified time period (no API key required!).

<procedure>

### Fetching data directly from the OpenSea API

1.  Download the [ingestion script from Github][ingest-script].
1.  Replace these parameters with the connection details for your TimescaleDB database:
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

</procedure>

### Download sample NFT data
You can download and insert sample CSV files that contain NFT sales data from 1 October 2021 to 7 October 2021.

<procedure>

### Downloading sample NFT data

1.  Download sample [CSV files containing one week of sample data][sample-data].
1.  Connect to your database:
    ```bash
    psql -x "postgres://host:port/tsdb?sslmode=require"
    ```
    If you're using Timescale Cloud, the instructions under `How to Connect` provide a 
    customized command to run to connect directly to your database.
1.  Uncompress the ZIP file, and import the CSV files in this order (it can take a few minutes in total):
    ```bash
    \copy accounts FROM accounts.csv CSV HEADER;
    \copy collections FROM collections.csv CSV HEADER;
    \copy assets FROM assets.csv CSV HEADER;
    \copy nft_sales FROM nft_sales.csv CSV HEADER;
    ```  

</procedure>

[nft-starter-kit]: https://github.com/timescale/nft-starter-kit
[ingest-script]: https://github.com/timescale/wip-crypto-starter/blob/main/ingest.py
[sample-data]: https://assets.timescale.com/docs/downloads/nft_sample.zip