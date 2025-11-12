#!/bin/bash

# Batch Research-Based Competitor Analysis Script
# Performs comprehensive research analysis for all banks with real data

echo "🏦 Batch Research-Based Competitor Analysis"
echo "=============================================="
echo ""

# Array of all major US banking players
banks=(
  "JPMorgan Chase"
  "Bank of America"
  "Wells Fargo"
  "Citibank"
  "U.S. Bank"
  "PNC Bank"
  "Truist Bank"
  "TD Bank"
  "Capital One"
  "Fifth Third Bank"
  "Citizens Bank"
  "KeyBank"
  "BMO (Bank of Montreal) US"
  "Huntington National Bank"
  "Regions Bank"
  "Ally Bank"
  "Discover Bank"
  "Marcus by Goldman Sachs"
  "Chime"
  "SoFi"
  "Navy Federal Credit Union"
  "State Employees' Credit Union (SECU)"
  "Pentagon Federal Credit Union (PenFed)"
)

echo "Total banks to analyze: ${#banks[@]}"
echo "Mode: Research-based with real data and sources"
echo ""

# Process banks sequentially to ensure quality
count=0
for bank in "${banks[@]}"; do
  ((count++))
  echo "[$count/${#banks[@]}] 🔬 Researching: $bank"

  npm run analyze-research "$bank" 2>&1 | grep -E "(✓|✅|❌)" || echo "  Processing..."

  # Small delay to avoid overwhelming the system
  sleep 0.5
done

echo ""
echo "✅ Batch research analysis complete!"
echo ""
echo "Generated analyses with:"
echo "  • Real company data and metrics"
echo "  • Financial performance details"
echo "  • Market position analysis"
echo "  • SWOT analysis"
echo "  • Comprehensive sources and references"
echo ""
echo "Location: analyses/"
ls -1 analyses/*.md | wc -l | xargs echo "Total files:"
