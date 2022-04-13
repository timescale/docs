# README

This is the source for content for docs.timescale.com, starting with release 2.0.
All documentation for previous versions is in the deprecated repository called
[docs.timescale.com-content](https://github.com/timescale/docs.timescale.com-content).

The docs website site uses this repo as a submodule and converts the files directly into
pages using a bash script and markdown parser.

**All files are written in standard markdown.**

## Contributing

We welcome and appreciate any help the community can provide to make
TimescaleDB's documentation better.

You can help either by opening an
[issue](https://github.com/timescale/docs/issues) with
any suggestions or bug reports, or by forking this repository, making your own
contribution, and submitting a pull request.

Before we accept any contributions, Timescale contributors need to
sign the [Contributor License Agreement](https://cla-assistant.io/timescale/docs) (CLA).
By signing a CLA, we can ensure that the community is free and confident in its
ability to use your contributions.

## Docs versions

There is a version of the docs for each supported version of the database, stored in
a separate git branch. Our docs site parses those branches to allow users to choose
what version of the docs they want to see. When submitting pull requests, you should determine
what versions of the docs your changes will apply to and attach a label to the pull request
that denotes the earliest version that your changes should apply to (`2.0`, `2.1`, etc.)
The admin for the docs will use that as a guide when updating version branches.

## Docs review

Once a PR has been started for any branch, a GitHub action will attach a unique
URL to preview your changes and allow others to more effectively review your
updates. The URL will be added as a comment to your PR.

Any new commits to that PR will rebuild and be visible at the same URL.

## Main sections and tree navigation

Each major section that is incorporated into docs.timescale.com has a navigation
hierarchy governed by the appropriate `page-index.js` file and underlying
directory structure. Depending on the content you are adding or editing, you may
have to modify the `page-index.js` file that exists for that specific sub-project.

For instance, if you are adding a new function to the 'API Reference' section,
then you need to modify the `page-index.js` file inside of `api-reference` folder,
specifically at `api-reference/page-index/page-index.js`.

Most content is then held within the parent folder as defined by the hierarchy. For
instance, the **Overview** section is a parent to a number of other pages and
folders. Therefore, there is a folder in the repo for `overview` with more Markdown
files and folder inside as the hierarchy dictates.

As a general rule, every folder must have an `index.md` file inside which will
have the content and layout for the "landing page" of that parent folder.

### `page-index.js` layout

The format of this file is generally self explanatory, but the following
rules should be understood to ensure you get the results you expect.

 - **href**: The minimum detail for any node in the tree is the `href` element. This
is used as both the name of the Markdown file (eg. `example-file.md`) to utilize for this URL and as
the text in the tree (Camel Case and all hyphens replaced by spaces).

 - **title**: If the navigation tree text should be anything other than the `href`
as described above, add a `title` tag provide the exact text you would like to
appear in the tree (and browser `Title` area).

- **pageComponents**: Any page that has children pages can list the children titles
in a "card" or "list" style at the bottom of any other content for the parent page. To
direct how a parent page should format links to the child object, use a value of
either `['featured-cards']` or `['content-list']`

 - **children**: An array of additional `title`/`href` objects, assumed to be inside
of an on-disk folder with the same name as the parent.

 - **type**: In some special cases, a tree element may have a special `type` associated
with it. This is rarely needed in day-to-day documentation updates, but when
specific functionality is required, it may be necessary to inquire about other page types. Currently `page` and `directory` the two major supported types in documentation.

 - **excerpt**: Excerpt displayed in the related content cards at the bottom of each page.

 - **keywords**: An array of keywords to be displayed at the bottom of the given page.

 - **relatedPages**: An array of pathnames will be displayed in the related content section of the given page. For example: "/promscale/:currentVersion:/installation/" - note the slashes and the use of :currentVersion:.
 
 - **"NEW" label**: To add a "NEW" label to content in the sidebar, include the key newLabel and the value 
 of a date string when the "NEW" label is set to expire. Use the format `"Month Day Year"` or `"YYYY-MM-DD"`.

__Example__
```js
    href: "overview",
    pageComponents: ["featured-cards"],
    children: [
        {
        title: "What is time-series data?",
        href: "what-is-time-series-data",
        newLabel: "October 21 2022"
        },
        {
        href: "core-concepts",
        children : [
            {
            title: "Hypertables & Chunks",
            href: "hypertables-and-chunks"
            },
            {
            href: "scaling"
            },
            ...
        ]
        }
    ]
```

In this example:

- `overview` is a parent and has no unique navigation title. If you look at the
tree under the **TimescaleDB** section in a browser, you will see the output is **Overview**
(Camel Case)

- **Overview** will have a visual indicator in the browser that it has children,
in this case at least **What is time-series data?** and **Core Concepts** (among
others)

- The content for the **Overview** page will be displayed first, and then all `title` elements
for the children will be displayed as "cards" below any content because of the **pageComponents**
setting

- Two of the examples above display a  navigation and page title text that is different from
the name of their source Markdown files. For instance, the content for **Hypertables
& Chunks** is found in the Markdown file `hypertables-and-chunks.md`.


## Formatting and content rules

### Internal page links

None of the internal page links within these files will work on GitHub inside of
the raw Markdown files that are being reviewed. Instead, the review link discussed
above should be utilized for verifying all internal links.

Links should be formatted according to their target.

### External links:

Input as-is.

### Internal links pointing to urls outside the current page's product and/or version:

The link used does not need to include https://docs.timescale.com/, but should contain 
the appropriate product and version. 

### Internal links pointing to urls within the same product and version:

The link does not require the current product and version. If a product is used
in the url, there must be an accompanying version.

### Anchor tags

By default, any H2 or H3 heading ('##' and '###' respectively in Markdown) will
have an anchor tag generated automatically. You can set the anchor and table of 
contents text by using `[custom_table_of_contents_label](custom_anchor_tag)`

If you want to link to a specific part of the page elsewhere in your document, you
need to use special anchor Markdown next to your anchor text; eg. `[](anchor_name)`.

**Your anchor name must be unique** in order for the highlight scrolling to work properly.

### Code blocks

**Command formatting**

When showing commands being entered from a command line, do not include a
character for the prompt. Do this:

```bash
some_command
```

instead of this:
```bash
$ some_command
```

or this:
```bash
> some_command
```

Otherwise the code highlighter may be disrupted.

**Syntax highlighting**

When using a code block, add the appropriate language identifier after the
initial three backticks to provide the appropriate highlighting on the
rendered documentation site.

Programming language samples aside, most code blocks will usually be one of:
`bash`, `sql`, `json`.

### General formatting conventions

To maintain consistency, please follow these general rules.

 * Maintain text editor width for paragraphs at 80 characters. We ask you to do
this to assist in reviewing documentation changes. When text is very wide, it
is difficult to visually see where text has changed within a paragraph and keeping
a narrow width on text assists in making PRs easier to review. **Most editors such
as Visual Studio Code have settings to do this visually.**
 * Most links should be reference-style links where the link address is at the
bottom of the page. The two exceptions are:
   * Links within Tip/Warning Callouts. These must be inline links for now
   * Links to anchors on the same page as the link itself.
 * All functions, commands and standalone function arguments (ex. `SELECT`,
`time_bucket`) should be set as inline code within backticks ("\`command\`").
 * Functions should not be written with parentheses unless the function is
being written with arguments within the parentheses.
 * "PostgreSQL" is the way to write the elephant database name, rather than
"Postgres." "TimescaleDB" refers to the database, "Timescale" refers to the
company.
 * Use single quotes when referring to the object of a user interface action.
For example: Click 'Get started' to proceed with the tutorial.

### Callout and highlight blocks
To create a callout around a paragraph of text, wrap it with the following custom
React component tag. **Reminder**, any links within the callout text MUST have
inline link styles.

The `type` can currently support a value of `"tip"`, `"warning"`, `"important"`, `"deprecation"` or `"note`".

```html
<highlight type="tip">
Callout text goes here...

Example link style would [look like this](http://example.com/)
</highlight>
```

### Special formatting helpers
There are some custom modifications to the markdown parser to allow for special
formatting within the docs.

+ Adding `sss` to the start of every list item in an ordered list will result in
  a switch to "steps" formatting which is used to denote instructional steps, as
  for a tutorial.
+ Adding `:FOOTER_LINK: ` to the start of a paragraph(line) will format it as a "footer link."
+ Adding `x.y.z` anywhere in the text will be replaced by the version number of the branch. Ex. `look at file foo-x.y.z` >> `look at file foo-0.4.2`.
+ Adding `:pg_version:` to text displayed in an installation section (that is, any page with a filename beginning `installation-`) will display the PostgreSQL version number. This is primarily to be used for displayed filenames in install instructions that need to be modular based on the version.
+ Wrapping a link with `<tag type="download">[file link here](https://link-to-file.com)</tag>` will create a tag "bubble" wrapper around the link and append a 'download link' icon to the end of the link inline.
+ Designating functions
    + Adding `<tag type="community">Community</tag>` next to a header (for example, in the api section) adds decorator text "Community."
    + Adding `<tag type="function">TSDB Function</tag>` next to a header (for example, in the api section) adds decorator text "TSDB Function."

_Make sure to include the space after the formatting command._


### Editing the API section

There is a specific format for the API section which consists of:
- **Function name** with empty parentheses (if function takes arguments). Ex. `add_dimension()`
- A brief, specific description of the function
- Any warnings necessary
- **Required Arguments**
    - A table with columns for "Name," "Type," and "Description"
- **Optional Arguments**
    - A table with columns for "Name," "Type," and "Description"
- Any specific instructions about the arguments, including valid types
- **Sample Usage**
    - One or two literal examples of the function being used to demonstrate argument syntax.

See the API file to get an idea.
