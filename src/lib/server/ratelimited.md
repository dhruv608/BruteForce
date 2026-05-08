# Rate Limiting Documentation

All rate limiting uses a **sliding window** algorithm backed by Redis.

---

## Limiter Types

| Name | Key | Window | Max | Purpose |
|---|---|---|---|---|
| `loginIP` | IP address | 5 min | 1000 | Classroom-safe login burst (300 students same WiFi) |
| `loginEmail` | email (lowercase) | 15 min | 10 | Brute force protection per account |
| `heavy` | userId (JWT) | 60 sec | 20 | CPU-heavy authenticated endpoints |
| `api` | userId (JWT) | 15 min | 100 | Regular authenticated endpoints |
| `bulk` | userId (JWT) | 15 min | 5 | File upload / bulk operations |
| `public` | IP address | 15 min | 200 | Public unauthenticated endpoints |

**Fail-open:** If Redis is unreachable, all requests are allowed through (never block users due to infra failure).

---

## 🔴 AUTH — IP + Email (no userId yet)

| Method | Endpoint | Limiters Applied |
|---|---|---|
| POST | `/api/auth/student/login` | `loginIP` + `loginEmail` |
| POST | `/api/auth/admin/login` | `loginIP` + `loginEmail` |
| POST | `/api/auth/google-login` | `loginIP` only (Google handles account security) |
| POST | `/api/auth/forgot-password` | `loginIP` + `loginEmail` |
| POST | `/api/auth/verify-otp` | `loginIP` + `loginEmail` |
| POST | `/api/auth/reset-password` | `loginIP` + `loginEmail` |
| POST | `/api/auth/student/logout` | ❌ None (no risk) |
| POST | `/api/auth/admin/logout` | ❌ None (no risk) |
| POST | `/api/auth/refresh-token` | ❌ None (httpOnly cookie, server-controlled) |

---

## 🟠 HEAVY — Per userId (authenticated, CPU-heavy)

Window: **60 sec / 20 req per user**

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/students/leaderboard` | Filtered ranking queries |
| GET | `/api/students/addedQuestions` | Practice page with filters |
| POST | `/api/admin/leaderboard` | Admin paginated ranking |

---

## 🟡 API — Per userId (authenticated, regular)

Window: **15 min / 100 req per user**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/students/topics` | Topic list with progress |
| GET | `/api/students/topics/[topicSlug]` | Topic overview |
| GET | `/api/students/topics/[topicSlug]/classes/[classSlug]` | Class detail |
| GET | `/api/students/recent-questions` | Recent questions sidebar |
| GET | `/api/students/bookmarks` | Bookmark list |
| POST | `/api/students/bookmarks` | Add bookmark |
| PUT | `/api/students/bookmarks/[questionId]` | Edit bookmark |
| DELETE | `/api/students/bookmarks/[questionId]` | Delete bookmark |
| GET | `/api/students/me` | Student profile |
| PUT | `/api/students/me` | Update profile |
| GET | `/api/students/batches` | Available batches |
| GET | `/api/students/cities` | Available cities |
| POST | `/api/students/username` | Update username |
| GET | `/api/admin/stats` | Admin dashboard stats |

---

## 🔵 BULK — Per userId (admin file operations)

Window: **15 min / 5 req per user**

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/admin/bulk-operations` | CSV student upload |
| POST | `/api/admin/topics/bulk-upload` | CSV topic upload |
| POST | `/api/admin/questions/bulk-upload` | CSV question upload |

---

## ⚪ PUBLIC — Per IP (unauthenticated)

Window: **15 min / 200 req per IP**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/students/profile/[username]` | Public student profile |
| GET | `/api/topicprogress/[username]` | Public topic progress |

---

## ❌ NO RATE LIMIT

| Endpoint | Reason |
|---|---|
| `/api/auth/student/logout` | No attack vector |
| `/api/auth/admin/logout` | No attack vector |
| `/api/auth/refresh-token` | httpOnly cookie, already protected |

---

## Classroom Scenario (300 students, same WiFi)

| Phase | What happens |
|---|---|
| Login burst (all 300 log in within 1 min) | `loginIP` allows 1000/5min → ✅ all login fine |
| Brute force attempt on one account | `loginEmail` blocks after 10 tries/15min → ✅ protected |
| Students using practice page | `heavy` per userId → each student has own 20 req/min bucket → ✅ no shared limit |
| Students browsing topics/bookmarks | `api` per userId → each student has own 100 req/15min → ✅ |

---

## Toast Message on Rate Limit

When any limit is hit, the API returns HTTP `429` and the client shows:

> **"Too many requests. Please wait a moment and try again."** (warning toast)
