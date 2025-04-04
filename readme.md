# Ellty 2nd Assignment

## Live Demo

🚀 [Live App](https://ellty-2nd-client-production.up.railway.app/)

### Video Demo
https://github.com/user-attachments/assets/4f606988-768a-4706-b7fb-a61dd23168d6



## My Approach and Decisions

- As usual, before solving any problem, the first step is to fully understand it, so that's what I did.
- I started by going through the problem statement and understanding the project requirements, which were pretty clearly defined. I figured that, I had to build out a hierarchical threads functionality (similar to Reddit), but where we only use numbers and perform calculations based on the operation selected by users.
- It was a pretty interesting problem and I had fun working on it. I also ended up learning a few new things, like how to build nested threads using recursion, and deciding how to display them properly in the UI.

```
{showReplies && (
  <div className="mt-4 pl-4 border-l-2 border-gray-200">
    <ReplyForm threadId={thread.id} onReplyAdded={fetchReplies} />
    {loading ? (
      <p>Loading replies...</p>
    ) : replies.length > 0 ? (
      <div className="space-y-3 mt-4">
        {replies.map((reply) => (
          <ThreadItem key={reply.id} thread={reply} />
        ))}
      </div>
    ) : (
      <p>No replies yet. Be the first to reply!</p>
    )}
  </div>
)}
```

- I decided to only show root threads at first, and let users view replies by clicking a “Show Replies” button. This keeps the UI clean and makes it easy to navigate.
- For the database, I used PostgreSQL, which worked well for the nested threads structure. The way I modeled the data using self-referencing relationships made it easy to fetch and organize replies. I also found this wonderful blog post that really helped me out. (https://www.aleksandra.codes/comments-db-model)

```
model Thread {
  id           Int        @id @default(autoincrement())
  value        Float
  operation    Operation?
  rightOperand Float?

  parent   Thread? @relation("Replies", fields: [parentId], references: [id])
  parentId Int?

  replies Thread[] @relation("Replies")

  user   User @relation(fields: [userId], references: [id])
  userId Int

  createdAt DateTime @default(now())

  @@index([parentId])
  @@map("Thread")
}
```

**Note**: Most of my decisions were also influenced by the time limit of the assignment, so I focused on the core part of the problem, building the nested thread logic and ensuring the calculations worked correctly. That being said, I’d love to improve the proejct whenever I have free time, like adding more tests, implementing pagination, and generally making the project better.

## Backend

### Tech Stack

- **Node.js & Express** – Handles API requests and server-side logic.
- **PostgreSQL & Prisma** – PostgreSQL is used as the database, and Prisma is used as an ORM for easy database interactions and migrations.
  - I used Prisma’s relational queries to fetch root threads and their direct replies. Instead of fetching entire thread trees in one go (which could be inefficient but can be improved with limits and offsets), replies are loaded dynamically as needed.
  - It also helps with schema migrations, making database changes more manageable.
- **Zod** – Used for data validation to ensure API requests meet expected formats.
- **TypeScript** – TS for types support.

### Folder Structure

The backend follows an MVC-like structure:

```
server/
├── config/       # Environment/config files
├── dtos/         # data transter objects and Zod validation schemas
├── handlers/     # Business logic (like controllers)
├── middlewares/  # Auth, error handling
├── routes/       # API endpoints
├── prisma/       # DB schema/migrations
└── utils/        # Shared utilities
```

### Authentication

Keeping the assignment's time frame in mind, I implemented a simple authentication system using a **single session-based endpoint**. It handles both **registration and login** in one request. JWT is used for authentication, and while it works for this project, it could be improved in a real-world scenario by adding:

- Refresh tokens for better security
- Stronger password storage and encryption
- Separate API endpoints for login and register along with another things.

**POST /api/auth/session**

- Handles both **registration** and **login**
- **Request:** `{ username, password }`
- **Response:**
  - If the user doesn't exist, creates an account and returns a JWT.
  - If the user exists, verifies the password and returns a JWT.
  - If invalid, returns an error.
- No explicit logout API (JWT can be cleared client-side).

### Thread API Endpoints

**GET /api/threads**

- Fetches all **root-level** calculation threads.

**GET /api/threads/:id/replies**

- Fetches **direct replies** to a specific parent calculation thread.

**POST /api/threads**

- Creates a **new root calculation**.
- **Request:** `{ value, userId }`
- userId is decoded from the JWT token

**POST /api/threads/:id/replies**

- Adds a reply to an existing calculation.
- **Request:** `{ operation, rightOperand, userId }`
- userId is decoded from the JWT token

## Future Improvements

- **Pagination**: Currently, all threads and replies are fetched at once, which isn't scalable. Implementing proper pagination would improve performance.
- **Enhanced Authentication**: More secure auth flows with refresh tokens and stronger password hashing.
- **Rate Limiting**: To prevent spam or abuse of the API.
- **Better Error Handling**: Although the error handling is pretty decent and works, we can improve it by sending more detailed, standardized error responses to the client for better debugging and clarity.
- **Testing**: I really wanted to work more on this since I’ve recently started getting into backend testing in my part-time gig, but due to the time constraint of the assignment, I couldn’t include test coverage here (though I want to and would be something that I will be doing).

---

## Frontend

### Tech Stack

- **React** – Used for building dynamic, component-driven UIs.
- **Tailwind CSS** – Made it quick to style without worrying too much about complex UI decisions (which wasn’t the main focus of this project).
- **Axios** – For making clean and simple HTTP requests to the backend.
- **React Context + Custom Hooks** – For managing user state and authentication.
- **TypeScript** – TS for types support.

### Folder Structure

```
client/
├── api/          # API service definitions (auth, threads)
├── assets/       # Static files (images, fonts)
├── components/   # Reusable UI components
│   ├── auth/     # Auth-specific components
│   ├── layout/   # Page structure components
│   ├── threads/  # Thread-related components
│   └── ui/       # Generic UI primitives (buttons, inputs)
├── context/      # AuthProvider in context manages user authentication state
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
└── utils/        # Helper functions (e.g. operation calculations)
```

### Authentication

- Authentication is handled via a single modal (AuthModal) that switches between login and register states.
- It uses a shared login API for both flows; backend auto-registers new users if credentials are new.

- **How It Works**
  - On successful login, the user's token and data are saved to localStorage.
  - The AuthProvider makes the user globally available through React Context.
  - Axios automatically adds the Bearer token to each request via an interceptor.
  - If a request fails with a 401, the token and user info are cleared from storage.

### My Approach to UI and UX

- My goal was to keep the UI as minimal and intuitive as possible, with a focus on the core interaction, threading and replying through calculations.
- I only displayed root-level threads initially and revealed replies on demand using a “Show Replies” button.
- Rendering nested replies recursively using the ThreadItem component.
- I used react-hot-toast to show feedback messages (success, error) across the app with minimal effort.

## Future Improvements

- **Component Splitting**: Split ThreadItem into smaller components for maintainability as it handles rendering, replies, and loading logic.
- **Other possible enhancements**: pagination for replies, optimistic UI updates, skeleton loading, more detailed error UI, visual nesting cues, caching, etc.
