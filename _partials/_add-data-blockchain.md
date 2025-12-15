## Load financial data

The dataset contains around 1.5 million Bitcoin transactions, the trades for five days. It includes
information about each transaction, along with the value in [satoshi][satoshi-def]. It also states if a
trade is a [coinbase][coinbase-def] transaction, and the reward a coin miner receives for mining the coin.

To ingest data into the tables that you created, you need to download the
dataset and copy the data to your database.

<Procedure>

1.  Download the `bitcoin_sample.zip` file. The file contains a `.csv`
    file that contains Bitcoin transactions for the past five days. Download:

    <Tag type="download">
      [bitcoin_sample.zip](https://assets.timescale.com/docs/downloads/bitcoin-blockchain/bitcoin_sample.zip)
    </Tag>

1.  In a new terminal window, run this command to unzip the `.csv` files:

    ```bash
    unzip bitcoin_sample.zip
    ```

1. In Terminal, navigate to the folder where you unzipped the Bitcoin transactions, then 
   connect to your $SERVICE_SHORT using [psql][connect-using-psql].

1.  At the `psql` prompt, use the `COPY` command to transfer data into your
    $SERVICE_LONG. If the `.csv` files aren't in your current directory,
    specify the file paths in these commands:

    ```sql
    \COPY transactions FROM 'tutorial_bitcoin_sample.csv' CSV HEADER;
    ```

    Because there is over a million rows of data, the `COPY` process could take
    a few minutes depending on your internet connection and local client
    resources.

</Procedure>

[coinbase-def]: https://www.pcmag.com/encyclopedia/term/coinbase-transaction
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
[satoshi-def]: https://www.pcmag.com/encyclopedia/term/satoshi
