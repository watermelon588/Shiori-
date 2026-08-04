# Shiori API Conventions

This document guides the design and creation of API routes in the Shiori backend to ensure consistent path formats and JSON payloads.

---

## Endpoint Naming Conventions
- Base all endpoints at `/api/`
- Use the RESTful format: `/api/resource/action` or `/api/resource`
- All route segments must be lowercase and pluralized where appropriate.
- Example routes:
  - `GET /api/health`
  - `GET /api/profile`
  - `PATCH /api/profile`
  - `GET /api/anime/search`

---

## HTTP Methods

Use HTTP methods strictly according to standard REST patterns:
- **`GET`**: Retrieve resources (no side effects).
- **`POST`**: Create new resources.
- **`PATCH`**: Partially update existing resources.
- **`PUT`**: Fully replace existing resources.
- **`DELETE`**: Remove resources.

---

## JSON Response Envelopes

### Success Responses
Always return direct JSON objects representing the retrieved data or updated objects.
Example (profile retrieval):
```json
{
  "_id": "64cb237de1a0c4f1c1f51b9e",
  "supabaseId": "usr_abc123",
  "preferences": {},
  "downloadPath": "",
  "createdAt": "2026-08-03T09:17:00.000Z",
  "updatedAt": "2026-08-03T09:17:00.000Z"
}
```

### Error Responses
All error payloads returned by the server are structured uniformly by the `errorHandler` middleware.

Format:
```json
{
  "status": "fail" | "error",
  "message": "Error message description",
  "errors": [ // Optional field, populated during validation errors (Zod validation failures)
    {
      "path": "field.name",
      "message": "Validation rule failure description"
    }
  ]
}
```

- **`status: "fail"`**: Returned for 4xx errors indicating client side issues.
- **`status: "error"`**: Returned for 5xx errors indicating server/operational crashes.
