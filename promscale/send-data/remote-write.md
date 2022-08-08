# Write data to Promscale using the remote-write API

Promscale provides a remote-write endpoint for ingesting data. The endpoint is
compatible with Prometheus. You can also push data to Promscale from a custom
application.

To configure Prometheus for remote writing to Promscale, see the section on
[writing from Prometheus][write-prometheus]. This section covers how to 
use the remote-write endpoint with a custom application.

## Overview of remote-write endpoint

The remote-write endpoint is located at `http://<PROMSCALE_URL>:<PORT>/write`.
The URL and port depend on your configuration. For example, if you're running
locally on the default port, the endpoint is located at
`http://localhost:9201/write`.

Only the HTTP POST method is supported.

The default data format is Protobuf, but JSON streaming and text are also
supported.

For more information on endpoint details, see the 
[Prometheus documentation][prometheus-remote-storage].

## Formats

This section covers formats for sending data to the Promscale endpoint,
including:

*   [General format for time-series data][general-format]
*   [Protobuf format][protobuf-format]
*   [JSON streaming format][json-format]
*   [Prometheus and OpenMetric text format][text-format]

## General format for time-series data

A time series must contain both labels and samples.

Labels are a collection of label name/value pairs with unique label names. Every
request must contain a label named `__name__` which cannot have an empty value.
All other labels are optional metadata.

A sample must contain two things:

*   An integer timestamp in milliseconds since the UNIX epoch. In other words,
    the number of milliseconds since `1970-01-01 00:00:00 UTC`, excluding leap
    seconds. This should be represented as required by Go's [ParseInt][parseint]
    function.
*   A floating point number that represents the actual measured value.

## Protobuf format

Protobuf is the default data format. It is slightly more complex than the 
[JSON streaming format][json-format], but it is usually more performant, because the
payload is smaller. We recommend this format if you're building a system to
ingest a lot of data continuously.

<procedure>

### Using the Promscale endpoint with the Protobuf format

1.  Fetch the protocol buffer definition files 
    [from the Prometheus GitHub repository][protobuf-definition].
1.  Compile the definitions into the structures of the programming language
    you're using. For instructions, see the 
    [Google Protobuf tutorials][protobuf-tutorials].
1.  Use the structures to construct requests to send to the Promscale write
    endpoint. For more information, see 
    [this sample request written in Go][go-sample].

</procedure>

### Protobuf example in Go

Before you begin, you need the Protobuf definition files, available in the
Prometheus codebase. These definitions must be compiled into the necessary
classes for payload serialization.

Since Prometheus is written in the Go language, you can directly import the
pre-generated classes from the [prompb][prompb] package in the Prometheus repository.
This gives you all the necessary classes to create a write request.

Then, you can:

*   Create a `WriteRequest` object
*   Preload it with metrics data
*   Serialize it
*   Send it as an HTTP request

A simplified `main.go` file for these steps looks like this:

```go
package main
import (
    "bytes"
    "net/http"
    "github.com/gogo/protobuf/proto"
    "github.com/golang/snappy"
)
func main() {
    // Create the WriteRequest object with metric data populated.
    wr := &WriteRequest{
        Timeseries: []TimeSeries{
            TimeSeries{
                Labels: []Label{
                    {
                        Name:  "__name__",
                        Value: "foo",
                    },
                },
                Samples: []Sample{
                    {
                        Timestamp: 1577836800000,
                        Value:     100.0,
                    },
                },
            },
        },
    }
    // Marshal the data into a byte slice using the protobuf library.
    data, err := proto.Marshal(wr)
    if err != nil {
        panic(err)
    }
    // Encode the content into snappy encoding.
    encoded := snappy.Encode(nil, data)
    body := bytes.NewReader(encoded)
    // Create an HTTP request from the body content and set necessary parameters.
    req, err := http.NewRequest("POST", "http://localhost:9201/write", body)
    if err != nil {
        panic(err)
    }
    // Set the required HTTP header content.
    req.Header.Set("Content-Type", "application/x-protobuf")
    req.Header.Set("Content-Encoding", "snappy")
    req.Header.Set("X-Prometheus-Remote-Write-Version", "0.1.0")
    // Send request to Promscale.
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    ...
```

## JSON streaming format

The JSON streaming format makes it easier to ingest metric data from third-party
tools. It was introduced in Promscale and is not part of the Prometheus
`remote-write` specification. JSON streaming is slightly less efficient than
Protobuf.

This format uses a JSON stream of objects with two fields:

*   `labels`: A JSON object in which all the labels are represented as fields
*   `samples`: A JSON array which contains arrays of timestamp-value sets

A simple payload looks like this:

```json
{
    "labels":{"__name__": "cpu_usage", "namespace":"dev", "node": "brain"},
    "samples":[
        [1577836800000, 100],
        [1577836801000, 99],
        [1577836802000, 98],
        ...
    ]
}
{
    "labels":{"__name__": "cpu_usage", "namespace":"prod", "node": "brain"},
    "samples":[
        [1577836800000, 98],
        [1577836801000, 99],
        [1577836802000, 100],
        ...
    ]
}
...
```

In the `labels` object, fields represent the label name. Field values contain
the label value.

The `samples` array must be in this format:

*   Each array can only contain two values.
*   The first value is a UNIX timestamp in milliseconds. It must be an integer.
*   The second value is a floating point number which represents the metric
    value for that timestamp.

To send this data to Promscale, send an HTTP POST request. Set the request body
to the JSON payload. Also set these HTTP headers:

*   `Content-Type`: `application/json`.
*   `Content-Encoding`: Set to `snappy` if using snappy compression. Otherwise,
    leave unset.

Here's an example request sent with `curl`:

```bash
curl --header "Content-Type: application/json" \
--request POST \
--data '{"labels":{"__name__":"foo"},"samples":[[1577836800000, 100]]}' \
"http://localhost:9201/write"
```

Here's an example request using snappy encoding:

```bash
curl --header "Content-Type: application/json" \
--header "Content-Encoding: snappy" \
--request POST \
--data-binary "@snappy-payload.sz" \
"http://localhost:9201/write"
```

## Prometheus and OpenMetric text format

The text format makes it easier to ingest samples using a push model. Metrics
exposed in this format can be directly forwarded to Promscale. Promscale parses
the text file and stores the parsed data.

For more details about the format, see the:

*   [Prometheus text-based format docs][prometheus-text-format]
*   [OpenMetrics format specification][openmetrics-format]

A simple payload might look like this:

```bash
# HELP http_requests_total The total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="post",code="200"} 1027 1395066363000
http_requests_total{method="post",code="400"}    3 1395066363000
# A histogram, which has a pretty complex representation in the text format:
# HELP http_request_duration_seconds A histogram of the request duration.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05"} 24054
http_request_duration_seconds_bucket{le="0.1"} 33444
http_request_duration_seconds_bucket{le="0.2"} 100392
http_request_duration_seconds_bucket{le="0.5"} 129389
http_request_duration_seconds_bucket{le="1"} 133988
http_request_duration_seconds_bucket{le="+Inf"} 144320
http_request_duration_seconds_sum 53423
http_request_duration_seconds_count 144320
...
```

Each sample entry is a single line in this format:

*   Metric name
*   **OPTIONAL** Collection label name and value, in curly braces, immediately
    following the metric name
*   Floating point number that represents the actual measured value
*   **OPTIONAL** An integer timestamp in milliseconds since the UNIX epoch. In
    other words, the number of milliseconds since `1970-01-01 00:00:00 UTC`,
    excluding leap seconds. This should be represented as required by Go's
    [ParseInt][parseint] function.

    If the timestamp is omitted, request time is used in its place.

Send the payload in the body of an HTTP POST request. Set these header values:

*   `Content-Type`: Either `text/plain` or `application/openmetrics-text`,
    depending on which format you use.
*   `Content-Encoding`: Set to `snappy` if using snappy compression. Otherwise,
    leave unset.

Here's an example request sent with `curl`:

```bash
curl --header "Content-Type: text/plain" \
--request POST \
--data 'test_metric 1\nanother_metric 2' \
"http://localhost:9201/write"
```

Here's an example request using snappy encoding:

```bash
curl --header "Content-Type: application/openmetrics-text" \
--header "Content-Encoding: snappy" \
--request POST \
--data-binary "@snappy-payload.sz" \
"http://localhost:9201/write"
```

[general-format]: #general-format-for-time-series-data
[go-sample]: #protobuf-example-in-go
[json-format]: #json-streaming-format
[openmetrics-format]: https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md
[parseint]: https://golang.org/pkg/strconv/#ParseInt
[prometheus-text-format]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
[prompb]: https://github.com/prometheus/prometheus/blob/master/prompb/
[protobuf-definition]: https://github.com/prometheus/prometheus/blob/master/prompb/
[protobuf-format]: #protobuf-format
[protobuf-tutorials]: https://developers.google.com/protocol-buffers/docs/tutorials
[prometheus-remote-storage]: https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations
[text-format]: #prometheus-and-openmetric-text-format
[write-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
