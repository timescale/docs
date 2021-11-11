# Introduction
There are multiple ways to help make TimescaleDB better. All of our
documentation and source for the PostgreSQL extension are available to use and
review with GitHub.

## First contribution
You can make contributions to the documentation by creating a fork of the
repository.

<procedure>

### Contributing using a fork
1.  Make sure you have a [github](github.com) account, and that you're signed in.
1.  Navigate to the [Timescale Documentation
Repo](https://github.com/timescale/docs) click the `Fork` button in the
top-right corner, and select the account you want to use.
1.  Wait for GitHub to create your fork and redirect you.
1.  Clone the repository to your local machine. To find this URL, click the green
    `Code` button and copy the HTTPS URL:
    ```bash
    git clone https://github.com/<username>/docs.git
    ```
1.  List the current remote branches:
    ```bash
    git remote -v
    ```
    This command should list two remotes, both marked `origin`, like this:
    ```bash
    origin  https://github.com/<username>/docs.git (fetch)
    origin  https://github.com/<username>/docs.git (push)
    ```
    The `origin` remotes are your own fork, and you can do whatever you want here without changing the upstream repository.
1.  Add the docs repo as an upstream:
    ```bash
    git remote add upstream https://github.com/timescale/docs.git
    ```
1.  Check:
    ```bash
    git remote -v
    ```
    This command should now have the same two `origin` remotes as before, plus two more labelled `upstream`, like this:
    ```bash
    origin  https://github.com/<username>/docs.git (fetch)
    origin  https://github.com/<username>/docs.git (push)
    upstream  https://github.com/timescale/docs.git (fetch)
    upstream  https://github.com/timescale/docs.git (push)
    ```
1.  Fetch the branches in the upstream repository:
    ```bash
    git fetch upstream
    ```
1.  Merge the changes from the upstream `latest` branch, into your fork's
    `latest` branch:
    ```bash
    git merge upstream/latest
    ```
1.  Create a new branch for the work you want to do. Make sure you give it an
    appropriate name, and include your username:
    ```bash
    git checkout -b update-readme-username
    ```

</procedure>

<procedure>

### Committing changes and creating a pull request
1.  Make your changes.
1.  Add the updated files to your commit:
    ```bash
    git add .
    ```
1.  Commit your changes:
    ```bash
    git commit -m "Commit message here"
    ```
1.  Push your changes:
    ```bash
    git push
    ```
    If git prompts you to set an upstream in order to push, use this command:
    ```bash
    git push --set-upstream origin <branchname>
    ```
1.  Create a pull request (PR) by navigating to <https://github.com/timescale/docs>
    and clicking `Compare and Create Pull Request`. Write an informative commit
    message detailing your changes, choose reviewers, and save your PR. If you
    haven't yet finished the work you want to do, make sure you create a draft PR by
    selecting it from the drop down box in the GitHub web UI. This lets your
    reviewers know that you haven't finished work yet, while still being transparent
    about what you are working on, and making sure we all understand current
    progress.

</procedure>

<highlight type="warning">Choose your reviewers carefully! If you have made changes to the technical
detail of the documentation, choose an appropriate subject matter expert (SME)
to review those changes. Additionally, every change requires at least one
documentation team member to approve.</highlight>

## Second contribution
Once you have checked out the repo and want to keep working on things, you need
to ensure that your local copy of the repo stays up to date. If you don't do
this, you *will* end up with merge conflicts.

<procedure>

### Second contribution
1.  Check out your fork's `latest` branch:
    ```bash
    git checkout latest
    ```
    You get a message like this:
    ```bash
    Switched to branch 'latest'
    Your branch is up to date with 'origin/latest'.
    ```
    BEWARE! This is usually a lie!
1.  Fetch the branches in the upstream repository:
    ```bash
    git fetch upstream
    ```
1.  Merge the changes from the upstream `latest` branch, into your fork's
    `latest` branch:
    ```bash
    git merge upstream/latest
    ```
1.  If you are continuing work you began earlier, check out the branch that
    contains your work. For new work, create a new branch. Doing this regularly as
    you are working means you keep your local copies up to date and avoid
    conflicts. You should do it at least every day before you begin work, and again
    whenever you switch branches.


</procedure>

<highlight type="warning">Never leave branches lying around on your local system. Create your PR as soon
as possible, and make good use of the Draft feature. Commit to your feature
branch early and often! Update your local copy from latest whenever you switch
branches.</highlight>

## Writing standards
Timescale is in the process of creating comprehensive writing and style standards. For the current guidelines, see [contributing to documentation][docs-standards].

## The Timescale documentation team
*   Ryan Booz <https://github.com/ryanbooz>
*   Lana Brindley <https://github.com/Loquacity>
*   Hel Rabelo <https://github.com/helrabelo>
*   Ted Sczelecki <https://github.com/tedsczelecki>


[docs-standards]: timescaledb/contribute-to-docs
