# Contribute to TigerData documentation

TigerData documentation is open for contribution from all community members. The current source is in this repository.

This page explains the structure and language guidelines for contributing to TigerData documentation. See the [README][readme] for how to contribute. 

## Language

Write in a clear, concise, and actionable manner. TigerData documentation uses the [Google Developer Documentation Style Guide][google-style] with the following exceptions:

- Do not capitalize the first word after a colon.
- Use code font (back ticks) for UI elements instead of semi-bold.

## Edit individual pages

Each major doc section has a dedicated directory with `.md` files inside, representing its child pages. This includes an `index.md` file that serves as a landing page for that doc section by default, unless specifically changed in the navigation tree. To edit a page, modify the corresponding `.md` file following these recommendations: 

- **Regular pages** should include:

  - A short intro describing the main subject of the page.
  - A visual illustrating the main concept, if relevant.
  - Paragraphs with descriptive headers, organizing the content into logical sections. 
  - Procedures to describe the sequence of steps to reach a certain goal. For example, create a Tiger Cloud service. 
  - Other visual aids, if necessary.
  - Links to other relevant resources. 

- **API pages** should include:

  - The function name, with empty parentheses if it takes arguments. 
  - A brief, specific description of the function, including any possible warnings. 
  - One or two samples of the function being used to demonstrate argument syntax.
  - An argument table with `Name`, `Type`, `Default`, `Required`, `Description` columns.
  - A return table with `Column`, `Type`, and `Description` columns.

- **Troubleshooting pages** are not written as whole Markdown files, but are programmatically assembled from individual files in the`_troubleshooting` folder. Each entry describes a single troubleshooting case and its solution, and contains the following front matter:
    
    |Key| Type  |Required| Description                                                                                                                                                                           | 
    |-|-------|-|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    |`title`| string                                              |✅| The title of the troubleshooting entry, displayed as a heading above it                                                                                                               |
    |`section`| The literal string `troubleshooting`                |✅| Must be `troubleshooting`, used to identify troubleshooting entries during site build                                                                                                 |
    |`products` or `topics`| array of strings                                    |✅ (can have either or both, but must have at least one)| The products or topics related to the entry. The entry shows up on the troubleshooting pages for the listed products and topics.                                                      |
    |`errors`| object of form `{language: string, message: string}` |❌| The error, if any, related to the troubleshooting entry. Displayed as a code block right underneath the title. `language` is the programming language to use for syntax highlighting. |
    |`keywords`| array of strings                                    |❌| These are displayed at the bottom of every troubleshooting page. Each keyword links to a collection of all pages associated with that keyword.                                        |
    |`tags`| array of strings                                    |❌| Concepts, actions, or things associated with the troubleshooting entry. These are not displayed in the UI, but they affect the calculation of related pages.                          |
    
    Beneath the front matter, describe the error and its solution in regular Markdown. You can also use any other components allowed within the docs site.
    
    The entry shows up on the troubleshooting pages for its associated products and topics. If the page doesn't already exist, add an entry for it in the page
    index, setting `type` to `placeholder`. See [Navigation tree](#navigation-tree).

## Edit the navigation hierarchy

The navigation hierarchy of a doc section is governed by `page-index/page-index.js` within the corresponding directory. For example:

```js
     {
        title: "Tiger Cloud services",
        href: "services",
        excerpt: "About Tiger Cloud services",
        children: [
          {
            title: "Services overview",
            href: "service-overview",
            excerpt: "Tiger Cloud services overview",
          },
          {
            title: "Service explorer",
            href: "service-explorer",
            excerpt: "Tiger Cloud services explorer",
          },
          {
            title: "Troubleshooting Tiger Cloud services",
            href: "troubleshooting",
            type: "placeholder",
          },
        ],
      },
```

See [Use $CLOUD_LONG section navigation][use-navigation] for reference.

To change the structure, add or delete pages in a section, modify the corresponding `page-index.js`. An entry in a `page-index.js` includes the following fields: 

| Key                | Type                                                      | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------------|-----------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `href`             | string                                                    | ✅      | The URL segment to use for the page. If there is a corresponding Markdown file, `href` must match the name of the Markdown file, minus the file extension.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `title`            | string                                                    | ✅      | The title of the page, used as the page name within the TOC on the left. Must be the same as the first header in the corresponding Markdown file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `excerpt`          | string                                                    | ✅       | The short description of the page, used for the page card if `pageComponents` is set to `featured-cards`. Should be up to 100 characters. See `pageComponents` for details.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `type`             | One of `[directory, placeholder, redirect-to-child-page]` | ❌       | If no type is specified, the page is built as a regular webpage. The structure of its children, if present, is defined by `children` entries and the corresponding structure of subfolders.  If the type is `directory`, the corresponding file becomes a directory. The difference of the directory page is that its child pages sit at the same level as the `directory` page. They only become children during the site build. If the type is `placeholder`, the corresponding page is produced programmatically upon site build. If not produced, the link in the navigation tree returns a 404. In particular, this is used for troubleshooting pages. If the type is `redirect-to-child-page`, no page is built and the link in the navigation tree goes directly to the first child. |
| `children`         | Array of page entries                                     | ❌       | Child pages of the current page. For regular pages, the children should be located in a directory with the same name as the parent. The parent is the `index.md` file in that directory. For`directory` pages, the children should be located in the same directory as the parent.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `pageComponents`   | One of `[['featured-cards'], ['content-list']]`           | ❌       | Any page that has child pages can list its children in either card or list style at the bottom of the page. Specify the desired style with this key.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `featuredChildren` | Array of URLs                                             | ❌       | Similar to `pageComponents`, this displays the children of the current page, but only the selected ones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `index`            | string                                                    | ❌       | If a section landing page needs to be different from the `index.md` file in that directory, this field specifies the corresponding Markdown file name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Reuse text in multiple pages

Partials allow you to reuse snippets of content in multiple places. All partials
live in the `_partials` top-level directory. To make a new partial, create a new
`.md` file in this directory. The filename must start with an underscore. Then import it into the target page as an `.mdx` file and reference in the relevant place. See [Formatting examples][formatting].

## Formatting

In addition to all the [regular Markdown formatting][markdown-syntax], the following elements are available for TigerData docs:

- Procedure blocks 
- Highlight blocks
- Tabs
- Code blocks without line numbers and the copy button
- Multi-tab code blocks
- Tags

See [Formatting examples][formatting] for how to use them. 

## Variables

TigerData documentation uses variables for its product names, features, and UI elements in Tiger Cloud Console with the following syntax: `$VARIABLE_NAME`. Variables do not work inside the following: 

- Front matter on each page
- HTML tables and tabs 

See the [full list of available variables][variables]. 

## Links

- Internal page links: internal links do not need to include the domain name `https://docs.tigerdata.com`. Use the `:currentVersion:` variable instead of `latest` in the URL.
- External links: input external links as is. 

See [Formatting examples][formatting] for details. 

## Visuals

When adding screenshots to the docs, aim for a full-screen view to provide better context. Reduce the size of your browser so there is as little wasted space as possible.

Attach the image to your issue or PR, and the doc team uploads and inserts it for you.

## SEO optimization 

To make a documentation page more visible and clear for Google: 

- Include the `title` and `excerpt` meta tags at the top of the page. These represent meta title and description required for SEO optimization.

  - `title`: up to 60 characters, a short description of the page contents. In most cases a variation of the page title. 
  - `excerpt`: under 200 characters, a longer description of the page contents. In most cases a variation of the page intro. 

- Summarize the contents of each paragraph in the first sentence of that paragraph. 
- Include main page keywords into the meta tags, page title, first header, and intro. These are usually the names of features described in the page. For example, for a page dedicated to creating hypertables, you can use the keyword **hypertable** in the following way: 

   - Title: Create a hypertable in Tiger Cloud
   - Description: Turn a regular $PG table into a hypertable in a few steps, using Tiger Cloud Console. 
   - First header: Create a hypertable

## Docs for deprecated products

The previous documentation source is in the deprecated repository called [docs.timescale.com-content][legacy-source].

[legacy-source]: https://github.com/timescale/docs.timescale.com-content

[google-style]: https://developers.google.com/style
[markdown-syntax]: https://www.markdownguide.org/extended-syntax/
[github-docs]: https://github.com/timescale/docs
[use-navigation]: use-timescale/page-index/page-index.js
[formatting]: _partials/_formatting_examples.md
[variables]: https://docs.tigerdata.com/variables-for-contributors/
[readme]: README.md