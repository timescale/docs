# Widgets
A single paragraph description of the feature. Make sure to cover what the
feature does in one or two sentences, and describe the primary use case. For
example:

```txt
Continuous aggregates are designed to make queries on very large
datasets run faster. TimescaleDB continuous aggregates use PostgreSQL
[materialized views][postgres-materialized-views]
to continuously and incrementally refresh a query in the background, so that
when you run the query, only the data that has changed needs to be computed, not
the entire dataset.
```

Create a bulleted list of the containing pages, with brief descriptions for each
page, and include reference-style links. For example:

*   [Learn about widgets][about-widgets] to understand how it works
    before you begin using it.
*   [Create a widget][widget-create] and turn it on.
*   [Fiddle with a widget][widget-fiddle] to make it do stuff.
*   [Troubleshoot][widget-tshoot] widgets.


[about-widgets]: /how-to-guides/:currentVersion:/_template/about-widgets/
[widget-create]: /how-to-guides/:currentVersion:/_template/create-widgets/
[widget-fiddle]: /how-to-guides/:currentVersion:/_template/fiddle-widgets/
[widget-tshoot]: /how-to-guides/:currentVersion:/_template/troubleshooting/
