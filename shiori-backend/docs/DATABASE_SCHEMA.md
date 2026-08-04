# Shiori Database Schema

This document details all MongoDB collections, Mongoose models, fields, types, and database indexes used in Shiori.

---

## Collection: `profiles` (Mongoose Model: `Profile`)

### Purpose
Stores authenticated user application preferences, user-specific configurations, paths, and platform-related settings. It is linked to the Supabase authentication user records.

### Fields

| Field Name | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated MongoDB primary key | Yes | Auto |
| `supabaseId` | `String` | Unique ID returned by Supabase Auth (`data.user.id`) | Yes | - |
| `preferences` | `Mixed` (Object) | Custom settings (e.g. themes, video players, metadata language) | No | `{}` |
| `downloadPath` | `String` | Host filesystem folder target for downloaded files | No | `""` |
| `createdAt` | `Date` | Timestamp of profile creation (via Mongoose `timestamps`) | Yes | Auto |
| `updatedAt` | `Date` | Timestamp of last profile update (via Mongoose `timestamps`) | Yes | Auto |

### Relationships
- **Supabase Auth**: Linked 1:1 using the `supabaseId` attribute.

### Indexes
- **supabaseId (Unique)**:
  `{ supabaseId: 1 }`
  Ensures direct, high-performance lookups of user settings upon route authentication.
