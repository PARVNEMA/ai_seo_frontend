"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Scale,
  Search,
  Globe,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  ImageIcon,
  Heading,
  Layers,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShieldAlert,
  Brain,
  SearchCheck,
  Cpu,
  BarChart3,
  ListChecks,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Types based on response structure
interface TavilyCompetitor {
  title: string;
  link: string;
  snippet: string;
}

interface CrawledSiteData {
  url: string;
  is_our_website: boolean;
  status_code: number;
  title: string;
  meta_description: string;
  h1: string[];
  h2: string[];
  h3: string[];
  h1_count: number;
  h2_count: number;
  h3_count: number;
  word_count: number;
  total_images: number;
  missing_alt_images: number;
  total_links: number;
  internal_links: number;
  external_links: number;
  canonical_url: string | null;
  error: string | null;
}

interface CompetitorAnalysisItem {
  title: string;
  meta_description: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  word_count: number;
  total_images: number;
  missing_alt_images: number;
  total_links: number;
  url: string;
}

interface OurWebsiteAnalysis {
  title: string;
  meta_description: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  word_count: number;
  total_images: number;
  missing_alt_images: number;
  total_links: number;
}

interface AiResponseData {
  summary: string;
  our_website_analysis: OurWebsiteAnalysis;
  competitor_analysis: CompetitorAnalysisItem[];
  gaps_and_opportunities: string[];
  actionable_recommendations: string[];
}

interface CompetitorResponse {
  keyword: string;
  website_url: string;
  tavily_competitors_data: TavilyCompetitor[];
  crawled_data: CrawledSiteData[];
  ai_response_data: AiResponseData;
  errors: any[];
}

// Sample fallback response provided in specification
const SAMPLE_DATA: CompetitorResponse = {
  keyword: "software jabalpur",
  website_url: "https://pageupsoft.com/",
  tavily_competitors_data: [
    {
      title: "Software Company|Software Development Company|Kreyon Systems|South Africa|UK|Jabalpur",
      link: "https://www.kreyonsystems.com",
      snippet: "Kreyon Systems is an IT company building software solutions using advanced analytics and data science. This is to increase clarity, focus and leverage information to help businesses succeed in their objectives. We use design thinking for improving data visualisation to uncover useful information from lots of data. Our software solutions are enabled with business intelligence and use self learning patterns. The advanced analytics helps clients to measure things in real time that matter the most. [...] Kreyon is a trusted software company with reputed clientele. Kreyon has completed projects like JICA Finance software for MPPTCL with funding of more than US$200Mln & managed assets of more than US$1Bln."
    },
    {
      title: "Professional and effective website Design,Software Development, custom WordPress website, e-commerce solutions as well as branding, social media marketing and graphic design for small to mid-size businesses. Website Design and Software Development Company India Company Software Development Website Devlopment Company in Jabalpur Software company in jabalpur website Design Jabalpur website Design Jabalpur website Design IN Jabalpur software company ",
      link: "http://shinesofttech.com",
      snippet: "Shine Software Technology - Website Designing company offers advanced Web Site Designing, Web Hosting, Web Development and Software Development, which enables your business to get access to the Internet Marketing Industry and Website Designing Industry. Get compatible Web Site design as well and search engine optimization for your online business with for your online business with Shine Software Technology.\n\n#### Technology [...] #### Technology\n\nOur Company has been worked with many commercial projects since seven year which is successfully uploaded and running on server"
    },
    {
      title: "InoCrypt Infosoft | Best Software Development Company in ...",
      link: "https://inocrypt.com",
      snippet: "Best software company in the jabalpur .Great place to work , Result oriented , Process Automation , Specialists in Software Development And Android App Development . this company provide complete IT solution.\n\n#### Ms. Sheela Pandey\n\nArmy Public School 2\n\nInquiry\n\n## Let’s Get in Touch\n\nSales Department  +91 7067781607\n\nHR Department  +91 9131519101\n\nSales Department  info@inocrypt.com\n\nConnect on whatsapp  Inocrypt Infosoft\n\nRead Our Customers Feedback\n\nreview  review  review"
    }
  ],
  crawled_data: [
    {
      url: "https://pageupsoft.com/",
      is_our_website: true,
      status_code: 200,
      title: "Best IT & Software Development Company | Custom Websites, Mobile Apps & Digital Marketing   | Pageup Software Services P",
      meta_description: "At Pageup software we specializes in creating innovative custom websites, mobile apps, and SaaS solutions. With expertise in UI/UX design, SEO, digital marketing, cloud-based IT services, and brand de",
      h1: [
        "EXCELLENCE",
        "Putting Clients First",
        "Innovation is Our Middle Name"
      ],
      h2: [
        "We deliver",
        "Tailored Tech Services for Your Needs",
        "Transform Your Brand Today",
        "Our Work Philosophy",
        "Looking for tailored-techsolutions to boost growth?"
      ],
      h3: [
        "Lets Collaborate & make good things together"
      ],
      h1_count: 8,
      h2_count: 7,
      h3_count: 1,
      word_count: 1019,
      total_images: 67,
      missing_alt_images: 64,
      total_links: 102,
      internal_links: 85,
      external_links: 17,
      canonical_url: "https://pageupsoft.com/",
      error: null
    },
    {
      url: "https://www.kreyonsystems.com",
      is_our_website: false,
      status_code: 200,
      title: "Software Company|Software Development Company|Kreyon Systems|South Africa|UK|Jabalpur",
      meta_description: "Kreyon Systems is a Design thinking Software Company providing Software Development for Business Process automation, Software Solutions like CRM, Supply Chain Management, Asset Management, Document Ma",
      h1: [
        "Software Development",
        "Software Company"
      ],
      h2: [
        "Design Thinking",
        "Mobile Applications",
        "Business Process Automation",
        "Software Products",
        "Big Data"
      ],
      h3: [
        "About Kreyon",
        "Services",
        "Industries"
      ],
      h1_count: 2,
      h2_count: 10,
      h3_count: 7,
      word_count: 2403,
      total_images: 29,
      missing_alt_images: 0,
      total_links: 168,
      internal_links: 165,
      external_links: 3,
      canonical_url: null,
      error: null
    },
    {
      url: "http://shinesofttech.com",
      is_our_website: false,
      status_code: 200,
      title: "Professional and effective website Design,Software Development,  custom WordPress website, e-commerce solutions as well ",
      meta_description: "Shine Software Technology - Website Designing company offers advanced Web Site Designing, Web Hosting, Web Development and Software Development, which enables your business to get access to the Intern",
      h1: [
        "Website Development Package",
        "Our Technology"
      ],
      h2: [
        "We provide Services",
        "BASIC PLAN",
        "PREMIUM PLAN",
        "ULTIMATE PLAN"
      ],
      h3: [
        "E-Commerce Website",
        "Software Development",
        "Website Design"
      ],
      h1_count: 2,
      h2_count: 4,
      h3_count: 10,
      word_count: 623,
      total_images: 135,
      missing_alt_images: 135,
      total_links: 54,
      internal_links: 35,
      external_links: 19,
      canonical_url: null,
      error: null
    },
    {
      url: "https://inocrypt.com",
      is_our_website: false,
      status_code: 200,
      title: "InoCrypt Infosoft | Best Software Development Company in Jabalpur | Top 10 software company in jabalpur",
      meta_description: "We provide Advance software solutions and Website , Android App Development, SEO,SMO, And Provide Training In website, android, laravel , MVC, Dot Net, ASP dot net",
      h1: [
        "Are you looking for",
        "Result BasedDigital Marketing Agency",
        "eCommerceDevelopment Company"
      ],
      h2: [
        "We Work WithGreat Companiesof All Sizes",
        "See What We CanDoforYou",
        "AwardWinning App & Web Development Company",
        "Technologieswe work with",
        "OurSelectedWork"
      ],
      h3: [
        "750+",
        "3500+",
        "20+"
      ],
      h1_count: 4,
      h2_count: 9,
      h3_count: 5,
      word_count: 1303,
      total_images: 89,
      missing_alt_images: 0,
      total_links: 257,
      internal_links: 224,
      external_links: 33,
      canonical_url: null,
      error: null
    }
  ],
  ai_response_data: {
    summary: "An analysis of our website, pageupsoft.com, against key competitors targeting 'software jabalpur' reveals several critical SEO vulnerabilities. While we perform moderately well in content word count compared to lower-tier competitors, we are significantly outperformed by top competitors like Kreyon Systems in content depth (2,403 words) and technical execution. Our main issues are the lack of local keyword targets ('Jabalpur') in metadata, an inflated and unstructured heading outline (8 H1 tags), an alarming rate of missing image alt texts (95.5%), and truncated meta tags. Addressing these gaps represents a massive opportunity to outrank local competition.",
    our_website_analysis: {
      title: "Best IT & Software Development Company | Custom Websites, Mobile Apps & Digital Marketing   | Pageup Software Services P",
      meta_description: "At Pageup software we specializes in creating innovative custom websites, mobile apps, and SaaS solutions. With expertise in UI/UX design, SEO, digital marketing, cloud-based IT services, and brand de",
      h1_count: 8,
      h2_count: 7,
      h3_count: 1,
      word_count: 1019,
      total_images: 67,
      missing_alt_images: 64,
      total_links: 102
    },
    competitor_analysis: [
      {
        title: "Software Company|Software Development Company|Kreyon Systems|South Africa|UK|Jabalpur",
        meta_description: "Kreyon Systems is a Design thinking Software Company providing Software Development for Business Process automation, Software Solutions like CRM, Supply Chain Management, Asset Management, Document Ma",
        h1_count: 2,
        h2_count: 10,
        h3_count: 7,
        word_count: 2403,
        total_images: 29,
        missing_alt_images: 0,
        total_links: 168,
        url: "https://www.kreyonsystems.com"
      },
      {
        title: "Professional and effective website Design,Software Development,  custom WordPress website, e-commerce solutions as well ",
        meta_description: "Shine Software Technology - Website Designing company offers advanced Web Site Designing, Web Hosting, Web Development and Software Development, which enables your business to get access to the Intern",
        h1_count: 2,
        h2_count: 4,
        h3_count: 10,
        word_count: 623,
        total_images: 135,
        missing_alt_images: 135,
        total_links: 54,
        url: "http://shinesofttech.com"
      },
      {
        title: "InoCrypt Infosoft | Best Software Development Company in Jabalpur | Top 10 software company in jabalpur",
        meta_description: "We provide Advance software solutions and Website , Android App Development, SEO,SMO, And Provide Training In website, android, laravel , MVC, Dot Net, ASP dot net",
        h1_count: 4,
        h2_count: 9,
        h3_count: 5,
        word_count: 1303,
        total_images: 89,
        missing_alt_images: 0,
        total_links: 257,
        url: "https://inocrypt.com"
      }
    ],
    gaps_and_opportunities: [
      "Missing Local Keyword Focus: Our title and meta description completely omit 'Jabalpur', whereas top competitors like Kreyon Systems and InoCrypt optimize heavily for this local modifier.",
      "Meta Tag Length and Grammar Issues: Our title tag (111 characters) and meta description (180 characters) exceed recommended length limits, leading to truncation in SERPs. The meta description also contains a grammatical error ('we specializes').",
      "Deficient Heading Hierarchy: Our website uses 8 H1 tags (the standard is 1) with highly generic copy ('EXCELLENCE', 'Putting Clients First'), whereas we only have 1 H3 tag, indicating a poorly optimized heading hierarchy.",
      "Critical Alt Text Gap: A staggering 95.5% of our website's images (64 out of 67) lack descriptive alt text, while primary competitors like Kreyon Systems and InoCrypt have fully optimized their images with 0 missing alt tags.",
      "Content Depth Deficit: Our website's word count of 1,019 lags significantly behind the top competitor Kreyon Systems, which leads the pack with 2,403 words.",
      "Link Structure Underperformance: Our total link count (102) is well below InoCrypt (257) and Kreyon Systems (168), indicating opportunities to strengthen internal linking and site architecture."
    ],
    actionable_recommendations: [
      "Rewrite the Meta Title to be under 60 characters while incorporating the target keyword and local modifier (e.g., 'Best Software Development Company in Jabalpur | Pageup Software').",
      "Optimize the Meta Description to be under 160 characters, fix the grammatical error ('we specializes' -> 'we specialize'), and include the target keyword 'software jabalpur'.",
      "Consolidate the H1 tags to exactly one (1) H1 per page that targets the main keyword (e.g., 'Innovative Software Development Solutions in Jabalpur'), resolving the current excessive count of 8 H1s.",
      "Add descriptive alt text to the 64 images that are currently missing alt tags (95.5% missing) to match the 100% optimized image profiles of Kreyon Systems and Inocrypt.",
      "Increase content depth from 1,019 words to over 2,500 words to match and exceed Kreyon Systems (2,403 words) by introducing high-value local tech case studies, client testimonials, and software service FAQs.",
      "Improve internal and external link architecture to increase the total links from 102 to 180+ to improve crawlability and match top-performing competitors like InoCrypt (257 links) and Kreyon Systems (168 links)."
    ]
  },
  errors: []
};

// SEO Tips for loading ticker
const LOADING_TIPS = [
  "Top SERP results average 2,000+ words of well-structured content for competitive keywords.",
  "Using a single descriptive H1 header per page strengthens search intent relevance.",
  "Missing image alt tags hurt screen reader accessibility and image search rankings.",
  "Local keyword modifiers like city names in Title tags dramatically increase CTR.",
  "Internal link depth allows search engine spiders to discover subpages faster.",
  "AI analysis extracts SERP patterns to highlight exact gaps holding back your rankings."
];

export default function CompetitorsPage() {
  const [keyword, setKeyword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CompetitorResponse | null>(null);

  // Loading animation state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "crawled" | "tavily" | "gaps" | "recommendations">("overview");

  // Interactivity state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [checkedRecs, setCheckedRecs] = useState<Record<number, boolean>>({});
  const [expandedCrawledIndex, setExpandedCrawledIndex] = useState<number | null>(0);

  // Timer for loading screen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let tipInterval: NodeJS.Timeout;

    if (isLoading) {
      setElapsedSeconds(0);
      setCompletedSteps([]);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Step progression based on estimated 60s
          if (next >= 5 && !completedSteps.includes(1)) {
            setCompletedSteps((s) => [...s, 1]);
          }
          if (next >= 22 && !completedSteps.includes(2)) {
            setCompletedSteps((s) => [...s, 2]);
          }
          if (next >= 42 && !completedSteps.includes(3)) {
            setCompletedSteps((s) => [...s, 3]);
          }
          return next;
        });
      }, 1000);

      tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 6000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, [isLoading]);

  const handlePreFillSample = () => {
    setKeyword("software jabalpur");
    setWebsiteUrl("https://pageupsoft.com/");
    toast.info("Pre-filled sample inputs!");
  };

  const handleLoadSampleResult = () => {
    setKeyword("software jabalpur");
    setWebsiteUrl("https://pageupsoft.com/");
    setResult(SAMPLE_DATA);
    toast.success("Loaded competitor audit sample data!");
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!websiteUrl) {
      toast.error("Please enter a valid Website URL.");
      return;
    }
    if (!keyword) {
      toast.error("Please enter a target keyword.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await api.post("/seo/competitors-ai", {
        keyword: keyword.trim(),
        website_url: websiteUrl.trim()
      });
      setResult(response.data);
      toast.success("Competitor comparison complete!");
    } catch (error: any) {
      console.error("Competitors AI API error:", error);
      toast.error("Live API took too long or failed. Loading full demonstration results.");
      setResult(SAMPLE_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied recommendation to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleCheckRec = (index: number) => {
    setCheckedRecs((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to extract clean domain string
  const getDomainName = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  // Find our site data and competitor max word count
  const ourSite = result?.crawled_data?.find((d) => d.is_our_website) || result?.crawled_data?.[0];
  const competitorsList = result?.crawled_data?.filter((d) => !d.is_our_website) || [];
  const topCompetitorWordCount = Math.max(...(competitorsList.map((c) => c.word_count) || [0]));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" /> AI Competitor Intelligence
            </span>
            {result && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Compare vs Competitor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyze your website against top SERP competitors targeting the same keyword with deep DOM crawling & AI synthesis.
          </p>
        </div>

        {/* Action button to load sample quickly */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreFillSample}
            className="text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Fill Sample Inputs
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadSampleResult}
            className="text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            Load Sample Audit
          </Button>
        </div>
      </div>

      {/* Input Search Form */}
      <Card className="border-border/60 shadow-lg shadow-primary/5 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Keyword input */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-primary" /> Target Keyword
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. software jabalpur"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-9 bg-background/80"
                    disabled={isLoading}
                  />
                  <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Website URL input */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" /> Your Website URL
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://pageupsoft.com/"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="pl-9 bg-background/80"
                    disabled={isLoading}
                  />
                  <Globe className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Submit button */}
              <div className="md:col-span-2 flex items-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scale className="mr-2 h-4 w-4" />
                      Compare
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Super Engaging Loading Screen (Takes approx 60s) */}
      {isLoading && (
        <Card className="border-primary/30 shadow-2xl bg-gradient-to-b from-card via-card/90 to-primary/5 overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-8">
            {/* Center Animated Glowing Pulse Radar */}
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center h-28 w-28">
                {/* Outer animated ripple rings */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                <div className="absolute -inset-4 rounded-full border border-primary/40 animate-spin opacity-40 border-t-transparent" />
                <div className="absolute -inset-8 rounded-full border border-primary/20 animate-pulse opacity-30" />

                {/* Inner core badge */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-600 text-white shadow-xl shadow-primary/30">
                  <Brain className="h-10 w-10 animate-bounce" />
                </div>
              </div>

              {/* Loading Title & Timer */}
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Running AI Competitor Benchmark Audit...
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Crawling real-time competitor websites, inspecting DOM structures, and computing SEO gap analysis.
                </p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-muted border text-xs font-mono font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  Elapsed: <span className="text-primary font-bold">{elapsedSeconds}s</span> / ~60s estimated
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xl space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Audit Progress</span>
                  <span>{Math.min(98, Math.floor((elapsedSeconds / 60) * 100))}%</span>
                </div>
                <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${Math.min(98, Math.floor((elapsedSeconds / 60) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Step Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
              {[
                {
                  step: 1,
                  icon: SearchCheck,
                  title: "SERP Competitors",
                  desc: "Querying Tavily AI for top keyword rankings",
                  isDone: completedSteps.includes(1),
                  isActive: elapsedSeconds < 22 && !completedSteps.includes(1)
                },
                {
                  step: 2,
                  icon: Cpu,
                  title: "DOM Web Crawler",
                  desc: "Scraping titles, H1-H3, word counts & alt tags",
                  isDone: completedSteps.includes(2),
                  isActive: elapsedSeconds >= 5 && elapsedSeconds < 42 && !completedSteps.includes(2)
                },
                {
                  step: 3,
                  icon: BarChart3,
                  title: "Metric Benchmark",
                  desc: "Quantifying content density & header gaps",
                  isDone: completedSteps.includes(3),
                  isActive: elapsedSeconds >= 22 && !completedSteps.includes(3)
                },
                {
                  step: 4,
                  icon: Sparkles,
                  title: "AI Synthesis",
                  desc: "Generating strategic competitor action plan",
                  isDone: false,
                  isActive: elapsedSeconds >= 42
                }
              ].map((s) => {
                const StepIcon = s.icon;
                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      s.isDone
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : s.isActive
                        ? "bg-primary/10 border-primary/40 text-primary shadow-sm"
                        : "bg-muted/30 border-border/40 opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StepIcon className="h-5 w-5" />
                      {s.isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : s.isActive ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <span className="text-xs font-mono opacity-60">Step {s.step}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold">{s.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Rotating SEO Tip Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">SEO Knowledge Ticker</span>
                  <p className="text-xs md:text-sm font-medium text-foreground mt-0.5">
                    {LOADING_TIPS[currentTipIndex]}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadSampleResult}
                className="shrink-0 text-xs text-muted-foreground hover:text-primary cursor-pointer"
              >
                Skip wait & view sample
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Quick Highlight Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Target Keyword */}
            <Card className="border-border/60 shadow-sm bg-card/60">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Keyword</p>
                  <h3 className="text-lg font-bold mt-1 text-foreground capitalize truncate max-w-[180px]">
                    {result.keyword}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5">SERP Intent Audited</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Search className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Stat 2: Word Count Comparison */}
            <Card className="border-border/60 shadow-sm bg-card/60">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Word Count</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-foreground">{ourSite?.word_count || 0}</span>
                    <span className="text-xs text-muted-foreground">vs Top {topCompetitorWordCount}</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-500 mt-0.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Gap: -{Math.max(0, topCompetitorWordCount - (ourSite?.word_count || 0))} words
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Stat 3: Heading Structure */}
            <Card className="border-border/60 shadow-sm bg-card/60">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">H1 Tag Count</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-foreground">{ourSite?.h1_count || 0} H1s</span>
                    <span className="text-xs text-muted-foreground">(Std: 1)</span>
                  </div>
                  <p className="text-xs font-semibold text-destructive mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Unstructured H1 outline
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <Heading className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Stat 4: Image Alt Text Deficit */}
            <Card className="border-border/60 shadow-sm bg-card/60">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Missing Alt Text</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-foreground">
                      {ourSite ? `${Math.round((ourSite.missing_alt_images / Math.max(1, ourSite.total_images)) * 100)}%` : '0%'}
                    </span>
                    <span className="text-xs text-muted-foreground">({ourSite?.missing_alt_images}/{ourSite?.total_images})</span>
                  </div>
                  <p className="text-xs font-semibold text-rose-500 mt-0.5 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Competitors: 0% missing
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Executive Summary Box */}
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">AI Executive Competitor Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                {result.ai_response_data?.summary}
              </p>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <div className="space-y-6">
            {/* Tab Nav Buttons */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
              {[
                { id: "overview", label: "Metrics Matrix", icon: Scale },
                { id: "gaps", label: `Gaps & Opportunities (${result.ai_response_data?.gaps_and_opportunities?.length || 0})`, icon: AlertTriangle },
                { id: "recommendations", label: `AI Recommendations (${result.ai_response_data?.actionable_recommendations?.length || 0})`, icon: ListChecks },
                { id: "crawled", label: `Crawled DOM Data (${result.crawled_data?.length || 0})`, icon: Layers },
                { id: "tavily", label: `SERP Competitors (${result.tavily_competitors_data?.length || 0})`, icon: Globe }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    }`}
                  >
                    <TabIcon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: METRICS MATRIX */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Head-to-Head Competitor Metrics Table</span>
                      <span className="text-xs font-normal text-muted-foreground">Comparing {result.crawled_data.length} audited sites</span>
                    </CardTitle>
                    <CardDescription>
                      Compare technical parameters, heading distribution, link authority, and image optimization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                          <th className="py-3.5 px-4">Website / Domain</th>
                          <th className="py-3.5 px-4">Word Count</th>
                          <th className="py-3.5 px-4">H1 Tags</th>
                          <th className="py-3.5 px-4">H2 Tags</th>
                          <th className="py-3.5 px-4">H3 Tags</th>
                          <th className="py-3.5 px-4">Missing Alt Images</th>
                          <th className="py-3.5 px-4">Total Links</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {result.crawled_data.map((site, i) => (
                          <tr
                            key={i}
                            className={`transition-colors hover:bg-muted/30 ${
                              site.is_our_website ? "bg-primary/5 font-medium" : ""
                            }`}
                          >
                            {/* Domain */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {site.is_our_website ? (
                                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md bg-primary text-primary-foreground">
                                    Your Site
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-muted text-muted-foreground">
                                    Competitor
                                  </span>
                                )}
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-foreground hover:text-primary font-semibold flex items-center gap-1 group"
                                >
                                  {getDomainName(site.url)}
                                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                </a>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[260px]">
                                {site.title}
                              </p>
                            </td>

                            {/* Word Count */}
                            <td className="py-4 px-4">
                              <span className={`font-mono font-semibold ${
                                site.word_count >= 2000 ? "text-emerald-500" : site.word_count < 800 ? "text-amber-500" : ""
                              }`}>
                                {site.word_count.toLocaleString()}
                              </span>
                            </td>

                            {/* H1 Count */}
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                                site.h1_count === 1
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : site.h1_count > 5
                                  ? "bg-destructive/10 text-destructive font-bold"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {site.h1_count} {site.h1_count > 5 ? "⚠️" : ""}
                              </span>
                            </td>

                            {/* H2 Count */}
                            <td className="py-4 px-4 font-mono font-medium text-muted-foreground">
                              {site.h2_count}
                            </td>

                            {/* H3 Count */}
                            <td className="py-4 px-4 font-mono font-medium text-muted-foreground">
                              {site.h3_count}
                            </td>

                            {/* Missing Alt Images */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className={`font-semibold ${
                                  site.missing_alt_images === 0
                                    ? "text-emerald-500"
                                    : site.missing_alt_images > 20
                                    ? "text-destructive font-bold"
                                    : "text-amber-500"
                                }`}>
                                  {site.missing_alt_images} / {site.total_images}
                                </span>
                                {site.total_images > 0 && (
                                  <span className="text-[11px] text-muted-foreground">
                                    ({Math.round((site.missing_alt_images / site.total_images) * 100)}%)
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Total Links */}
                            <td className="py-4 px-4 font-mono font-medium text-muted-foreground">
                              {site.total_links} ({site.internal_links} int / {site.external_links} ext)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Head-to-Head Visual Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.crawled_data.map((site, i) => (
                    <Card
                      key={i}
                      className={`border transition-all duration-200 ${
                        site.is_our_website
                          ? "border-primary/50 shadow-md ring-2 ring-primary/20 bg-card"
                          : "border-border/60 shadow-sm"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {site.is_our_website ? (
                              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-primary text-primary-foreground">
                                YOUR SITE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-muted text-muted-foreground">
                                Competitor #{i}
                              </span>
                            )}
                            <h3 className="font-bold text-base tracking-tight truncate max-w-[200px]">
                              {getDomainName(site.url)}
                            </h3>
                          </div>
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary flex items-center gap-1 hover:underline shrink-0"
                          >
                            Visit <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {site.title}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-2 text-xs">
                        {/* Meta description preview */}
                        <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Meta Description
                          </span>
                          <p className="text-xs text-foreground/80 mt-1 line-clamp-2">
                            {site.meta_description || "No meta description defined."}
                          </p>
                        </div>

                        {/* Metric grid pills */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                            <span className="text-[10px] text-muted-foreground uppercase">Word Count</span>
                            <p className="text-sm font-bold mt-0.5">{site.word_count}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                            <span className="text-[10px] text-muted-foreground uppercase">Headings (H1/H2/H3)</span>
                            <p className="text-sm font-bold mt-0.5">{site.h1_count} / {site.h2_count} / {site.h3_count}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                            <span className="text-[10px] text-muted-foreground uppercase">Missing Alt</span>
                            <p className={`text-sm font-bold mt-0.5 ${site.missing_alt_images > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {site.missing_alt_images} ({site.total_images})
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GAPS & OPPORTUNITIES */}
            {activeTab === "gaps" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold tracking-tight">AI Detected Competitive Gaps ({result.ai_response_data?.gaps_and_opportunities?.length || 0})</h3>
                  <span className="text-xs text-muted-foreground">High impact items holding back rankings</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {result.ai_response_data?.gaps_and_opportunities?.map((gap, idx) => (
                    <Card key={idx} className="border-l-4 border-l-amber-500 border-border/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Opportunity #{idx + 1}
                            </span>
                          </div>
                          <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                            {gap}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ACTIONABLE RECOMMENDATIONS */}
            {activeTab === "recommendations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">Actionable Optimization Checklist</h3>
                    <p className="text-xs text-muted-foreground">Step-by-step roadmap to outrank top SERP competitors</p>
                  </div>
                  <span className="text-xs font-mono text-primary font-semibold">
                    {Object.values(checkedRecs).filter(Boolean).length} / {result.ai_response_data?.actionable_recommendations?.length} Done
                  </span>
                </div>

                <div className="space-y-3">
                  {result.ai_response_data?.actionable_recommendations?.map((rec, idx) => {
                    const isChecked = !!checkedRecs[idx];
                    return (
                      <Card
                        key={idx}
                        className={`border transition-all duration-200 ${
                          isChecked ? "bg-emerald-500/5 border-emerald-500/30 opacity-75" : "border-border/60 shadow-sm"
                        }`}
                      >
                        <CardContent className="p-4 flex items-start gap-4">
                          {/* Checkbox button */}
                          <button
                            onClick={() => toggleCheckRec(idx)}
                            className={`h-6 w-6 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-border/80 hover:border-primary"
                            }`}
                          >
                            {isChecked && <Check className="h-4 w-4" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <p className={`text-sm md:text-base font-medium leading-relaxed ${
                              isChecked ? "line-through text-muted-foreground" : "text-foreground"
                            }`}>
                              {rec}
                            </p>
                          </div>

                          {/* Copy button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(rec, idx)}
                            className="text-xs text-muted-foreground hover:text-primary shrink-0 cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: CRAWLED DOM DATA */}
            {activeTab === "crawled" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold tracking-tight">Crawled Website DOM Breakdown</h3>
                  <span className="text-xs text-muted-foreground">Detailed HTML extracted structure</span>
                </div>

                <div className="space-y-4">
                  {result.crawled_data.map((site, i) => {
                    const isExpanded = expandedCrawledIndex === i;
                    return (
                      <Card key={i} className="border-border/60 shadow-sm overflow-hidden">
                        <CardHeader
                          className="p-4 bg-muted/20 cursor-pointer flex flex-row items-center justify-between"
                          onClick={() => setExpandedCrawledIndex(isExpanded ? null : i)}
                        >
                          <div className="flex items-center gap-3">
                            {site.is_our_website ? (
                              <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
                                YOUR SITE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
                                Competitor
                              </span>
                            )}
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{getDomainName(site.url)}</h4>
                              <p className="text-xs text-muted-foreground truncate max-w-[400px]">{site.url}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                              {site.word_count} words | {site.h1_count} H1s
                            </span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="p-6 space-y-6 text-sm border-t border-border/40">
                            {/* Title & Meta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Page Title Tag</span>
                                <p className="text-sm font-medium mt-1">{site.title || "N/A"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Meta Description</span>
                                <p className="text-sm font-medium mt-1">{site.meta_description || "N/A"}</p>
                              </div>
                            </div>

                            {/* Extracted Headings */}
                            <div className="space-y-3">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Extracted Heading Hierarchy (H1, H2, H3)
                              </h5>

                              {/* H1 Tags */}
                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-primary">H1 Tags ({site.h1_count})</span>
                                {site.h1 && site.h1.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {site.h1.map((h1Text, hIdx) => (
                                      <span key={hIdx} className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                        {h1Text}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">No H1 tags found.</p>
                                )}
                              </div>

                              {/* H2 Tags */}
                              <div className="space-y-1 pt-2">
                                <span className="text-xs font-semibold text-foreground">H2 Tags ({site.h2_count})</span>
                                {site.h2 && site.h2.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {site.h2.map((h2Text, hIdx) => (
                                      <span key={hIdx} className="px-2 py-0.5 rounded bg-muted text-foreground text-xs border border-border/40">
                                        {h2Text}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">No H2 tags found.</p>
                                )}
                              </div>

                              {/* H3 Tags */}
                              <div className="space-y-1 pt-2">
                                <span className="text-xs font-semibold text-muted-foreground">H3 Tags ({site.h3_count})</span>
                                {site.h3 && site.h3.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {site.h3.map((h3Text, hIdx) => (
                                      <span key={hIdx} className="px-2 py-0.5 rounded bg-muted/60 text-muted-foreground text-xs">
                                        {h3Text}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">No H3 tags found.</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: TAVILY SERP DATA */}
            {activeTab === "tavily" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold tracking-tight">Tavily AI SERP Search Competitors</h3>
                  <span className="text-xs text-muted-foreground">Top organic search results discovered</span>
                </div>

                <div className="space-y-4">
                  {result.tavily_competitors_data.map((comp, idx) => (
                    <Card key={idx} className="border-border/60 shadow-sm hover:border-primary/40 transition-colors">
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-muted-foreground">Result #{idx + 1}</span>
                          <a
                            href={comp.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                          >
                            {comp.link} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <h4 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                          <a href={comp.link} target="_blank" rel="noreferrer">
                            {comp.title}
                          </a>
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                          {comp.snippet}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
