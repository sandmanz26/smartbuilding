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
