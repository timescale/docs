## decompress_chunk() <tag type="community">Community</tag> 
If you need to modify or add data to a chunk that has already been
compressed, you will need to decompress the chunk first. This is especially
useful for backfilling old data.

<highlight type="tip">
Prior to decompressing chunks for the purpose of data backfill or updating you should
first stop any compression policy that is active on the hypertable you plan to perform this
operation on.  Once the update and/or backfill is complete simply turn the policy back on
and the system will recompress your chunks.
</highlight>

### Required Arguments
|Name|Type|Description|
|---|---|---|
| `chunk_name` | REGCLASS | Name of the chunk to be decompressed. |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `if_compressed` | BOOLEAN | Setting to true will skip chunks that are not compressed. Defaults to false.|

### Sample Usage 
Decompress a single chunk

``` sql
SELECT decompress_chunk('_timescaledb_internal._hyper_2_2_chunk');
```