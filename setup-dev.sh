#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development environment setup...${NC}\n"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo -e "${BLUE}Checking required tools...${NC}"
if ! command_exists node; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Setup Backend
echo -e "\n${BLUE}Setting up backend...${NC}"
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskpal
JWT_SECRET=your_jwt_secret_here
EOL
    echo -e "${GREEN}Created .env file. Please update the values as needed.${NC}"
fi

cd ..

# Setup Frontend
echo -e "\n${BLUE}Setting up frontend...${NC}"
cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000
EOL
    echo -e "${GREEN}Created .env file. Please update the values as needed.${NC}"
fi

cd ..

# Create a script to start both servers
echo -e "\n${BLUE}Creating start script...${NC}"
cat > start-dev.sh << 'EOL'
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process on port
kill_port() {
    lsof -ti:$1 | xargs kill -9 2>/dev/null
}

# Kill existing processes on ports 3000 and 5000
echo -e "${BLUE}Cleaning up existing processes...${NC}"
kill_port 3000
kill_port 5000

# Start backend
echo -e "\n${BLUE}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
echo -e "\n${BLUE}Starting frontend server...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo -e "\n${BLUE}Shutting down servers...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOL

# Make the start script executable
chmod +x start-dev.sh

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "\nTo start the development servers, run:"
echo -e "${BLUE}./start-dev.sh${NC}"
echo -e "\nThis will start both the frontend and backend servers."
echo -e "Frontend will be available at: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend will be available at: ${GREEN}http://localhost:5000${NC}" 