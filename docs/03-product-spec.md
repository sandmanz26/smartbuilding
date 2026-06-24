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

## Export/Import & Penanganan Complex Case (ditambahkan di Request #4)

Setelah riset kompetitor lanjutan (`docs/04-competitor-research-v2.md`),
ditambahkan kapabilitas berikut — generik di infrastruktur `DataTable`, bukan
duplikasi per halaman:

- **Export CSV** — tombol toolbar di `DataTable` (prop `exportFilename`)
  yang mengekspor baris yang sedang ter-filter/sort ke file `.csv`, dibuat
  murni di browser (`Blob` + `URL.createObjectURL`, tanpa library eksternal).
  Header diturunkan dari definisi kolom.
- **Import CSV** — tombol toolbar (prop `onImport`) dengan parser CSV ringan
  (`src/lib/csv.ts`, menangani quoted field, koma, newline) yang mem-parse
  file menjadi `Record<string,string>[]`; setiap halaman memetakan baris hasil
  parse ke tipe domainnya sendiri lalu menggabungkannya ke state lokal.
  Diaktifkan di modul Unit, Billing, Manajemen Sewa, Vendor & Kontraktor, dan
  Submetering (modul data-entry paling intensif).
- **Validasi form** — `FormDialog` memvalidasi field wajib (`required`,
  default true kecuali dinyatakan `false`), format angka (termasuk `min`),
  dan format tanggal, dengan pesan error inline di bawah setiap field serta
  indikator `*` pada label field wajib. Submit diblokir selama ada error.
- **Bulk actions** — `DataTable` mendukung kolom checkbox seleksi baris
  (prop `onBulkDelete`) dengan tombol "Hapus (n)" dan dialog konfirmasi,
  aktif di modul Unit, Billing, Manajemen Sewa, Vendor & Kontraktor, dan
  Submetering — penting untuk mengelola ratusan unit/invoice sekaligus.
- **Peringatan integritas relasional** — di modul Unit, menghapus satu atau
  beberapa unit yang masih memiliki Lease/Invoice terkait memunculkan dialog
  konfirmasi tambahan yang menjelaskan jumlah data terkait sebelum hapus
  benar-benar dieksekusi (baik hapus satuan maupun bulk delete).
- **Pengingat perpanjangan sewa** — modul Manajemen Sewa menghitung otomatis
  lease yang akan berakhir dalam 60 hari (`daysUntil` di `lib/format.ts`) dan
  menampilkannya sebagai KPI card serta badge "Berakhir N hari lagi" per baris.
- **Aging tunggakan & denda keterlambatan otomatis** — modul Billing
  menghitung kolom "Umur Tunggakan" (bucket 1-30/31-60/61-90/90+ hari) dan
  "Denda" (2% dari nilai invoice per blok 30 hari terlambat, maksimum 20%,
  via `calculateLateFee` di `lib/format.ts`), plus KPI card potensi denda
  keseluruhan — meniru praktik umum software IPL apartemen Indonesia dan
  fitur late-fee AppFolio/Buildium/Yardi Breeze.

## IPL, Status Penjualan Unit, Pet Policy & Kuota Parkir (ditambahkan di Request #5)

Empat kapabilitas residential tambahan, semuanya derived dari mock data yang
sudah ada (tanpa ledger/tabel baru), konsisten dengan pola yang ada:

- **Tunggakan IPL per unit** — modul Unit menambah kolom "Tunggakan IPL" yang
  menghitung total invoice belum lunas (`status !== 'paid'`) per unit dari
  `invoices`, via `calculateOutstandingBalance(unitId, invoices)` di
  `lib/format.ts`. Ditampilkan sebagai badge "Lunas" atau "Ada Tunggakan: Rp X".
- **Status dijual vs kosong biasa** — `Unit.isListedForSale: boolean`
  melengkapi `Unit.status: UnitOccupancyStatus` untuk membedakan unit kosong
  biasa dari unit yang sudah dimiliki tapi sedang aktif dipasarkan dan belum
  laku terjual. Disurfacekan sebagai badge "Kosong Belum Laku" di kolom Status
  modul Unit serta checkbox di form Tambah/Edit Unit.
- **Pet policy per gedung** — `Building.petsAllowed: boolean` disurfacekan
  sebagai badge "Boleh Hewan"/"Tidak Boleh Hewan" di card gedung pada modul
  Gedung & Lantai. `Unit.hasPet: boolean` (penghuni unit memelihara hewan)
  ditampilkan sebagai badge terpisah di modul Unit.
- **Kuota parkir per unit** — `Unit.parkingQuota: number` (default 1 untuk
  Studio/1BR/2BR, 2 untuk unit besar seperti 3BR Executive). Modul Parking
  menambah tabel "Kuota Parkir per Unit" yang membandingkan jumlah slot
  (`parkingSlots` dengan `unitId` cocok) terhadap kuota, dengan badge status
  "Sesuai Kuota"/"Lebih Kuota"/"Belum Ada Slot" dan KPI card ringkasan unit
  yang lebih kuota / belum punya slot.

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
    format.ts         # formatRupiah, formatDate, formatDateTime, daysUntil, calculateLateFee
    csv.ts             # parser & builder CSV browser-only untuk export/import (Request #4)
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
