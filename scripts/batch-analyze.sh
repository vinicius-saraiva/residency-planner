#!/bin/bash

# Batch Competitor Analysis Script
# Analyzes all banks from the US banking players list in parallel

echo "🏦 Batch Competitor Analysis"
echo "================================"
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
echo ""

# Process all banks in parallel using background jobs
# Limit concurrent processes to avoid overwhelming the system
MAX_PARALLEL=5
count=0

for bank in "${banks[@]}"; do
  echo "📊 Starting analysis for: $bank"

  # Run analysis in background
  npm run analyze-competitor "$bank" > /dev/null 2>&1 &

  ((count++))

  # Limit parallel processes
  if [ $((count % MAX_PARALLEL)) -eq 0 ]; then
    wait # Wait for current batch to complete
  fi
done

# Wait for all remaining background jobs to complete
wait

echo ""
echo "✅ Batch analysis complete!"
echo ""
echo "Generated $(ls -1 analyses/ | wc -l) analysis files:"
ls -1 analyses/
echo ""
echo "Location: analyses/"
