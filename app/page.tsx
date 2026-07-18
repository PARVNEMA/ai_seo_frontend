import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle2, 
  LineChart, 
  Search, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  ArrowUpRight, 
  Users, 
  HelpCircle,
  History,
  FileSearch,
  MessageSquare
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
        {/* Decorative Grid and Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container px-4 md:px-6 relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Next-Gen Agentic SEO Optimization Platform</span>
            </div>

            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary">
                Outrank Competitors with <span className="text-primary">AI-Agentic</span> SEO Intelligence
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Stop relying on arbitrary scores. Our platform runs deep crawl simulations, parses your content against real-time search engine competitors, and returns production-ready semantic edits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-md font-semibold w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-md font-semibold w-full sm:w-auto hover:bg-muted/50">
                  Access Dashboard
                </Button>
              </Link>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-8 border-t w-full max-w-4xl mt-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">98.4%</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">Audit Accuracy</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">12M+</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">Pages Crawled</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">3.5x</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">Average Traffic Boost</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">&lt;60s</h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">Average Scan Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof Section */}
      <section className="w-full py-12 border-y bg-muted/30">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-8">
            Empowering modern marketing teams & creators globally
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70 grayscale contrast-200">
            <span className="font-bold text-xl md:text-2xl text-foreground/80 tracking-tight">SEO weekly</span>
            <span className="font-bold text-xl md:text-2xl text-foreground/80 tracking-tight">SERPMetrics</span>
            <span className="font-bold text-xl md:text-2xl text-foreground/80 tracking-tight">IndexLabs</span>
            <span className="font-bold text-xl md:text-2xl text-foreground/80 tracking-tight">FlowScale</span>
            <span className="font-bold text-xl md:text-2xl text-foreground/80 tracking-tight">RankGuard</span>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
              Actionable SEO Audits, Powered by AI
            </h2>
            <p className="max-w-[85%] text-muted-foreground text-md sm:text-lg">
              Traditional tools check lists. Our agentic pipeline reads the page, understands the competitive intent, and gives you actual code-level rewrites.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <FileSearch className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Single-Page Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Deeply scan on-page attributes, header hierarchies, word counts, and metadata. Instantly identify missing alt texts and broken links.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Actionable Suggestion Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Receive actual copy suggestions for page titles and meta descriptions with deep reasoning. Improve SEO intent matching instantly.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Live Crawler Sandbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Simulate search engine crawler requests in real-time. Verify indexability status, headers response, and crawl-budget safety metrics.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Competitor Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Compare your keyword density and semantic intent directly with live competitor search results. Find traffic-driving gaps instantly.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <History className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Audit History Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Monitor how your web page scores evolve. Re-run audits with a single click to track improvements and keyword rankings over time.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="space-y-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Trustworthy Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  Your data and audit history are secured with advanced JWT tokens. We never scrape behind authenticated paywalls without permission.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="w-full py-20 md:py-28 bg-muted/40 border-y">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
              Simple 3-Step Optimization
            </h2>
            <p className="max-w-[85%] text-muted-foreground text-md sm:text-lg">
              No complex integrations required. Input your URL and watch our agent analyze.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="text-xl font-bold">Input URL & Keyword</h3>
              <p className="text-sm text-muted-foreground">
                Enter any public page URL and the target keyword you want to rank for on search engine results pages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">
                2
              </div>
              <h3 className="text-xl font-bold">Agentic AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                Our agent analyzes page metadata, scans for technical errors, evaluates competitor keywords, and detects readability levels.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">
                3
              </div>
              <h3 className="text-xl font-bold">Implement Actions</h3>
              <p className="text-sm text-muted-foreground">
                Copy AI-rewritten titles and meta descriptions, resolve broken link paths, and watch your index visibility surge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Comparison Section */}
      <section className="w-full py-20 md:py-28 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">How We Compare</h2>
            <p className="text-muted-foreground mt-2">Why professional teams choose AI SEO Optimizer over traditional tools.</p>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="p-4 font-bold text-sm text-muted-foreground">Feature</th>
                  <th className="p-4 font-bold text-sm text-primary">AI SEO Optimizer</th>
                  <th className="p-4 font-bold text-sm text-muted-foreground">Traditional Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr>
                  <td className="p-4 font-medium">Actionable Title Rewrites</td>
                  <td className="p-4 text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Yes (AI-generated)</td>
                  <td className="p-4 text-muted-foreground">No (Only word limits)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Competitor Graph Analysis</td>
                  <td className="p-4 text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Yes (Live Scraping)</td>
                  <td className="p-4 text-muted-foreground">Slow / Requires upgrades</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Readability Score Feedback</td>
                  <td className="p-4 text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Yes (With suggestions)</td>
                  <td className="p-4 text-muted-foreground">Basic metrics only</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Live crawling simulations</td>
                  <td className="p-4 text-emerald-500 font-bold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Yes (Immediate)</td>
                  <td className="p-4 text-muted-foreground">Scheduled or manual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 md:py-28 bg-muted/20 border-t">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">Approved by SEO Professionals</h2>
            <p className="text-muted-foreground mt-2">Hear from webmasters and creators who have boosted their rankings.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card hover:-translate-y-1 transition-transform duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-6">
                  "Using AI SEO Optimizer, we boosted our product landing page organic traffic by 42% in just two weeks. The AI-suggested title replacements were spot on and directly aligned with Jabalpur search intent!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">John Doe</h4>
                    <p className="text-xs text-muted-foreground">Founder, TechSpace Ltd.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:-translate-y-1 transition-transform duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-6">
                  "The Live Crawler component is a game-changer. I can quickly mock index requests and detect broken alt texts or duplicate headers in seconds rather than waiting for Google Search Console to update."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    SM
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Sarah Miller</h4>
                    <p className="text-xs text-muted-foreground">Senior SEO Consultant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover:-translate-y-1 transition-transform duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-6">
                  "We audited 50+ client landing pages. Finding broken links and fixing technical keyword density was never this fast. The UI is simple, clean, and extremely fast."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    AR
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Alex Rivera</h4>
                    <p className="text-xs text-muted-foreground">Marketing Lead, GrowthLabs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="w-full py-20 md:py-28 bg-background border-t">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">Everything you need to know about our AI-driven SEO analyzer.</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 border rounded-2xl bg-card/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                How does the AI title suggestion logic work?
              </h3>
              <p className="text-muted-foreground text-sm mt-2 pl-7">
                Our agent parses the target keyword along with your competitor's SERP headers, evaluates the page readability, and generates a higher click-through title optimized for search intents.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-card/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                Is there any query limit during the sandbox trial?
              </h3>
              <p className="text-muted-foreground text-sm mt-2 pl-7">
                The free tier allows up to 10 live page crawls and deep SEO audits per day. High-velocity agencies can upgrade for unlimited crawls.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-card/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                Can it analyze localized keywords (e.g., specific cities)?
              </h3>
              <p className="text-muted-foreground text-sm mt-2 pl-7">
                Yes! You can specify any target keyword, including localized search tags (e.g. "best software company in jabalpur"), and the scraper will match competitor search lists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Dominate the SERPs?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 text-md md:text-lg">
            Create a free account today and scan your first webpage in under 60 seconds. Get clear suggestions instantly.
          </p>
          <div className="pt-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-md font-semibold bg-white text-primary hover:bg-neutral-100 shadow-xl transition-all">
                Start Auditing Now <ArrowUpRight className="ml-2 h-4.5 w-4.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
