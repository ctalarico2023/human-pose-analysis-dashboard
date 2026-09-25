# Human Pose Analysis Dashboard

This is a standalone Engineering Design 2 student project. It is a web dashboard for storing and managing pose-analysis records.

Each record stores metadata about an analysis, such as a title, image name, model, camera view, and notes, along with representative human pose keypoint data saved as JSON. The dashboard lets a signed-in user create, view, edit, and delete their own records.

This application does not perform pose estimation. It also does not connect to the separate Human-Joint-Keypoint-Estimation project. Keypoint JSON is entered and stored here as record data only.

## Features

- User registration and login
- Logout
- Protected dashboard (sign-in is required)
- Create pose-analysis records
- View records
- Edit records
- Delete records
- Store keypoint data as JSON
- Supabase database storage
- User-specific data protection through Supabase Row Level Security

## Technologies

- React
- Vite
- JavaScript
- Supabase
- Supabase Authentication
- Supabase PostgreSQL
- Git/GitHub
- Cursor
- Netlify (planned deployment platform)

## Database

Records are stored in a Supabase PostgreSQL table named `pose_analyses`. The main fields are:

| Field | Purpose |
| --- | --- |
| `id` | Unique identifier for the record |
| `user_id` | The signed-in user who owns the record |
| `title` | Short name for the analysis |
| `image_name` | Name of the source image associated with the record |
| `model` | Pose model name recorded with the analysis |
| `camera_view` | Camera view used for the pose |
| `joints_tracked` | Number of joints tracked |
| `status` | Record status (Draft, In review, or Complete) |
| `notes` | Optional notes about the analysis |
| `keypoints` | Representative pose keypoint data stored as JSON |
| `created_at` | Timestamp for when the record was created |

Row Level Security policies on this table restrict each user to their own records. A user can only read and change rows where `user_id` matches their account.

## Local setup

1. Clone the repository and open the project folder:

```bash
git clone <repository-url>
cd human-pose-analysis-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a file named `.env.local` in the project root (the same folder as `package.json`).

4. Add the Supabase URL and publishable key. Use your own project values. Do not commit this file.

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

5. Start the development server:

```bash
npm run dev
```

6. Create a production build:

```bash
npm run build
```

## Environment variables

`.env.local` is for local development only. It is ignored by Git (files matching `*.local` are listed in `.gitignore`) and should not be committed to GitHub.

The application reads these variables:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Replace the placeholders with the URL and publishable key from your Supabase project. Do not put real credentials in this README or in the repository.

## Deployment

The application is intended to be deployed using Netlify. The same two environment variables, `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, need to be set in the Netlify site settings before a production build.

[Deployed application link will be added here]

## Project structure

```text
src/
  components/     Shared UI, including the site header
  context/        Authentication state (AuthProvider)
  data/           Sample pose-analysis records (not the live database)
  lib/            Supabase client setup
  pages/          Home, login, signup, and dashboard pages
  App.jsx         View routing and protected dashboard access
  main.jsx        Application entry point
```
