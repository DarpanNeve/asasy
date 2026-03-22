# Asasy - SaaS Analytics Platform

A scalable SaaS analytics platform built with FastAPI, React, MongoDB, and modern DevOps practices.

## 🚀 Tech Stack

- **Frontend**: Vite + React.js + Tailwind CSS + JavaScript
- **Backend**: FastAPI (Python 3.11+)
- **Database**: MongoDB with Pydantic/Beanie ODM
- **Authentication**: OAuth2 (Google) + JWT + Email/Password
- **Payments**: Razorpay integration
- **Email**: msg91 for transactional emails
- **Cache**: Redis
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
asasy/
├── frontend/                 # React frontend
├── backend/                  # FastAPI backend
├── docker-compose.yml        # Local development
├── docker-compose.prod.yml   # Production setup
├── .github/workflows/        # CI/CD pipelines
├── k8s/                      # Kubernetes manifests
└── docs/                     # Documentation
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- MongoDB
- Redis

### Local Development

1. **Clone and setup environment**:

```bash
git clone <repository>
cd asasy
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. **Start services**:

```bash
docker-compose up -d  # MongoDB, Redis
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
```

3. **Run development servers**:

```bash
# Terminal 1 - Backend
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

4. **Access application**:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: import.meta.env.VITE_API_URLdocs

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URL=mongodb://localhost:27017/asasy
REDIS_URL=redis://localhost:6379

# Auth
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# msg91
MSG91_API_KEY=your-msg91-api-key
MSG91_TEMPLATE_ID=your-template-id

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# AWS S3 (for report storage)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

## 🚀 Deployment

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## 📊 Features

- ✅ Google OAuth2 + Email/Password Auth
- ✅ Email verification with OTP
- ✅ Subscription management with Razorpay
- ✅ AI-powered report generation
- ✅ User profile management
- ✅ Rate limiting & security
- ✅ Responsive design
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Horizontal scaling ready

## 🔒 Security Features

- JWT token authentication with refresh tokens
- Rate limiting (100 requests/minute per IP)
- Input validation and sanitization
- CORS protection
- SQL injection prevention
- XSS protection
- Password hashing with bcrypt
- Secure cookie handling

## 📈 Scaling Considerations

- **Stateless services**: All services are stateless for easy horizontal scaling
- **Database connection pooling**: MongoDB connection pool configuration
- **Redis caching**: Session storage and API response caching
- **Load balancing**: Nginx reverse proxy configuration
- **CDN integration**: Static asset delivery optimization
- **Monitoring**: Health checks and metrics collection

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## 📚 API Documentation

Once running, visit import.meta.env.VITE_API_URLdocs for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.# asasy

# asasy

# asasy

# asasy
