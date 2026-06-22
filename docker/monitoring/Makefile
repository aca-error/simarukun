# Makefile for SimaRukun Monitoring Stack
# Usage: make <target>

.PHONY: help start stop restart status logs clean pull

# Default target
help:
	@echo "SimaRukun Monitoring Stack - Makefile Commands"
	@echo "==============================================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make start           - Start monitoring stack"
	@echo "  make stop            - Stop monitoring stack"
	@echo "  make restart         - Restart monitoring stack"
	@echo "  make status          - Show status of monitoring services"
	@echo "  make logs            - Show logs of monitoring services"
	@echo "  make clean           - Remove containers and volumes"
	@echo "  make pull            - Pull latest images"
	@echo "  make down            - Stop and remove containers"
	@echo ""

# Docker Compose file
DOCKER_COMPOSE := docker-compose -f docker-compose.yml

# Start monitoring stack
start:
	@echo "Starting SimaRukun Monitoring Stack..."
	mkdir -p logs
	$(DOCKER_COMPOSE) up -d
	@echo ""
	@echo "Monitoring Stack Started!"
	@echo "Prometheus: http://localhost:9090"
	@echo "Grafana:     http://localhost:3000 (admin/admin123)"
	@echo "Loki:       http://localhost:3100"
	@echo "Alertmanager: http://localhost:9093"

# Stop monitoring stack
stop:
	@echo "Stopping SimaRukun Monitoring Stack..."
	$(DOCKER_COMPOSE) stop
	@echo "Monitoring Stack Stopped!"

# Restart monitoring stack
restart:
	@echo "Restarting SimaRukun Monitoring Stack..."
	$(DOCKER_COMPOSE) restart
	@echo "Monitoring Stack Restarted!"

# Show status of services
status:
	@echo "SimaRukun Monitoring Stack Status:"
	@echo "==================================="
	$(DOCKER_COMPOSE) ps

# Show all logs
logs:
	@echo "SimaRukun Monitoring Stack Logs:"
	@echo "================================="
	$(DOCKER_COMPOSE) logs -f --tail=100

# Stop and remove containers
clean:
	@echo "Cleaning SimaRukun Monitoring Stack..."
	$(DOCKER_COMPOSE) down -v --rmi local
	@echo "Monitoring Stack Cleaned!"

# Stop and remove containers (keep volumes)
down:
	@echo "Stopping SimaRukun Monitoring Stack..."
	$(DOCKER_COMPOSE) down
	@echo "Monitoring Stack Stopped!"

# Pull latest images
pull:
	@echo "Pulling latest images..."
	$(DOCKER_COMPOSE) pull
	@echo "Images pulled!"
