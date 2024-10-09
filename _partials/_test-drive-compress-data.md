import HypertableIntro from "versionContent/_partials/_hypertables-intro.mdx";

## Compress your data  

You compress time-series in order to reduce the amount of storage required, and increase the 
speed of some queries. This is a cornerstone feature of Timescale. When new data is added to 
your database, it is in the form of uncompressed rows. Timescale uses a built-in job scheduler
to convert this data to the form of compressed columns. This occurs across chunks of Timescale 
hypertables.

Timescale charges are based on how much storage you use. You don't pay for a fixed storage size,
and you don't need to worry about scaling disk size as your data grows; We handle it all for you. 
To reduce your data costs further, use compression, a data retention policy, and tiered storage.

### Enable a compression policy 



<Procedure>

1.  Do this
1.  Do that


</Procedure>


