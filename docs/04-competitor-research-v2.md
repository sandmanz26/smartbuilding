# Competitor Research v2 — Gap Analysis & Prioritized Shortlist

## Prioritized shortlist (implemented this round)

Picked for high value / low-to-medium effort, buildable with existing
DataTable + FormDialog + mock-state architecture (no backend):

1. **CSV Export/Import** on data-heavy modules (Units, Billing, Leases,
   Vendors, Meter Readings) — every competitor (AppFolio, Buildium, Yardi
   Breeze) supports bulk data import/export; it's table-stakes for onboarding
   a building's existing spreadsheet data and for accounting handoff.
2. **Form validation** in `FormDialog` (required fields, number/date sanity
   checks, inline errors) — currently any garbage/empty submission is
   accepted, which is unrealistic for "complex case" data entry at scale.
3. **Bulk actions** (row selection + bulk delete) in `DataTable` — property
   managers handling hundreds of units/invoices need to act on many rows at
   once (e.g. month-end invoice cleanup), a pattern present in every
   competitor's grid UI (AppFolio's bulk e-sign, Buildium's bulk rent charges).
4. **Relational-integrity guard on delete** — deleting a Unit that still has
   active Leases/Invoices should warn, not silently orphan data. Strata/condo
   systems (Yardi Breeze associations, Console Cloud) enforce this at the data
   layer; we approximate it client-side since there's no real DB.
5. **Lease renewal reminders** — leases ending within 60 days are surfaced
   distinctly (already partly modeled via `ending_soon` status; we make the
   threshold automatic/computed rather than a static seeded value, and added
   a dedicated dashboard call-out).
6. **Invoice aging / arrears view + automatic late fee** — overdue invoices
   computed against due date, with an automatic late-fee surcharge shown in
   the Billing module. AppFolio/Buildium/Yardi all support configurable late
   fees and arrears (aging buckets) reporting; Indonesian apartment IPL
   software (MOaja, Lyrid) frames the same idea as "denda keterlambatan".

## Deferred (valuable, but out of scope for this round)

- Online tenant/owner self-service portal & resident mobile app.
- Real payment gateway / bank reconciliation (AppFolio, Buildium core
  differentiator — requires real backend & compliance, out of scope for a
  frontend-only mock demo).
- E-signature / online lease signing workflow.
- Owner-association financials (sinking fund / reserve fund tracking,
  AGM/voting tools) — common in MRI Strata / Console Cloud for strata title
  buildings; deferred as a v3 candidate.
- Predictive/automated maintenance scheduling tied to IoT sensor feeds
  (already loosely modeled via Asset health score; deeper automation deferred).
- Multi-currency / multi-entity accounting ledgers (full GL) — would need a
  real backend to be meaningful.

## Research notes by competitor

### AppFolio
Cloud PMS targeting 50+ unit portfolios. Strengths: AI leasing assistant,
mobile work-order/vendor coordination, integrated rent tracking with bank
reconciliation, online applications w/ e-signature & tenant screening.
Source: https://www.turbotenant.com/reviews/appfolio-vs-yardi-vs-buildium/,
https://agorareal.com/compare/appfolio-vs-yardi/

### Buildium
Targets smaller managers / portfolios up to ~5,000 units. Core: property
accounting, online leasing, resident portal, maintenance management — a
single pane of glass for day-to-day ops. Source:
https://ndconsultingllc.com/buildium-vs-appfolio-vs-yardi-which-software-is-best-for-your-property-needs/

### Yardi Breeze
Targets small/mid owners across residential, HOA/condo, affordable housing,
storage, mixed portfolios. Strong at owner-by-fraction reporting, payment
calculation while maintaining reserve amounts — i.e. strata/condo-style
shared-ownership financials. Source:
https://www.softwareadvice.com/property/yardi-breeze-profile/,
https://www.capterra.com/compare/47428-164741/Buildium-Property-Management-Software-vs-Yardi-Breeze

### MRI Software / Strata Master, ResMan, Console Cloud, RealPage
(background knowledge + general market positioning) — all add
strata-specific concerns on top of generic PMS: owners corporation /
body-corporate financials, AGM scheduling and voting, by-law compliance,
sinking-fund/reserve-fund tracking, and levy notices distinct from regular
rent invoices. These overlap with our existing Billing/IPL module but go
further into governance — flagged as a v3 candidate above.

### Indonesian market (IPL / apartment service-charge context)
Local apartment management apps (MOaja, Lyrid, Bimasakti, Realta, Nimbus9)
emphasize: (a) automatic due-date payment reminders before IPL is overdue,
(b) late-fee/denda enforcement, sometimes tied to access restrictions
(elevator/parking lockout) for non-payment, (c) full payment history per
unit, (d) multi-channel payment (bank transfer, e-wallet). This directly
informed the late-fee + arrears aging addition to Billing in this round.
Sources:
https://twospaces.id/journals/mengenal-ipl-saat-menyewa-apartemen-di-indonesia-apa-kenapa-dan-bagaimana,
https://manyoption.co.id/bayar-ipl-apartemen-makin-mudah-dengan-moaja/,
https://lyrid.co.id/aplikasi-pembayaran-ipl-jadi-solusi-warga/,
https://jendela.com/artikel/tips-pemilik-apartemen/perbedaan-service-charge-sinking-fund-dan-ipl
