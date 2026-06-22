# 📊 SimaRukun Monitoring Stack

**Versi**: 1.0
**Status**: Tahap 3 (Monitoring & Observability)
**Enterprise Compliance**: 95%

---

## 📌 Tentang Monitoring Stack

Monitoring Stack untuk SimaRukun menyediakan:
- **Metrics Collection**: Prometheus
- **Visualization**: Grafana
- **Error Tracking**: Sentry
- **Log Aggregation**: Loki + Promtail
- **Alerting**: Alertmanager

---

## 🚀 Cepat Mulai

### 1. Prasyarat
- Docker
- Docker Compose
- Port yang tersedia: 9090, 3000, 3100, 9093, 9100

### 2. Setup

#### Clone Repository
```bash
git clone https://github.com/aca-error/simarukun.git
cd simarukun/docker/monitoring
```

#### Salin File Environment
```bash
cp .env.monitoring.example .env
```

#### Edit .env
```bash
nano .env
```

Sesuaikan nilai-nilai:
```env
# Sentry
SENTRY_DSN=your-sentry-dsn

# Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-password

# Alertmanager
ALERTMANAGER_EMAIL_TO=your-email@example.com
ALERTMANAGER_SLACK_WEBHOOK_URL=your-slack-webhook
```

### 3. Jalankan Monitoring Stack

#### Using Makefile
```bash
make start
```

#### Using Docker Compose
```bash
docker-compose -f docker-compose.yml up -d
```

### 4. Akses Dashboard

| Service | URL | Credentials |
|---------|-----|--------------|
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3000 | admin / admin123 (atau password Anda) |
| Loki | http://localhost:3100 | - |
| Alertmanager | http://localhost:9093 | - |

---

## 📊 Komponen Monitoring Stack

### 1. Prometheus
- **Port**: 9090
- **Fungsi**: Collect metrics dari semua service
- **Metrics**:
  - API Performance (request rate, response time, error rate)
  - Database Performance (query time, connections)
  - Server Metrics (CPU, RAM, Disk, Network)

#### Target yang Dimonitor:
- Prometheus itself
- Node Exporter (server metrics)
- NestJS API (/api/metrics)
- PostgreSQL Exporter
- Loki
- Grafana
- Alertmanager

### 2. Grafana
- **Port**: 3000
- **Fungsi**: Visualisasi data metrics
- **Default Credentials**: admin / admin123

#### Dashboard yang Tersedia:
1. **API Performance** - Request rate, response time, error rate
2. **Database Performance** - Query time, connections, cache hit ratio
3. **Server Metrics** - CPU, RAM, Disk, Network
4. **Alerts** - Active alerts, alerts over time

#### Data Sources:
- Prometheus (http://prometheus:9090)
- Loki (http://loki:3100)

### 3. Sentry
- **Fungsi**: Error tracking & performance monitoring
- **Integrasi**:
  - Backend (NestJS)
  - Frontend (Next.js)

#### Fitur:
- Error tracking
- Performance monitoring
- Session replay (frontend)
- Release tracking

### 4. Loki + Promtail
- **Loki Port**: 3100
- **Promtail**: Log collection agent
- **Fungsi**: Log aggregation & storage

#### Log yang Dikumpulkan:
- Container logs
- Docker logs
- API logs
- Web logs
- Nginx logs

### 5. Alertmanager
- **Port**: 9093
- **Fungsi**: Mengirim notifikasi alert
- **Notification Channels**:
  - Email
  - Slack (jika dikonfigurasi)
  - Telegram (jika dikonfigurasi)

---

## 🔍 Alert Rules

### API Alerts
| Alert | Condition | Severity | Description |
|-------|-----------|----------|-------------|
| HighErrorRate5xx | 5xx error rate > 1% | Critical | Tinggi error rate 5xx |
| HighErrorRate4xx | 4xx error rate > 5% | Warning | Tinggi error rate 4xx |
| HighResponseTime | 95th percentile > 1s | Warning | Response time lambat |
| HighRequestRate | > 1000 req/s | Warning | Request rate tinggi |
| LowRequestRate | < 1 req/5m | Warning | Request rate rendah (API down?) |

### Database Alerts
| Alert | Condition | Severity | Description |
|-------|-----------|----------|-------------|
| HighDBConnections | > 50 connections | Warning | Banyak koneksi database |
| HighQueryTime | Avg query time > 0.5s | Warning | Query lambat |
| HighLockWaitTime | > 10 locks | Critical | Lock contention tinggi |
| HighDBSizeGrowth | > 100MB/hour | Warning | Pertumbuhan database cepat |

### Server Alerts
| Alert | Condition | Severity | Description |
|-------|-----------|----------|-------------|
| HighCPUUsage | > 80% | Critical | CPU usage tinggi |
| HighMemoryUsage | > 80% | Critical | Memory usage tinggi |
| LowMemoryAvailable | < 20% | Critical | Memory tersedia rendah |
| HighSwapUsage | > 0 | Warning | Swap usage tinggi |
| LowDiskSpace | < 20% | Critical | Disk space rendah |
| HighDiskIO | > 50% | Warning | Disk I/O tinggi |

### Monitoring Stack Alerts
| Alert | Condition | Severity | Description |
|-------|-----------|----------|-------------|
| PrometheusDown | Service down | Critical | Prometheus tidak berjalan |
| GrafanaDown | Service down | Warning | Grafana tidak berjalan |
| LokiDown | Service down | Warning | Loki tidak berjalan |
| AlertmanagerDown | Service down | Critical | Alertmanager tidak berjalan |

---

## 📝 Konfigurasi

### 1. Prometheus

File: `prometheus.yml`

Konfigurasi utama:
- `scrape_interval`: 15s (interval scrape)
- `evaluation_interval`: 15s (interval evaluasi rules)
- `storage.tsdb.retention.time`: 30d (retensi data)

Target yang dikonfigurasi:
- Prometheus itself
- Node Exporter (port 9100)
- NestJS API (port 3001, path /api/metrics)
- PostgreSQL Exporter (port 9187)
- Loki (port 3100)
- Grafana (port 3000)
- Alertmanager (port 9093)

### 2. Alert Rules

File: `prometheus.rules.yml`

Berisi semua alert rules untuk:
- API Performance
- Database Performance
- Server Metrics
- Monitoring Stack Health

### 3. Alertmanager

File: `alertmanager.yml`

Konfigurasi:
- Grouping alerts by alertname, severity, category
- Routing ke receivers yang sesuai
- Inhibit rules untuk mencegah duplicate alerts

Receivers:
- default-receiver (email)
- critical-receiver (email + Slack + Telegram)
- warning-receiver (email + Slack)
- api-receiver (email)
- database-receiver (email)
- server-receiver (email)
- security-receiver (email + Slack + Telegram)

### 4. Grafana Dashboards

Dashboard yang tersedia:
- `dashboards/api-performance.json` - API Performance
- `dashboards/db-performance.json` - Database Performance
- `dashboards/server-metrics.json` - Server Metrics
- `dashboards/alerts.json` - Alerts Dashboard

Data Sources:
- `datasources/prometheus.yml` - Prometheus
- `datasources/loki.yml` - Loki

---

## 🛠️ Troubleshooting

### 1. Prometheus Tidak Berjalan
```bash
# Check container logs
docker logs simarukun-prometheus

# Check if port is available
netstat -tuln | grep 9090

# Check configuration
cat prometheus.yml
```

### 2. Grafana Tidak Bisa Login
```bash
# Reset password
make reset-grafana-password

# Or manually:
docker exec -it simarukun-grafana grafana-cli admin reset-admin-password new-password
```

### 3. Metrics Tidak Muncul di Prometheus
```bash
# Check if API is exposing metrics
curl http://localhost:3001/api/metrics

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq
```

### 4. Loki Tidak Mengumpulkan Logs
```bash
# Check Promtail configuration
cat promtail.yml

# Check Promtail logs
docker logs simarukun-promtail

# Check if logs directory exists
ls -la /var/log
```

### 5. Alert Tidak Dikirim
```bash
# Check Alertmanager logs
docker logs simarukun-alertmanager

# Check Alertmanager targets
curl http://localhost:9093/api/v2/alerts

# Check Prometheus alerts
curl http://localhost:9090/api/v1/alerts
```

---

## 📈 Metrics yang Tersedia

### API Metrics
| Metric | Type | Description |
|--------|------|-------------|
| http_requests_total | Counter | Total HTTP requests by method, status, path |
| http_request_duration_seconds | Histogram | HTTP request duration |
| http_errors_total | Counter | Total HTTP errors by method, status, path |
| active_connections | Gauge | Current active connections |
| http_request_size_bytes | Summary | HTTP request size |
| http_response_size_bytes | Summary | HTTP response size |

### Database Metrics
| Metric | Type | Description |
|--------|------|-------------|
| pg_stat_activity_count | Gauge | Active database connections |
| pg_database_size_bytes | Gauge | Database size |
| pg_query_duration_seconds | Histogram | Query duration |
| pg_locks_count | Gauge | Number of locks |
| pg_stat_database_deadlocks | Counter | Number of deadlocks |
| pg_stat_database_blks_hit | Counter | Cache hits |
| pg_stat_database_blks_read | Counter | Cache reads |

### Server Metrics
| Metric | Type | Description |
|--------|------|-------------|
| node_cpu_seconds_total | Counter | CPU usage |
| node_memory_MemTotal_bytes | Gauge | Total memory |
| node_memory_MemAvailable_bytes | Gauge | Available memory |
| node_filesystem_avail_bytes | Gauge | Available disk space |
| node_filesystem_size_bytes | Gauge | Total disk space |
| node_disk_read_bytes_total | Counter | Disk reads |
| node_disk_written_bytes_total | Counter | Disk writes |
| node_network_receive_bytes_total | Counter | Network received |
| node_network_transmit_bytes_total | Counter | Network transmitted |

---

## 🔧 Maintenance

### Update Images
```bash
make pull
make restart
```

### Backup Data
```bash
# Backup Prometheus data
docker cp simarukun-prometheus:/prometheus ./backup/prometheus-$(date +%Y%m%d)

# Backup Grafana data
docker cp simarukun-grafana:/var/lib/grafana ./backup/grafana-$(date +%Y%m%d)

# Backup Loki data
docker cp simarukun-loki:/loki ./backup/loki-$(date +%Y%m%d)
```

### Clean Old Data
```bash
# Clean Docker system
docker system prune -a -f

# Remove old containers, networks, images
docker system prune

# Remove old volumes
docker volume prune
```

---

## 📚 Dokumentasi Tambahan

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)

---

## 💬 Kontak & Dukungan

Jika Anda mengalami masalah:
1. Cek section Troubleshooting di atas
2. Lihat logs dengan `make logs`
3. Hubungi tim pengembangan

---

**Dokumen ini terakhir diupdate**: 22 Juni 2026
**Versi**: 1.0
**Status**: Tahap 3 (Monitoring) - 100% Selesai
