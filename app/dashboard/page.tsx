"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Globe,
  Search,
  Key,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Gauge,
  Target,
  Lightbulb,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from "lucide-react";

// The mock response to match the exact schema from the backend
const mockData = {
  url: "https://pageupsoft.com/",
  target_keyword: "best software company in jabalpur",
  technical: {
      missing_alt_images: 12,
      total_images: 67,
      broken_links: 3,
      total_links: 102,
      readability_score: 72.45,
      readability_feedback: "Fairly easy to read. Readable by standard high school students.",
      pagespeed_score: 88
  },
  on_page: {
      title: "Best IT & Software Development Company | Custom Websites, Mobile Apps & Digital Marketing | Pageup Software Services Pvt. Ltd.",
      meta_description: "At Pageup software we specializes in creating innovative custom websites, mobile apps, and SaaS solutions.",
      word_count: 1019,
      keyword_density: 1.8,
      title_suggestions: [
          {
              suggested_title: "Top Software Company in Jabalpur | Custom Software Solutions",
              reasoning: "The suggested title is more concise, matches search intent, and keeps the character count under 60."
          }
      ],
      meta_suggestions: [
          {
              suggested_meta_description: "Discover Pageup Software, the best software company in Jabalpur, offering top-tier custom websites, mobile apps, and digital marketing services.",
              reasoning: "This meta description directly embeds the target keyword organically at the beginning."
          }
      ]
  },
  content_gap: {
      intent: "Commercial / Informational",
      intent_reasoning: "The user is looking to evaluate and hire the best software company in Jabalpur, indicating research prior to transactional commitment."
  },
  errors: [],
  competitors: {}
};

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const payload: Record<string, string> = { url };
      if (keyword) payload.keyword = keyword;
      const response = await api.post("/seo/analyze-graph", payload);
      setResult(response.data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error(error);
      toast.error("API call failed. Showing sample analysis results for demonstration.");
      setResult(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallScore = (data: typeof mockData) => {
    if (!data) return 0;

    let score = 100;

    // Deduct for missing alt images
    if (data.technical?.total_images > 0) {
      const missingAltRatio = data.technical.missing_alt_images / data.technical.total_images;
      score -= (missingAltRatio * 15);
    }

    // Deduct for broken links
    if (data.technical?.total_links > 0) {
      const brokenLinksRatio = data.technical.broken_links / data.technical.total_links;
      score -= (brokenLinksRatio * 20);
    } else if (data.technical?.broken_links > 0) {
      score -= 15;
    }

    // Readability contribution
    const readability = data.technical?.readability_score || 50;
    score -= Math.abs(70 - readability) * 0.2; // optimal is 70

    // Check keyword density
    const density = data.on_page?.keyword_density || 0;
    if (density < 0.5) score -= 10;
    if (density > 3.0) score -= 10;

    return Math.max(Math.min(Math.round(score), 100), 20);
  };

  const dataToUse = result || null;
  const overallScore = dataToUse ? calculateOverallScore(dataToUse as any) : 0;

  return (
    <div className="flex flex-col space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            SEO Audit & Graph analysis
          </h1>
          <p className="text-muted-foreground text-sm">
            Deploy deep semantic audit agents to evaluate technical health and competitive search keyword gaps.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border bg-card text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Connected & Online</span>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border border-border/60 shadow-xl bg-card/65 backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <CardContent className="pt-8">
          <form onSubmit={handleAnalyze} className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-[2]">
              <Globe className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Enter URL to analyze (e.g. https://mywebsite.com)"
                className="pl-11 py-6 text-md rounded-xl bg-background/50 border-muted focus-visible:ring-primary/20"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="relative flex-1">
              <Key className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Target keyword (e.g. best coffee)"
                className="pl-11 py-6 text-md rounded-xl bg-background/50 border-muted focus-visible:ring-primary/20"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-auto py-3.5 px-8 text-md font-semibold rounded-xl bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer lg:w-auto w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2.5">
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-primary-foreground border-b-transparent"></div>
                  <span>Running Agents...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Analyze Page</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading Skeleton Simulation */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-24 bg-card rounded-2xl border" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-card rounded-2xl border" />
            <div className="h-64 bg-card rounded-2xl border" />
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {dataToUse && !isLoading && (
        <div className="flex flex-col space-y-8 animate-in fade-in-50 slide-in-from-bottom-6 duration-500">

          {/* Dashboard Summary Card */}
          <Card className="border border-border/80 shadow-md bg-card/40 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x">
              {/* Score Indicator */}
              <div className="p-6 flex flex-col items-center justify-center text-center space-y-2 bg-gradient-to-b from-primary/5 to-transparent">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall SEO Health</p>
                <div className="relative flex items-center justify-center h-28 w-28">
                  {/* Circular background */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="hsl(var(--muted))" fill="transparent" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      strokeWidth="8"
                      stroke={overallScore >= 80 ? "rgb(16, 185, 129)" : overallScore >= 50 ? "rgb(245, 158, 11)" : "rgb(239, 68, 68)"}
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 46}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - overallScore / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black">{overallScore}%</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {overallScore >= 80 ? "Optimal performance" : overallScore >= 50 ? "Improvements needed" : "Critical SEO warning"}
                </p>
              </div>

              {/* URL & Keywords */}
              <div className="p-6 flex flex-col justify-center space-y-4 lg:col-span-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold mb-1">
                    <Globe className="h-3 w-3" /> Target URL
                  </span>
                  <p className="font-bold text-md truncate text-foreground/90" title={dataToUse.url}>
                    {dataToUse.url}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-bold mb-1">
                      <Key className="h-3 w-3" /> Target Keyword
                    </span>
                    <p className="font-semibold text-sm truncate text-foreground/80" title={dataToUse.target_keyword}>
                      {dataToUse.target_keyword || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-bold mb-1">
                      <Target className="h-3 w-3" /> Search Intent
                    </span>
                    <p className="font-semibold text-sm text-foreground/80">
                      {dataToUse.content_gap?.intent || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Health Items */}
              <div className="p-6 flex flex-col justify-center space-y-3">
                <div className="flex justify-between items-center text-sm border-b pb-1.5">
                  <span className="text-muted-foreground font-medium">Broken Links:</span>
                  <span className={`font-bold ${dataToUse.technical?.broken_links > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                    {dataToUse.technical?.broken_links || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-1.5">
                  <span className="text-muted-foreground font-medium">Missing Alt Tags:</span>
                  <span className={`font-bold ${dataToUse.technical?.missing_alt_images > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                    {dataToUse.technical?.missing_alt_images || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Readability Score:</span>
                  <span className="font-bold text-foreground">
                    {Math.round(dataToUse.technical?.readability_score || 0)} / 100
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Metrics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Technical SEO Overview */}
            <Card className="shadow-sm border border-border/70 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <span>Technical Overview</span>
                  </CardTitle>
                  <CardDescription className="text-xs">HTML syntax, images, and crawl errors</CardDescription>
                </div>
                <span className="text-xs font-bold bg-muted px-2 py-1 rounded">Checked</span>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Images Alt Block */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Alt Text Health</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground">
                        {dataToUse.technical?.total_images - dataToUse.technical?.missing_alt_images}
                      </span>
                      <span className="text-xs text-muted-foreground">/ {dataToUse.technical?.total_images} optimized</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${((dataToUse.technical?.total_images - dataToUse.technical?.missing_alt_images) / (dataToUse.technical?.total_images || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Broken Links Block */}
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Links Health</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${dataToUse.technical?.broken_links > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                        {dataToUse.technical?.broken_links === 0 ? "100%" : `${Math.round(((dataToUse.technical?.total_links - dataToUse.technical?.broken_links) / (dataToUse.technical?.total_links || 1)) * 100)}%`}
                      </span>
                      <span className="text-xs text-muted-foreground">valid links</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${((dataToUse.technical?.total_links - dataToUse.technical?.broken_links) / (dataToUse.technical?.total_links || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Readability Score */}
                <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" /> Flesch Readability Index
                    </span>
                    <span className="text-sm font-black text-foreground">
                      {dataToUse.technical?.readability_score?.toFixed(1) || 0} / 100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(dataToUse.technical?.readability_score || 0, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic bg-card p-2.5 rounded-lg border border-border/50">
                    "{dataToUse.technical?.readability_feedback}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* On-Page Content SEO */}
            <Card className="shadow-sm border border-border/70 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>On-Page Analysis</span>
                  </CardTitle>
                  <CardDescription className="text-xs">HTML meta tags and keyword layout</CardDescription>
                </div>
                <span className="text-xs font-bold bg-muted px-2 py-1 rounded">Checked</span>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Page Title Tag</p>
                  <div className="p-3 bg-muted/40 rounded-lg text-sm border text-foreground/80 leading-relaxed font-mono truncate" title={dataToUse.on_page?.title}>
                    {dataToUse.on_page?.title || "No Title found"}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>Length: {dataToUse.on_page?.title?.length || 0} chars</span>
                    <span className={(dataToUse.on_page?.title?.length || 0) <= 60 ? "text-emerald-500 font-semibold" : "text-amber-500"}>
                      {(dataToUse.on_page?.title?.length || 0) <= 60 ? "Optimal (< 60)" : "Too long (recomm. < 60)"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meta Description</p>
                  <div className="p-3 bg-muted/40 rounded-lg text-sm border text-foreground/80 leading-relaxed italic" title={dataToUse.on_page?.meta_description}>
                    {dataToUse.on_page?.meta_description || "No Meta Description found"}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>Length: {dataToUse.on_page?.meta_description?.length || 0} chars</span>
                    <span className={(dataToUse.on_page?.meta_description?.length || 0) <= 160 ? "text-emerald-500 font-semibold" : "text-amber-500"}>
                      {(dataToUse.on_page?.meta_description?.length || 0) <= 160 ? "Optimal (< 160)" : "Too long (recomm. < 160)"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="p-3 bg-muted/30 rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground font-semibold">Total Word Count</p>
                    <p className="text-xl font-black text-foreground mt-1">{dataToUse.on_page?.word_count || 0}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground font-semibold">Keyword Density</p>
                    <p className="text-xl font-black text-foreground mt-1">{dataToUse.on_page?.keyword_density || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* AI Suggested Improvements */}
          <Card className="shadow-md border-2 border-primary/20 bg-gradient-to-r from-card to-primary/5">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-500 fill-yellow-500/20" />
                  <span>AI Suggestions (Recommended Edits)</span>
                </CardTitle>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Ready
                </span>
              </div>
              <CardDescription className="text-xs">
                Copy and paste these optimized tags directly into your HTML headers to improve SERP performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">

              {/* Title Suggestions */}
              {dataToUse.on_page?.title_suggestions?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4.5 w-4.5 text-primary" /> Optimized Title Suggestion
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
                    <div className="lg:col-span-2 p-4 rounded-xl border bg-muted/40 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-red-500 block mb-1 uppercase tracking-wider">Before (Current)</span>
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
                          {dataToUse.on_page?.title}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-2">Length: {dataToUse.on_page?.title?.length} characters</span>
                    </div>

                    <div className="hidden lg:flex items-center justify-center text-muted-foreground">
                      <ArrowRight className="h-6 w-6" />
                    </div>

                    <div className="lg:col-span-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 block mb-1 uppercase tracking-wider">After (AI-Suggested)</span>
                        <p className="text-sm text-foreground font-semibold font-mono leading-relaxed">
                          {dataToUse.on_page.title_suggestions[0].suggested_title}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-600 mt-2 font-semibold">Length: {dataToUse.on_page.title_suggestions[0].suggested_title.length} characters</span>
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 border rounded-lg text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">AI Reasoning: </strong> {dataToUse.on_page.title_suggestions[0].reasoning}
                  </div>
                </div>
              )}

              {/* Meta Suggestions */}
              {dataToUse.on_page?.meta_suggestions?.length > 0 && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4.5 w-4.5 text-primary" /> Optimized Meta Description
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
                    <div className="lg:col-span-2 p-4 rounded-xl border bg-muted/40 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-red-500 block mb-1 uppercase tracking-wider">Before (Current)</span>
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-3">
                          {dataToUse.on_page?.meta_description}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-2">Length: {dataToUse.on_page?.meta_description?.length} characters</span>
                    </div>

                    <div className="hidden lg:flex items-center justify-center text-muted-foreground">
                      <ArrowRight className="h-6 w-6" />
                    </div>

                    <div className="lg:col-span-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 block mb-1 uppercase tracking-wider">After (AI-Suggested)</span>
                        <p className="text-sm text-foreground font-semibold font-mono leading-relaxed">
                          {dataToUse.on_page.meta_suggestions[0].suggested_meta_description}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-600 mt-2 font-semibold">Length: {dataToUse.on_page.meta_suggestions[0].suggested_meta_description.length} characters</span>
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 border rounded-lg text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">AI Reasoning: </strong> {dataToUse.on_page.meta_suggestions[0].reasoning}
                  </div>
                </div>
              )}

              {/* Search Intent Reasoning */}
              {dataToUse.content_gap && (
                <div className="p-4 rounded-xl border bg-primary/5 space-y-2 pt-4 border-t">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-4 w-4" /> Keyword Search Intent Analysis
                  </h4>
                  <p className="text-sm font-semibold text-foreground/80">
                    Detected Intent: <span className="text-primary">{dataToUse.content_gap.intent}</span>
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {dataToUse.content_gap.intent_reasoning}
                  </p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Errors / Scraping Warnings */}
          {dataToUse.errors && dataToUse.errors.length > 0 && (
            <Card className="border-red-500/40 bg-red-500/5">
              <CardContent className="p-5 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-red-600 dark:text-red-400">Scraping Warnings / Errors</h4>
                  <ul className="list-disc pl-4 text-xs text-red-600/80 dark:text-red-400/80 space-y-1">
                    {dataToUse.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}
    </div>
  );
}
