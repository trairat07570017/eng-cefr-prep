export interface RawNewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category: "education" | "technology" | "environment" | "general";
}

const RSS_FEEDS: Record<string, { url: string; source: string; category: "education" | "technology" | "environment" | "general" }> = {
  education: {
    url: "https://feeds.bbci.co.uk/news/education/rss.xml",
    source: "BBC News Education",
    category: "education",
  },
  technology: {
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    source: "BBC News Technology",
    category: "technology",
  },
  environment: {
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    source: "BBC Science & Environment",
    category: "environment",
  },
};

const FALLBACK_NEWS: Record<string, RawNewsItem> = {
  education: {
    title: "How Generative Artificial Intelligence Is Transforming Classroom Learning and Teaching",
    link: "https://www.bbc.com/news/education",
    description: "Schools and universities across the globe are integrating AI tutors into daily lessons. Educators report that personalized learning tools help students master foreign languages and complex subjects faster, while teachers can save hours on lesson planning and feedback.",
    pubDate: new Date().toISOString(),
    source: "Global Education Journal",
    category: "education",
  },
  technology: {
    title: "Breakthroughs in Renewable Energy Tech Offer Hope for Greener Smart Cities",
    link: "https://www.bbc.com/news/technology",
    description: "Engineers have unveiled next-generation solar panels and battery storage systems that operate with 40% higher efficiency. These technologies are poised to power clean public transport and reduce urban carbon footprints.",
    pubDate: new Date().toISOString(),
    source: "Tech & Science Review",
    category: "technology",
  },
  environment: {
    title: "Global Reforestation Initiatives Show Measurable Revival of Endangered Wildlife",
    link: "https://www.bbc.com/news/science_and_environment",
    description: "Satellite data demonstrates that community-led tree planting campaigns over the past decade have successfully restored vital forest corridors, bringing endangered species back from the brink of extinction.",
    pubDate: new Date().toISOString(),
    source: "Environmental Science Today",
    category: "environment",
  },
};

export async function fetchRssNewsItem(
  category: "education" | "technology" | "environment" | "general" = "education"
): Promise<RawNewsItem> {
  const targetCategory = category === "general" ? "education" : category;
  const feedConfig = RSS_FEEDS[targetCategory] || RSS_FEEDS.education;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(feedConfig.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: HTTP ${response.status}`);
    }

    const xml = await response.text();
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);

    if (itemMatches && itemMatches.length > 0) {
      // Pick one of the top 3 items randomly for variety
      const index = Math.min(Math.floor(Math.random() * 3), itemMatches.length - 1);
      const selectedItemXml = itemMatches[index];

      const titleMatch = selectedItemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || selectedItemXml.match(/<title>(.*?)<\/title>/);
      const descMatch = selectedItemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || selectedItemXml.match(/<description>(.*?)<\/description>/);
      const linkMatch = selectedItemXml.match(/<link>(.*?)<\/link>/);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "";

      if (title && description) {
        return {
          title,
          description,
          link: link || feedConfig.url,
          pubDate: new Date().toISOString(),
          source: feedConfig.source,
          category: targetCategory,
        };
      }
    }
  } catch (err) {
    console.warn(`[RSS Fetcher] Warning: falling back to curated news for ${category}:`, err);
  }

  // Fallback to curated news item
  return FALLBACK_NEWS[targetCategory] || FALLBACK_NEWS.education;
}
