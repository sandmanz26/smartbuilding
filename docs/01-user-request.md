# User Request Log

## Request #1 — 2026-06-23

**Bahasa asal (Indonesia):**

> bekerjalah sebagai expert software engineering dengan kemampuan product manager.
> buatkan saya sebuah front end saja tanpa ada backend. menggunakan shadcn sebagai ui
> framework nya. kamu bisa menggunakan react.
> saya ingin kamu buatkan saya sebuah system sederhana untuk building management
> system. pikirkan dari segi enterprise level.
> lakukan competitor research dulu untuk memahami dan memperkuat pemahamanmu.
> simpan dalam MD setiap request yang saya minta

**Ringkasan kebutuhan:**

1. Frontend-only (tanpa backend / tanpa API server sungguhan — gunakan mock data).
2. Tech stack: React + shadcn/ui.
3. Domain: Building Management System (BMS), dengan pola pikir enterprise-grade
   (multi-building, multi-role, skalabel, auditable).
4. Lakukan riset kompetitor (Siemens, Honeywell, Johnson Controls, IBM TRIRIGA,
   Planon, Archibus, Schneider Electric, dll.) sebelum desain produk.
5. Setiap request dari user disimpan dalam file Markdown (dokumen ini & seterusnya).

## Request #2 — 2026-06-23

**Bahasa asal (Indonesia):**

> tambahkan fitur fitur lain yang sekiranya perlu untuk building management,
> sebagai gambaran context building yang di buat sistemnya adalah apartment
> dengan banyak gendung. lakukan penambahan fitur yang memang secara real di
> butuhkan. tolong tambahkan.

**Ringkasan kebutuhan:**

Konteks sistem diperjelas: ini adalah **apartemen dengan banyak gedung (multi-tower
residential)**, bukan sekadar gedung perkantoran. Maka fitur BMS generik (HVAC,
energi, alarm, access control, maintenance) perlu dilengkapi fitur khas
**residential/apartment property management** yang nyata dibutuhkan operator
apartemen sehari-hari:

1. **Unit & Penghuni (Unit/Tenant Management)** — data unit per tower/lantai,
   status (terisi/kosong/dijual/disewa), data pemilik & penyewa.
2. **Billing & Iuran (IPL/Service Charge)** — invoice bulanan, tagihan utilitas,
   status lunas/jatuh tempo/tertunggak.
3. **Visitor Management** — log tamu masuk/keluar per tower, sponsor unit, status.
4. **Parking Management** — slot parkir per tower, kendaraan terdaftar, status.
5. **Amenity Booking** — reservasi fasilitas bersama (gym, kolam renang,
   function hall, BBQ area) dengan slot waktu.
6. **Keluhan & Tiket Layanan (Complaints/Service Requests)** — keluhan penghuni,
   prioritas, status penyelesaian.
7. **Pengumuman (Announcements)** — broadcast informasi ke penghuni per tower
   atau seluruh kompleks.

Tetap frontend-only dengan mock data, konsisten dengan stack React + shadcn/ui
yang sudah ada.

## Request #3 — 2026-06-23

**Bahasa asal (Indonesia):**

> tolong buat data table lebih mature seperti sort, search, filter, termasuk
> CRUD nya juga. serta saya mau lebih banyak fitur yang betul betul real ada
> di market. sekali lagi pikirkan dari sisi product juga

**Ringkasan kebutuhan:**

1. **Data table yang mature** — semua tabel di seluruh modul perlu naik level
   dari tabel statis menjadi data table interaktif: sorting per kolom, search/
   pencarian, faceted filter (multi-select per kolom seperti status/kategori),
   dan pagination — dibangun sebagai komponen generik (`DataTable`,
   `DataTableColumnHeader`, `DataTableFacetedFilter`) berbasis TanStack Table.
2. **CRUD penuh** — setiap modul mendapat kemampuan Tambah/Edit/Hapus melalui
   `FormDialog` (form generik berbasis konfigurasi field) dan `RowActions`
   (dropdown edit/hapus dengan dialog konfirmasi), dengan state lokal React
   (`useState`) yang di-seed dari mock data — tetap frontend-only, tanpa backend.
3. **Fitur baru yang nyata ada di pasar properti/apartemen** — ditambahkan tiga
   modul baru yang lazim dipakai software property management komersial:
   - **Manajemen Sewa (Lease Management)** — kontrak sewa unit, masa sewa,
     nilai sewa bulanan, deposit, status (aktif/akan berakhir/berakhir/diputus).
   - **Submetering Air & Listrik (Meter Reading)** — pencatatan meter individual
     per unit per periode untuk penagihan utilitas berbasis pemakaian aktual.
   - **Vendor & Kontraktor (Vendor Management)** — data vendor jasa kebersihan,
     keamanan, HVAC, lift, landscaping, pest control beserta masa kontrak & status.
4. Modul yang sudah ada (Unit, Billing, Visitor, Parking, Amenity, Complaints,
   Maintenance/Work Order, Pengguna) dikonversi dari tabel statis shadcn menjadi
   `DataTable` dengan CRUD lengkap, konsisten dengan tiga modul baru di atas.
