#!/bin/bash

echo "🚀 Installing E-Learning Full-Stack Demo..."

# Install root dependencies with legacy peer deps
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ -d "frontend" ]; then
    cd frontend && npm install --legacy-peer-deps && cd ..
else
    echo "❌ Frontend directory not found"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
if [ -d "backend" ]; then
    cd backend && npm install --legacy-peer-deps && cd ..
else
    echo "❌ Backend directory not found"
fi

# Install shared dependencies
echo "📦 Installing shared dependencies..."
if [ -d "shared" ]; then
    cd shared && npm install --legacy-peer-deps && cd ..
else
    echo "❌ Shared directory not found"
fi

# Copy environment files
echo "📄 Setting up environment files..."
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

if [ -f "frontend/.env.local.example" ] && [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local file"
fi

if [ -f "backend/.env.example" ] && [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env file"
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📝 Next steps:"
echo "1. Update database connection in backend/.env"
echo "2. Run: npm run db:migrate"
echo "3. Run: npm run db:seed"
echo "4. Run: npm run dev"
echo ""
echo "🌐 URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo ""