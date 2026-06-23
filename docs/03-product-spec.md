# Product Spec — SmartBuilding Enterprise BMS (Frontend Demo)

## Tujuan
Frontend-only demo enterprise Building Management System (BMS), dibangun dengan
React + shadcn/ui + Tailwind CSS v4, tanpa backend nyata (semua data adalah mock
data lokal di `src/data/mock.ts`).

## Modul yang Dibangun

| Modul | Rute | Insight dari Kompetitor |
|---|---|---|
| Dashboard / Portfolio Overview | `/` | KPI ringkas multi-gedung (Desigo CC, TRIRIGA) |
| Gedung & Lantai | `/buildings` | Space/occupancy management (TRIRIGA, Planon) |
| HVAC & Energi | `/hvac-energy` | Zone control + energy breakdown (Metasys, EcoStruxure) |
| Alarm & Notifikasi | `/alarms` | Severity + acknowledge workflow (Desigo CC, Honeywell EBI) |
| Access Control | `/access-control` | Status pintu & log akses (unified security) |
| Aset & Maintenance | `/maintenance` | Health score & work order (predictive maintenance pattern) |
| Laporan | `/reports` | Energy vs budget chart + export template (compliance reporting) |
| Pengguna & Role | `/users` | Role-based access: admin, facility manager, technician, viewer |

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (`new-york` style)
- react-router-dom untuk navigasi SPA
- recharts untuk visualisasi data (area chart, bar chart)
- lucide-react untuk ikon

## Struktur Folder
```
app/src/
  components/
    layout/        # AppSidebar, AppLayout
    ui/             # komponen shadcn (button, card, table, sidebar, dll.)
  data/mock.ts      # seluruh mock data (buildings, hvac, alarms, dll.)
  lib/status.ts     # mapping label & badge variant per status/severity
  pages/            # 8 halaman modul di atas
  types/index.ts    # definisi tipe domain BMS
```

## Catatan
- Tidak ada backend/API — seluruh interaksi (misalnya "Acknowledge" alarm)
  hanya mengubah state React di sisi klien (tidak persisten setelah refresh).
- Desain mengikuti pola enterprise: multi-building, role-based access,
  alarm severity & acknowledge, predictive maintenance health score,
  dan reporting/compliance.
