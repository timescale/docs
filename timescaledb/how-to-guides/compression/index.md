# Compression

Native compression of time-series data is a cornerstone feature of TimescaleDB,
reducing the amount of storage needed for data while increasing the speed of 
some types of queries.

This section will walk through the concepts and help you understand some of the
benefits and limitations of native compression. We will also walk you through the
basics of setting this up for use in your environment.

Prior to enabling compression on your hypertables, **we recommend that you take
the time to read and understand the information in [Compression Basics]** to learn
more about how compression works. 

At a high level, TimescaleDB's built-in job scheduler framework will asynchronously 
convert recent data from an uncompressed row-based form to a compressed columnar 
form across chunks of TimescaleDB hypertables.

<highlight type="tip">
As with any type of data altering operation, we suggest backing up
your important data prior to implementing compression.
</highlight>


[Compression Basics]: /how-to-guides/compression/compression-basics/