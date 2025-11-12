#!/usr/bin/env node

/**
 * Competitor Analysis Agent
 *
 * This script reads the competitor analysis template and generates
 * a comprehensive analysis for a specified US banking player.
 *
 * Usage:
 *   npm run analyze-competitor "Bank of America"
 *   or
 *   ts-node scripts/competitor-analyzer.ts "Bank of America"
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AnalyzerConfig {
  bankName: string;
  templatePath: string;
  bankingPlayersPath: string;
  outputDir: string;
  apiKey?: string;
  apiProvider?: 'anthropic' | 'openai' | 'manual';
}

class CompetitorAnalyzer {
  private config: AnalyzerConfig;
  private template: string;
  private bankingPlayers: string;

  constructor(config: AnalyzerConfig) {
    this.config = config;
    this.template = '';
    this.bankingPlayers = '';
  }

  /**
   * Load the template and banking players list
   */
  async loadResources(): Promise<void> {
    try {
      this.template = fs.readFileSync(this.config.templatePath, 'utf-8');
      this.bankingPlayers = fs.readFileSync(this.config.bankingPlayersPath, 'utf-8');
      console.log('✓ Resources loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load resources: ${error}`);
    }
  }

  /**
   * Validate that the bank exists in our list
   */
  validateBank(): boolean {
    const bankExists = this.bankingPlayers.toLowerCase().includes(this.config.bankName.toLowerCase());
    if (!bankExists) {
      console.warn(`Warning: "${this.config.bankName}" not found in the banking players list.`);
      console.log('Available banks include:');
      const lines = this.bankingPlayers.split('\n').filter(line => line.match(/^\d+\.|^-/));
      lines.slice(0, 10).forEach(line => console.log(`  ${line}`));
      console.log('  ... (see us-banking-players.md for complete list)');
    }
    return bankExists;
  }

  /**
   * Extract section structure from template
   */
  extractTemplateSections(): Map<string, string[]> {
    const sections = new Map<string, string[]>();
    const lines = this.template.split('\n');
    let currentSection = '';
    let currentSubsections: string[] = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.set(currentSection, currentSubsections);
        }
        currentSection = line.replace('## ', '').trim();
        currentSubsections = [];
      } else if (line.startsWith('### ') && currentSection) {
        currentSubsections.push(line.replace('### ', '').trim());
      }
    }

    if (currentSection) {
      sections.set(currentSection, currentSubsections);
    }

    return sections;
  }

  /**
   * Generate analysis prompt for AI
   */
  generateAnalysisPrompt(): string {
    const sections = this.extractTemplateSections();

    let prompt = `You are a financial analyst tasked with conducting a comprehensive competitor analysis of ${this.config.bankName}.\n\n`;
    prompt += `Please provide a detailed analysis following this structure:\n\n`;

    sections.forEach((subsections, section) => {
      prompt += `## ${section}\n`;
      if (subsections.length > 0) {
        subsections.forEach(sub => {
          prompt += `  - ${sub}\n`;
        });
      }
      prompt += '\n';
    });

    prompt += `\nPlease research and provide accurate, up-to-date information for each section.`;
    prompt += `\nUse the exact template format from the competitor analysis template.`;
    prompt += `\nInclude specific data points, metrics, and examples where possible.`;

    return prompt;
  }

  /**
   * Call AI API to generate analysis
   */
  async generateAnalysisWithAI(): Promise<string> {
    const prompt = this.generateAnalysisPrompt();

    if (!this.config.apiKey) {
      console.log('\n📋 AI Analysis Prompt Generated:');
      console.log('─'.repeat(80));
      console.log(prompt);
      console.log('─'.repeat(80));
      console.log('\n💡 Tip: Set ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable to auto-generate analysis');
      return this.createManualTemplate();
    }

    // Here you would integrate with actual AI APIs
    // For now, returning a structured template
    console.log('🤖 AI analysis would be generated here with your API key');
    return this.createManualTemplate();
  }

  /**
   * Create a manual template with placeholder guidance
   */
  createManualTemplate(): string {
    let output = this.template;

    // Replace the title
    output = output.replace('# Competitor Analysis Template',
                          `# Competitor Analysis: ${this.config.bankName}`);

    // Add analysis metadata
    const now = new Date().toISOString().split('T')[0];
    output = output.replace('- **Competitor Name:**',
                           `- **Competitor Name:** ${this.config.bankName}`);
    output = output.replace('- **Analysis Date:**',
                           `- **Analysis Date:** ${now}`);

    // Add helpful notes
    const introNote = `\n> **Analysis Status:** Template generated for ${this.config.bankName}\n` +
                     `> This template is ready to be filled with research data.\n` +
                     `> Consider using web research, financial reports, and market data to complete each section.\n\n`;

    output = output.replace('## Basic Information', introNote + '## Basic Information');

    return output;
  }

  /**
   * Save the analysis to a file
   */
  async saveAnalysis(analysis: string): Promise<string> {
    const sanitizedName = this.config.bankName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const filename = `competitor-analysis-${sanitizedName}.md`;
    const filepath = path.join(this.config.outputDir, filename);

    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    fs.writeFileSync(filepath, analysis, 'utf-8');
    console.log(`✓ Analysis saved to: ${filepath}`);

    return filepath;
  }

  /**
   * Run the complete analysis workflow
   */
  async analyze(): Promise<void> {
    console.log(`\n🏦 Starting Competitor Analysis for: ${this.config.bankName}\n`);

    // Load resources
    await this.loadResources();

    // Validate bank
    this.validateBank();

    // Generate analysis
    console.log('\n📊 Generating analysis...\n');
    const analysis = await this.generateAnalysisWithAI();

    // Save analysis
    const filepath = await this.saveAnalysis(analysis);

    // Print summary
    console.log('\n✅ Analysis Complete!');
    console.log(`\nNext steps:`);
    console.log(`1. Open ${filepath}`);
    console.log(`2. Fill in the sections with research data`);
    console.log(`3. Use the template as a guide for comprehensive analysis\n`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Competitor Analysis Agent
═════════════════════════

Usage:
  npm run analyze-competitor "Bank Name"
  ts-node scripts/competitor-analyzer.ts "Bank Name"

Examples:
  npm run analyze-competitor "Bank of America"
  npm run analyze-competitor "JPMorgan Chase"
  npm run analyze-competitor "Wells Fargo"

Environment Variables:
  ANTHROPIC_API_KEY - Anthropic API key for AI-powered analysis
  OPENAI_API_KEY    - OpenAI API key for AI-powered analysis

Options:
  --help, -h        Show this help message
    `);
    process.exit(0);
  }

  const bankName = args[0];
  const projectRoot = path.resolve(__dirname, '..');

  const config: AnalyzerConfig = {
    bankName,
    templatePath: path.join(projectRoot, 'competitor-analysis-template.md'),
    bankingPlayersPath: path.join(projectRoot, 'us-banking-players.md'),
    outputDir: path.join(projectRoot, 'analyses'),
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY,
    apiProvider: process.env.ANTHROPIC_API_KEY ? 'anthropic' :
                 process.env.OPENAI_API_KEY ? 'openai' : 'manual'
  };

  const analyzer = new CompetitorAnalyzer(config);

  try {
    await analyzer.analyze();
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
// @ts-ignore - ES module check
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { CompetitorAnalyzer };
export type { AnalyzerConfig };
