# Stockly – Inventory Management

A simple full-stack inventory CRUD application using HTML, CSS, JavaScript, Node.js, Express, MongoDB Atlas and Vercel.

## Features
- Add inventory items with name, category and quantity
- View and search items
- Edit item details and quantity
- Delete items
- Dashboard totals and low-stock indicator
- REST API for Postman testing
- Vercel serverless deployment configuration

## 1. Requirements
- Node.js and npm
- MongoDB Atlas account
- Git (for GitHub/Vercel deployment)

## 2. Install and run locally
Open a terminal in the project folder:

```bash
npm install
```

Copy `.env.example` to `.env` and set your real MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/inventoryDB?retryWrites=true&w=majority
PORT=5000
```

Then run:

```bash
npm run dev
```

Open http://localhost:5000

If you use a Windows Command Prompt, copy the environment template with:

```cmd
copy .env.example .env
```

Edit `.env` with Notepad. Do not commit `.env` to GitHub.

## 3. MongoDB Atlas setup
1. Create a free Atlas cluster if the free tier is available in your region.
2. Create a Database User and remember its password.
3. In Network Access, allow your current public IP for local development.
4. Copy the Node.js driver connection string.
5. Replace the username, password and cluster placeholder in `MONGO_URI`.
6. If the password contains special characters, URL-encode them before placing them in the URI.

The database name in this project is `inventoryDB`. MongoDB creates the database and `items` collection automatically when the first item is inserted.

For Vercel, add the Vercel outbound IP access method supported by your Atlas plan, or use the Atlas network access option appropriate for your deployment. `0.0.0.0/0` allows connections from any IP and is less restrictive; only use it if necessary and protect the database with a strong unique database password.

## 4. REST API endpoints
Base URL locally: `http://localhost:5000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/items` | Get all items |
| GET | `/api/items?search=pen` | Search items |
| POST | `/api/items` | Add an item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |

### POST body
Send as `Body > raw > JSON` in Postman:

```json
{
  "name": "Notebook",
  "category": "Stationery",
  "quantity": 25
}
```

### PUT body
Use the MongoDB `_id` returned by GET or POST:

```json
{
  "quantity": 40
}
```

## 5. Deploy to Vercel
1. Push the project to a GitHub repository. Do not push `.env` or `node_modules`.
2. Sign in at https://vercel.com and import the GitHub repository.
3. Keep the project root as the deployment root. No build command is required for this plain Node/Express app.
4. In Vercel Project Settings → Environment Variables, add:
   - Name: `MONGO_URI`
   - Value: your complete Atlas connection string
   - Environments: Production (and Preview/Development if needed)
5. Deploy or redeploy after adding the variable.
6. Test `https://YOUR-PROJECT.vercel.app/api/health` and then the CRUD endpoints.

The frontend is served as static files from `public/`; `/api/*` requests are rewritten to the Express function at `api/index.js`.

## 6. Postman test order
1. GET `/api/health`
2. POST `/api/items` with the JSON body above
3. GET `/api/items`
4. PUT `/api/items/PASTE_MONGODB_ID` with a JSON update body
5. DELETE `/api/items/PASTE_MONGODB_ID`

## Notes
- Quantities must be whole numbers greater than or equal to zero.
- The app has no login system; it is intended as a starter learning project. Do not expose it publicly with sensitive inventory data until authentication and authorization are added.
- If Atlas reports an IP access error, check Network Access. If authentication fails, verify the database username/password and URL-encode special characters in the password.
