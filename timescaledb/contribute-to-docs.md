---
title: Contribute to TimescaleDB documentation
excerpt: Advice and style guide for contributing to TimescaleDB documentation
keywords: [contribute]
tags: [docs, style guide]
---

# Contributing to Timescale documentation

Timescale documentation is hosted in a [GitHub repository][github-docs]  and is
open for contribution from all community members. If you  find errors or would
like to add content to our docs, you can create a pull request using GitHub for
review by our documentation team. This document contains everything you need to
know about our writing style and standards, but don't worry too much if you
aren't sure what to write. Our documentation team helps you craft the
perfect words when you have a PR ready. We also have some automation on our
repository to help you.

If you want to make minor changes to docs, such as fixing a typo, you can make
corrections  and submit pull requests on the GitHub website. Go to the file you
want to  correct and click the 'pencil' icon to edit. Make the corrections, and
use the options at the bottom of the page to submit a pull request.

To make larger changes to the documentation, follow the instructions in
our [Contributors' Guide][contributors].

For technical details about the repository, including understanding how the
repository is organized, and the various markup and formatting conventions, see
the [README][readme].

Before we accept any contributions, Timescale contributors need to sign the
Contributor License Agreement (CLA). By signing a CLA, we  can ensure that the
community is free and confident in its ability to use your contributions. You
are prompted to sign the CLA during the pull request process.

## Resources

When making style decisions, consult resources in this order:

1.  This guide: always check this guide first, it contains project-specific
    guidance, and in some cases differs from the other resources listed here.
1.  The [Google Developer Documentation Style Guide][google-style]: for most
    general style guidance, we rely on the style defined here.
1.  The Chicago Manual of Style: we use this guide for some formatting decisions
    that are not covered in other resources
1.  Merriam-Webster: Timescale documentation is written in US English, for
    spelling and definitions, consult the dictionary.

## Language

We use standard US English, with an emphasis on plain (or classical) language,
in simple present tense, using the second person singular ("you"). We prefer the
active voice, but do not be afraid to use the passive voice if it serves a
purpose. Always choose the simplest and clearest language, regardless of whether
it's passive or active voice.

For example, here are three ways of writing one sentence:

*   Natural English: In order to perform X installation process, please ensure
    that all of the following steps are done ...
*   Tech writer's English: To perform the X installation process, verify you
    have done the subsequent steps ...
*   Plain English: To install X, do these steps ...

Remember that the order of words is important in English. Put the most important
part of a sentence first, this is usually the actor or the action. Use the
second part of the sentence to give it a focus: what else should the reader
notice?

Readers are often in an agitated state by the time they get to our
documentation. Stressed readers jump around in the text, skip words, steps, or
paragraphs, and can quickly give up if things seem too complex. To mitigate
this, use short sentences, plain language, and a minimum number of eye-catching
details such as admonitions.

Never assume that because you've explained something earlier in a document,
readers know it later in the document. You can use cross-references to help
guide readers to further information if they need it.

## Grammar

Grammar rules are tacit evolving conventions. They have no implicit value by
themselves, they only gain value because everyone is doing it.

There are no hard and fast rules about dangling participles, split infinitives,
or ending sentences with prepositions. Obeying these rules can often make
language clearer but, in some cases, they make language more complicated. In
that case, feel free to ignore them.

## Headings

All headings should be written in sentence case: capitalize only the first word
in the heading, and proper nouns.

For top-level page headings, and most section headings, use the simplest noun
phrase possible. For example, instead of "Using hypertables", call the page
"Hypertables".

For level two sections that contain one or more procedures, use a simple verb
phrase. For example, "Install TimescaleDB". For the associated procedures, use a
level three heading, with the gerund form of the same heading. For example,
"Installing TimescaleDB".

## Processes and procedures

We use processes and procedures to provide readers with numbered steps to
achieve a specific goal.

Processes contain procedures. If the task you are describing is very lengthy, or
has a series of distinct components, break it up into a series of procedures
within a process.

Procedures contain these elements:

<!-- markdownlint-disable -->

1.  Level two section title in simple verb form
1.  Short introduction
1.  Open `<procedure>` tag
1.  Level three procedure title in gerund verb form
1.  Numbered steps
1.  Screenshot
1.  Close `</procedure>` tag

<!-- markdownlint-enable -->

For example:

```txt
## Install TimescaleDB

This section describes how to install TimescaleDB on premise.

<procedure>

### Installing TimescaleDB

1. Start each step with a verb, or a location.
1. For example, "Run the `example` command", or "At the command prompt, open the
   `example` file."

<Add screenshot here>

</procedure>

```

In general, do not use result statements. However, if you feel it is absolutely
necessary, include it immediately before the closing procedure tag, and do not
put it as a step.

## Code blocks

Offset code blocks from the surrounding text by using three backticks and
declaring the language in use in the block. Usually, this is either `sql`, for
queries, or `bash`, for commands given at the command prompt. For a full list of
available languages see [the prismjs site][prismjs].

Make sure that the code block is indented at the same level as the surrounding text.

When writing commands in a code block, do not use `#`, `$`, or any other prompt.
Additionally, for Linux commands, do not use `sudo`, instead, use the stem
sentence to indicate that the command must be run as the root user.

For example, a bash command:

```txt

    At the command prompt, as root, use this command:

    ```bash
    apt install postgresql
    ```

```

For example, an SQL query:

```txt

    At the `psql` prompt, use this query:

    ```sql
    SELECT * FROM table LIMIT 5;
    ```

```

## Verbs

*   `Click` a button in a graphical user interface using a mouse. Do not `Click on`.
*   `Press` a key or key combination on a keyboard.
*   `Type` words or numbers using a keyboard.
*   `Check` or `uncheck` a checkbox.
*   `Select` or `deselect` an item in a menu.
*   `Navigate` to a page or location in a graphical user interface.

## Word usage

### A

*Above*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

*Adverbs*
: Do not use.

&#128077; Install TimescaleDB.

&#10060; Simply install TimescaleDB.

*And/Or*
: Do not use. You can usually pick one. If you're not sure, pick "and."

&#10060; I like apples and/or oranges.

&#128077; I like apples and oranges.

*Appears*
: Do not use.

### B

*Bare metal*
: Noun.

&#128077; "Install TimescaleDB on bare metal."

&#10060; "Perform a bare metal installation."

*Bare-metal*
: Adjective.

&#128077; "Perform a bare-metal installation."

&#10060; "Install TimescaleDB on bare-metal."

*Below*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

### C

*Contractions*
: Absolutely fine to use, but try not to overdo it.

*Cybersecurity*
: One word.

### D

### E

### F

*Fail over*
: Use as a verb

*Failover*
: Use as a noun or adjective.

*File system*
: Two words.

### G

### H

### I

### J

### K

### L

*Latin abbreviations*
: Do not use.

&#128077; For example

&#10060; eg

*Log in*
: Verb.

&#128077; "Log in to Timescale Cloud."

&#10060; "Enter your log in information."

*Login*
: Adjective or noun.

&#128077; "Enter your login information."

&#10060; "Login to Timescale Cloud."

### M

*Master/Slave*
: Do not use. Use "Primary" and "Secondary" instead.

### N

*Next*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

### O

*Once*
: Do not use. Use "when" instead.

&#10060; "Once you have finished the installation, you can..."

&#128077; "When you have finished the installation, you can."

### P

*Postgres*
: Do not use. Use "PostgreSQL" instead.

&#10060; "Run the Postgres query"

&#128077; "Run the PostgreSQL query."

*PostgreSQL*
: Always refer to PostgreSQL by its full name and with correct capitalization,
as shown.

*Previous*
: Avoid all directional words. You cannot guarantee that things will stay in the
same position, or be in the position you expect on an individual reader's
device.

*Promscale Connector*
: Use initial capital letters.

&#128077; "Install the Promscale Connector."

&#10060; "Install the Promscale connector."

&#10060; "Install the promscale connector."

### Q

### R

### S

*Superuser*
: One word.

### T

*Thus*
: Do not use.

*Timescale*
: The name of the company. Do not use camel case.

&#128077; Timescale is hosting a virtual event.

&#10060; I have installed Timescale to manage my time-series data.

&#10060; TimeScale

*TimescaleDB*
: The name of the product. Capitalize the initial letter, and the "DB" at the end.

&#128077; "I have installed TimescaleDB to manage my time-series data."

&#10060; "TimescaleDB is hosting a virtual event."

&#10060; "I want to install TimeScaleDB"

*tobs*
: The observability suite. Do not use capitalization, even when it begins
a sentence. If possible, rewrite the sentence to avoid this.

&#128077; "Install using tobs"

&#10060; "Tobs can be used to install."

### U

*Update*
: An update is a small or minor improvement, often delivered in a patch. Updates
are done frequently, and require little or no downtime.

&#128077; Install the security update to patch this version.

*Upgrade*
: An upgrade is a large or major improvement, and usually requires a new
version. Upgrades are done less frequently, and could require planning,
prepatory backups, and planned downtime.

&#128077; Upgrade from TimescaleDB&nbsp;1 to TimescaleDB&nbsp;2.

&#128077; Upgrade from TimescaleDB&nbsp;2.3 to TimescaleDB&nbsp;2.4.

*Utilize*
: Do not use. Use "use" instead.

### V

*Vanilla PostgreSQL*
: Do not use. If you want to differentiate between regular PostgreSQL tables,
and tables that contain time-series, use "standard PostgreSQL".

&#10060; "You can also create services that run vanilla PostgreSQL."

&#128077; "You can also create services that run standard PostgreSQL."

*Via*
: Avoid if possible. There is usually a more accurate English word, like
"through," "with," or "using."

### W

*Will*
: Do not use. It usually indicates that you are writing in future tense.
Always write in simple present tense.

&#128077; After installation, you see a message.

&#10060; After installation, you will see a message.

### X

### Y

### Z

[contributors]: https://github.com/timescale/docs/blob/latest/CONTRIBUTING.md
[github-docs]: https://github.com/timescale/docs
[google-style]: https://developers.google.com/style
[readme]: https://github.com/timescale/docs#readme
[prismjs]: https://prismjs.com/#supported-languages
