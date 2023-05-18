---
title: Inserting or modifying data in compressed chunks
excerpt: What happens when you try to modify data in a compressed hypertable
products: [cloud, mst, self_hosted]
keywords: [compression, backfilling, hypertables]
---

# Inserting into compressed chunks

Prior to version 2.10, inserting into compressed chunks was blocked due to certain
limitations of the system. In 2.10, those limitations were reduced and we enabled
insertion into compressed chunk with limitations. We were not able to check unique
constraints so if you had any such constraints, we denied the operation. Also,
newly inserted data needed to be compressed together with the already compressed
data (either by a running recompression policy or running the recompress_chunk
procedure manually on the chunk).

In version 2.11, we removed more limitation and implemented a way to insert into
compressed chunks while enforcing unique constraints if any are present. The way
we do this is by leveraging Postgres infrastructure and decompressing relevant
data on the fly in order to check if the new data breaks unique checks. This means
any such insert will decompress a (hopefully) limited amount of data necessary
to do speculative insertion and block any inserts which would violate the constraints.

# Modifying compressed rows

Also in 2.11, we now support running UPDATE/DELETE commands to modify existing
rows in the compressed chunks. Similar to previously mentioned insert operation,
we have to decompress the relevant data before we can run these modifications.
The system will try to filter out data necessary to decompress such that we
reduce the amount of decompression work we do. In some naive cases, such
modification commands can end up decompressing a lot of data (e.g. `UPDATE
metric SET value = 1`) due to the fact qualifiers are not present or they
cannot be used to filter. General recommendation here is to use columns used
in compression configuration for `segmentby` and `orderby` so that we can
filter out as much data as possible before attempting to decompress and modify
compressed rows.
