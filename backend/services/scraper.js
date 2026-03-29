import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Basic Web Scraper Service for Competitive Intelligence.
 * In a real-world scenario, you would use a headless browser like Puppeteer/Playwright 
 * or a specialized SERP API (Serper.dev, BrightData) to bypass bot detection.
 */
/**
 * Uses Serper.dev to find recent news and signals for a competitor.
 */
export const scrapeCompetitorSignals = async (companyName) => {
  try {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) throw new Error("SERPER_API_KEY missing");

    console.log(`[Scraper] Searching Serper for ${companyName} signals...`);
    
    const { data } = await axios.post('https://google.serper.dev/news', {
      q: `${companyName} product update pricing shift`,
      num: 5
    }, {
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
    });

    if (data.news && data.news.length > 0) {
      return data.news.map(item => `${item.title}: ${item.snippet}`);
    }

    return ["No recent news signals found via search."];
  } catch (error) {
    console.error(`[Scraper Error] Serper search failed for ${companyName}:`, error.message);
    return ["Error fetching real-time signals."];
  }
};

/**
 * Uses Firecrawl to scrape a specific URL for deep content.
 */
export const scrapePageContent = async (url) => {
    try {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) throw new Error("FIRECRAWL_API_KEY missing");

        console.log(`[Scraper] Firecrawling ${url}...`);

        const { data } = await axios.post('https://api.firecrawl.dev/v1/scrape', {
            url: url,
            formats: ["markdown"]
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
        });

        if (data.success && data.data && data.data.markdown) {
            return data.data.markdown;
        }
        
        return "Failed to extract clean markdown content.";
    } catch (error) {
        console.error(`[Scraper Error] Firecrawl failed for ${url}:`, error.message);
        return "Error performing deep scrape.";
    }
};

/**
 * Searches for companies matching an ICP using Serper.dev.
 */
export const searchCompanies = async (query) => {
    try {
        const apiKey = process.env.SERPER_API_KEY;
        if (!apiKey) throw new Error("SERPER_API_KEY missing");

        console.log(`[Scraper] Searching companies for query: ${query}`);

        const { data } = await axios.post('https://google.serper.dev/search', {
            q: query,
            num: 10
        }, {
            headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
        });

        return data.organic || [];
    } catch (error) {
        console.error(`[Scraper Error] Serper search failed:`, error.message);
        return [];
    }
};

/**
 * Analyzes competitor pricing from public data (Simulated).
 */
export const analyzeCompetitorPricing = async (url) => {
    try {
        // A real version would fetch the provided URL and parse the <table> or <div> containing pricing tiers.
        console.log(`[Scraper] Analyzing pricing at ${url}`);
        
        return {
            tiers: [
                { name: 'Starter', price: '$99/mo', features: ['3 users', 'Basic reporting'] },
                { name: 'Pro', price: '$249/mo', features: ['10 users', 'API access', 'Custom fields'] },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited', 'SLA', 'Dedicated support'] }
            ],
            lastChecked: new Date().toISOString()
        };
    } catch (error) {
        return null;
    }
};
