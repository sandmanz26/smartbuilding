# Competitor Research — Enterprise Building Management Systems (BMS)

Riset dilakukan 2026-06-23 untuk memperkuat pemahaman sebelum mendesain produk.

## 1. Siemens Desigo CC
- Platform unifikasi: HVAC, lighting, power, fire, security dalam satu dashboard.
- Digital twin, AI anomaly detection, predictive energy modeling.
- Dashboard customizable, mobile access.
- Target: smart building & mission-critical data center.

## 2. Johnson Controls Metasys / OpenBlue
- Kontrol terpusat HVAC, lighting, fire, security via web UI.
- Open architecture: BACnet, Modbus, LonWorks.
- Analitik lanjutan untuk efisiensi energi & predictive maintenance.
- Skala dari single building sampai portfolio multi-gedung.

## 3. Honeywell (Enterprise Buildings Integrator / Forge)
- Fokus pada life-safety integration, redundansi tinggi, uptime monitoring.
- Banyak dipakai di airport, hospital, critical infrastructure.
- Integrasi HVAC + lighting + fire + security jadi satu platform.

## 4. Schneider Electric EcoStruxure Building Operation
- Arsitektur multi-building, scalable untuk portfolio besar.
- Centralized operations dengan alarm & energy management terintegrasi.

## 5. IBM TRIRIGA (sekarang IBM Maximo Real Estate & Facilities)
- IWMS (Integrated Workplace Management System).
- Modul: space management, lease administration, capital project, maintenance,
  sustainability tracking.
- Dashboard role-based (executive vs facility manager), heat map, KPI trend, mobile.

## 6. Planon & Archibus
- Kompetitor IWMS langsung ke TRIRIGA.
- Kuat di real estate/lease management & workplace management.
- Reporting & compliance accounting untuk kontrak sewa.

## Pola Umum Industri (Key Patterns)

| Kategori | Insight yang Diadopsi |
|---|---|
| Unified dashboard | Satu portal untuk semua subsistem (HVAC, listrik, fire, security, access) |
| Role-based views | Executive lihat KPI ringkas; facility manager lihat detail operasional |
| Real-time monitoring + alarm | Status alarm dengan severity level & acknowledge workflow |
| Energy management | Trend konsumsi energi, benchmarking, target efisiensi |
| Asset & maintenance | Preventive maintenance schedule, work order tracking |
| Multi-building/portfolio | Switch antar gedung/lantai, agregasi data portfolio |
| Space/occupancy | Floor plan visual, okupansi ruangan |
| Access control & security | Status pintu, kartu akses, log kejadian |
| Reporting & compliance | Export laporan, audit trail |
| Mobile-friendly & responsive UI | Akses dari device apapun |

## Kesimpulan untuk Desain Produk

Produk yang dibangun (frontend-only, mock data) akan mengadopsi pola-pola di atas
dalam skala "sederhana namun representatif enterprise":

- Dashboard Overview (KPI ringkas multi-gedung)
- Manajemen Gedung & Lantai (space/floor)
- Monitoring HVAC & Energi
- Alarm & Notifikasi (severity, acknowledge)
- Access Control (status pintu & log akses)
- Asset & Maintenance (work order sederhana)
- Reports (ringkasan & export placeholder)
- User & Role Management (admin, facility manager, viewer)

Sumber riset:
- [Top 10 Building Management System Companies to Know](https://www.nanogrid.com/blog/top-10-building-management-system-companies-to-know-and-how-to-compare-them)
- [Comparing the Top BMS Systems: Features, Pricing, and User Experiences](https://www.enerlution.com.cn/a-news-comparing-the-top-bms-systems-features-pricing-and-user-experiences.html)
- [Top 10 Best Building Automation Software | 2026 Expert Picks](https://zipdo.co/best/building-automation-software/)
- [IBM TRIRIGA - Analyst Reviews, Pricing & Features 2026](https://www3.technologyevaluation.com/solutions/53700/ibm-tririga)
- [Real Estate and Facilities Management | IBM Maximo](https://www.ibm.com/products/tririga)
- [IBM Maximo Real Estate and Facilities Features | G2](https://www.g2.com/products/ibm-maximo-real-estate-and-facilities-formerly-ibm-tririga/features)
