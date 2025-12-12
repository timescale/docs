# Formatting examples 

This page illustrates and provides examples of the formatting available for $COMPANY documentation. Note that for most elements, spacing is important. 

## Procedure

Use for a logical sequence of steps to achieve a goal. For example, create a hypertable.

![Procedure example](https://assets.timescale.com/docs/images/procedure-syntax.png)

Syntax:

    <Procedure>

    1. **Step 1 summary in bold**

       Step 1 explanation in details.

       ```
       step 1 code
       ```
   
    1. **Step 2 summary in bold**

       Step 2 explanation in details. 

       1. Sub-step 1.

         ```
         Sub-step 1 code
         ```
   
       1. Sub-step 2.

       1. Sub-step 3. 

    </Procedure>

See a [use example][data-tiering] in the docs.
  
## Highlight blocks

Use sparingly and only if it's essential to attract the reader's attention. 

- Note
    
    ![Note highlight](https://assets.timescale.com/docs/images/highlight-note.png)

    Syntax:

      <Highlight type="note">
    
      Additional relevant information worth highlighting. 
    
      </Highlight>

    See a [use example][disable-chunk-skipping] in the docs.

- Important
    
    ![Important highlight](https://assets.timescale.com/docs/images/highlight-important.png)

    Syntax: 

      <Highlight type="important">
    
      Important things to keep in mind. 
    
      </Highlight>

    See a [use example][decompress-chunks] in the docs.

- Warning
    
    ![Caution highlight](https://assets.timescale.com/docs/images/highlight-warning.png)

    Syntax:

      <Highlight type="warning">
    
      Caution!
    
      </Highlight>

    See a [use example][alerting] in the docs.

- Deprecation
    
    ![Deprecated highlight](https://assets.timescale.com/docs/images/highlight-deprecation.png)

    Syntax:

      <Highlight type="deprecation">
    
      A deprecation notice.
    
      </Highlight>

    See a [use example][deprecation] in the docs.

- Cloud
    
    ![Cloud highlight](https://assets.timescale.com/docs/images/highlight-cloud.png)

    Syntax:

      <Highlight type="cloud">
    
      A note dealing specifically with Tiger.
    
      </Highlight>

## Tabs

![Tabs](https://assets.timescale.com/docs/images/tabs-example.png)

Syntax:

    <Tabs label="Tabs label for accessibility" persistKey="keyfromlistinprocedure.md">
    
    <Tab title="First tab title" label="labelfromlistinprocedure.md">
    
    First tab content
    
    </Tab>

    <Tab title="Second tab title" label="otherlabelfromlistinprocedure.md">
    
    Second tab content
    
    </Tab>

    </Tabs>

See a [use example][live-migration] in the docs.

## Code blocks 

As a default, use [fenced Markdown code blocks][fenced-code-blocks]:

![Regular code block](https://assets.timescale.com/docs/images/markdown-code-block.png)

To remove line numbers and the copy button, use the `CodeBlock` component with `canCopy` and `showLineNumbers` set to `false`:

![Custom code block](https://assets.timescale.com/docs/images/custom-code-block.png)

Syntax: 

    <CodeBlock canCopy={false} showLineNumbers={false} children={`
    CREATE TABLE conditions (
           time          TIMESTAMPZ        NOT NULL,
           location      TEXT              NOT NULL,
           device        TEXT              NOT NULL,
           temperature   DOUBLE PRECISION  NULL,
           humidity      DOUBLE PRECISION  NULL
    );
    `} />

See a [use example][connection-pooling] in the docs.

## Multi-tab code blocks

![Multi-tab code block](https://assets.timescale.com/docs/images/multi-tab-code.png)

Syntax: 

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
    go code
    ```
        
    </tab>
        
    </Terminal>

## Tags

- Download

  ![Download tag](https://assets.timescale.com/docs/images/tag-download.png)

   Syntax:

      <Tag type="download">Markdown link to download</Tag>

   See a [use example][installation-windows] in the docs.

- Experimental
  
  ![Experimental tag](https://assets.timescale.com/docs/images/tag-experimental.png)

   Syntax:

      <Tag type="experimental">Experimental</Tag>

   See a [use example][time-bucket] in the docs.

- $TOOLKIT_LONG
 
  ![Tooklit tag](https://assets.timescale.com/docs/images/tag-toolkit.png)

   Syntax:

      <Tag type="toolkit">Toolkit</Tag>

   See a [use example][time-weighted-average] in the docs.

- Community
  
  ![Community tag](https://assets.timescale.com/docs/images/tag-community.png)

   Syntax:

      <Tag type="community">Community</Tag>

   See a [use example][remove-reorder-policy] in the docs.

- Hollow

  ![Hollow tag](https://assets.timescale.com/docs/images/hollow-tag.png)

   Syntax:

   ```text
   <Tag variant="hollow">Text to display in a tag</Tag>
   ```

## Partials

Import a partial from the `_partials` directory and then reference it in the relevant part of the page. 

Syntax: 

    import PartialName from "versionContent/_partials/_partial.mdx";
    
    <PartialName />

See a [use example][live-migration] in the docs.

## Links

Links should be [reference-style Markdown links][reference-links]. 

Syntax:

    [Anchor][link-label]
    

For example:

[A link to the data tiering section in docs][data-tiering]

    [link-label]: absolute or relative URL
[data-tiering]: ../use-timescale/data-tiering/enabling-data-tiering.md
[disable-chunk-skipping]: ../api/hypertable/disable_chunk_skipping.md
[decompress-chunks]: ../use-timescale/compression/decompress-chunks.md
[alerting]: ../use-timescale/alerting.md
[deprecation]: ../_partials/_deprecated.md
[live-migration]: ../migrate/live-migration.md
[fenced-code-blocks]: https://www.markdownguide.org/extended-syntax/#fenced-code-blocks
[connection-pooling]: ../use-timescale/services/connection-pooling.md
[installation-windows]: ../self-hosted/install/installation-windows.md
[time-bucket]: ../api/time_bucket_ng.md
[time-weighted-average]: ../api/time-weighted-averages.md
[remove-reorder-policy]: ../api/hypertable/remove_reorder_policy.md
[reference-links]: https://www.markdownguide.org/basic-syntax/#reference-style-links
