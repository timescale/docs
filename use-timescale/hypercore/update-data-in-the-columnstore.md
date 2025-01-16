---
title: Modify data in the columnstore
excerpt: Update data and the table schema in the columnstore
products: [cloud,]
keywords: [hyperscore, hypertable, compression, row-columnar storage, hypercore, hyperstore]
---

import Prereq from "versionContent/_partials/_prereqs-cloud-and-self.mdx";

# Modify data in the columnstore






This page shows you how to ... .

## Prerequisites

<Prereq />


## Modify small amounts of data

In TimescaleDB v2.11 and later, you can insert data into compressed chunks.
This works even if the data you are inserting has unique constraints, and
those constraints are preserved during the insert operation. This is done
by using a PostgreSQL function that decompresses relevant data during the
insert to check if the new data breaks unique checks. This means that any
time you insert data into a compressed chunk, a small amount of data is
decompressed to allow a speculative insertion, and block any inserts which
could violate constraints.

For TimescaleDB v2.17.0 and later there is improved delete performance on
compressed hypertables when a large amount of data is affected. When you delete
whole segments of data, filter your deletes by segment_by column(s) instead of
separate deletes. This considerably increase performance by skipping the decompression step.

## Modify large amounts of data


## Modify a table schema for data in the columnstore


1. **Move the data to modify to the rowstore**

2. **Modify the schema**:

   |Schema modification|Available| Command                                                                                         |
   |-|-|-------------------------------------------------------------------------------------------------|
   |Add a nullable column|✅| `ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype>;`                                 |
   |Add a column with a default value and a `NOT NULL` constraint|✅| `ALTER TABLE <hypertable> ADD COLUMN <column_name> <datatype> NOT NULL DEFAULT <default_value>;` |
   |Rename a column|✅| `ALTER TABLE <hypertable> RENAME <column_name> TO <new_name>;` |
   |Drop a column|✅| `ALTER TABLE <hypertable> DROP COLUMN <column_name>;`                                                                                                |
   |Change the data type of a column|❌| -                                                                                               |

1. **Add the data back to the columstore manually**
