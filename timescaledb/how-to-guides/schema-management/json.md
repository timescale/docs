## JSON support for semi-structured data [](json)

TimescaleDB can work with any data types available in PostgreSQL, including JSON
and JSONB. These datatypes are most useful for data that contains user-defined
fields (i.e., fields names that are defined by individual users and vary from
user-to-user). We recommend using this in a semi-structured way:

```sql
CREATE TABLE metrics (
  time TIMESTAMPTZ,
  user_id INT,
  device_id INT,
  data JSONB
);
```
The above model schema demonstrates some best practices when using JSON:
1. Common fields such as time, user_id, and device_id are pulled outside of the
JSONB structure and stored as columns. This is because field accesses are more
efficient on table columns than inside of JSONB structures. Storage is also more
efficient.

2. We use the JSONB data type (that is, JSON stored in a binary format) and not the JSON data type. JSONB data types are
are more efficient in both storage overhead and lookup performance.

<highlight type="tip">
[](sparse_json) Often, people use JSON for sparse data as opposed
to user-defined data. We do not recommend this usage inside TimescaleDB for most
datasets (unless the data is extremely sparse, e.g., more than 95% of fields for
a row are empty). Instead, we suggest using NULLable fields and, if possible,
running on top of a compressed file system like ZFS.
</highlight>


### Indexing the entire JSONB structure [](indexing-all-json)

When indexing JSONB data across all fields that may be contained inside, it is
often best to use a GIN index. PostgreSQL documentation has
a [nice description][json-indexing] of the different types of GIN indexes
available on JSON data. If in doubt, it is best to use the default GIN operator
since it allows for more powerful queries:

```sql
CREATE INDEX idxgin ON metrics USING GIN (data);
```

Please note that this index will only optimize queries for which the WHERE clause
uses the `?`, `?&`, `?|`, or `@>` operator (for a description of these operators
see [this table][json-operators] in the PostgreSQL docs). So you should make
sure to structure your queries appropriately.

### Indexing individual fields within a JSONB [](indexing-json-fields)

Sometimes, JSONB columns have common fields whose values are useful to index
individually. Such indexes could be useful for ordering operations on field
values, [multicolumn indexes][multicolumn-index], and indexes on  specialized
types (for example, using a field value as a postGIS geography type). Another
advantage of indexes on individual field values is that they are often smaller
than GIN indexes on the entire JSONB field. To create such an index, it is often
useful to use a [partial index][partial-index] on an
[expression][expression-index] accessing the field. For example,

```sql
CREATE INDEX idxcpu
  ON metrics(((data->>'cpu')::double precision))
  WHERE data ? 'cpu';
```

In this example, the expression being indexed is the `cpu` field inside the
`data` JSONB object cast to a double. The cast reduces the size of the index by
storing the (much smaller) double instead of a string. The WHERE clause ensures
that the only rows included in the index are those that contain a `cpu` field
(i.e.,  `data ? 'cpu'` returns true). This also serves to reduce the size
of the index by not including rows without a `cpu` field. Note that in order for
a query to use the index, it must have `data ? 'cpu'` in the WHERE clause.

The expression above can be used with a multi-column index (e.g., adding `time
DESC` as a leading column). Note, however, that to enable index-only scans, you
need `data` as a column, not the full expression `((data->>'cpu')::double
precision)`.



[json-indexing]: https://www.postgresql.org/docs/current/static/datatype-json.html#JSON-INDEXING
[json-operators]: https://www.postgresql.org/docs/current/static/functions-json.html#FUNCTIONS-JSONB-OP-TABLE
[multicolumn-index]: https://www.postgresql.org/docs/current/static/indexes-multicolumn.html
[partial-index]: https://www.postgresql.org/docs/current/static/indexes-partial.html
[expression-index]: https://www.postgresql.org/docs/current/static/indexes-expressional.html
