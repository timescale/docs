## Load financial data

This tutorial uses Bitcoin transactions from the past five days.

## Ingest the dataset

To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database.

<Procedure>

### Ingesting the dataset

1.  Download the `bitcoin_sample.zip` file. The file contains a `.csv`
    file that contains Bitcoin transactions for the past five days. Download:

    <Tag type="download">
      [bitcoin_sample.zip](https://assets.timescale.com/docs/downloads/bitcoin-blockchain/bitcoin_sample.zip)
    </Tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:

    ```bash
    unzip bitcoin_sample.zip
    ```

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    $COMPANY instance. If the `.csv` files aren't in your current directory,
    specify the file paths in these commands:

    ```sql
    \COPY transactions FROM 'tutorial_bitcoin_sample.csv' CSV HEADER;
    ```

    Because there is over a million rows of data, the `COPY` process could take
    a few minutes depending on your internet connection and local client
    resources.

</Procedure>
