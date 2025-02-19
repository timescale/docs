# Formatting examples 

This page illustrates and provides examples of the formatting available for Timescale documentation. Note that for most elements, spacing is important. 

## Procedure

Use for a logical sequence of steps to achieve a goal. For example, create a hypertable.  

![Procedure example](https://assets.timescale.com/docs/images/procedure-syntax.png)

See a [use example][data-tiering] in the docs.
  
## Highlight blocks

Use sparingly and only if it's essential to attract the reader's attention. 

- Note
    
    ![Note highlight](https://assets.timescale.com/docs/images/highlight-note.png)

    See a [use example][disable-chunk-skipping] in the docs.

- Important
    
    ![Important highlight](https://assets.timescale.com/docs/images/highlight-important.png)

    See a [use example][decompress-chunks] in the docs.

- Warning
    
    ![Caution highlight](https://assets.timescale.com/docs/images/highlight-warning.png)

    See a [use example][alerting] in the docs.

- Deprecation
    
    ![Deprecated highlight](https://assets.timescale.com/docs/images/highlight-deprecation.png)

    See a [use example][deprecation] in the docs.

- Cloud
    
    ![Cloud highlight](https://assets.timescale.com/docs/images/highlight-cloud.png)

    Syntax example:

    ```text
    <Highlight type="cloud">
    
    A note dealing specifically with Timescale Cloud.
    
    </Highlight>
    ```

## Tabs

![Tabs](https://assets.timescale.com/docs/images/tabs-example.png)

See a [use example][live-migration] in the docs.

## Code blocks 

As a default, use [fenced Markdown code blocks][fenced-code-blocks]:

![Regular code block](https://assets.timescale.com/docs/images/markdown-code-block.png)

To remove line numbers and the copy button, use the `CodeBlock` component with `canCopy` and `showLineNumbers` set to `false`:

![Custom code block](https://assets.timescale.com/docs/images/custom-code-block.png)

See a [use example][aggregation] in the docs.

## Multi-tab code blocks

![Multi-tab code block](https://assets.timescale.com/docs/images/multi-tab-code.png)

Syntax example: 

    <Terminal>
    
    <tab label='ruby'>
        
    ```ruby
    ruby code
    ```
        
    </tab>
        
    <tab label="python">
        
    ```python
    pyhon code
    ```
        
    </tab>
        
    <tab label="go">
        
    ```go
    different python code
    ```
        
    </tab>
        
    </Terminal>

## Tags

- Download

  ![Download tag](https://assets.timescale.com/docs/images/tag-download.png)

  See a [use example][installation-windows] in the docs.

- Experimental
  
  ![Experimental tag](https://assets.timescale.com/docs/images/tag-experimental.png)

  See a [use example][time-bucket] in the docs.

- Toolkit
 
  ![Tooklit tag](https://assets.timescale.com/docs/images/tag-toolkit.png)

  See a [use example][time-weighted-average] in the docs.

- Community
  
  ![Community tag](https://assets.timescale.com/docs/images/tag-community.png)

  See a [use example][remove-reorder-policy] in the docs.

- Hollow

  ![Hollow tag](https://assets.timescale.com/docs/images/hollow-tag.png)

  Syntax example:

  ```text
  <Tag variant="hollow">Text to display in a tag</Tag>
  ```

## Partials

Import a partial from the `_partials` directory and then reference it in the relevant part of the page. See a [use example][live-migration] in the docs.

## Links

Links should be [reference-style Markdown links][reference-links]. For example:

[A link to the data tiering section in docs][data-tiering]

[data-tiering]: ../use-timescale/data-tiering/enabling-data-tiering.md
[disable-chunk-skipping]: ../api/disable_chunk_skipping.md
[decompress-chunks]: ../use-timescale/compression/decompress-chunks.md
[alerting]: ../use-timescale/alerting.md
[deprecation]: ../_partials/_deprecated.md
[live-migration]: ../migrate/live-migration.md
[fenced-code-blocks]: https://www.markdownguide.org/extended-syntax/#fenced-code-blocks
[aggregation]: ../getting-started/test-drive-timescale-features.md
[installation-windows]: ../self-hosted/install/installation-windows.md
[time-bucket]: ../api/time_bucket_ng.md
[time-weighted-average]: ../api/time-weighted-averages.md
[remove-reorder-policy]: ../api/remove_reorder_policy.md
[reference-links]: https://www.markdownguide.org/basic-syntax/#reference-style-links


