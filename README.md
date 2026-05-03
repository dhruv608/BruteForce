<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=000000&height=250&section=header&text=BruteForce&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=ffffff" />
  
  #  BruteForce
  
  **Automated, scalable, and intelligent progress tracking for massive programming cohorts.**
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <br />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/BullMQ-E71536?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
</div>

<br />

---

## 📑 Table of Contents

1. [🌟 Overview](#-overview)
2. [🎯 Core Objectives](#-core-objectives)
3. [👥 Role-Based Capabilities](#-role-based-capabilities)
4. [🧠 System Architecture & Workflow](#-system-architecture--workflow)
5. [⚙️ The Synchronization Engine](#️-the-synchronization-engine)
6. [🗄️ Database & Schema](#️-database--schema)
7. [⚡ Caching Strategy](#-caching-strategy)
8. [🎨 UI/UX Philosophy](#-uiux-philosophy)

---

## 🌟 Overview

**BruteForce** is a high-performance, full-stack web platform built from the ground up to automate the tracking of algorithmic problem-solving progress. Targeted at large educational institutions and programming bootcamps, the platform seamlessly connects with external coding environments like **LeetCode** and **GeeksforGeeks**.

Managing a massive cohort of students manually is error-prone and time-consuming. This platform acts as a unified central brain: autonomously crawling external profiles, mapping submissions to an internal curriculum, grading students, and rendering ultra-fast leaderboards.

---

## 🎯 Core Objectives

- **Eliminate Manual Tracking:** Students no longer need to submit screenshots or manually input their solved problems.
- **Data-Driven Interventions:** Provide educators with a real-time pulse on batch health, allowing them to identify struggling students instantly.
- **Foster Gamification:** Use global and localized leaderboards alongside coding streaks to promote healthy competition.
- **Uncompromised Scale:** Architected to handle high-frequency data syncing across thousands of profiles without hitting rate limits or database deadlocks.

---

## 👥 Role-Based Capabilities

The application implements a strict, multi-tier RBAC (Role-Based Access Control) system ensuring data security and distinct user experiences.

### 🎓 For Students
The student portal is designed as a personal command center for algorithmic growth.
- **Interactive Heatmaps:** A GitHub-style daily activity heatmap visually tracks their coding consistency and platform engagement over the last 365 days.
- **Curriculum Tracking:** An intuitive interface mapping their specific batch's curriculum. Questions are automatically marked as `[Solved]` or `[Pending]`.
- **Bookmarks & Notes:** A personalized learning space where students can bookmark complex questions and attach private markdown-enabled notes for revision.
- **Advanced Leaderboards:** Students can view their Global all-time ranking, or filter down to see how they perform against peers in their specific City or Batch.
- **Zero-Friction Profile Sync:** Students simply input their LeetCode/GFG usernames once; the system takes over all tracking indefinitely.

### 👨‍🏫 For Teachers & Admins
Educators get access to powerful analytical tools to oversee their assigned cohorts.
- **Batch-Level Analytics:** High-level metrics showing the average completion rate of homework and classwork for entire batches.
- **Student Deep-Dives:** Granular views into individual student profiles, analyzing exactly where they are getting stuck in the curriculum.
- **Search & Filter:** Rapidly search through hundreds of students by name, enrollment ID, or email to pull up performance reports.

### 👑 For SuperAdmins
The master control tier for institutional management.
- **Curriculum Architecture:** Build the global database of questions, categorized by topic (Arrays, DP, Graphs) and difficulty (Easy, Medium, Hard).
- **Institutional Management:** Create organizational hierarchies by establishing Cities, then nesting specific academic Batches inside those cities.
- **Staff Provisioning:** Full CRUD controls to create and assign Teacher/Admin accounts to specific batches.
- **System Diagnostics:** Monitor system health, view cron job success rates, and audit API traffic.

---

## 🧠 System Architecture & Workflow

The platform leverages a hybrid architecture, combining the edge-network capabilities of Next.js with a highly stateful background processing engine.

### Frontend (Client-Side)
- **Next.js App Router:** Utilizes React Server Components (RSC) for initial page loads to optimize SEO and reduce bundle sizes, passing interactivity off to Client Components where necessary.
- **State Management:** `Zustand` is used for lightweight, fast global state (like active user sessions), while `@tanstack/react-query` handles all server-state caching, fetching, and optimistic UI updates.
- **Form Validation:** End-to-end type safety using `Zod` schemas paired with `react-hook-form`.

### Backend (Server-Side)
- **API Endpoints:** Built directly into the Next.js `/api` directory, serving as secure, rate-limited, REST-like endpoints.
- **Security:** JWT-based authentication with sliding expirations. Passwords are securely hashed using `bcryptjs`.
- **Error Handling:** Centralized error interceptors standardize all HTTP responses into predictable formats, logging critical errors securely.

---

## ⚙️ The Synchronization Engine

The crown jewel of the platform is the background synchronization engine, built to handle massive scale without triggering third-party API bans.

### 1. The Trigger
A Node-Cron schedule fires precisely at 5:00 AM, 2:00 PM, and 8:00 PM daily.

### 2. Job Queueing
The system scans the PostgreSQL database for active students and bulk-inserts individual synchronization jobs into a **Redis-backed BullMQ Queue**.

### 3. The Worker Nodes
- BullMQ workers pop jobs off the queue sequentially.
- They execute heavily optimized HTTP requests to external APIs (LeetCode/GFG) to fetch the student's latest submission logs.
- **Resilience:** If an external API times out or rate-limits the worker, BullMQ automatically applies an *Exponential Backoff* strategy, pausing the specific job and retrying later (e.g., 5s -> 10s -> 20s).

### 4. Smart Mapping & DB Insertion
- Fetched submissions are parsed, and the URL slugs are matched in-memory against the institution's master curriculum map.
- Valid solves are pushed to PostgreSQL using high-speed atomic `createMany` operations with `skipDuplicates: true` to prevent race conditions.

### 5. The Leaderboard Window
- To prevent locking the database during heavy queue processing, the Leaderboard Calculation engine sits in a "Wait Window."
- Only after the BullMQ queue fires the `drained` event does the SQL engine execute a massive Upsert, recalculating global ranks, city ranks, and dynamic coding streaks for every student.

---

## 🗄️ Database & Schema

Data integrity is maintained by a relational **PostgreSQL** database, modeled with **Prisma ORM**.

- **Student Entity:** Stores authentication, demographics, and external platform IDs.
- **Curriculum Entities:** `Topic` -> `Question` hierarchy representing the educational structure.
- **Institutional Entities:** `City` -> `Batch` hierarchy.
- **Progress Entity:** A highly indexed pivot table tracking `Student ID` <-> `Question ID` alongside completion timestamps.
- **Leaderboard Entity:** A denormalized table heavily optimized for fast read-access, storing pre-calculated rankings and streak metadata.

---

## ⚡ Caching Strategy

Rendering leaderboards for thousands of students requires heavy SQL aggregations. To achieve 0ms load times, the platform employs an aggressive Redis caching strategy.

- **Write-Through Caching:** Whenever the cron job completes a leaderboard calculation, the raw JSON response is immediately serialized and injected into Redis.
- **Targeted Invalidation:** If a SuperAdmin adds a new question, or a Teacher manually updates a student, the backend selectively purges only the relevant cached endpoints (e.g., specific batch leaderboards) without dropping the entire cache.
- **Fallback Logic:** If Redis goes offline or connection is lost, the API routes gracefully degrade, falling back directly to PostgreSQL queries to ensure uptime.

---

## 🎨 UI/UX Philosophy

The interface is built to feel premium, responsive, and dynamic.

- **Design System:** Utilizes **Shadcn UI** for accessible, headless components wrapped in pure TailwindCSS.
- **Aesthetics:** A dark-mode native, glassmorphic design language. Clean typography (Inter/Outfit), subtle gradients, and high-contrast badges create an environment that feels more like a modern developer tool than a standard school portal.
- **Micro-interactions:** Powered by `framer-motion` to provide tactile feedback on button presses, modal opens, and page transitions.

<br />

<div align="center">
  <i>Engineered with precision. Built for scale.</i>
</div>
