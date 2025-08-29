<img width="1140" height="895" alt="Basic-Finance-Quote-Project" src="https://github.com/user-attachments/assets/0e2587dc-ed83-4d2a-b5b7-bec9ccd463db" />

# xDeskPro Clone (Vue 3 + TypeScript + Vite) & TypeScript Backend - X Assessment - LUCAS LOPES

This project recreates the UI shown in the screenshot running alongside a small TypeScript backend for calculations + saved quotes.

## Quick start

### STEP 1: Set up Backend
```bash
cd backend
npm i
npm run dev
# server should now be running on: http://localhost:5175
```

### STEP 2: Set up Frontend
```bash
cd frontend
npm i
npm run dev
# app should now be active on: http://localhost:5173
```

The Vite dev server proxies `/api/*` calls to the backend.

## API Functionality
* Front end makes the API call "calc" to the server to calculate financing.

* Front end makes the API call "quotes"(GET) to the server to retrieve all quotes currently in store.

* Front end makes the API call "quotes"(POST) to the server to add a new quote to the store

* Front end makes the API call "quotes"(DELETE) to the server to remove a specified quote from the store

## Calculation
Payment (within "calc" logic) uses the standard amortization formula:
`payment = L * (i * (1+i)^n) / ((1+i)^n - 1)` where `i = APR/12` and `n = months`.
When APR is `0%`, it falls back to `L / n`. 
Total interest = `payment * n - L`.

## Notes
- Backend was originall in-memory (resets when server restarts), but I have since added sql-lite integration Please be aware that this will involve the creation of the quotes.db file.
