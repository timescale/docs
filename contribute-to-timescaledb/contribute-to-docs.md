# Contribute to Timescale documentation
Join the community to help make Timescale documentation even better. You can
contribute to the [documentation repository on GitHub][github-docs].

Issues and pull requests of any size, from typo fixes to new content sections,
are always welcome.

The contribution and style guides introduce you to the Timescale documentation
workflow, style, and standards. But don't worry too much about perfection. The
documentation team can help you polish your content when your pull request is
ready. 

To learn more:
*   Keep reading this style guide, which covers the documentation's use of the
    English language
*   See the [contribution guide][contributors] to learn about the GitHub
    workflows, repository structure, and markup conventions

## Style guide sections
This style guide covers:
*   [Style references](#style-references)
    *   Style references in order of importance
*   [Language](#language)
    *   Plain English
    *   Tense and perspective
    *   Voice
    *   Grammar
    *   User interface actions
    *   Prose linting with Vale
*   [Structure](#structure)
    *   Information where it's needed, when it's needed
    *   Documenting processes and procedures
*   [Word use](#word-use)
    *   Word list from A to Z

## Style references
To make style decisions, consult resources in this order:
1.  This guide. Check this guide first, because it contains project-specific
    guidelines that override guidance given elsewhere.
1.  The [Google Developer Documentation Style Guide][google-style]. Contains
    most of the relevant styling information.
1.  The [Chicago Manual of Style][chicago-manual]. Covers formatting decisions
    that aren't covered in other resources.
1.  [Merriam-Webster][merriam-webster]. Timescale documentation is written in US
    English.

## Language

### Plain English
Write in plain English.

Choose the simplest and clearest language to express an idea. Readers often come
to documentation when they're stressed. They skim text, jump between paragraphs,
skip words, and give up quickly if things seem complex. You can reduce their
reading workload by using:
*   Short sentences
*   Plain language
*   Common vocabulary
*   A minimum number of eye-catching details such as admonitions

For example, here's the same idea expressed three different ways, with varying
clarity:

|Style|Example|
|-|-|
|❌ Natural English|In order to perform X installation process, please ensure that all of the following steps are done ...|
|❌ Tech writer's English|To perform the X installation process, verify you have done the following steps ...|
|✅ Plain English|To install X, do these steps ...|

### Tense and perspective
Use simple present tense and the second person singular ("you"). In general,
avoid the first person plural ("we," "us"), because it isn't clear who is
included in that group.

### Voice
We prefer active voice, but don't be afraid to use passive when it serves the
purpose better. For example, the most important words come first in an English
sentence. If the object or the action is the most important part of a sentence,
put it first, even if it means using passive voice.

In other kinds of writing, identifying the actor early helps readers understand
the text. In documentation writing, the actor is known. It's "you," the reader.
As a writer, you can use imperative voice more often. For example:

```md
Install the thing
```

```md
Configure the thing
```

### Grammar
Grammar rules matter only because everyone follows them. They change over time
as public use changes.

Don't worry about hard and fast rules, such as avoiding dangling participles,
not splitting infinitives, and not ending sentences with prepositions. 

Use grammar rules when they make the sentence clearer. For example, use commas
to avoid ambiguous meanings.

When grammar rules hurt more than help, ignore them.

### User interface actions
Refer to user interface actions like this:
*   `Click` a button in a graphical user interface. Do not `Click on`.
*   `Press` a key or key combination on a keyboard.
*   `Type` words or numbers using a keyboard.
*   `Check` or `uncheck` a checkbox.
*   `Select` or `deselect` an item in a menu.
*   `Navigate` to a page or location in a graphical user interface.

### Prose linting with Vale
The Timescale documentation uses the Vale prose linter to check content for
language conventions. After you submit a pull request, a GitHub Action
automatically runs Vale. It shows the results within the `Files changed` view of
your pull request.

Vale has three levels of admonitions:
*   Errors. These block merging of your pull request into the official published
    docs. They must be fixed before your contribution can be accepted.
*   Warnings. Less serious than errors. Adopt these recommendations unless you
    have a strong reason not to.
*   Suggestions. The least serious level. Consider and adopt these
    recommendations, unless your content is a special case or exception.

## Structure

### Information where it's needed, when it's needed
Readers don't read documentation from cover to cover, like a book. They skim and
skip. Don't assume that they know something because it's explained earlier in
the document. Use cross-references to guide them to further information when
they need it.  

The Timescale documentation follows an Every Page is Page One philosophy. That
is, we assume readers come to the documentation from search and links. They may
land on any page as their first page. Each page needs to provide enough context
to stand alone. Pages should also link to other pages to provide the reader with
navigation cues.

### Documenting processes and procedures
Documentation often describes action steps needed to complete a task. A
**procedure** is a set of steps needed to achieve a goal. A **process** is a set
of procedures needed to achieve a larger goal.

In Timescale documentation, procedures have special markup:
*   They are wrapped in `<procedure>` tags. For more information, see the
    [markup conventions][markup-procedures].
*   They start with a heading in gerund form. That means the first word is a
    verb ending in "-ing."
*   They contain a numbered list of steps. 

To describe a process, create several child procedures. Then list all the child
procedures in one place for quick reference.

## Word use

## A [](#A)

*Adverbs*
: Do not use.

&#128077; Install TimescaleDB.

&#10060; Simply install TimescaleDB.

*And/Or*
: Do not use. You can usually pick one. If you're not sure, pick "and."

&#10060; I like apples and/or oranges.

&#128077; I like apples and oranges.

## B [](#B)

## C [](#C)

*Contractions*
: Absolutely fine to use, but try not to overdo it.

## D [](#D)

## E [](#E)

## F [](#F)

*File system*
: Two words.

## G [](#G)

## H [](#H)

## I [](#I)

## J [](#J)

## K [](#K)

## L [](#L)

*Latin abbreviations*
: Do not use.

&#128077; For example

&#10060; eg

## M [](#M)

## N [](#N)

*Next*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

*Numbers* 
: Write numbers as numerals rather than spelling them out, including
single-digit numbers. For exceptions, see the Google Developer Documentation
Style Guide.

## O [](#O)

## P [](#P)

*Please*
: Do not use. Just state the required action.


*Previous*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

## Q [](#Q)

## R [](#R)

## S [](#S)

## T [](#T)

*Timescale*
: The name of the company. Do not use camel case.

&#128077; Timescale is hosting a virtual event.

&#10060; I have installed Timescale to manage my time-series data.

&#10060; TimeScale

*TimescaleDB*
: The name of the product. Capitalize the initial letter and the "DB" at the end.

&#128077; "I have installed TimescaleDB to manage my time-series data."

&#10060; "TimescaleDB is hosting a virtual event."

&#10060; "I want to install TimeScaleDB"

*Thus*
: Do not use.

## U [](#U)

*Utilize*
: Do not use. Use "use" instead.

## V [](#V)

*Via*
: Avoid if possible. There is usually a more accurate English word, like
"through," "with," or "using."

## W [](#W)

*We*
: Use with caution. When providing instructions to the reader, use "you"
instead. Only use "we" to refer to Timescale, the company.

*Will*
: Do not use. It usually indicates that you are writing in future tense.
Always write in simple present tense.

&#128077; After installation, you see a message.

&#10060; After installation, you will see a message.

## X [](#X)

## Y [](#Y)

## Z [](#Z)

[chicago-manual]: https://www.chicagomanualofstyle.org/home.html
[contributors]: https://github.com/timescale/docs/blob/latest/CONTRIBUTING.md
[github-docs]: https://github.com/timescale/docs
[google-style]: https://developers.google.com/style
[markup-procedures]: https://github.com/timescale/docs/blob/latest/CONTRIBUTING.md#procedures
[merriam-webster]: https://www.merriam-webster.com
[readme]: https://github.com/timescale/docs/README.md
