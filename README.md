# Cake & Fame

Cake & Fame is a Next.js application for discovering celebrity profiles based on birthdays, professions, and related connections.

The application uses a PostgreSQL database for storing profile data and supports dynamic routing for profile pages.

---

## Getting Started

Install dependencies:

npm install

Run the development server:

npm run dev

Open:

http://localhost:3000

---

## Environment Variables

Create a `.env` file using the following:

DATABASE_URL=your_database_url  
OPENAI_API_KEY=your_openai_api_key  

---

## Features

- Birthday-based discovery (Today / Yesterday)
- Upcoming birthday tracking
- Dynamic profile pages
- Search functionality with filtering
- Clickable filters (birthday, birthplace, profession)
- Bio generation using OpenAI (full_bio)
- Separate Bio and Career sections
- Modular component structure

---

## Project Structure

app/  
components/  
data/  
lib/  

- app → Next.js routes and pages  
- components → reusable UI components  
- data → initial JSON data (used for import only)  
- lib → database and utility functions  

---

## Data Flow

- JSON → imported into database using `importProfiles.cjs`
- Application reads data directly from PostgreSQL
- Bio generation handled via `generateBios.cjs`
- Generated bios stored in `full_bio` column

---

## Bio Generation Script

Run the script:

node generateBios.cjs

This will:

- Process profiles in batches  
- Generate 5-paragraph bios using OpenAI  
- Update the `full_bio` column  
- Resume automatically if interrupted  

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Node.js
- OpenAI API

---

## Notes

- JSON files are only used for initial data import  
- Database is the primary source of truth  
- Ensure `full_bio` column exists before running bio script  

---

## Deployment

This application can be deployed on:

- Vercel  
- Any Node.js hosting provider  

For production bio generation:

- Set `DATABASE_URL` to production DB  
- Set `OPENAI_API_KEY` with billing enabled  
- Run the script on the server  

---