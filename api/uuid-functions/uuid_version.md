---
api_name: uuid_version()
excerpt: Extract the version of a UUID
topics: [uuid]
keywords: [uuid]
tags: [uuid, partitioning, events]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# uuid_version() <Tag type="Community">Community</Tag>

Extract the version number of a UUID.

## Samples

```sql
postgres=# SELECT uuid_version('019913ce-f124-7835-96c7-a2df691caa98');
 uuid_version
--------------
            7
```

### Required arguments

|Name|Type|Description|
|---|---|---|
|`uuid`|UUID|The UUID to extract the version from|
