#!/bin/bash

echo "Starting Leafora Backend (FastAPI)..."
cd backend
source venv/bin/activate || source .venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "Starting Leafora Frontend (Vite)..."
cd frontend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm run dev &
FRONTEND_PID=$!
cd ..

function shutdown() {
    echo ""
    echo "Shutting down Leafora services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Trap Ctrl+C (SIGINT) to elegantly shut down both servers
trap shutdown SIGINT SIGTERM

echo "====================================================="
echo "   Leafora is running! Press Ctrl+C to stop both.   "
echo "====================================================="

# Wait for background processes
wait $BACKEND_PID
wait $FRONTEND_PID
