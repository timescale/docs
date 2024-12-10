# Formatting examples 

This page explains how to use the formatting available for Timescale documentation and how it renders on the website. Note that for most elements, spacing is important. 

## Procedure

```xml
<Procedure>

1.  **Step 1 summary in bold**

    Step 1 explanation and details.

    ```
    step 1 code
    ```

1.  **Step 2 summary in bold** 

    Step 2 explanation and details.
    
    1. Sub-step 1.

       ```
       Sub-step 1 code
       ```
    
    1. Sub-step 2. 
    
    1. <Optional /> Sub-step 3. 

</Procedure>
```

![Procedure example](https://assets.timescale.com/docs/images/procedure-example.png)

The `Optional` tag is used to mark steps that are not required. 
  
## Highlight blocks

Use sparingly and only if it's essential to attract the reader's attention. 

- Note

    ```text
    <Highlight type="note">
    
    Additional relevant information worth highlighting.
    
    </Highlight>
    ```
    
    ![Note highlight](https://assets.timescale.com/docs/images/highlight-note.png)

- Important

    ```text
    <Highlight type="important">
    
    Important things to keep in mind.
    
    </Highlight>
    ```
    
    ![Important highlight](https://assets.timescale.com/docs/images/highlight-important.png)

- Warning

    ```text
    <Highlight type="warning">
    
    Caution!
    
    </Highlight>
    ```
    
    ![Caution highlight](https://assets.timescale.com/docs/images/highlight-warning.png)

- Deprecation

    ```text
    <Highlight type="deprecation">
    
    A deprecation notice.
    
    </Highlight>
    ```
    
    ![Deprecated highlight](https://assets.timescale.com/docs/images/highlight-deprecation.png)

- Cloud

    ```text
    <Highlight type="cloud">
    
    A note dealing specifically with Timescale Cloud.
    
    </Highlight>
    ```
    
    ![Cloud highlight](https://assets.timescale.com/docs/images/highlight-cloud.png)

## Tabs

```text
<Tabs label="Description of section, used for accessibility">

<Tab title="First tab title">

First tab content

</Tab>

<Tab title="Second tab title">

Second tab content

</Tab>

</Tabs>
```

![Tabs](https://assets.timescale.com/docs/images/tabs-example.png)

## Code blocks 

As a default, use [fenced Markdown code blocks](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks):

    ```sql
    CREATE TABLE conditions (
       time        TIMESTAMPTZ       NOT NULL,
       location    TEXT              NOT NULL,
       device      TEXT              NOT NULL,
       temperature DOUBLE PRECISION  NULL,
       humidity    DOUBLE PRECISION  NULL
    );
    ```

To remove line numbers and the copy button, use the `CodeBlock` component with `canCopy` and `showLineNumbers` set to `false`:

```text
<CodeBlock canCopy={false} showLineNumbers={false} children={`
code 
code 
code
`} />
```

![Custom code block](https://assets.timescale.com/docs/images/custom-code-block-example.png)

## Multi-tab code blocks

    <Terminal>
    
    <tab label='ruby'>
        
    ```ruby
    ruby code
    ```
        
    </tab>
        
    <tab label="python-1">
        
    ```python
    pyhon code
    ```
        
    </tab>
        
    <tab label="python-2">
        
    ```python
    different python code
    ```
        
    </tab>
        
    </Terminal>

![Multi-tab code block](https://assets.timescale.com/docs/images/multi-tab-code-block.png)

## Tags

```text
<Tag type="download">Markdown link to download</Tag>
```

![Download tag](https://assets.timescale.com/docs/images/tag-download.png)

```text
<Tag type="experimental" content="Experimental" /> or <Tag type="experimental-toolkit" content="Experimental"/> 
```

![Experimental tag](https://assets.timescale.com/docs/images/tag-experimental.png)

```text
<Tag type="toolkit" content="Toolkit" />
```

![Tooklit tag](https://assets.timescale.com/docs/images/tag-toolkit.png)

```text
<Tag type="community" content="Community" />
```

![Community tag](https://assets.timescale.com/docs/images/tag-community.png)

```text
<Tag variant="hollow">Text to display in a tag</Tag>
```

![Hollow tag](https://assets.timescale.com/docs/images/hollow-tag.png)

## Partials

```text
import PartialName from 'versionContent/_partials/_partial-name.mdx';

Page content preceding the partial.

<PartialName />

Page content following the partial.
```

## Links

```text
[anchor][reference-name]

Full page content goes here.

[reference-name]: /doc-section-name/:currentVersion:/path/to/page OR any external link
```




