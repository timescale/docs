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

Extract the version number from a UUID object: 

![UUIDv7][uuidv7]

## Samples

```sql
postgres=# SELECT uuid_version('019913ce-f124-7835-96c7-a2df691caa98');
```
Returns something like:
```terminaloutput
 uuid_version
--------------
            7
```

## Arguments

| Name | Type             | Default | Required | Description                                        |
|-|------------------|-|----------|----------------------------------------------------|
|`uuid`|UUID| - | ✔ | The UUID object to extract the version number from |

[uuidv7]: https://assets.timescale.com/docs/images/uuidv7-structure.svg
