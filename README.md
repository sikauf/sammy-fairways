# This was written by chat as a placeholder so take with grain of salt
# 🏌️ Golf Courses & Rounds Tracker

A personal (and eventually multi-user) golf tracking web app that lets users store golf courses they’ve played, track individual rounds, and attach photos to each course.
Each course has its own mini page with rounds, stats, and a photo gallery.

Built with **Next.js (App Router)**, **Supabase**, and **TypeScript**.

---

## 🚀 Features

- **Course Pages**
  - Each golf course has its own dedicated page
  - Displays course details, rounds played, and photo gallery

- **Round Tracking**
  - Log every round played at a course
  - Track scores, tees, slope/rating, and notes
  - View stats like best score and average score

- **Photo Uploads**
  - Upload multiple photos per course
  - Set a cover image for each course
  - Images stored securely in Supabase Storage

- **Authentication**
  - Supabase Auth
  - User accounts with isolated data via Row Level Security (RLS)

- **Scalable Data Model**
  - Clean relational schema (courses → rounds → images)
  - Designed to grow without rewrites

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend**
- Supabase (Postgres + Auth + Storage)
- Row Level Security (RLS)

---


---

## 🗃 Database Schema (Not true at all right now just a place holder)

### courses
| Column | Type |
|------|------|
| id | uuid (PK) |
| owner_id | uuid |
| name | text |
| city | text |
| state | text |
| country | text |
| created_at | timestamptz |

### rounds
| Column | Type |
|------|------|
| id | uuid (PK) |
| owner_id | uuid |
| course_id | uuid (FK) |
| played_at | timestamptz |
| score | int |
| tees | text |
| slope | int |
| rating | numeric |
| notes | text |
| created_at | timestamptz |

### course_images
| Column | Type |
|------|------|
| id | uuid (PK) |
| owner_id | uuid |
| course_id | uuid (FK) |
| path | text |
| caption | text |
| is_cover | boolean |
| created_at | timestamptz |

---

## 🖼 Image Storage

- Bucket: `course-photos`
- Path convention:
{user_id}/{course_id}/{image_id}.{ext}

## 📈 Future Improvements

- User specific data
- Courses storing rounds
- Courses storing pictures