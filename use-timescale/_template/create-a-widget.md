/* vale off */}
# Create a widget

This is the first page that contains procedures. It should cover the most
important and first task a reader is going to need to do with this feature, which
is usually installing, creating, or setting up the feature. It answers the
question "How do I do it?". This initial paragraph should provide a short
description of the procedures that are covered in this section. For example:

```txt
Creating a continuous aggregate is a two-step process. You need to create the
view first, then enable a policy to keep the view refreshed. You can have more
than one continuous aggregate on a single hypertable.

Continuous aggregates require a `time_bucket` on the time partitioning column of
the hypertable.
```

<Highlight type="note|important|warning">
If there are prerequisites that apply to the entire section, if this is a
pre-release or beta feature, or if there is a risk of data loss that could apply
to this entire section, add the warning here in an admonition.
</Highlight>

## Create a widget

This is the introduction to your first procedure. Use one or two sentences to
explain the procedure, including giving more context to any examples you might be
using in the procedure. Make sure you explicitly call out any prerequisites for
this particular procedure here. You can also use this paragraph to position the
procedure within a larger process ("When you have done X, you can go on to do Y").
Note the simple verb form in the title. For example:

```txt
In this example, we are using a hypertable called `conditions`, and creating a
continuous aggregate view for daily weather data. The `GROUP BY` clause must
include a `time_bucket` expression which uses time dimension column of the
hypertable. Additionally, all functions and their arguments included in
`SELECT`, `GROUP BY`, and `HAVING` clauses must be
[immutable][postgres-immutable].
```

<Procedure>

### Creating a widget

1.  Start each step with a verb (create, use, install, etc), or a location (at
    the `psql` prompt, on your local filesystem, on the server, etc) followed by
    a verb.
1.  Do the next step:

   ```sql|bash|...
   Add any commands in a block like this.
   Make sure you specify the language.
   Do not include any prompts, or sudo commands. If root is required \
   state it in the step instead. Break long lines appropriately.
   ```

1.  Make sure that any action that is the result of the step stays with the step.
   For example, clicking a button, and a dialog box appearing, is a single step.
1.  Finish the procedure on the final step. Do not include a result statement.

<Highlight type="note|important|warning">
Do not embed admonitions within steps. If you need an admonition in the procedure,
add it before or after the steps, but inside the procedure tags,
</Highlight>

</Procedure>

## Verb the noun

Go on to continue creating procedures in the same format. Make sure there is a
logical progression through the procedures, and that they go from simpler to more
complex (as much as is possible). If you find you have a procedure that only has
one step, write out the single step without a procedure tag and the L3 heading.
Try to avoid documenting anything that is thoroughly documented elsewhere (for
example, in the PostgreSQL docs), instead, use the form "For more information
about adjective nouns, see the
[adjective noun PostgreSQL documentation[noun-pg-docs]."

Include any reference-style links at the bottom of the page.
