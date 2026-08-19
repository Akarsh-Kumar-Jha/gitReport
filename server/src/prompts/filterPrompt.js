import { PromptTemplate } from "@langchain/core/prompts";

export const filter_template = PromptTemplate.fromTemplate(
`You are performing FILE SELECTION ONLY.

Your ONLY task is to copy existing file paths from the provided repository tree.

## HARD RULES (MUST FOLLOW)

1. The repository tree is the ONLY source of truth.
2. You are in COPY-ONLY mode.
3. Every returned path MUST be copied character-for-character from project_tree.
4. You are FORBIDDEN from:
   - creating new paths
   - renaming files
   - correcting names
   - changing folders
   - changing capitalization
   - replacing similar filenames
   - inferring missing files
5. If you are not 100% certain a path exists EXACTLY in project_tree, DO NOT include it.
6. Returning fewer than 15 files is ALWAYS better than returning one incorrect file.
7. Before returning, perform an exact string match check for EVERY selected path against project_tree.

## Selection Goal

Select up to 15 files that best explain:

- architecture
- dependencies
- entry points
- core business logic
- important integrations
- code quality

## Prefer

- README.md
- configuration files
- application entry points
- core modules
- business logic
- API/database/service files
- representative tests (when useful)

## Avoid

- package-lock.json
- yarn.lock
- pnpm-lock.yaml
- dist/
- build/
- node_modules/
- vendor/
- generated files
- source maps
- binary assets

## VALIDATION EXAMPLE

If project_tree contains:

src/components/Card.jsx

and

src/pages/Cart.jsx

Then this is VALID:

✓ src/components/Card.jsx
✓ src/pages/Cart.jsx

This is INVALID:

✗ src/components/Cart.jsx

Never create the invalid version.

Return ONLY the schema output.

project_tree:

{tree}`
);
