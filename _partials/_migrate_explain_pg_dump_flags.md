- `--no-tablespaces` is required because Timescale does not support
  tablespaces other than the default. This is a known limitation.

- `--no-owner` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign ownership in all cases. This flag means that
  everything is owned by the user used to connect to the target, regardless of
  ownership in the source. This is a known limitation.

- `--no-privileges` is required because Timescale's `tsdbadmin` user is not a
  superuser and cannot assign privileges in all cases. This flag means that
  privileges assigned to other users must be reassigned in the target database
  as a manual clean-up task. This is a known limitation.
