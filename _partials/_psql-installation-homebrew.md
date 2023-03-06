<Procedure>

#### Installing psql using Homebrew

1.  Install `psql`:

    ```bash
    brew install libpq
    ```

1.  Update your path to include the `psql` tool.

    ```bash
    brew link --force libpq
    ```

    On Intel chips, the symbolic link is added to `/usr/local/bin`. On Apple
    Silicon, the symbolic link is added to `/opt/homebrew/bin`.

</Procedure>
