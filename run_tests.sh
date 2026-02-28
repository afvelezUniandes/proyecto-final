#!/bin/bash
# Script para ejecutar todas las pruebas con cobertura

set -e

echo "================================================"
echo "  Running TravelHub Test Suite"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Activar entorno virtual
if [ -d "venv" ]; then
    echo -e "${YELLOW}Activating virtual environment...${NC}"
    source venv/bin/activate
else
    echo -e "${RED}Virtual environment not found! Run ./setup_venv.sh first.${NC}"
    exit 1
fi
echo ""

# Auth Service
echo -e "${YELLOW}[1/3] Running Auth Service tests...${NC}"
cd auth-service
pytest || AUTH_FAILED=1
cd ..
echo ""

# Catalog Service
echo -e "${YELLOW}[2/3] Running Catalog Service tests...${NC}"
cd catalog-service
pytest || CATALOG_FAILED=1
cd ..
echo ""

# Client Gateway
echo -e "${YELLOW}[3/3] Running Client Gateway tests...${NC}"
cd client-gateway
pytest || GATEWAY_FAILED=1
cd ..
echo ""

# Summary
echo "================================================"
echo "  Test Summary"
echo "================================================"

if [ -z "$AUTH_FAILED" ]; then
    echo -e "${GREEN}✓ Auth Service: PASSED${NC}"
else
    echo -e "${RED}✗ Auth Service: FAILED${NC}"
fi

if [ -z "$CATALOG_FAILED" ]; then
    echo -e "${GREEN}✓ Catalog Service: PASSED${NC}"
else
    echo -e "${RED}✗ Catalog Service: FAILED${NC}"
fi

if [ -z "$GATEWAY_FAILED" ]; then
    echo -e "${GREEN}✓ Client Gateway: PASSED${NC}"
else
    echo -e "${RED}✗ Client Gateway: FAILED${NC}"
fi

echo ""

# Exit with error if any test failed
if [ ! -z "$AUTH_FAILED" ] || [ ! -z "$CATALOG_FAILED" ] || [ ! -z "$GATEWAY_FAILED" ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi
