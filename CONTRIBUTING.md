# Introduction
Join the community to help make TimescaleDB documentation even better. Issues and pull
requests are always welcome. 

This guide covers the documentation's [contributing
workflow](#contribute-to-documentation), [repository
structure](#repository-structure), [markup conventions](#markup-conventions),
and [templates](#templates). For the style guide, see [the documentation
site](https://docs.timescale.com/timescaledb/latest/contribute-to-docs/).

To contribute to TimescaleDB's source code, see the [TimescaleDB
repository](https://github.com/timescale/timescaledb).

# Contribute to documentation
You can contribute to documentation by making a pull request.

## Make a minor change
For minor changes, such as typos and broken-link fixes, you can edit directly in
GitHub. 

<procedure>

### Making a minor change

1.  Sign in to your [GitHub](https://github.com) account.
1.  Open the file you want to edit within GitHub. For help finding the right
    file, see the [repository structure section](#repository-structure).
1.  Click the pencil icon in the top-right corner of the code box. GitHub
    automatically forks the project for you and opens a code editor.
1.  Make your edits.
1.  Propose your changes by adding a title and optional description in the
    `Propose changes` box at the bottom of the page.
1.  Review the differences between your changes and the `latest` branch on the
    docs repository. Click `Create pull request`.
1.  Edit the pull request description. Click `Create pull request` again. 
1.  If this is your first contribution, you receive a comment asking you to sign
    the Contributor License Agreement. Sign the agreement so your contribution
    can be added to the documentation.
1.  Review the auto-generated preview of your changes. A GiHub action produces
    the preview and attaches the link to your PR.

</procedure>

## Make a larger change
For larger changes, such as new content and long edits, fork the repository and
make changes on your local machine. If you have write access to the repository,
use a branch instead. Some of our automation will not work correctly on forks.

### Fork and clone the repository
If this is your first contribution, start by forking the repository and cloning
the fork to your local machine.

<procedure>

#### Forking and cloning the repository
1.  Sign in to your [GitHub](https://github.com) account.
1.  Navigate to the [Timescale documentation
    repo](https://github.com/timescale/docs).
1.  Click the `Fork` button in the top-right corner, and select the account you
    want to use.
1.  Wait for GitHub to create your fork and redirect you.
1.  Clone the repository to your local machine by clicking the green `Code`
    button, copying the HTTPS URL, and running the following command at your
    command prompt:
    ```bash
    git clone <YOUR_FORK_URL>
    ```
1.  List the current remote branches:
    ```bash
    git remote -v
    ```
    This command should list two remotes, both marked `origin`, like this:
    ```bash
    origin  https://github.com/<YOUR_GITHUB_USERNAME>/docs.git (fetch)
    origin  https://github.com/<YOUR_GITHUB_USERNAME>/docs.git (push)
    ```
    The `origin` remotes are your own fork. You can do whatever you want here
    without changing the upstream repository.
1.  Add the docs repo as an upstream:
    ```bash
    git remote add upstream https://github.com/timescale/docs.git
    ```
1.  Check that the upstream repository is added successfully:
    ```bash
    git remote -v
    ```
    This command should now list the two `origin` remotes from before, plus two
    more labelled `upstream`, like this:
    ```bash
    origin  https://github.com/<YOUR_GITHUB_USERNAME>/docs.git (fetch)
    origin  https://github.com/<YOUR_GITHUB_USERNAME>/docs.git (push)
    upstream  https://github.com/timescale/docs.git (fetch)
    upstream  https://github.com/timescale/docs.git (push)
    ```
1.  Fetch the branches in the upstream repository:
    ```bash
    git fetch upstream
    ```
1.  Merge the changes from the upstream `latest` branch into your fork's
    `latest` branch:
    ```bash
    git merge upstream/latest
    ```
1.  Create a new branch for the work you want to do. Give it a descriptive name
    that includes your GitHub username. For example:
    ```bash
    git checkout -b update-readme-<USERNAME>
    ```

</procedure>

### Commit changes and create a pull request
Once you have a local copy of the docs, make your changes. Then commit your work
and create a pull request to the Timescale docs repo.

<procedure>

#### Committing changes
1.  Make your changes. You can edit the Markdown files in any text editor. For
    more information, see the sections on [repository
    structure](#repository-structure) and [markup
    conventions](#markup-conventions).
1.  Add the updated files to your commit:
    ```bash
    git add .
    ```
1.  Commit your changes:
    ```bash
    git commit -m "<COMMIT_MESSAGE>"
    ```
1.  Push your changes:
    ```bash
    git push
    ```
    If git prompts you to set an upstream in order to push, use this command:
    ```bash
    git push --set-upstream origin <BRANCH_NAME>
    ```

#### Creating a pull request
1.  Navigate to the [Timescale documentation
    repo](https://github.com/timescale/docs).
1.  Click `Compare and Create Pull Request`.
1.  Write an informative commit message detailing your changes. 
1.  Choose reviewers. Each documentation change needs a reviewer from the
    [Timescale documentation team](#the-timescale-documentation-team). Ask the
    documentation team for a review by adding the `timescale/documentation`
    group as a reviewer. If you made changes to any technical details, you also
    neeed a subject matter expert (SME) to review. For help choosing an SME, see
    the [TimescaleDB source code
    repository](https://github.com/timescale/timescaledb) for SMEs who have
    worked on your topic.
1.  If you've finished your work, submit a pull request by clicking `Create pull
    request`. If you haven't finished, create a draft PR by clicking the arrow
    beside `Create pull request`. This lets your reviewers know that you're
    working on the topic. They can understand your progress and expect your
    contribution. Once you've finished, you can click `Ready for review`.
1.  If this is your first contribution, you receive a comment asking you to sign
    the Contributor License Agreement. Sign the agreement so your contribution
    can be added to the documentation.
1.  A GiHub action produces a preview of your changes, and attaches the link to
    your PR.
1.  A member of the documentation team reviews your pull request for accuracy
    and adherence to our standards. You can see a list of the things that
    reviewers check for in the pull request template.

</procedure>

Commit to your feature branch early and often, and create your pull request as
soon as possible. Even if you haven't finished work, you can make a pull request
with the Draft feature. Communicating your work helps prevent duplicated work
and conflicting information.

## Keep your local copy up to date
As other contributors add to the docs, your local copy drifts out of sync with
the `latest` branch. Avoid merge conflicts by keeping your local copy up to
date. Fetch and merge changes from `latest` every day before you begin your
work, and again whenever you switch branches.

<procedure>

### Keeping your local copy up to date
1.  Check out your fork's `latest` branch:
    ```bash
    git checkout latest
    ```
    You get a message like this:
    ```bash
    Switched to branch 'latest'
    Your branch is up to date with 'origin/latest'.
    ```
    BEWARE! Despite the message, your branch is probably _not_ up to date. Your
    `origin/` pointers don't reflect the latest changes in the upstream remote
    repository.
1.  Fetch the branches in the upstream repository:
    ```bash
    git fetch upstream
    ```
1.  Merge the changes from the upstream `latest` branch into your fork's
    `latest` branch:
    ```bash
    git merge upstream/latest
    ```
1.  To continue work that you began earlier, check out the branch that contains
    your work. To start new work, create a new branch. 

</procedure>

# Repository structure

The documentation site's navigation hierarchy mirrors the repository's folder
hierarchy. Each top-level section in the site corresponds to a top-level folder
in the repository:

|Site section|Repository folder|
|-|-|
|Install TimescaleDB|`install/`|
|TimescaleDB|`timescaledb/`|
|API reference|`api/`|
|Timescale Cloud|`cloud/`|
|Managed Service for TimescaleDB|`mst/`|
|Promscale|`promscale/`|

Each folder must contain an `index.md` file. This file contains the content for
that section's landing page. For example, `cloud/index.md` contains the content
for `docs.timescale.com/cloud/`.

Each folder also contains other Markdown files. These files contain the content
for that section's direct child pages.

Each folder may also contain subfolders. These folders correspond to the
subsections in that section. Each subfolder has its own `index.md` page and
child pages, and may have its own subfolders.

To find the repository file corresponding to a specific page, you can use the
page's URL, ignoring the domain, subdomain, and version. For example, for the
URL `docs.timescale.com/timescaledb/latest/how-to-guides/hyperfunctions/<SLUG>`,
ignore the domain and subdomain, `docs.timescale.com`, and the version,
`latest`. If the page has no sub-pages, the corresponding file is
`timescaledb/how-to-guides/hyperfunctions/<SLUG>.md`. If the page has sub-pages,
the corresponding file is
`timescaledb/how-to-guides/hyperfunctions/<SLUG>/index.md`.

## Site navigation and URL structure

The documentation site's navigation and URL structure are defined in the
`page-index.js` files. Each section's `page-index.js` contains the details for
that section's landing page and child pages. For example:

```js
module.exports = [
    {
        href: "overview",
        children: [
          {
            title: "What is time-series data?",
            href: "what-is-time-series-data",
            pageComponents: ["featured-cards"],
            tags: ['data', 'timescaledb'],
            keywords: ['TimescaleDB', 'data'],
            excerpt: "Learn about time-series data"
          },
          {
            title: "Core concepts",
            href: "core-concepts",
            excerpt: "Why use TimescaleDB?",
            children : [
              {
                title: "Hypertables and chunks",
                href: "hypertables-and-chunks",
                tags: ['hypertables', 'chunks', 'timescaledb'],
                keywords: ['hypertables', 'chunks', 'TimescaleDB'],
                excerpt: "Understanding hypertables and chunks"
              },
              {
                title: "Scaling",
                href: "scaling",
                tags: ['hypertables', 'chunks', 'timescaledb'],
                keywords: ['hypertables', 'chunks', 'TimescaleDB'],
                excerpt: "Scaling hypertables"
              },
              ...
            ]
          },
          ...
        ]
    }
]
```

## Layout of `page-index.js`

Each page listed in `page-index.js` can have the following properties:

|Property|Required or optional|Description|
|-|-|-|
|`href`|Required|The name of the Markdown file containing the content for the page. For example: `example-file.md`|
|`title`|Optional|The page title to display in the navigation menu and browser title area. If no title is provided, `href` is used, in Camel Case and with hyphens replaced by spaces.|
|`children`|Optional|An array containing the child pages for the page. Child-page properties are defined in the same way as parent-page properties. Child pages can be nested inside other child pages to form multiple levels. The filenames provided in `href` should be located in a sub-folder with the same name as the parent page.|
|`keywords`|Optional|An array of keywords to be displayed at the bottom of the page.|
|`excerpt`|Optional|A short description of the page. Excerpts are displayed within Related Content cards at the bottom of each page.|
|`relatedPages`|Optional|An array of path names to be displayed as Related Content at the bottom of the page. For example, `["/promscale/:currentVersion:/installation/"]`|
|`pageComponents`|Optional|If provided, child pages are listed below any other content in the parent page. Takes two possible values, `['featured-cards']` and `['content-list']`, corresponding to the two list styles.|
|`featuredChildren`|Optional|If the `pageComponents` option `featured-cards` is used, `featuredChildren` specifies which child pages to feature on the cards. Takes an array of pathnames, in the same format as `relatedPages`. Using `featured-cards` without specifying `featuredChildren` results in all child pages being displayed on cards.|
|`type`|Optional|Associates the page with a specific page type that has special features or layout. Rarely used.|
|`newLabel`|Optional|Adds a `NEW` label to content in the navigation menu. Set the value of `newLabel` to the date when the label should expire. Use the format `"Month Day Year"` or `"YYYY-MM-DD"`.|

## Add a new page

To add a new page, create a new `<FILENAME>.md` file within the appropriate
folder. Name your file descriptively, in lowercase, and separate words with
hyphens.

Then, add an entry to the `page-index.js` file for that section. To find the
`page-index.js` file, look in the top-level folder for the section, which should
be one of `api/`, `cloud/`, `install/`, `mst/`, `promscale/`, or `timescaledb/`.
The folder contains a `page-index/` subfolder, which holds the `page-index.js`
file.

In larger sections, `page-index.js` is split into multiple files. In this case,
the parent `page-index.js` starts with several `require` statements, which show
the paths to child `page-index.js` files.

# Markup conventions

Documentation content is written in standard Markdown. 

Follow the following conventions:
*   Break lines at 80 characters to make documentation review easier
*   Format function names, commands, function arguments, and user interface
    elements as inline code by wrapping them in backticks. Headers are an
    exception. Markdown markup doesn't work within headers.
*   Don't write functions with parentheses unless the function is being written
    with arguments within the parentheses. The title of API references is an
    exception.

See special instructions for:
*   [Links](#links)
*   [Anchor tags](#anchor-tags)
*   [Code blocks](#code-blocks)
*   [Images](#images)
*   [Procedures](#procedures)
*   [Callout and highlight blocks](#callout-and-highlight-blocks)
*   [Tags](#tags)
*   [Partials](#partials)

## Links

Use reference-style links and put the link address at the bottom of the page.
For example:

```md
<!-- within text -->
[link text to display][link-ref]

<!-- at bottom of page -->
[link-ref]: https://example.com/path/to/page
```

There are three exceptions where inline links must be used:
*   Links within [callouts and highlights](#callout-and-highlight-blocks)
*   Links within [tags](#tags)
*   Links to anchors on the same page as the link itself

Organize link references in alphabetical order. Don't use an empty link
reference. Within the link reference, join words with hyphens and avoid spaces,
so the missing-link check can work properly.

Do:
```md
[Timescale Cloud][timescale-cloud]
```

Don't do:
```md
[Timescale Cloud][]
```

Don't do:
```md
[Timescale Cloud][timescale cloud]
```

### Internal links

If your internal link's URL contains the same product and version as the current
page, you don't need to include the product or version. Include only the part of
the link after the version identifier.

For example, to link from
`docs.timescale.com/timescaledb/latest/overview/what-is-time-series-data/` to
`docs.timescale.com/timescaledb/latest/overview/deployment-options/`, use
`overview/deployment-options`.

If your internal link's URL points to a different product or version than the
current page, include the product or version. To point to the same version, use
`:currentVersion:`.

For example, to link from
`docs.timescale.com/timescaledb/latest/overview/what-is-time-series-data/` to
`docs.timescale.com/cloud/latest/create-a-service/`, use
`cloud/:currentVersion:/create-a-service/`.

## Anchor tags

`h2` and `h3` headings, which correspond to `##` and `###` in Markdown, have
automatically generated anchor tags. The tag is the heading text, in lowercase,
with spaces replaced by hyphens.

To set your own anchor and table-of-contents text, use `[custom table of
contents label](custom-anchor-tag)`.

To create an anchor tag for another Markdown element, include `[](anchor-name)`
right after the element.

The anchor name must be unique.

## Code blocks

Don't include a prompt character for the command prompt.

Do:

```bash
some_command
```

Don't do:
```bash
$ some_command
```

Otherwise the code highlighter may be disrupted.

Include the programming language name after the three initial backticks to
select the appropriate syntax highlighting.

### Language or environment tabs

For some code blocks, you may want separate tabs to display the example in
different languages or operating system environments. For example:

Use the syntax in the [multi-code block
template](https://github.com/timescale/docs/blob/latest/_multi-code-block.md?plain=1).

## Images

Images are inserted using HTML tags rather than Markdown embeds. Every image
needs alt text. If the image is purely decorative, use empty alt text, like
this:

```html
alt=""
```

Images also need the class `main-content__illustration` to display correctly on
the site. The full image tag looks like this:

```html
<img class="main-content__illustration" 
src="https://example.com/image.png" 
alt="Example image" />
```

If you're using Visual Studio Code, you can insert an image by using the `img`
snippet.

## Procedures

Format multiple step procedures inside a procedure component, like this:

```md
<procedure>

### Procedure title
1.  Instructions for step one
1.  Instructions for step two
1.  Instructions for step three

</procedure>
```

Keep a blank line between the `<procedure>` tags and the procedure contents to 
avoid parsing problems.

## Callout and highlight blocks

To create a callout, wrap the callout text in the custom `<highlight>`
component, like this:

```markdown
<highlight type="note">
This is a note. It links to [an example link](https://example.com/).
</highlight>
```

The supported values for `type`, in approximate order of severity, are `note`,
`important`, `warning`, and `deprecated`. `tip` is maintained for backwards
compatibility only. Don't use it for new content.

Any links in a `<highlight>` component must use inline link styles. The product
and version number must be explicitly specified. `:currentVersion:` does not
work.

If you're using Visual Studio Code, you can wrap selected text in a
`<highlight>` component by using the `high` snippet. You can also insert a blank
`<highlight>` component by using the `hl` snippet.

## Tags

A bubble-style tag appears around certain links and decorator text in the
documentation:

*   Download links. Wrap links to direct downloads in a download tag, like this:
    ```html
    <tag type="download">[file name](https://example.com/file-link.extension)</tag>
    ```
    This appends a 'download link' icon to the link.
*   API reference tags. API references may be grouped into the categories
    `Community`, `Experimental`, and `Toolkit`. To add the appropriate tag, add
    the following component next to the header:
    *   `<tag type="community" content="Community" />`
    *   `<tag type="experimental" content="Experimental" />`
    *   `<tag type="toolkit" content="Toolkit" />`

## Partials

Partials allow you to reuse snippets of content in multiple places. All partials
live in the `_partials` top-level directory. To make a new partial, create a new
`.mdx` file. The filename must start with an underscore.

To insert the partial in another document, put an import statement in the
document. The import statement goes before the content and after any
frontmatter. For example:

`import Component from '../../../_partials/_partial-name.mdx';`

The path follows the site's directory structure, not the docs repo's
directory structure. You can determine the site's directory structure from the
page's URL. `Component` can be any CamelCased name. For consistency, make it
the CamelCased version of your partial's filename.

Where you need the partial to display, insert it as a self-closing tag:

`<Component />`

# Templates

In the API references section, documents follow [the API
template](https://github.com/timescale/docs/blob/latest/api/_template.md). Copy
and paste the template to create a new API reference.

If you're using Visual Studio Code, you can also insert the template by using 
the `api` snippet.

# The Timescale documentation team
*   Ryan Booz <https://github.com/ryanbooz>
*   Lana Brindley <https://github.com/Loquacity>
*   Daniel Bogart <https://github.com/daniel-bogart>
*   Rajakavitha Kodhandapani <https://github.com/Rajakavitha1>
*   Charis Lam <https://github.com/charislam>
*   Jacob Prall <https://github.com/jacobprall>
