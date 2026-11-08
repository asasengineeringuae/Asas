# Glossary

Domain and architecture names used in this repo.

## Domain

**Portfolio** — published website projects (CMS `projects` collection).

**Website client** — logo/name record on the public site, distinct from an Ops client.

**Identity bridge** — matching Ops employees/clients to CMS users, team members, and website clients.

## Architecture

**Module** — anything with an interface and an implementation.

**Seam** — where that interface lives; behaviour can change behind it without editing callers.

**Adapter** — a concrete implementation at a seam (local `.data`, serverless tmp, in-memory overlay).

**Persistence bag** — the deep JSON document module at `lib/persist/json-documents.js`.
