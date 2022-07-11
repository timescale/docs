---
api_name: DROP MATERIALIZED VIEW (Continuous Aggregate)
excerpt: Drop a continuous aggregate view
license: community
topic: continuous aggregates
keywords: [continuous aggregates, delete]
tags: [materialized views, drop]
---

## DROP MATERIALIZED VIEW (Continuous Aggregate) <tag type="community">Community</tag> 
Continuous aggregate views can be dropped using the `DROP MATERIALIZED VIEW` statement.

This statement deletes the continuous aggregate and all its internal
objects. It also removes refresh policies for that
aggregate. To delete other dependent objects, such as a view
defined on the continuous aggregate, add the `CASCADE`
option. Dropping a continuous aggregate does not affect the data in
the underlying hypertable from which the continuous aggregate is
derived.

``` sql
DROP MATERIALIZED VIEW <view_name>;
```
### Parameters
|Name|Type|Description|
|---|---|---|
| `<view_name>` | TEXT | Name (optionally schema-qualified) of continuous aggregate view to be created.|

### Sample usage 
Drop existing continuous aggregate.

```sql
DROP MATERIALIZED VIEW contagg_view;
```
