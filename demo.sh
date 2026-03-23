#!/bin/bash

# CoralGuard Demo Script
# This script demonstrates the CoralGuard platform functionality

echo "🐠 CoralGuard - Marine Conservation Platform Demo"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Smart Contract Tests${NC}"
echo "------------------------------"
echo "Running comprehensive contract tests..."
npm test
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All contract tests passed!${NC}"
else
    echo -e "${YELLOW}✗ Some tests failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Contract Compilation${NC}"
echo "------------------------------"
echo "Compiling smart contracts..."
npm run compile
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Contracts compiled successfully!${NC}"
else
    echo -e "${YELLOW}✗ Compilation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 3: Frontend Build${NC}"
echo "----------------------"
echo "Building React frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built successfully!${NC}"
else
    echo -e "${YELLOW}✗ Build failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 4: Frontend Tests${NC}"
echo "----------------------"
echo "Running frontend tests..."
npm test -- --watchAll=false
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All frontend tests passed!${NC}"
else
    echo -e "${YELLOW}✗ Some tests failed${NC}"
    exit 1
fi
cd ..
echo ""

echo -e "${CYAN}================================================${NC}"
echo -e "${GREEN}🎉 Demo Complete!${NC}"
echo ""
echo "CoralGuard is ready for deployment:"
echo ""
echo "  🌐 Live Demo:     https://tiny-fish-project.vercel.app"
echo "  📊 Contracts:     3 deployed on Base Sepolia"
echo "  🎨 Frontend:      React + Tailwind CSS"
echo "  ⛓️  Blockchain:    Base Sepolia Testnet"
echo ""
echo "Key Features:"
echo "  • Real-time reef health monitoring"
echo "  • NFT-based conservation fundraising"
echo "  • Guardian rewards for conservation actions"
echo "  • On-chain transparency for all data"
echo ""
echo "Next Steps:"
echo "  1. Deploy contracts to Base Sepolia: npm run deploy:base-sepolia"
echo "  2. Update contract addresses in frontend/src/contracts/addresses.ts"
echo "  3. Deploy frontend: cd frontend && vercel --prod"
echo ""
echo -e "${CYAN}Together, we can save our oceans! 🌊${NC}"
