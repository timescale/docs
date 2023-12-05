---
title: About compression methods
excerpt: Understand the different compression methods
products: [cloud, mst, self_hosted]
keywords: [compression]
---

# About compression methods

TimescaleDB uses different compression algorithms, depending on the data type
that is being compressed.

For integers, timestamps, and other integer-like types, a combination of
compression methods are used: [delta encoding][delta],
[delta-of-delta][delta-delta], [simple-8b][simple-8b], and
[run-length encoding][run-length].

For columns that do not have a high amount of repeated values,
[XOR-based][xor] compression is used, with some
[dictionary compression][dictionary].

For all other types, [dictionary compression][dictionary] is used.

## Integer compression

For integers, timestamps, and other integer-like types TimescaleDB uses a
combination of delta encoding, delta-of-delta, simple 8-b, and run-length
encoding.

The simple-8b compression method has been extended so that data can be
decompressed in reverse order. Backward scanning queries are common in
time-series workloads. This means that these types of queries run much faster.

### Delta encoding

Delta encoding reduces the amount of information required to represent a data
object by only storing the difference, sometimes referred to as the delta,
between that object and one or more reference objects. These algorithms work
best where there is a lot of redundant information, and it is often used in
workloads like versioned file systems. For example, this is how Dropbox keeps
your files synchronized. Applying delta-encoding to time-series data means that
you can use fewer bytes to represent a data point, because you only need to
store the delta from the previous data point.

For example, imagine you had a dataset that collected CPU, free memory,
temperature, and humidity over time. If you time column was stored as an integer
value, like seconds since UNIX epoch, your raw data would look a little like
this:

|time|cpu|mem_free_bytes|temperature|humidity|
|-|-|-|-|-|
|2023-04-01 10:00:00|82|1,073,741,824|80|25|
|2023-04-01 10:05:00|98|858,993,459|81|25|
|2023-04-01 10:05:00|98|858,904,583|81|25|

With delta encoding, you only need to store how much each value changed from the
previous data point, resulting in smaller values to store. So after the first
row, you can represent subsequent rows with less information, like this:

|time|cpu|mem_free_bytes|temperature|humidity|
|-|-|-|-|-|
|2020-04-01 10:00:00|82|1,073,741,824|80|25|
|5 seconds|16|-214,748,365|1|0|
|5 seconds|0|-88,876|0|0|

Applying delta encoding to time-series data takes advantage of the fact that
most time-series datasets are not random, but instead represent something that
is slowly changing over time. The storage savings over millions of rows can be
substantial, especially if the value changes very little, or doesn't change at
all.

### Delta-of-delta encoding

Delta-of-delta encoding takes delta encoding one step further and applies
delta-encoding over data that has previously been delta-encoded. With
time-series datasets where data collection happens at regular intervals, you can
apply delta-of-delta encoding to the time column, which results in only needing to
store a series of zeroes.

In other words, delta encoding stores the first derivative of the dataset, while
delta-of-delta encoding stores the second derivative of the dataset.

Applied to the example dataset from earlier, delta-of-delta encoding results in this:

|time|cpu|mem_free_bytes|temperature|humidity|
|-|-|-|-|-|
|2020-04-01 10:00:00|82|1,073,741,824|80|25|
|5 seconds|16|-214,748,365|1|0|
|0|0|-88,876|0|0|

In this example, delta-of-delta further compresses 5 seconds in the time column
down to 0 for every entry in the time column after the second row, because the
five second gap remains constant for each entry. Note that you see two entries
in the table before the delta-delta 0 values, because you need two deltas to
compare.

This compresses a full timestamp of 8 bytes, or 64 bits, down to just a single
bit, resulting in 64x compression.

### Simple-8b

With delta and delta-of-delta encoding, you can significantly reduce the number
of digits you need to store. But you still need an efficient way to store the
smaller integers. The previous examples used a standard integer datatype for the
time column, which needs 64 bits to represent the value of 0 when delta-delta
encoded. This means that even though you are only storing the integer 0, you are
still consuming 64 bits to store it, so you haven't actually saved anything.

Simple-8b is one of the simplest and smallest methods of storing variable-length
integers. In this method, integers are stored as a series of fixed-size blocks.
For each block, every integer within the block is represented by the minimal
bit-length needed to represent the largest integer in that block. The first bits
of each block denotes the minimum bit-length for the block.

This technique has the advantage of only needing to store the length once for a
given block, instead of once for each integer. Because the blocks are of a fixed
size, you can infer the number of integers in each block from the size of the
integers being stored.

For example, if you wanted to store a temperature that changed over time, and
you applied delta encoding, you might end up needing to store this set of
integers:

|temperature (deltas)|
|-|
|1|
|10|
|11|
|13|
|9|
|100|
|22|
|11|

With a block size of 10 digits, you could store this set of integers as two
blocks: one block storing 5 2-digit numbers, and a second block storing 3
3-digit numbers, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
{2: [01, 10, 11, 13, 09]} {3: [100, 022, 011]}
`} />

In this example, both blocks store about 10 digits worth of data, even though
some of the numbers have to be padded with a leading 0. You might also notice
that the second block only stores 9 digits, because 10 is not evenly divisible
by 3.

Simple-8b works in this way, except it uses binary numbers instead of decimal,
and it usually uses 64-bit blocks. In general, the longer the integer, the fewer
number of integers that can be stored in each block.

### Run-length encoding

Simple-8b compresses integers very well, however, if you have a large number of
repeats of the same value, you can get even better compression with run-length
encoding. This method works well for values that don't change very often, or if
an earlier transformation removes the changes.

Run-length encoding is one of the classic compression algorithms. For
time-series data with billions of contiguous zeroes, or even a document with a
million identically repeated strings, run-length encoding works incredibly well.

For example, if you wanted to store a temperature that changed minimally over
time, and you applied delta encoding, you might end up needing to store this set
of integers:

|temperature (deltas)|
|-|
|11|
|12|
|12|
|12|
|12|
|12|
|12|
|1|
|12|
|12|
|12|
|12|

For values like these, you do not need to store each instance of the value, but
rather how long the run, or number of repeats, is. You can store this set of
numbers as `{run; value}` pairs like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
{1; 11}, {6; 12}, {1; 1}, {4; 12}
`} />

This technique uses 11 digits of storage (1, 1, 1, 6, 1, 2, 1, 1, 4, 1, 2),
rather than 23 digits that an optimal series of variable-length integers
requires (11, 12, 12, 12, 12, 12, 12, 1, 12, 12, 12, 12).

Run-length encoding is also used as a building block for many more advanced
algorithms, such as Simple-8b RLE, which is an algorithm that combines
run-length and Simple-8b techniques. TimescaleDB implements a variant of
Simple-8b RLE. This variant uses different sizes to standard Simple-8b, in order
to handle 64-bit values, and RLE.

## Floating point compression

For columns that do not have a high amount of repeated values, TimescaleDB uses
XOR-based compression.

The standard XOR-based compression method has been extended so that data can be
decompressed in reverse order. Backward scanning queries are common in
time-series workloads. This means that queries that use backwards scans run much
faster.

### XOR-based compression

Floating point numbers are usually more difficult to compress than integers.
Fixed-length integers often have leading zeroes, but floating point numbers usually
use all of their available bits, especially if they are converted from decimal
numbers, which can't be represented precisely in binary.

Techniques like delta-encoding don't work well for floats, because they do not
reduce the number of bits sufficiently. This means that most floating-point
compression algorithms tend to be either complex and slow, or truncate
significant digits. One of the few simple and fast lossless floating-point
compression algorithms is XOR-based compression, built on top of Facebook's
Gorilla compression.

XOR is the binary function `exclusive or`. In this algorithm, successive
floating point numbers are compared with XOR, and a difference results in a bit
being stored. The first data point is stored without compression, and subsequent
data points are represented using their XOR'd values.

## Data-agnostic compression

For values that are not integers or floating point, TiemscaleDB uses dictionary
compression.

### Dictionary compression

One of the earliest lossless compression algorithms, dictionary compression is
the basis of many popular compression methods. Dictionary compression can also
be found in areas outside of computer science, such as medical coding.

Instead of storing values directly, dictionary compression works by making a
list of the possible values that can appear, and then storing an index into a
dictionary containing the unique values. This technique is quite versatile, can
be used regardless of data type, and works especially well when you have a
limited set of values that repeat frequently.

For example, if you had the list of temperatures shown earlier, but you wanted
an additional column storing a city location for each measurement, you might
have a set of values like this:

|City|
|-|
|New York|
|San Francisco|
|San Francisco|
|Los Angeles|

Instead of storing all the city names directly, you can instead store a
dictionary, like this:

<CodeBlock canCopy={false} showLineNumbers={false} children={`
{0: "New York", 1: "San Francisco", 2: "Los Angeles",}
`} />

You can then store just the indices in your column, like this:

|City|
|-|
|0|
|1|
|1|
|2|

For a dataset with a lot of repetition, this can offer significant compression.
In the example, each city name is on average 11 bytes in length, while the
indices are never going to be more than 4 bytes long, reducing space usage
nearly 3 times. In TimescaleDB, the list of indices is compressed even further
with the Simple-8b+RLE method, making the storage cost even smaller.

Dictionary compression doesn't always result in savings. If your dataset doesn't
have a lot of repeated values, then the dictionary is the same size as the
original data. TimescaleDB automatically detects this case, and falls back to
not using a dictionary in that scenario.

[decompress-chunks]: /use-timescale/:currentVersion:/compression/decompress-chunks
[manual-compression]: /use-timescale/:currentVersion:/compression/manual-compression/
[delta]: /use-timescale/:currentVersion:/compression/compression-methods/#delta-encoding
[delta-delta]: /use-timescale/:currentVersion:/compression/compression-methods/#delta-of-delta-encoding
[simple-8b]: /use-timescale/:currentVersion:/compression/compression-methods/#simple-8b
[run-length]: /use-timescale/:currentVersion:/compression/compression-methods/#run-length-encoding
[xor]: /use-timescale/:currentVersion:/compression/compression-methods/#xor-based-encoding
[dictionary]: /use-timescale/:currentVersion:/compression/compression-methods/#dictionary-compression
