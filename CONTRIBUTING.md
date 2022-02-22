# Introduction
You can help make TimescaleDB better in multiple ways. The documentation and
TimescaleDB source code are available on GitHub. Issues and pull requests are
encouraged.

This guide covers the documentation's [contributing
workflow](#contribute-to-documentation), [repository
structure](#repository-structure), and [markup
conventions](#markup-conventions). For the style guide, see [the documentation
site](docs.timescale.com/timescaledb/latest/contribute-to-docs/).

To contribute to TimescaleDB's source code, see the [TimescaleDB
repository](github.com/timescale/timescaledb).

## Contribute to documentation
You can make contribute to documentation by making a pull request.

### Make a minor change
For minor changes, such as typos and broken-link fixes, you can edit directly in
GitHub. 

<procedure>

#### Making a minor change

1.  Sign in to your [github](github.com) account.
1.  Open the file you want to edit within GitHub. For help finding the right
    file, see the [repository structure section](#repository-structure).
1.  Click the pencil icon in the top-right corner of the code box. GitHub
    automatically forks the project for you and opens a code editor.
1.  Make your edits.
1.  Propose your changes by adding a title and optional description in the
    `Propose changes` box at the bottom of the page.
1.  Review the differences between your changes and the `latest` branch on the
    docs repository. Click `Create pull request`.
1.  Edit the pull request description. Click `Create pull request`. If
    this is your first contribution, you receive a comment asking you to sign
    the Contributor License Agreement.  
1.  Sign the agreement so your contribution can be added to the documentation.

</procedure>

### Make a larger change
For larger changes, such as new content and long edits, fork the repository and
make changes on your local machine.

## Fork and clone the repository
If this is your first contribution, start by forking the repository and cloning
the fork to your local machine.

<procedure>

### Forking and cloning the repository
1.  Sign in to your [github](github.com) account.
1.  Navigate to the [Timescale documentation repo](github.com/timescale/docs).
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

## Commit changes and create a pull request
Once you have a local copy of the docs, make your changes. Then commit your work
and create a pull request to the Timescale docs repo.

<procedure>

### Committing changes
1.  Make your changes. You can edit the Markdown files in any text editor. For
    mroe information, see the sections on [repository
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

### Creating a pull request
1.  Navigate to the [Timescale documentation repo](github.com/timescale/docs).
1.  Click `Compare and Create Pull Request`.
1.  Write an informative commit message detailing your changes. 
1.  Choose reviewers. Each documentation change needs a reviewer from the
    [Timescale documentation team](#the-timescale-documentation-team). If you
    made changes to any technical details, you also neeed a subject matter
    expert (SME) to review. For help choosing an SME, see the [TimescaleDB
    source code repo](github.com/timescale/timescaledb) for SMEs who have worked
    on your topic.
1.  If you've finished your work, submit a pull request by clicking `Create pull
    request`. If you haven't finished, create a draft PR by clicking the arrow
    beside `Create pull request`. This lets your reviewers know that you're
    working on the topic. They can understand your progress and expect your
    contribution. Once you've finished, you can click `Ready for review`.
1.  If this is your first contribution, you receive a comment asking you to sign
    the Contributor License Agreement. Sign the agreement so your contribution
    can be added to the documentation.

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

## Repository structure

## Markup conventions

## The Timescale documentation team
*   Ryan Booz <https://github.com/ryanbooz>
*   Lana Brindley <https://github.com/Loquacity>
*   Daniel Bogart <https://github.com/daniel-bogart>
*   Rajakavitha Kodhandapani <https://github.com/Rajakavitha1>
*   Charis Lam <https://github.com/charislam>
*   Jacob Prall <https://github.com/jacobprall>
