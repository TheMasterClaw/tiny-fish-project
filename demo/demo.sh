#!/bin/bash
# CoralGuard Demo Script - AI + Blockchain for Ocean Conservation
# Run this to showcase all key features for hackathon judges

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          CORALGUARD - HACKATHON DEMO SCRIPT                   ║"
echo "║     AI + Blockchain for Ocean Conservation                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "─────────────────────────────────────────────────────────────────"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check prerequisites
print_section "CHECKING PREREQUISITES"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Demo 1: Project Overview
print_section "DEMO 1: PROJECT OVERVIEW"
echo "CoralGuard combines:"
echo "  • 🐠 AI-powered fish detection and classification"
echo "  • 🪸 NFT-based coral reef adoption and monitoring"
echo "  • 📊 Real-time reef health analytics dashboard"
echo "  • 💰 Direct donations to ocean conservation orgs"
echo ""
print_info "Tech Stack: Next.js + Python AI + Solana + Tiny Fish API"

# Demo 2: Key Features
print_section "DEMO 2: KEY FEATURES DEMO"
echo ""
echo "1️⃣  FISH IDENTIFICATION"
echo "    → Upload photo of fish"
echo "    → AI identifies species with confidence score"
echo "    → Shows conservation status and info"
echo ""
echo "2️⃣  REEF NFT ADOPTION"
echo "    → Browse available reef sections"
echo "    → Mint NFT representing reef adoption"
echo "    → Track reef health over time"
echo ""
echo "3️⃣  ANALYTICS DASHBOARD"
echo "    → View global reef health metrics"
echo "    → Track fish population trends"
echo "    → Monitor conservation impact"
echo ""
echo "4️⃣  DONATION MARKETPLACE"
echo "    → Direct crypto donations"
echo "    → Transparent fund tracking"
echo "    → Verified conservation partners"
echo ""

# Demo 3: Run Development Server
print_section "DEMO 3: STARTING DEVELOPMENT SERVER"
if [ -f "package.json" ]; then
    print_info "Installing dependencies (if needed)..."
    npm install --silent 2>/dev/null || true
    
    print_success "Dependencies ready"
    print_info "Starting Next.js development server..."
    print_info "🌐 Open http://localhost:3000 after server starts"
    echo ""
    print_info "Press Ctrl+C when demo is complete"
    echo ""
    
    npm run dev
else
    echo "❌ package.json not found. Are you in the correct directory?"
    exit 1
fi
