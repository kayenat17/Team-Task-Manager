TASKFLOW | HIGH-PERFORMANCE TEAM WORKSPACE

Welcome to TaskFlow. We believe that managing work should not feel like work. That is why we built a task manager that does not just track your progress—it elevates your entire productivity ecosystem with a high-end, "chic" aesthetic.

Inspired by the most sophisticated designs on Dribbble and the clean efficiency of tools like Linear, TaskFlow is a full-stack Next.js application designed for teams who care about craft, speed, and beautiful interfaces.

---

WHY TASKFLOW?

- CHIC "ORDI" AESTHETIC: A warm, high-fashion light-mode design with massive typography and a rotating plush lightning bolt background that brings your workspace to life.
- BENTO GRID INTELLIGENCE: Your dashboard and projects are organized into an organic "Bento" layout, making information easy to digest and beautiful to look at.
- REAL-TIME ECOSYSTEM SYNC: Stats for "To Do", "In Progress", and "Completed" update across your entire system, giving you a bird's-eye view of your team's output.
- SECURE & PRIVATE: Built with industry-standard bcrypt hashing and NextAuth.js to ensure your data stays yours.

---

THE ENGINE UNDER THE HOOD

- Frontend: Next.js 15+ (App Router), React 19, Vanilla CSS (Pure craft, no Tailwind).
- Backend: Next.js Server Actions & API Routes.
- Database: Prisma ORM with SQLite (Local) / PostgreSQL (Production).
- Security: Bcryptjs for password protection & NextAuth.js for session management.

---

GETTING STARTED

1. Install the dependencies: npm install
2. Prepare the Database: npx prisma generate
3. Ignite the Engine: npm run dev

Visit http://localhost:3000 and experience the difference.

---

GOING LIVE (RAILWAY)

1. Push to GitHub.
2. Deploy on Railway by selecting your repo.
3. Set your variables:
   - NEXTAUTH_SECRET: (Generate one with openssl rand -base64 32)
   - NEXTAUTH_URL: Your live domain.
   - DATABASE_URL: Your database link.

---

