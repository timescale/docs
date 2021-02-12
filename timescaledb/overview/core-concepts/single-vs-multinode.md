## Single Node vs. Multi-Node [](single-node-vs-clustering)

TimescaleDB performs extensive partitioning both
on **single-node** deployments as well as **multi-node** deployments.
While
partitioning is traditionally only used for scaling out across multiple
machines, it also allows us to scale up to high write rates (and improved
parallelized queries) even on single machines.

The current open-source release of TimescaleDB only supports single-node
deployments. Of note is that the single-node version of TimescaleDB has been
benchmarked to over 10-billion-row hypertables on commodity machines without
a loss in insert performance.

## Benefits of Single-node Partitioning [](benefits-chunking)

A common problem with scaling database performance on a single machine
is the significant cost/performance trade-off between memory and disk.
Eventually, our entire dataset will not fit in memory, and we’ll need
to write our data and indexes to disk.

Once the data is sufficiently large that we can’t fit all pages of our indexes
(e.g., B-trees) in memory, then updating a random part of the tree can involve
swapping in data from disk.  And databases like PostgreSQL keep a B-tree (or
other data structure) for each table index, in order for values in that
index to be found efficiently. So, the problem compounds as you index more
columns.

But because each of the chunks created by TimescaleDB is itself stored as a
separate database table, all of its indexes are built only across these much
smaller tables rather than a single table representing the entire
dataset. So if we size these chunks properly, we can fit the latest tables
(and their B-trees) completely in memory, and avoid this swap-to-disk problem,
while maintaining support for multiple indexes.

For more on the motivation and design of TimescaleDB, please see our
[technical blog post][chunking].