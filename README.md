This github repository is for the Sentify project. 

The working prototype is a dashboard built with React. 
## Prerequisites

### Backend (Python 3.10+)
- `fastapi`, `uvicorn`, `joblib`, `numpy`, `pydantic`

### Frontend (Node.js 18+)
- `npm install` dependencies

---

## Setup Instructions
_Run all the following on your terminal:_


### 1. Backend (FastAPI)
cd api

python -m venv venv

source venv/bin/activate      # or .\venv\Scripts\activate on Windows


pip install fastapi uvicorn joblib numpy pydantic

_Then run the API:_


python -m uvicorn app:app --reload --host 127.0.0.1 --port 800

### 2. Backend (FastAPI)


cd ..

npm install

npm run dev

Visit: http://localhost:3000



