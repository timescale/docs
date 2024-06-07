---
title: Python interface for pgvector and pgvectorscale
excerpt: Working with pgvectorscale and pgvector in python
products: [cloud]
keywords: [ai, vector, pgvector, timescale vector, pgvectorscale, python]
tags: [ai, vector, python]
---

# Python interface for pgvector and pgvectorscale

You use pgvectorscale to power production grade AI applications. `timescale_vector` is the
 Python interface you use to interact with a pgvectorscale service programmatically.

Before you get started with `timescale_vector`:

- [Sign up for pgvectorscale](https://console.cloud.timescale.com/signup?utm_campaign=vectorlaunch&utm_source=docs&utm_medium=direct): Get 90 days free to try pgvectorscale on the Timescale cloud data platform. There is no self-managed version at this time.
- [Follow the Get Started Tutorial](https://timescale.github.io/python-vector/tsv_python_getting_started_tutorial.html): 
Learn how to use pgvectorscale for semantic search on a real-world dataset.

If you prefer to use an LLM development or data framework, see pgvectorscale's integrations with [LangChain](https://python.langchain.com/docs/integrations/vectorstores/timescalevector) and [LlamaIndex](https://gpt-index.readthedocs.io/en/stable/examples/vector_stores/Timescalevector.html).

## Prerequisites 

`timescale_vector` depends on the source distribution of `psycopg2` and adheres 
to [best practices for psycopg2](https://www.psycopg.org/docs/install.html#psycopg-vs-psycopg-binary). 

Before you install `timescale_vector`: 

* Follow the [psycopg2 build prerequisites](https://www.psycopg.org/docs/install.html#build-prerequisites).

## Install

To interact with pgvectorscale using Python:

1. Install `timescale_vector`: 

    ```bash
    pip install timescale_vector
    ```
1. Install `dotenv`:

    ```bash
    pip install python-dotenv
    ```

    In these examples, you use `dotenv` to pass secrets and keys. 

That is it, you are ready to go. 

## Basic usage of the timescale_vector library

First, import all the necessary libraries:

``` python
from dotenv import load_dotenv, find_dotenv
import os
from timescale_vector import client
import uuid
from datetime import datetime, timedelta
```

Load up your PostgreSQL credentials, the safest way is with a `.env` file:

``` python
_ = load_dotenv(find_dotenv(), override=True)
service_url  = os.environ['TIMESCALE_SERVICE_URL']
```

Next, create the client. This tutorial, uses the sync client. But the library has an async client as well (with an identical interface that
uses async functions).

The client constructor takes three required arguments:

| name           | description                                                                               |
|----------------|-------------------------------------------------------------------------------------------|
| `service_url`    | Timescale service URL / connection string                                                 |
| `table_name`     | Name of the table to use for storing the embeddings. Think of this as the collection name |
| `num_dimensions` | Number of dimensions in the vector                                                        |

``` python
vec  = client.Sync(service_url, "my_data", 2)
```

Next, create the tables for the collection:

``` python
vec.create_tables()
```

Next, insert some data. The data record contains:

- A UUID to uniquely identify the embedding
- A JSON blob of metadata about the embedding
- The text the embedding represents
- The embedding itself

Because this data includes UUIDs which become primary keys, upserts should be used for ingest.

``` python
vec.upsert([\
    (uuid.uuid1(), {"animal": "fox"}, "the brown fox", [1.0,1.3]),\
    (uuid.uuid1(), {"animal": "fox", "action":"jump"}, "jumped over the", [1.0,10.8]),\
])
```

You can now create a vector index to speed up similarity search:

``` python
vec.create_embedding_index(client.TimescaleVectorIndex())
```

Then, you can query for similar items:

``` python
vec.search([1.0, 9.0])
```

    [[UUID('73d05df0-84c1-11ee-98da-6ee10b77fd08'),
      {'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456],
     [UUID('73d05d6e-84c1-11ee-98da-6ee10b77fd08'),
      {'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

There are many search options which are covered below in the
`Advanced search` section.

A simple search example that returns one item using a similarity search
constrained by a metadata filter is shown below:

``` python
vec.search([1.0, 9.0], limit=1, filter={"action": "jump"})
```

    [[UUID('73d05df0-84c1-11ee-98da-6ee10b77fd08'),
      {'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

The returned records contain 5 fields:

| name      | description                                             |
|-----------|---------------------------------------------------------|
| id        | The UUID of the record                                  |
| metadata  | The JSON metadata associated with the record            |
| contents  | the text content that was embedded                      |
| embedding | The vector embedding                                    |
| distance  | The distance between the query embedding and the vector |

You can access the fields by simply using the record as a dictionary
keyed on the field name:

``` python
records = vec.search([1.0, 9.0], limit=1, filter={"action": "jump"})
(records[0]["id"],records[0]["metadata"], records[0]["contents"], records[0]["embedding"], records[0]["distance"])
```

    (UUID('73d05df0-84c1-11ee-98da-6ee10b77fd08'),
     {'action': 'jump', 'animal': 'fox'},
     'jumped over the',
     array([ 1. , 10.8], dtype=float32),
     0.00016793422934946456)

You can delete by ID:

``` python
vec.delete_by_ids([records[0]["id"]])
```

Or you can delete by metadata filters:

``` python
vec.delete_by_metadata({"action": "jump"})
```

To delete all records use:

``` python
vec.delete_all()
```

## Advanced usage

This section goes into more detail about the Python interface. It covers:

1.  Search filter options - how to narrow your search by additional
    constraints
2.  Indexing - how to speed up your similarity queries
3.  Time-based partitioning - how to optimize similarity queries that
    filter on time
4.  Setting different distance types to use in distance calculations

### Search options

The `search` function is very versatile and allows you to search for the right vector in a wide variety of ways. This section describes the search option in 3 parts:

1.  Basic similarity search.
2.  How to filter your search based on the associated metadata.
3.  Filtering on time when time-partitioning is enabled.

The following examples are based on this data:

``` python
vec.upsert([\
    (uuid.uuid1(), {"animal":"fox", "action": "sit", "times":1}, "the brown fox", [1.0,1.3]),\
    (uuid.uuid1(),  {"animal":"fox", "action": "jump", "times":100}, "jumped over the", [1.0,10.8]),\
])
```

The basic query looks like this:

``` python
vec.search([1.0, 9.0])
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456],
     [UUID('7487af14-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

You could provide a limit for the number of items returned:

``` python
vec.search([1.0, 9.0], limit=1)
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

#### Narrowing your search by metadata

There are two main ways to filter results by metadata:
- `filters` for equality matches on metadata.
- `predicates` for complex conditions on metadata.

Filters are more limited in what they can express, but are also more performant. You should use filters if your use case allows it.

##### Using filters for equality matches

You could specify a match on the metadata as a dictionary where all keys
have to match the provided values (keys not in the filter are
unconstrained):

``` python
vec.search([1.0, 9.0], limit=1, filter={"action": "sit"})
```

    [[UUID('7487af14-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

You can also specify a list of filter dictionaries, where an item is
returned if it matches any dict:

``` python
vec.search([1.0, 9.0], limit=2, filter=[{"action": "jump"}, {"animal": "fox"}])
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456],
     [UUID('7487af14-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

##### Using predicates for more advanced filtering on metadata

Predicates allow for more complex search conditions. For example, you
could use greater than and less than conditions on numeric values.

``` python
vec.search([1.0, 9.0], limit=2, predicates=client.Predicates("times", ">", 1))
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

`Predicates`
objects are defined by the name of the metadata key, an operator, and a value.

The supported operators are: `==`, `!=`, `<`, `<=`, `>`, `>=`

The type of the values determines the type of comparison to perform. For
example, passing in `"Sam"` (a string) performs a string comparison while
a `10` (an int) performs an integer comparison, and a `10.0`
(float) performs a float comparison. It is important to note that using a
value of `"10"` performs a string comparison as well so it's important to
use the right type. Supported Python types are: `str`, `int`, and
`float`.

One more example with a string comparison:

``` python
vec.search([1.0, 9.0], limit=2, predicates=client.Predicates("action", "==", "jump"))
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

The real power of predicates is that they can also be combined using the
`&` operator (for combining predicates with `AND` semantics) and `|`(for
combining using OR semantic). So you can do:

``` python
vec.search([1.0, 9.0], limit=2, predicates=client.Predicates("action", "==", "jump") & client.Predicates("times", ">", 1))
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

Just for sanity, the next example shows a case where no results are returned because
of predicates:

``` python
vec.search([1.0, 9.0], limit=2, predicates=client.Predicates("action", "==", "jump") & client.Predicates("times", "==", 1))
```

    []

And one more example where the predicates are defined as a variable
and use grouping with parenthesis:

``` python
my_predicates = client.Predicates("action", "==", "jump") & (client.Predicates("times", "==", 1) | client.Predicates("times", ">", 1))
vec.search([1.0, 9.0], limit=2, predicates=my_predicates)
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

There is also semantic sugar for combining many predicates with `AND`
semantics. You can pass in multiple 3-tuples to
`Predicates`:

``` python
vec.search([1.0, 9.0], limit=2, predicates=client.Predicates(("action", "==", "jump"), ("times", ">", 10)))
```

    [[UUID('7487af96-84c1-11ee-98da-6ee10b77fd08'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

#### Filter your search by time

When using `time-partitioning` (see below) you can very efficiently
filter your search by time. Time-partitioning associates the timestamp embedded
in a UUID-based ID with an embedding. First,
create a collection with time partitioning and insert some data (one
item from January 2018 and another in January 2019):

``` python
tpvec = client.Sync(service_url, "time_partitioned_table", 2, time_partition_interval=timedelta(hours=6))
tpvec.create_tables()

specific_datetime = datetime(2018, 1, 1, 12, 0, 0)
tpvec.upsert([\
    (client.uuid_from_time(specific_datetime), {"animal":"fox", "action": "sit", "times":1}, "the brown fox", [1.0,1.3]),\
    (client.uuid_from_time(specific_datetime+timedelta(days=365)),  {"animal":"fox", "action": "jump", "times":100}, "jumped over the", [1.0,10.8]),\
])
```

Then, you can filter using the timestamps by specifying a
`uuid_time_filter`:

``` python
tpvec.search([1.0, 9.0], limit=4, uuid_time_filter=client.UUIDTimeRange(specific_datetime, specific_datetime+timedelta(days=1)))
```

    [[UUID('33c52800-ef15-11e7-be03-4f1f9a1bde5a'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

A
[`UUIDTimeRange`](https://timescale.github.io/python-vector/vector.html#uuidtimerange)
can specify a `start_date` or `end_date` or both(as in the example above).
Specifying only the `start_date` or `end_date` leaves the other end
unconstrained.

``` python
tpvec.search([1.0, 9.0], limit=4, uuid_time_filter=client.UUIDTimeRange(start_date=specific_datetime))
```

    [[UUID('ac8be800-0de6-11e9-889a-5eec84ba8a7b'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456],
     [UUID('33c52800-ef15-11e7-be03-4f1f9a1bde5a'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

You have the option to define whether the start and end dates
are inclusive with the `start_inclusive` and `end_inclusive` parameters. Setting
`start_inclusive` to true results in comparisons using the `>=`
operator, whereas setting it to false applies the `>` operator. By
default, the start date is inclusive, while the end date is exclusive.
One example:

``` python
tpvec.search([1.0, 9.0], limit=4, uuid_time_filter=client.UUIDTimeRange(start_date=specific_datetime, start_inclusive=False))
```

    [[UUID('ac8be800-0de6-11e9-889a-5eec84ba8a7b'),
      {'times': 100, 'action': 'jump', 'animal': 'fox'},
      'jumped over the',
      array([ 1. , 10.8], dtype=float32),
      0.00016793422934946456]]

Notice how the results are different when using the
`start_inclusive=False` option because the first row has the exact
timestamp specified by `start_date`.

It is also easy to integrate time filters using the `filter` and
`predicates` parameters described above using special reserved key names
to make it appear that the timestamps are part of your metadata. This
is useful when integrating with other systems that just want to
specify a set of filters (often these are "auto retriever" type
systems). The reserved key names are `__start_date` and `__end_date` for
filters and `__uuid_timestamp` for predicates. Some examples below:

``` python
tpvec.search([1.0, 9.0], limit=4, filter={ "__start_date": specific_datetime, "__end_date": specific_datetime+timedelta(days=1)})
```

    [[UUID('33c52800-ef15-11e7-be03-4f1f9a1bde5a'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

``` python
tpvec.search([1.0, 9.0], limit=4,
             predicates=client.Predicates("__uuid_timestamp", ">", specific_datetime) & client.Predicates("__uuid_timestamp", "<", specific_datetime+timedelta(days=1)))
```

    [[UUID('33c52800-ef15-11e7-be03-4f1f9a1bde5a'),
      {'times': 1, 'action': 'sit', 'animal': 'fox'},
      'the brown fox',
      array([1. , 1.3], dtype=float32),
      0.14489260377438218]]

### Indexing

Indexing speeds up queries over your data. By default, the system creates indexes
to query your data by the UUID and the metadata.

To speed up similarity search based on the embeddings, you have to
create additional indexes.

Note that if performing a query without an index, you always get an
exact result, but the query is slow (it has to read all of the data
you store for every query). With an index, your queries are
order-of-magnitude faster, but the results are approximate (because there
are no known indexing techniques that are exact).

Luckily, Timescale provides 3 excellent approximate indexing algorithms,
pgvectorscale index, pgvector HNSW, and pgvector ivfflat.

Below are the trade-offs between these algorithms:

| Algorithm        | Build speed | Query speed | Need to rebuild after updates |
|------------------|-------------|-------------|-------------------------------|
| pgvectorscale | Slow        | Fastest     | No                            |
| pgvector HNSW    | Slowest     | Faster      | No                            |
| pgvector ivfflat | Fastest     | Slowest     | Yes                           |

You can see
[benchmarks](https://www.timescale.com/blog/how-we-made-postgresql-the-best-vector-database/)
on the blog.

You should use the pgvectorscale index for most use cases. This
can be created with:

``` python
vec.create_embedding_index(client.TimescaleVectorIndex())
```

Indexes are created for a particular distance metric type. So it is
important that the same distance metric is set on the client during
index creation as it is during queries. See the `distance type` section
below.

Each of these indexes has a set of build-time options for controlling
the speed/accuracy trade-off when creating the index and an additional
query-time option for controlling accuracy during a particular query. The
library uses smart defaults for all of these options. The
details for how to adjust these options manually are below.

<!-- vale Google.Headings = NO -->
#### pgvectorscale index
<!-- vale Google.Headings = YES -->

The pgvectorscale index is a graph-based algorithm that uses the
[DiskANN](https://github.com/microsoft/DiskANN) algorithm. You can read
more about it in the
[blog](https://www.timescale.com/blog/how-we-made-postgresql-the-best-vector-database/)
announcing its release.

To create this index, run:

``` python
vec.create_embedding_index(client.TimescaleVectorIndex())
```

The above command creates the index using smart defaults. There are
a number of parameters you could tune to adjust the accuracy/speed
trade-off.

The parameters you can set at index build time are:

| Parameter name   | Description                                                                                                                                                   | Default value |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `num_neighbors`    | Sets the maximum number of neighbors per node. Higher values increase accuracy but make the graph traversal slower.                                           | 50            |
| `search_list_size` | This is the S parameter used in the greedy search algorithm used during construction. Higher values improve graph quality at the cost of slower index builds. | 100           |
| `max_alpha`        | Is the alpha parameter in the algorithm. Higher values improve graph quality at the cost of slower index builds.                                              | 1.0           |

To set these parameters, you could run:

``` python
vec.create_embedding_index(client.TimescaleVectorIndex(num_neighbors=50, search_list_size=100, max_alpha=1.0))
```

You can also set a parameter to control the accuracy vs. query speed
trade-off at query time. The parameter is set in the `search()` function
using the `query_params` argument. You can set the
`search_list_size`(default: 100). This is the number of additional
candidates considered during the graph search at query time. Higher
values improve query accuracy while making the query slower.

You can specify this value during search as follows:

``` python
vec.search([1.0, 9.0], limit=4, query_params=TimescaleVectorIndexParams(search_list_size=10))
```

To drop the index, run:

``` python
vec.drop_embedding_index()
```

#### pgvector HNSW index

Pgvector provides a graph-based indexing algorithm based on the popular
[HNSW algorithm](https://arxiv.org/abs/1603.09320).

To create this index, run:

``` python
vec.create_embedding_index(client.HNSWIndex())
```

The above command creates the index using smart defaults. There are
a number of parameters you could tune to adjust the accuracy/speed
trade-off.

The parameters you can set at index build time are:

| Parameter name  | Description                                                                                                                                                                                                                                                            | Default value |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `m`               | Represents the maximum number of connections per layer. Think of these connections as edges created for each node during graph construction. Increasing m increases accuracy but also increases index build time and size.                                             | 16            |
| `ef_construction` | Represents the size of the dynamic candidate list for constructing the graph. It influences the trade-off between index quality and construction speed. Increasing `ef_construction` enables more accurate search results at the expense of lengthier index build times. | 64            |

To set these parameters, you could run:

``` python
vec.create_embedding_index(client.HNSWIndex(m=16, ef_construction=64))
```

You can also set a parameter to control the accuracy vs. query speed
trade-off at query time. The parameter is set in the `search()` function
using the `query_params` argument. You can set the `ef_search`(default:
40). This parameter specifies the size of the dynamic candidate list
used during search. Higher values improve query accuracy while making
the query slower.

You can specify this value during search as follows:

``` python
vec.search([1.0, 9.0], limit=4, query_params=HNSWIndexParams(ef_search=10))
```

To drop the index run:

``` python
vec.drop_embedding_index()
```

#### pgvector ivfflat index

Pgvector provides a clustering-based indexing algorithm. The [blog
post](https://www.timescale.com/blog/nearest-neighbor-indexes-what-are-ivfflat-indexes-in-pgvector-and-how-do-they-work/)
describes how it works in detail. It provides the fastest
index-build speed but the slowest query speeds of any indexing
algorithm.

To create this index, run:

``` python
vec.create_embedding_index(client.IvfflatIndex())
```

Note: *ivfflat should never be created on empty tables* because it needs
to cluster data, and that only happens when an index is first created,
not when new rows are inserted or modified. Also, if your table
undergoes a lot of modifications, you need to rebuild this index
occasionally to maintain good accuracy. See the [blog
post](https://www.timescale.com/blog/nearest-neighbor-indexes-what-are-ivfflat-indexes-in-pgvector-and-how-do-they-work/)
for details.

Pgvector ivfflat has a `lists` index parameter that is automatically set
with a smart default based on the number of rows in your table. If you
know that you'll have a different table size, you can specify the number
of records to use for calculating the `lists` parameter as follows:

``` python
vec.create_embedding_index(client.IvfflatIndex(num_records=1000000))
```

You can also set the `lists` parameter directly:

``` python
vec.create_embedding_index(client.IvfflatIndex(num_lists=100))
```

You can also set a parameter to control the accuracy vs. query speed
trade-off at query time. The parameter is set in the `search()` function
using the `query_params` argument. You can set the `probes`. This
parameter specifies the number of clusters searched during a query. It
is recommended to set this parameter to `sqrt(lists)` where lists is the
`num_list` parameter used above during index creation. Higher values
improve query accuracy while making the query slower.

You can specify this value during search as follows:

``` python
vec.search([1.0, 9.0], limit=4, query_params=IvfflatIndexParams(probes=10))
```

To drop the index, run:

``` python
vec.drop_embedding_index()
```

### Time partitioning

In many use cases where you have many embeddings, time is an important
component associated with the embeddings. For example, when embedding
news stories, you often search by time as well as similarity
(for example, stories related to Bitcoin in the past week or stories about
Clinton in November 2016).

Yet, traditionally, searching by two components "similarity" and "time"
is challenging for Approximate Nearest Neighbor (ANN) indexes and makes the
similarity-search index less effective.

One approach to solving this is partitioning the data by time and
creating ANN indexes on each partition individually. Then, during search,
you can:

- Step 1: filter partitions that don't match the time predicate.
- Step 2: perform the similarity search on all matching partitions.
- Step 3: combine all the results from each partition in step 2, re-rank,
  and filter out results by time.

Step 1 makes the search a lot more efficient by filtering out whole
swaths of data in one go.

Timescale-vector supports time partitioning using TimescaleDB's
hypertables. To use this feature, simply indicate the length of time for
each partition when creating the client:

``` python
from datetime import timedelta
from datetime import datetime
```

``` python
vec = client.Async(service_url, "my_data_with_time_partition", 2, time_partition_interval=timedelta(hours=6))
await vec.create_tables()
```

Then, insert data where the IDs use UUIDs v1 and the time component of
the UUIDspecifies the time of the embedding. For example, to create an
embedding for the current time, simply do:

``` python
id = uuid.uuid1()
await vec.upsert([(id, {"key": "val"}, "the brown fox", [1.0, 1.2])])
```

To insert data for a specific time in the past, create the UUID using the
`uuid_from_time` function

``` python
specific_datetime = datetime(2018, 8, 10, 15, 30, 0)
await vec.upsert([(client.uuid_from_time(specific_datetime), {"key": "val"}, "the brown fox", [1.0, 1.2])])
```

You can then query the data by specifying a `uuid_time_filter` in the
search call:

``` python
rec = await vec.search([1.0, 2.0], limit=4, uuid_time_filter=client.UUIDTimeRange(specific_datetime-timedelta(days=7), specific_datetime+timedelta(days=7)))
```

### Distance metrics

Cosine distance is used by default to measure how similarly an embedding
is to a given query. In addition to cosine distance, Euclidean/L2 distance is
also supported. The distance type is set when creating the client
using the `distance_type` parameter. For example, to use the Euclidean
distance metric, you can create the client with:

``` python
vec  = client.Sync(service_url, "my_data", 2, distance_type="euclidean")
```

Valid values for `distance_type` are `cosine` and `euclidean`.

It is important to note that you should use consistent distance types on
clients that create indexes and perform queries. That is because an
index is only valid for one particular type of distance measure.

Note that the pgvectorscale index only supports cosine distance at
this time.
