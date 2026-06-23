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

### Keuangan & Vendor (ditambahkan di Request #3 — fitur nyata pasar property management)

| Modul | Rute | Kebutuhan Nyata Operator Apartemen |
|---|---|---|
| Manajemen Sewa | `/leases` | Kontrak sewa unit, masa sewa, nilai sewa & deposit, status sewa |
| Submetering | `/meter-readings` | Pencatatan meter air/listrik per unit untuk penagihan berbasis pemakaian |
| Vendor & Kontraktor | `/vendors` | Data vendor jasa (kebersihan, keamanan, HVAC, lift, landscaping) & kontrak |

### Administrasi

| Modul | Rute |
|---|---|
| Laporan | `/reports` |
| Pengguna & Role | `/users` |

## Data Table & CRUD (ditambahkan di Request #3)

Seluruh modul tabel (operasional maupun residential) menggunakan infrastruktur
data table generik berbasis **TanStack Table**, bukan lagi tabel statis:

- **Sort** — setiap kolom yang relevan bisa diurutkan via `DataTableColumnHeader`.
- **Search** — pencarian teks bebas pada kolom kunci (nama penyewa, nomor unit,
  nama vendor, dll.) via `searchColumnId`.
- **Faceted filter** — filter multi-select per kolom (status, kategori,
  prioritas, jenis meter, dll.) via `DataTableFacetedFilter`.
- **Pagination** — kontrol jumlah baris per halaman & navigasi halaman.
- **CRUD** — Tambah/Edit lewat `FormDialog` (form generik berbasis konfigurasi
  field: text/number/date/datetime/textarea/select), dan Hapus lewat
  `RowActions` (dropdown dengan dialog konfirmasi). Semua operasi memodifikasi
  state React lokal (`useState`) yang di-seed dari mock data — tetap
  frontend-only, tidak ada backend/API, dan tidak persisten setelah refresh.

Komponen ini dipakai konsisten di seluruh modul: Unit, Billing, Visitor,
Parking, Amenity, Complaints, Maintenance (Work Order), Pengguna, dan tiga
modul baru (Manajemen Sewa, Submetering, Vendor & Kontraktor).

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (`new-york` style)
- react-router-dom untuk navigasi SPA
- recharts untuk visualisasi data (area chart, bar chart)
- @tanstack/react-table untuk data table (sort, filter, pagination)
- lucide-react untuk ikon

## Struktur Folder
```
app/src/
  components/
    layout/         # AppSidebar, AppLayout
    ui/              # komponen shadcn (button, card, table, sidebar, dll.)
    data-table/      # DataTable, DataTableColumnHeader, DataTableFacetedFilter,
                      # FormDialog, RowActions — infrastruktur CRUD generik
  data/mock.ts       # seluruh mock data (buildings, hvac, alarms, leases, dll.)
  lib/
    status.ts        # mapping label & badge variant per status/severity
    format.ts         # formatRupiah, formatDate, formatDateTime
  pages/             # 18 halaman modul di atas
  types/index.ts     # definisi tipe domain BMS & residential
```

## Catatan
- Tidak ada backend/API — seluruh interaksi CRUD (Tambah/Edit/Hapus, termasuk
  "Acknowledge" alarm) hanya mengubah state React di sisi klien (tidak
  persisten setelah refresh).
- Desain mengikuti pola enterprise: multi-building, role-based access,
  alarm severity & acknowledge, predictive maintenance health score,
  data table mature (sort/search/filter/CRUD), dan reporting/compliance.
