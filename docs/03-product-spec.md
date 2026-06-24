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
| Amenity Booking | `/amenities` | Reservasi kolam renang, gym, function hall, BBQ area, dll. dengan kuota & slot waktu otomatis |
| Pengaturan Fasilitas | `/amenities/settings` | Master data fasilitas: jam operasional, durasi slot, kuota per slot, cakupan tower (Request #6) |
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
  Modul Billing menambah panel ringkasan "Tunggakan IPL per Unit" yang
  mengelompokkan saldo tertunggak per unit (diurutkan dari terbesar), memakai
  helper yang sama, tanpa ledger terpisah.
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
- **Jenis pengguna slot parkir** — `ParkingSlot.userType: 'resident' | 'visitor'`
  ditambahkan untuk membedakan slot parkir penghuni vs. slot tamu, dengan label
  & badge di `lib/status.ts` (`parkingUserTypeLabel`/`parkingUserTypeVariant`),
  kolom badge dan faceted filter "Jenis Pengguna" di tabel slot parkir, serta
  field pilihan pada form Tambah/Edit Slot Parkir.

## Reservasi Fasilitas: Master Data, Jadwal & Kuota (ditambahkan di Request #6)

Sebelumnya Amenity Booking hanya berupa teks bebas tanpa kuota. Sekarang
reservasi fasilitas memiliki master data dan penegakan kuota:

- **Master fasilitas (`Amenity`)** — dikelola di halaman baru **Pengaturan
  Fasilitas** (`/amenities/settings`), berisi nama, kategori, cakupan
  (`audience: 'all'` untuk fasilitas bersama semua tower, atau
  `single_building` + `buildingId` untuk fasilitas spesifik satu tower —
  meniru pola `AnnouncementAudience`), jam operasional (`operatingHoursStart`/
  `operatingHoursEnd`), durasi slot (`slotDurationMinutes`), kuota per slot
  (`capacityPerSlot`), dan status aktif/nonaktif (mis. ditutup untuk
  maintenance). CRUD penuh dengan DataTable/FormDialog/RowActions seperti
  modul lain. Mock data mencakup 8 fasilitas contoh: Kolam Renang, Gym,
  Function Hall, BBQ Area, Sky Lounge, Co-working Space, Perpustakaan, dan
  Meja Biliard.
- **Booking terhubung ke master fasilitas** — `AmenityBooking.amenityId`
  (FK ke `Amenity`) menggantikan nama fasilitas bebas teks. Form booking di
  `/amenities` hanya menampilkan fasilitas yang `status: 'active'`.
- **Slot waktu dinamis** — opsi slot waktu pada form booking diturunkan
  otomatis dari jam operasional & durasi slot fasilitas yang dipilih, via
  `generateTimeSlots()` di `lib/format.ts`. `FormDialog` mendapat hook
  generik baru `onFieldChange` agar halaman pemanggil bisa membangun field
  select yang nilainya bergantung pada field lain, tanpa mengubah arsitektur
  form yang sudah ada.
- **Penegakan kuota** — submit booking (tambah/edit) memeriksa jumlah
  booking aktif (bukan `cancelled`) pada kombinasi fasilitas + tanggal +
  slot yang sama; jika sudah mencapai `capacityPerSlot`, submit diblokir
  dengan peringatan. Kolom "Kuota Slot" pada tabel reservasi menampilkan
  pemakaian real-time (mis. "2 dari 4 slot terisi"). Tidak ada penyelesaian
  konflik di luar penghitungan sinkron terhadap state lokal (tanpa backend).

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
