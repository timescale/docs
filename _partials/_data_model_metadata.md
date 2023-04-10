<script>
    import { Highlight } from "$lib/components"
</script>

<Highlight type="note">
You might also notice that the metadata fields are missing. Because this is a
relational database, metadata can be stored in a secondary table and `JOIN`ed at
query time. Learn more about [Timescale's support for `JOIN`s](#joins-with-relational-data).
</Highlight>
