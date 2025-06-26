# Deployment Guide

## Overview

This guide covers deploying Asasy to production using Docker and Kubernetes.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (optional)
- Domain name and SSL certificate
- MongoDB Atlas or self-hosted MongoDB
- Redis instance
- AWS S3 bucket (for file storage)

## Environment Setup

### 1. Environment Variables

Create production environment files:

**backend/.env.prod**
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-secret-key
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/asasy
REDIS_URL=redis://user:pass@redis-host:6379
ALLOWED_ORIGINS=["https://yourdomain.com"]
ALLOWED_HOSTS=["yourdomain.com","api.yourdomain.com"]
```

**frontend/.env.prod**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

### 2. SSL Certificates

Obtain SSL certificates for your domain:
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

## Docker Deployment

### 1. Build Production Images

```bash
# Build backend
docker build -t asasy-backend:latest ./backend

# Build frontend  
docker build -t asasy-frontend:latest ./frontend
```

### 2. Deploy with Docker Compose

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Initialize Database

```bash
# Run database migrations and seed data
docker exec asasy_backend python scripts/seed_data.py
```

## Kubernetes Deployment

### 1. Create Secrets

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=mongodb-url="mongodb+srv://user:pass@cluster.mongodb.net/asasy" \
  --from-literal=redis-url="redis://user:pass@redis-host:6379" \
  --from-literal=secret-key="your-super-secure-secret-key" \
  -n asasy
```

### 2. Deploy Services

```bash
# Deploy MongoDB (if self-hosting)
kubectl apply -f k8s/mongodb.yaml

# Deploy Redis
kubectl apply -f k8s/redis.yaml

# Deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

### 3. Configure Ingress

Create `k8s/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: asasy-ingress
  namespace: asasy
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - yourdomain.com
    - api.yourdomain.com
    secretName: asasy-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8000
```

## Monitoring and Logging

### 1. Health Checks

Both services include health check endpoints:
- Backend: `GET /health`
- Frontend: `GET /` (returns 200 if healthy)

### 2. Logging

Configure centralized logging:
```bash
# Using ELK stack or similar
kubectl apply -f k8s/logging/
```

### 3. Monitoring

Set up monitoring with Prometheus and Grafana:
```bash
kubectl apply -f k8s/monitoring/
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend pods
kubectl scale deployment backend --replicas=5 -n asasy

# Scale frontend pods  
kubectl scale deployment frontend --replicas=3 -n asasy
```

### Auto-scaling

Configure HPA (Horizontal Pod Autoscaler):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: asasy
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Backup and Recovery

### 1. Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/asasy" --out=/backup/$(date +%Y%m%d)
```

### 2. File Storage Backup

```bash
# S3 backup (if using S3)
aws s3 sync s3://your-bucket s3://your-backup-bucket
```

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Regular security updates applied
- [ ] Monitoring and alerting configured

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check MongoDB connectivity
   kubectl exec -it backend-pod -- python -c "from app.core.database import init_database; import asyncio; asyncio.run(init_database())"
   ```

2. **Redis Connection Issues**
   ```bash
   # Test Redis connection
   kubectl exec -it redis-pod -- redis-cli ping
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   kubectl describe certificate asasy-tls -n asasy
   ```

### Logs

```bash
# View backend logs
kubectl logs -f deployment/backend -n asasy

# View frontend logs
kubectl logs -f deployment/frontend -n asasy
```

## Performance Optimization

1. **Database Optimization**
   - Enable MongoDB connection pooling
   - Add appropriate indexes
   - Use read replicas for scaling

2. **Caching**
   - Implement Redis caching for API responses
   - Use CDN for static assets
   - Enable browser caching

3. **Load Balancing**
   - Configure nginx load balancer
   - Use sticky sessions if needed
   - Implement health checks

## Maintenance

### Regular Tasks

1. **Updates**
   ```bash
   # Update images
   kubectl set image deployment/backend backend=asasy-backend:v1.1.0 -n asasy
   kubectl set image deployment/frontend frontend=asasy-frontend:v1.1.0 -n asasy
   ```

2. **Database Maintenance**
   ```bash
   # Compact database
   mongosh --eval "db.runCommand({compact: 'collection_name'})"
   ```

3. **Log Rotation**
   ```bash
   # Configure log rotation
   kubectl apply -f k8s/log-rotation.yaml
   ```