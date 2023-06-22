---
title: pgcrypto PostgreSQL extension
excerpt: Use the pgcrypto extension with your Timescale service
products: [cloud]
keywords: [services, settings, extensions, pgcrypto]
tags: [extensions, pgcrypto]
---

# The `pgcrypto` extension

pgcrypto is a PostgreSQL extension that provides cryptographic functions such as:

*   General hashing
*   Password hashing
*   PGP Encryption
*   Raw Encryption
*   Random-Data

For more information about these fuctions and the options available, see the
[pgcryto documentation] [pgcryto-docs].

## Use `pgcrypto` extension with Timescale

`pgcrypto` is a PostgreSQL extension that enables you to encrypt, decrypt, hash,
and create digital signatures within your database. Timescale understands how
precious your data is and safeguards sensitive information.

<Procedure>

### Using `pgcrypto` extension to encrypt the data you insert in Timescale

1.  Install the `pgcryto` extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    ```

1.  You can confirm if the extension is installed using the `\dx` command.
    The extensions that are instlled is listed:

    ```sql
        List of installed extensions
            Name         | Version |   Schema   |                                      Description                                      
    ---------------------+---------+------------+---------------------------------------------------------------------------------------
     pg_stat_statements  | 1.10    | public     | track planning and execution statistics of all SQL statements executed
     pgcrypto            | 1.3     | public     | cryptographic functions
     plpgsql             | 1.0     | pg_catalog | PL/pgSQL procedural language
     timescaledb         | 2.11.0  | public     | Enables scalable inserts and complex queries for time-series data (Community Edition)
     timescaledb_toolkit | 1.16.0  | public     | Library of analytical hyperfunctions, time-series pipelining, and other SQL utilities
     ```

1.  Create a table named `user_passwords`:

    ```sql
       CREATE TABLE user_passwords (username varchar(100) PRIMARY KEY, crypttext text);
    ```

1.  Insert the values in the `user_passwords` table and replace `<Password_Key>`
    with a password key of your choice:

    ```sql
       INSERT INTO tbl_sym_crypt (username, crypttext)
        VALUES ('user1', pgp_sym_encrypt('user1_password','<Password_Key>')),
           ('user2', pgp_sym_encrypt('user2_password','<Password_Key>'));
    ```

1.  You can confirm that the password is encrypted using the command:

    ```sql
     SELECT * FROM user_passwords;
     ```

    The encrypted passwords are listed:

    ```sql
           username |                                                                              crypttext                                                                               
    ----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     user1      | \xc30d040703025caa37f9d1c731d169d240018529d6f0002b2948905a87e4787efaa0046e58fd3f04ee95594bea1803807063321f62c9651cbf0422b04508093df9644a76684b504b317cf633552fcf164f
     user2   | \xc30d0407030279bbcf760b81d3de73d23c01c04142632fc8527c0c1b17cc954c77f16df46022acddc565fd18f0f0f761ddb2f31b21c4ebe47a48039d685287d64506029e027cf29b5493b574df
    (2 rows)
    ```

1.  To view the decrypted passwords for the users replace `<Password_Key>` with
    the password key that you created:

    ```sql
        SELECT username, pgp_sym_decrypt(crypttext::bytea, '<Password_Key>')
        FROM user_passwords;
    ```

    The decrypted passwords are listed:

    ```sql
        username | pgp_sym_decrypt 
        ----------+-----------------
         user1   | user1_password
         user2   | user2_password
        (2 rows)
    ```

</Procedure>

[pgcrypto-docs]: https://www.postgresql.org/docs/current/pgcrypto.html
