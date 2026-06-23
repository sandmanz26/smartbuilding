# Product Spec — SmartBuilding Enterprise BMS (Frontend Demo)

## Tujuan
Frontend-only demo enterprise Building Management System (BMS) untuk **kompleks
apartemen multi-tower**, dibangun dengan React + shadcn/ui + Tailwind CSS v4,
tanpa backend nyata (semua data adalah mock data lokal di `src/data/mock.ts`).

## Modul yang Dibangun

### Operasional Gedung (BMS klasik)

| Modul | Rute | Insight dari Kompetitor |
|---|---|---|
| Dashboard / Portfolio Overview | `/` | KPI ringkas multi-gedung (Desigo CC, TRIRIGA) |
| Gedung & Lantai | `/buildings` | Space/occupancy management (TRIRIGA, Planon) |
| HVAC & Energi | `/hvac-energy` | Zone control + energy breakdown (Metasys, EcoStruxure) |
| Alarm & Notifikasi | `/alarms` | Severity + acknowledge workflow (Desigo CC, Honeywell EBI) |
| Access Control | `/access-control` | Status pintu & log akses (unified security) |
| Aset & Maintenance | `/maintenance` | Health score & work order (predictive maintenance pattern) |

### Manajemen Penghuni (khas apartemen/residential — ditambahkan di Request #2)

| Modul | Rute | Kebutuhan Nyata Operator Apartemen |
|---|---|---|
| Unit & Penghuni | `/units` | Data unit per tower, status hunian, pemilik/penyewa |
| Billing & Iuran | `/billing` | Invoice IPL & utilitas, status lunas/jatuh tempo/tertunggak |
| Visitor Management | `/visitors` | Log tamu masuk/keluar, keperluan, kendaraan |
| Parking | `/parking` | Status slot parkir mobil/motor, kendaraan terdaftar |
| Amenity Booking | `/amenities` | Reservasi kolam renang, gym, function hall, BBQ area |
| Keluhan & Tiket | `/complaints` | Tiket keluhan penghuni dengan prioritas & status |
| Pengumuman | `/announcements` | Broadcast info ke seluruh kompleks atau per tower |

### Administrasi

| Modul | Rute |
|---|---|
| Laporan | `/reports` |
| Pengguna & Role | `/users` |

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
  pages/            # 15 halaman modul di atas
  types/index.ts    # definisi tipe domain BMS & residential
```

## Catatan
- Tidak ada backend/API — seluruh interaksi (misalnya "Acknowledge" alarm)
  hanya mengubah state React di sisi klien (tidak persisten setelah refresh).
- Desain mengikuti pola enterprise: multi-building, role-based access,
  alarm severity & acknowledge, predictive maintenance health score,
  dan reporting/compliance.
