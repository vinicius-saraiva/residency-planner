# Competitor Analysis Agent

An automated tool for generating comprehensive competitor analyses of US banking institutions.

## Overview

This agent reads your competitor analysis template and banking players list to generate structured competitor analysis reports. It can work in two modes:

1. **Template Mode** (default): Generates a structured template pre-filled with bank name and ready for manual research
2. **AI Mode** (with API key): Uses AI to automatically research and populate the analysis

## Quick Start

### Basic Usage

```bash
# Generate a template for Bank of America
npm run analyze-competitor "Bank of America"

# Generate a template for JPMorgan Chase
npm run analyze-competitor "JPMorgan Chase"

# Generate a template for Wells Fargo
npm run analyze-competitor "Wells Fargo"
```

### With AI-Powered Analysis

Set your API key and the agent will automatically research and generate the analysis:

```bash
# Using Anthropic Claude
export ANTHROPIC_API_KEY="your-api-key-here"
npm run analyze-competitor "Capital One"

# Using OpenAI
export OPENAI_API_KEY="your-api-key-here"
npm run analyze-competitor "Citibank"
```

## Features

- ✅ **Template-based Analysis**: Uses your custom competitor analysis template
- ✅ **Banking Players Validation**: Checks against your list of US banking players
- ✅ **Structured Output**: Generates markdown files in the `analyses/` directory
- ✅ **AI Integration Ready**: Supports Anthropic Claude and OpenAI APIs
- ✅ **Flexible**: Works manually or with AI assistance

## Output

The agent generates analysis files in the `analyses/` directory:

```
analyses/
├── competitor-analysis-bank-of-america.md
├── competitor-analysis-jpmorgan-chase.md
└── competitor-analysis-wells-fargo.md
```

Each file includes:
- Pre-filled bank name and analysis date
- Complete template structure from `competitor-analysis-template.md`
- Section-by-section guidance for research
- Ready to populate with data

## Workflow

1. **Select a Bank**: Choose from `us-banking-players.md` or specify any US bank
2. **Run the Agent**: Execute the script with the bank name
3. **Review Output**: Open the generated file in `analyses/` directory
4. **Complete Research**: Fill in each section with your research findings
5. **Iterate**: Run for multiple competitors to build a comprehensive competitive landscape

## Advanced Usage

### Direct Script Execution

```bash
# Using ts-node directly
npx ts-node scripts/competitor-analyzer.ts "U.S. Bank"

# Make executable and run
chmod +x scripts/competitor-analyzer.ts
./scripts/competitor-analyzer.ts "PNC Bank"
```

### Batch Analysis

Create analyses for multiple banks at once:

```bash
#!/bin/bash
# analyze-top-banks.sh

banks=(
  "JPMorgan Chase"
  "Bank of America"
  "Wells Fargo"
  "Citibank"
  "U.S. Bank"
)

for bank in "${banks[@]}"; do
  npm run analyze-competitor "$bank"
done
```

### Custom Output Directory

Modify the script to change output location:

```typescript
const config = {
  // ...
  outputDir: path.join(projectRoot, 'custom-analyses'),
  // ...
};
```

## AI Integration

### Anthropic Claude (Recommended)

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm run analyze-competitor "Bank of America"
```

Benefits:
- Deep financial analysis capabilities
- Strong reasoning for competitive insights
- Comprehensive market research

### OpenAI GPT

```bash
export OPENAI_API_KEY="sk-..."
npm run analyze-competitor "Bank of America"
```

### Custom AI Provider

Extend the `CompetitorAnalyzer` class to add your own AI provider:

```typescript
async generateAnalysisWithCustomAI(): Promise<string> {
  // Your custom AI integration
  const response = await yourAIProvider.analyze({
    bank: this.config.bankName,
    template: this.template
  });
  return response;
}
```

## Template Structure

The agent uses sections from `competitor-analysis-template.md`:

- Basic Information
- Company Overview
- Products & Services
- Market Position
- Customer Experience
- Technology & Innovation
- Marketing & Brand
- Financial Performance
- Operations
- Strategic Initiatives
- Regulatory & Compliance
- SWOT Analysis
- Competitive Comparison
- Key Insights & Takeaways

## Examples

### Example 1: Quick Template Generation

```bash
$ npm run analyze-competitor "Ally Bank"

🏦 Starting Competitor Analysis for: Ally Bank

✓ Resources loaded successfully
Warning: Checking banking players list...
✓ Bank found in list

📊 Generating analysis...

✓ Analysis saved to: analyses/competitor-analysis-ally-bank.md

✅ Analysis Complete!

Next steps:
1. Open analyses/competitor-analysis-ally-bank.md
2. Fill in the sections with research data
3. Use the template as a guide for comprehensive analysis
```

### Example 2: AI-Powered Analysis

```bash
$ export ANTHROPIC_API_KEY="sk-ant-..."
$ npm run analyze-competitor "Chase"

🏦 Starting Competitor Analysis for: Chase

✓ Resources loaded successfully
✓ Bank validated

📊 Generating AI-powered analysis...
🤖 Researching company background...
🤖 Analyzing products and services...
🤖 Evaluating market position...
🤖 Completing SWOT analysis...

✓ Analysis saved to: analyses/competitor-analysis-chase.md

✅ Analysis Complete with AI insights!
```

## Troubleshooting

### Bank Not Found

If the agent warns that a bank isn't in the list, you can still proceed. The list is for reference only.

```bash
Warning: "Custom Bank" not found in the banking players list.
Available banks include:
  1. **JPMorgan Chase**
  2. **Bank of America**
  ...
```

### Missing Dependencies

```bash
npm install
```

### TypeScript Errors

Ensure TypeScript is installed:

```bash
npm install -D typescript @types/node
npx ts-node scripts/competitor-analyzer.ts "Bank Name"
```

### API Rate Limits

If using AI mode, be aware of API rate limits. The agent makes comprehensive requests that may consume significant tokens.

## Best Practices

1. **Start Manual**: Generate templates first to understand the structure
2. **Research Thoroughly**: Use multiple sources (company websites, financial reports, news)
3. **Update Regularly**: Competitor landscapes change; schedule periodic updates
4. **Compare**: Generate analyses for multiple competitors to identify patterns
5. **Validate AI Output**: Always verify AI-generated facts and figures

## Future Enhancements

Planned features:
- [ ] Automatic web scraping for public data
- [ ] Integration with financial data APIs (Yahoo Finance, Alpha Vantage)
- [ ] PDF export functionality
- [ ] Comparative analysis across multiple competitors
- [ ] Automated SWOT generation from collected data
- [ ] Scheduled analysis updates
- [ ] Dashboard visualization

## Contributing

To extend the agent:

1. Fork the repository
2. Create your feature branch
3. Add new analyzers or data sources
4. Submit a pull request

## License

Part of the residency-planner project.
