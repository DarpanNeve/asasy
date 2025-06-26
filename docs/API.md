# Asasy API Documentation

## Overview

The Asasy API provides endpoints for user authentication, subscription management, and AI-powered report generation.

## Base URL

- Development: `http://localhost:8000`
- Production: `https://api.yourdomain.com`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please verify your email.",
  "email": "john@example.com"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "username": "john@example.com",
  
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "is_verified": true
  }
}
```

#### POST /auth/verify-email-otp
Verify email address with OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### POST /auth/google
Authenticate with Google OAuth.

**Request Body:**
```json
{
  "credential": "google_jwt_token"
}
```

### Users

#### GET /users/me
Get current user profile.

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "reports_generated": 5,
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PATCH /users/me
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "company": "Tech Corp",
  "job_title": "CTO"
}
```

### Plans

#### GET /plans
Get all available subscription plans.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Professional",
    "description": "Perfect for growing businesses",
    "price_inr": 299900,
    "price_rupees": 2999,
    "duration_days": 30,
    "features": ["50 reports/month", "Priority support"],
    "is_popular": true
  }
]
```

### Subscriptions

#### POST /subscriptions/create-order
Create a Razorpay order for subscription.

**Request Body:**
```json
{
  "plan_id": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "order_id": "order_razorpay_id",
  "amount": 299900,
  "currency": "INR",
  "plan": {
    "name": "Professional",
    "duration_days": 30
  }
}
```

### Reports

#### POST /reports/generate
Generate a new technology assessment report.

**Request Body:**
```json
{
  "idea": "AI-powered smart home automation system with voice control and predictive analytics"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "status": "processing",
  "message": "Report generation started. You will be notified when complete."
}
```

#### GET /reports
Get user's reports with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)

**Response:**
```json
{
  "reports": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "AI Smart Home Technology Assessment",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z",
      "pdf_url": "https://s3.amazonaws.com/bucket/report.pdf"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "detail": "Error message description"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Rate Limited
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate limited:
- Authentication endpoints: 10 requests/minute
- Report generation: 5 requests/minute
- Other endpoints: 100 requests/minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Window reset time (Unix timestamp)