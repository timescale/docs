Over time you end up with a lot of data. Since this data is mostly immutable, you can compress it
to save space and avoid incurring additional cost.

$TIMESCALE_DB is built for handling event-oriented data such as time-series, it comes with support
to compress the data in $HYPERTABLEs using [$HYPERCORE][hypercore].

[$HYPERCORE_CAP][hypercore] enables you to store the data in a vastly more efficient format allowing
up to 20x compression ratio compared to a normal $PG table. However, this is highly dependent
on the data and configuration.

[$HYPERCORE_CAP][hypercore] is implemented natively in $PG and does not require special storage
formats. When you convert your data from the $ROWSTORE to the $COLUMNSTORE, $TIMESCALE_DB uses
$PG features to transform the data into columnar format. The use of a columnar format allows a better
compression ratio since similar data is stored adjacently. For more details on the columnar format, 
see [$HYPERCORE][hypercore].

A beneficial side effect of compressing data is that certain queries are significantly faster, since
less data has to be read into memory.


[hypercore]: /use-timescale/:currentVersion:/hypercore/
