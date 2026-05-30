# Permalist

Simple to-do list app using Node.js, Express, EJS, and PostgreSQL.

## Railway Deploy Setup

### 1. Set Variables in Railway

In your web service Variables, add:

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `PORT=3000`

### 2. Create Database Table in Railway Postgres

Open Railway Postgres -> Query and run:

```sql
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Optional seed data:

```sql
INSERT INTO items (title) VALUES
('Buy milk'),
('Finish homework');
```

### 3. Local Development

1. Copy `.env.example` to `.env`
2. Fill in local database values (or set `DATABASE_URL`)
3. Run:

```bash
npm install
npm start
```

App runs on `http://localhost:3000` by default.
