# Every substantive Work project is illustrated; figureless projects are demoted to "Also on GitHub"

## Status

Accepted.

## Context

The Work page (`/projects/`) renders each substantive project as a side-by-side
editorial entry: text on one side (index, kind, title, summary, Problem / Approach /
Result, tools) and an illustration panel on the other — an interactive `embed` iframe or
a static `image` (see CONTEXT.md → "Item shape (Work)" and the figure embed channel).
Issues #18 and #19 brought the last two substantive projects (choicekit, Economic Theories
& ML) up to a figure, so by this point every project outside the "Also on GitHub" link
group is illustrated. Smaller learning builds live in that link group and render as a
compact link list, not as full illustrated cards.

The open question this ADR settles: what should happen if a future substantive project has
no figure? Two layouts can tolerate that — one keeps a uniform illustrated rhythm and
refuses to render an unillustrated card; the other relaxes the layout to a text-only
stacked entry when a figure is missing. The goal stated for the page is that each project
be understandable from **text and illustration**, and that the entries share one
side-by-side rhythm rather than a mix of illustrated and bare rows.

## Decision

**Every substantive Work project is illustrated.** A project in any group other than the
"Also on GitHub" link group must carry an `embed` or `image`. This is enforced at the data
layer by the figure-coverage rule in `checkInvariants(projects, groups)`
(`src/data/projects.ts`), run at import so the build is protected — not just the page that
renders the projects.

The fallback for a future figureless project is **demote-to-"Also on GitHub"**, not
text-only render: a project with nothing to show beside its copy belongs in the compact
link list with the other smaller builds, where the absence of a figure is the expected
shape. There is no stacked, figure-optional variant of the substantive entry.

The CitiBike figure is an accepted exception to *locality* (its `embed` is an external
`https` URL, every other figure is a committed local `/figures/*.html` file); it still
satisfies coverage. The embed-asset-existence test checks only local `/figures/` embeds and
excludes external URLs. This is noted in CONTEXT.md's Flagged Ambiguities.

## Considered alternatives

- **A stacked layout that tolerates missing figures** (render a substantive entry text-only
  when it has no `embed`/`image`). Rejected: it breaks the uniform side-by-side rhythm,
  produces two visually different substantive-entry shapes, and lets a project ship that is
  understandable from text *or* illustration but not reliably both — the opposite of the
  page's goal. Demote-to-link-group keeps one substantive shape and one link-list shape.
- **Make `embed`/`image` a required field on `Project`.** Rejected: the link-group entries
  legitimately have neither, so a blanket type-level requirement is wrong; the rule is
  conditional on group, which the import-time invariant expresses precisely and tests can
  exercise against fixtures.

## Consequences

- A future contributor adding a substantive project with no figure will fail the build
  (the import-time invariant throws). The intended fix is to add a figure or move the
  project to "Also on GitHub" — not to relax the invariant. Fighting this means updating
  the ADR rather than diverging silently.
- The figure-coverage rule, unique-titles / known-groups / featured-exist rules, and the
  embed-asset-existence and embed-channel-marker tests together pin the illustrated rhythm:
  data, assets, and the figure contract are all checked.
- CitiBike's external embed is the one accepted locality exception; if its host moves the
  figure breaks, and the local-asset test will not catch it (by design). Bringing the
  figure in-repo would remove the exception.
