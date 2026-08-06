# Shiori API Testing Guide

Base URL:
`http://localhost:8080`

## Authentication

Every protected endpoint requires a Supabase JWT (access token) sent via the `Authorization` header.

### Headers:
```http
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

### How to Obtain Token:
1. Authenticate with Supabase Auth (e.g. login through frontend, or call Supabase login/signup API).
2. Retrieve the `access_token` from the authentication response.
3. In Postman, go to the **Authorization** tab, select **Bearer Token**, paste the token into the Token field (or configure the `Authorization` header manually as shown above).

---

## Health Module

### GET /api/health
Purpose: Checks backend availability and health status across all components.

Authentication: None

Request:
```http
GET /api/health
```

Success Response (200 OK):
```json
{
  "status": "healthy",
  "service": "Shiori (栞)-backend",
  "version": "1.0.0",
  "uptime": 12.345,
  "timestamp": "2026-08-06T22:14:12.000Z",
  "backend": "online",
  "database": "online",
  "supabase": "online",
  "integration": "offline",
  "provider": "offline",
  "automation": "offline"
}
```

Errors:
* **500 Internal Server Error**: Service is down or database configuration has failed.

---

## Auth Module

### GET /api/auth/status
Purpose: Returns Supabase authentication integration status.
Authentication: None

Request:
```http
GET /api/auth/status
```

Success Response (200 OK):
```json
{
  "success": true,
  "service": "auth",
  "provider": "supabase",
  "status": "configured",
  "message": "Supabase Authentication is active. JWT validation handled via protect middleware."
}
```

Errors:
* **500 Internal Server Error**

---

## Integration Module

### GET /api/integration/status
Purpose: Returns Seanime integration status.
Authentication: None

Request:
```http
GET /api/integration/status
```

Success Response (200 OK):
```json
{
  "success": true,
  "connected": false,
  "provider": null,
  "message": "Seanime integration has not been configured."
}
```

Errors:
* **500 Internal Server Error**

---

## Provider Module

### GET /api/provider/status
Purpose: Checks provider engine status.
Authentication: None

Request:
```http
GET /api/provider/status
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Provider engine has not been implemented."
}
```

---

### GET /api/provider/providers
Purpose: Lists available stream provider scrapers.
Authentication: None

Request:
```http
GET /api/provider/providers
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Provider engine has not been implemented."
}
```

---

### POST /api/provider/resolve
Purpose: Resolves an anime stream source URL from provider.
Authentication: None

Request:
```http
POST /api/provider/resolve
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Provider engine has not been implemented."
}
```

---

## Download Module

### POST /api/download
Purpose: Initiates a new anime episode download job.
Authentication: None

Request:
```http
POST /api/download
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Download engine has not been implemented."
}
```

---

### GET /api/download/:id
Purpose: Fetches progress for a specific download job.
Authentication: None

Request:
```http
GET /api/download/123
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Download engine has not been implemented."
}
```

---

### DELETE /api/download/:id
Purpose: Cancels an ongoing download job.
Authentication: None

Request:
```http
DELETE /api/download/123
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Download engine has not been implemented."
}
```

---

## Automation Module

### POST /api/automation/execute
Purpose: Triggers AI or n8n workflow execution pipelines.
Authentication: None

Request:
```http
POST /api/automation/execute
```

Response (501 Not Implemented):
```json
{
  "success": false,
  "message": "Automation pipeline has not been implemented."
}
```


---

## Profile Module

### GET /api/profile
Purpose: Retrieves the authenticated user's profile, or automatically creates it if it does not yet exist in MongoDB.

Authentication: Required (Supabase Access Token)

Request:
```http
GET /api/profile
```

Success Response (200 OK):
```json
{
  "_id": "64cb237de1a0c4f1c1f51b9e",
  "supabaseId": "usr_9901ad876bc29f81",
  "preferences": {},
  "downloadPath": "",
  "createdAt": "2026-08-03T09:17:00.000Z",
  "updatedAt": "2026-08-03T09:17:00.000Z",
  "__v": 0
}
```

Errors:
* **401 Unauthorized**: Missing or invalid Authorization header.
  ```json
  {
    "status": "fail",
    "message": "Authorization token missing or invalid"
  }
  ```
* **500 Internal Server Error**

---

### PATCH /api/profile
Purpose: Updates user preferences and downloadPath.

Authentication: Required (Supabase Access Token)

Request:
```http
PATCH /api/profile
```

Headers:
```http
Content-Type: application/json
```

Request Body (JSON Schema):
```json
{
  "preferences": {
    "theme": "dark",
    "autoplay": true
  },
  "downloadPath": "D:/AnimeDownloads"
}
```

Success Response (200 OK):
```json
{
  "_id": "64cb237de1a0c4f1c1f51b9e",
  "supabaseId": "usr_9901ad876bc29f81",
  "preferences": {
    "theme": "dark",
    "autoplay": true
  },
  "downloadPath": "D:/AnimeDownloads",
  "createdAt": "2026-08-03T09:17:00.000Z",
  "updatedAt": "2026-08-03T09:18:20.000Z",
  "__v": 0
}
```

Errors:
* **400 Bad Request**: Input validation failed (Zod error).
  ```json
  {
    "status": "fail",
    "message": "Validation failed",
    "errors": [
      {
        "path": "downloadPath",
        "message": "Expected string, received number"
      }
    ]
  }
  ```
* **401 Unauthorized**: Missing, expired, or invalid token.
* **404 Not Found**: User profile could not be found.
  ```json
  {
    "status": "fail",
    "message": "Profile not found"
  }
  ```
* **500 Internal Server Error**
