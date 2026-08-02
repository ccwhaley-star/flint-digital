# Tumbler PWA data export — all properties

Full export of the Tumbler platform's live tenant database (Turso), pulled
2026-08-02 14:18 UTC via the `Export Tenant Data` workflow on the
`claude/pwa-data-export` branch of `ccwhaley-star/tumbler-platform`.
Covers all 8 properties (4 owned + 4 SandHills lease-option).

## Start here for the August forecast

**`monthly_summary.csv`** — one row per property per month:
revenue collected, ESS expected revenue, rented/total units, occupancy %,
move-ins/outs, GA sessions, and inbound call volume. August 2026 rows are
partial (collections through Aug 2) but `expected_revenue` for August is
already populated from ESS — that column is the natural forecast baseline,
adjusted by the occupancy and net-move trend.

## Raw tables

| File | Rows | Contents |
|---|---|---|
| `properties.csv` | 8 | Property master (id, name, units, status) |
| `revenue_transactions.csv` | 8,552 | Every ESS revenue transaction, Jul 2025 – Aug 2, 2026 |
| `expected_revenue.csv` | 18 | ESS expected monthly revenue, Apr – Aug 2026 |
| `occupancy_history.csv` | 139 | Monthly rented/total units, Jan 2025 – Aug 2026 |
| `move_activity.csv` | 128 | Move-ins/outs, Apr – Aug 2026 |
| `rent_roll.csv` | 1,021 | Current rent roll (unit, tenant, rent, market rate) |
| `unit_rates.csv` | 2,072 | Unit-level street/current rates |
| `past_due.csv` | 169 | Delinquencies (balance, days behind, lockout/auction) |
| `ga_metrics.csv` | 20 | Website sessions/pageviews by month (Mar – Aug 2026) |
| `quo_calls.csv` | 4,367 | Phone calls, Jan – Aug 2026 (IDs and transcripts omitted) |
| `quo_messages.csv` | 5,019 | SMS metadata, Jan – Aug 2026 (IDs and bodies omitted) |
| `market_rates.csv` | 0 | Empty in the live DB |

Property IDs in these files are the live multitenant IDs (5–12), per
`properties.csv` — not the old 1–6 IDs from the legacy local database.

To re-export fresh data later, push any commit to (or manually dispatch the
workflow on) the `claude/pwa-data-export` branch of `tumbler-platform`;
the CSVs are re-committed to that branch's `data-export/` folder.
