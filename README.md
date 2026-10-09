# AI Resume Reviewer

A full-stack web app that scores a resume against a job description using the Gemini API, returning a match score, a summary, missing sections/keywords, and improvement suggestions.

**Live:** [https://ai-resume-review-mfkb.onrender.com/] · **Status:** in progress (~60%) — landing page, pricing/payment flow, and a separate signup flow are planned next.

## Stack

- **Frontend:** React, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **AI:** Google Gemini API
- **Auth:** Session-based (`express-session` + `connect-pg-simple`), bcrypt password hashing
- **Deploy:** Single Express service serving the built React app (Render)

## Features

- Email/password signup and login with hashed passwords and server-side sessions
- Resume upload (PDF/image) with file-type and job-description validation
- Daily review quota per plan (free: 1/day, pro: 5/day), enforced server-side
- Gemini-powered review: match score, summary, missing sections/keywords; detailed improvement suggestions on the Pro plan
- Rate-limited auth routes to reduce abuse

## Project Structure

```
client/   React + TypeScript frontend (Vite)
server/   Express + TypeScript backend (REST API, auth, quota, Gemini integration)
```

## Roadmap

- [ ] Public landing page with navbar.
- [ ] Product page with plan selection and payment for tiers.
- [ ] Move authentication out of the landing flow.