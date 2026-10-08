# CAP Learning: Purchase Requests

A hands-on SAP CAP (Node.js) project for ABAP developers. It follows the learning plan stage by stage: you get a working model, services and seed data, and you implement the business logic and authorization yourself. Tests tell you when each exercise is done.

## Getting started

```sh
npm install -g @sap/cds-dk   # once
npm install
cds watch                    # http://localhost:4004
```

Mocked users (no password): `alice` (Requester), `bob` (Approver), `carol` (Requester and Approver).
Try the calls in [`test/requests.http`](test/requests.http) with the VS Code REST Client extension.

## What is done, what is yours

| Stage | Status | Where |
| --- | --- | --- |
| 2 Domain model | Done, read it and extend it | `db/schema.cds`, `db/data/*.csv` |
| 3 Services | Done, try the `.http` calls | `srv/*.cds`, `test/requests.http` |
| 4 Handlers and CQL | **Your exercise** | `TODO` comments in `srv/request-service.js`, `srv/approval-service.js` |
| 5 Authorization | **Your exercise** | `TODO` comments in `srv/request-service.cds`, `srv/approval-service.cds` |
| 6 to 9 | Next steps from the plan | Fiori app, more tests, HANA Cloud, BTP |

## Tests

```sh
npm test                  # baseline: should always pass
npm run test:exercises    # fails until you finish stages 4 and 5
```

Run a single stage with `npx jest test/exercises/stage4-handlers.test.js`.

## Stuck?

The `solutions` branch has a reference implementation. Try first, then compare: `git diff main solutions -- srv/`.

## ABAP to CAP in one glance

| ABAP / RAP | CAP Node.js |
| --- | --- |
| CDS view entity / DDIC table | `entity` in `db/schema.cds` |
| Service definition + binding | `service` in `srv/*.cds`, OData V4 at `/odata/v4/<path>` |
| Behavior implementation | `srv/*.js` with `this.before / on / after` |
| Open SQL | CQL: `await SELECT.from(...).where(...)` |
| Message class | `_i18n/messages.properties` + `req.error(code, 'KEY')` |
| AUTHORITY-CHECK / DCL | `@requires`, `@restrict` |
| ABAP Unit | `cds.test` + Jest |
