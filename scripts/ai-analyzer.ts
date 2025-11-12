#!/usr/bin/env node

/**
 * AI-Powered Competitor Analysis Agent
 *
 * This enhanced version includes actual AI API integration for
 * automated competitor analysis using Claude or GPT models.
 *
 * Usage:
 *   npm run analyze-ai "Bank of America"
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AIAnalysisOptions {
  bankName: string;
  templatePath: string;
  outputDir: string;
  apiKey: string;
  apiProvider: 'anthropic' | 'openai';
  model?: string;
}

class AICompetitorAnalyzer {
  private options: AIAnalysisOptions;
  private template: string;

  constructor(options: AIAnalysisOptions) {
    this.options = options;
    this.template = '';
  }

  /**
   * Load the competitor analysis template
   */
  loadTemplate(): void {
    this.template = fs.readFileSync(this.options.templatePath, 'utf-8');
  }

  /**
   * Make an API call to Claude (Anthropic)
   */
  async callClaudeAPI(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const model = this.options.model || 'claude-3-5-sonnet-20241022';

      const data = JSON.stringify({
        model: model,
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.options.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            if (response.content && response.content[0]) {
              resolve(response.content[0].text);
            } else if (response.error) {
              reject(new Error(`API Error: ${response.error.message}`));
            } else {
              reject(new Error('Unexpected API response format'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`API request failed: ${error.message}`));
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Make an API call to OpenAI
   */
  async callOpenAIAPI(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const model = this.options.model || 'gpt-4-turbo-preview';

      const data = JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst expert in competitor analysis for banking institutions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 8000,
        temperature: 0.7
      });

      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.options.apiKey}`,
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            if (response.choices && response.choices[0]) {
              resolve(response.choices[0].message.content);
            } else if (response.error) {
              reject(new Error(`API Error: ${response.error.message}`));
            } else {
              reject(new Error('Unexpected API response format'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`API request failed: ${error.message}`));
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Generate comprehensive analysis prompt
   */
  generatePrompt(): string {
    const prompt = `You are a senior financial analyst conducting a comprehensive competitor analysis of ${this.options.bankName}.

Using the following template structure, please provide a detailed, data-driven analysis:

${this.template}

Requirements:
1. Replace the placeholder "Competitor Name" with "${this.options.bankName}"
2. Fill in EVERY section with accurate, current information
3. Include specific data points, metrics, and financial figures where available
4. Use bullet points and tables where appropriate
5. Ensure all information is factual and based on publicly available data
6. For the SWOT analysis, provide at least 4 items per category
7. Include recent news, developments, and strategic initiatives (within the last 12-24 months)
8. Provide specific examples and case studies where relevant

Focus areas:
- Market position and competitive advantages
- Digital transformation and technology initiatives
- Financial performance metrics (ROA, ROE, NIM, efficiency ratio)
- Customer satisfaction scores and ratings
- Product innovation and differentiation
- Recent M&A activity or partnerships
- Regulatory compliance status
- Strategic direction and future plans

Please provide a thorough, professional analysis that would be valuable for executive decision-making.`;

    return prompt;
  }

  /**
   * Generate the competitor analysis using AI
   */
  async generateAnalysis(): Promise<string> {
    console.log(`🤖 Generating AI-powered analysis for ${this.options.bankName}...`);
    console.log(`📡 Using ${this.options.apiProvider.toUpperCase()} API...`);

    const prompt = this.generatePrompt();

    let analysis: string;

    if (this.options.apiProvider === 'anthropic') {
      analysis = await this.callClaudeAPI(prompt);
    } else {
      analysis = await this.callOpenAIAPI(prompt);
    }

    console.log(`✓ AI analysis generated (${analysis.length} characters)`);

    return analysis;
  }

  /**
   * Save the analysis to a file
   */
  saveAnalysis(analysis: string): string {
    const sanitizedName = this.options.bankName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const filename = `competitor-analysis-${sanitizedName}.md`;
    const filepath = path.join(this.options.outputDir, filename);

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Add metadata header
    const header = `<!-- Generated by AI Competitor Analyzer -->\n` +
                  `<!-- Bank: ${this.options.bankName} -->\n` +
                  `<!-- Date: ${new Date().toISOString()} -->\n` +
                  `<!-- Provider: ${this.options.apiProvider} -->\n\n`;

    fs.writeFileSync(filepath, header + analysis, 'utf-8');
    console.log(`✓ Analysis saved to: ${filepath}`);

    return filepath;
  }

  /**
   * Run the complete AI analysis workflow
   */
  async analyze(): Promise<void> {
    console.log(`\n🏦 AI Competitor Analysis\n`);
    console.log(`Bank: ${this.options.bankName}`);
    console.log(`Provider: ${this.options.apiProvider}`);
    console.log('─'.repeat(60));

    try {
      // Load template
      this.loadTemplate();
      console.log('✓ Template loaded');

      // Generate analysis with AI
      const analysis = await this.generateAnalysis();

      // Save the analysis
      const filepath = this.saveAnalysis(analysis);

      // Print summary
      console.log('\n✅ AI Analysis Complete!\n');
      console.log(`Output: ${filepath}`);
      console.log('\nThe analysis includes:');
      console.log('  • Comprehensive company overview');
      console.log('  • Market position and competitive analysis');
      console.log('  • Financial performance metrics');
      console.log('  • Technology and innovation assessment');
      console.log('  • SWOT analysis');
      console.log('  • Strategic insights and recommendations\n');

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
AI-Powered Competitor Analysis Agent
════════════════════════════════════

Usage:
  npm run analyze-ai "Bank Name"
  ANTHROPIC_API_KEY=sk-... npm run analyze-ai "Bank Name"

Examples:
  export ANTHROPIC_API_KEY="sk-ant-..."
  npm run analyze-ai "Bank of America"

  export OPENAI_API_KEY="sk-..."
  npm run analyze-ai "JPMorgan Chase"

Environment Variables (Required):
  ANTHROPIC_API_KEY - Anthropic API key for Claude analysis
  OPENAI_API_KEY    - OpenAI API key for GPT analysis

Optional Environment Variables:
  AI_MODEL          - Specific model to use
                      Claude: claude-3-5-sonnet-20241022 (default)
                      OpenAI: gpt-4-turbo-preview (default)

Options:
  --help, -h        Show this help message

Note: This tool requires an API key and will make API calls that incur costs.
      Typical analysis costs: $0.10-0.50 per bank depending on model.
    `);
    process.exit(0);
  }

  const bankName = args[0];
  const projectRoot = path.resolve(__dirname, '..');

  // Determine which API to use
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!anthropicKey && !openaiKey) {
    console.error('❌ Error: No API key found.');
    console.error('Please set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable.\n');
    console.error('Example:');
    console.error('  export ANTHROPIC_API_KEY="sk-ant-..."');
    console.error('  npm run analyze-ai "Bank Name"\n');
    process.exit(1);
  }

  const apiProvider = anthropicKey ? 'anthropic' : 'openai';
  const apiKey = anthropicKey || openaiKey || '';

  const options: AIAnalysisOptions = {
    bankName,
    templatePath: path.join(projectRoot, 'competitor-analysis-template.md'),
    outputDir: path.join(projectRoot, 'analyses'),
    apiKey,
    apiProvider,
    model: process.env.AI_MODEL
  };

  const analyzer = new AICompetitorAnalyzer(options);

  try {
    await analyzer.analyze();
  } catch (error) {
    console.error('\n❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run if called directly
// @ts-ignore - ES module check
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AICompetitorAnalyzer };
export type { AIAnalysisOptions };
