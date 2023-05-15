---
title: PostgreSQL transaction ID wraparound
section: troubleshooting
products: [mst]
topics: [configuration]
keywords: [transaction ID, freezing, autovacuum, control mechanism]
tags: [tshoot, ]
---

The transaction control mechanism in PostgreSQL assigns a transaction ID to
every row that is modified in the database; these IDs control the visibility of
that row to other concurrent transactions. The transaction ID is a 32-bit number
where two billion IDs are always in the visible past and the remaining IDs are
reserved for future transactions and are not visible to the running transaction.
To avoid a transaction wraparound of old rows, PostgreSQL requires occasional
cleanup and freezing of old rows. This ensures that existing rows are visible
when more transactions are created. You can manually freeze the old rows by
executing `VACUUM FREEZE`. It can also be done automatically using the
`autovacuum` daemon when a configured number of transactions has been created
since the last freeze point.

In Managed Service for TimescaleDB, the transaction limit is set according to
the size of the database, up to 1.5 billion transactions. This ensures 500
million transaction IDs are available before a forced freeze and avoids
churning stable data in existing tables. To check your transaction freeze
limits, you can execute `show autovacuum_freeze_max_age` in your PostgreSQL
instance. When the limit is reached, `autovacuum` starts freezing the old rows.
Some applications do not automatically adjust the configuration when the PostgreSQL
settings change, which can result in unnecessary warnings. For example,
PGHero's default settings alert when 500 million transactions have been created
instead of alerting after 1.5 billion transactions. To avoid this, change the
value of the `transaction_id_danger` setting from 1,500,000,000 to
500,000,000, to receive warnings when the transaction limit reaches 1.5 billion.
