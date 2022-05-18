# JSONB support for semi-structured data
You can use JSON and JSONB to provide semi-structured data. This is most useful
for data that contains user-defined fields, such as field names that are defined
by individual users and vary from user to user. We recommend using this in a
semi-structured way, for example:

```sql
CREATE TABLE metrics (
  time TIMESTAMPTZ,
  user_id INT,
  device_id INT,
  data JSONB
);
```

When you are defining a schema using JSON, ensure that common fields, such as
`time`, `user_id`, and `device_id`, are pulled outside of the JSONB structure
and stored as columns. This is because field accesses are more efficient on
table columns than inside of JSONB structures. Storage is also more efficient.

You should also use the JSONB data type, that is, JSON stored in a binary
format, rather than JSON data type. JSONB data types are more efficient in both
storage overhead and lookup performance.

<highlight type="note">
Use JSONB for user-defined data rather than sparse data. This works best for most
data sets. For sparse data, use NULLable fields and, if possible, run on top of
a compressed file system like ZFS. This will work better than a JSONB data type,
unless the data is extremely sparse, for example, more than 95% of fields for a
row are empty.
</highlight>

## Index the JSONB structure
When you index JSONB data across all fields, it is usually best to use a GIN
(generalized inverted) index. In most cases, you can use the default GIN
operator, like this:

```sql
CREATE INDEX idxgin ON metrics USING GIN (data);
```

For more information about GIN indexes, see the
[PostgreSQL documentation][json-indexing].

This index only optimizes queries where the `WHERE` clause uses the `?`, `?&`,
`?|`, or `@>` operator. For more information about these operators, see the
[PostgreSQL documentation][json-operators].

## Index individual fields
JSONB columns sometimes have common fields containing values that are useful to
index individually. Indexes like this can be useful for ordering operations on
field values, [multicolumn indexes][multicolumn-index], and indexes on
specialized types, such as a postGIS geography type. Another advantage of
indexes on individual field values is that they are often smaller than GIN
indexes on the entire JSONB field. To create an index like this, it is usually
best to use a [partial index][partial-index] on an [expression][expression-index]
accessing the field. For example:

```sql
CREATE INDEX idxcpu
  ON metrics(((data->>'cpu')::double precision))
  WHERE data ? 'cpu';
```

In this example, the expression being indexed is the `cpu` field inside the
`data` JSONB object, cast to a double. The cast reduces the size of the index by
storing the much smaller double, instead of a string. The `WHERE` clause ensures
that the only rows included in the index are those that contain a `cpu` field,
because the `data ? 'cpu'` returns `true`. This also serves to reduce the size
of the index by not including rows without a `cpu` field. Note that in order for
a query to use the index, it must have `data ? 'cpu'` in the WHERE clause.

This expression can also be used with a multi-column index, for example, by
adding `time DESC` as a leading column. Note, however, that to enable index-only
scans, you need `data` as a column, not the full expression
`((data->>'cpu')::double precision)`.

[json-indexing]: https://www.postgresql.org/docs/current/static/datatype-json.html#JSON-INDEXING
[json-operators]: https://www.postgresql.org/docs/current/static/functions-json.html#FUNCTIONS-JSONB-OP-TABLE
[multicolumn-index]: https://www.postgresql.org/docs/current/static/indexes-multicolumn.html
[partial-index]: https://www.postgresql.org/docs/current/static/indexes-partial.html
[expression-index]: https://www.postgresql.org/docs/current/static/indexes-expressional.html
