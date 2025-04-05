frontend:
npm run dev

.env:
VITE_REMOTE_SERVER=http://localhost:4000

backend:
npm run start

.env:
NODE_ENV=development
NETLIFY_URL=http://localhost:5173
REMOTE_SERVER=http://localhost:4000
SESSION_SECRET=super secret session phase
MONGO_CONNECTION_STRING=mongodb://localhost:27017/kambaz