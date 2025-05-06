
## Prerequisites

### Backend (Python 3.10+)
- `fastapi`, `uvicorn`, `joblib`, `numpy`, `pydantic`

### Frontend (Node.js 18+)
- `npm install` dependencies

---

## Setup Instructions

### 1. Backend (FastAPI)
cd api
python -m venv venv
source venv/bin/activate      # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
If requirements.txt doesn’t exist:

bash
Copia
pip install fastapi uvicorn joblib numpy pydantic
Then run the API:

bash
Copia
python -m uvicorn app:app --reload --host 127.0.0.1 --port 800

### 2. Backend (FastAPI)

bash
Copia
cd ..
npm install
npm run dev
Visit: http://localhost:3000



