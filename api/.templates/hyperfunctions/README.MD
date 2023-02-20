# Hyperfunctions template

Here are the templates for new hyperfunction groups.

## How to use

1.  Copy and paste this directory into the `api/_hyperfunctions` directory.

2.  Rename the directory after the main aggregate function for this family. For
    example, `uddsketch`.

3.  Fill in the templates for:
      *   [Introduction](./intro.md)
      *   [Aggregate function](./aggregate.md)
      *   [Accessor functions](./accessor.md)
      *   [Rollup function](./rollup.md)
      *   [Examples](./examples.md)

4.  Add a page-index entry under `api/page-index/page-index.js`.

        a.  You need a page for the category if it doesn't already exist (for
            example, `percentile approximation`).
            
            The `href` for this page should match the YAML field
            `hyperfunction > family`. For example, if `hyperfunction > family`
            is `percentile approximation`, the `href` is
            `percentile-approximation`.
            
            The `type` for the page is `redirect-to-child-page` (see example
            below).

        b.  Under the category, make a child page for each aggregate function in
            the category.
            
            The `href` for this page is the name of the aggregate function.

            The `type` for the page is `placeholder`.

    Example:

    ```js
    {
      title: "Approximate count distinct",
      href: "approximate-count-distinct",
      type: "redirect-to-child-page",
      children: [
        {
          title: "hyperloglog",
          href: "hyperloglog",
          type: "placeholder",
        },
      ],
    }
    ```

5.  Delete this README.

## Special cases

This group of functions has multiple aggregate functions, or an alternate
function that acts sort of like an aggregate, but isn't one:

*   If you have multiple aggregate functions:

    *   Are your aggregate functions guaranteed to always work with exactly the
        same accessors? (For example, one is simply a convenience wrapper
        around the other, and they produce the same type of aggregate object.)

        Choose one to be the main aggregate. For the other aggregates, use the
        `aggregate` template but set `hyperfunction > type` to
        `alternate aggregate`.

    *   Do the functions work with different accessors, or might they do so in
        the future?

        Split them into different directories. You can put them into the same
        larger category, for example `uddsketch` and `tdigest` are different
        directories but part of the same `percentile approximation` category
        because they both set `hyperfunction > family` to
        `percentile approximation`.

*   If you have an alternate function that acts sort of like an aggregate but
    isn't one, such as the `candlestick()` function that converts
    already-aggregated data into the right form:

    Use the `aggregate` template but set `hyperfunction > type` to
    `pseudo-aggregate`.
