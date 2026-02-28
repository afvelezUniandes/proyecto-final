#!/bin/bash
# Script para configurar el entorno virtual e instalar dependencias

set -e

echo "================================================"
echo "  TravelHub - Virtual Environment Setup"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if venv already exists
if [ -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment already exists.${NC}"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing existing venv..."
        rm -rf venv
    else
        echo "Using existing venv..."
    fi
fi

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
    echo ""
fi

# Activate venv
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip
echo ""

# Install dependencies for each service
echo -e "${YELLOW}Installing auth-service dependencies...${NC}"
cd auth-service
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Auth service dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Installing catalog-service dependencies...${NC}"
cd catalog-service
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Catalog service dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Installing client-gateway dependencies...${NC}"
cd client-gateway
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Client gateway dependencies installed${NC}"
echo ""

echo "================================================"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "================================================"
echo ""
echo "To activate the virtual environment in the future, run:"
echo "  source venv/bin/activate"
echo ""
echo "To deactivate it, run:"
echo "  deactivate"
echo ""
