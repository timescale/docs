# Compression

As of version 1.5, TimescaleDB supports the ability to natively compress data. This
functionality does not require the use of any specific file system or external software,
and as you will see, it is simple to set up and configure by the user.

Prior to using this guide, we recommend taking a look at our architecture section
to learn more about how compression works. At a high level, TimescaleDB's built-in
job scheduler framework will asynchronously convert recent data from an uncompressed
row-based form to a compressed columnar form across chunks of TimescaleDB hypertables.

This section will walk through the concepts and help you understand some of the
benefits and limitations of native compression. We will also walk you through the
basics of setting this up for use in your environment.

<highlight type="tip">
As with any type of data altering operation, we suggest backing up
your important data prior to implementing compression.
</highlight>