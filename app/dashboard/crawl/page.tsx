"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Globe,
  CheckCircle,
  XCircle,
  Search,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  StopCircle,
  Play,
  PlayCircle,
  Clock,
  Compass,
  FileCheck
} from "lucide-react";

interface PageResult {
  url: string;
  title: string | null;
  meta_description: string | null;
  headers: Record<string, string[]>;
  total_images: number;
  missing_alt_images: number;
  total_links: number;
  broken_links: number;
}

export default function LiveCrawlerPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "running" | "completed" | "stopped" | "failed">("idle");
  const [results, setResults] = useState<PageResult[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      setStatus("failed");
      return;
    }

    // Use ws for localhost:8000 since api base is http://localhost:8000/api/v1
    const wsUrl = `ws://localhost:8000/api/v1/ws/crawls/${jobId}?token=${encodeURIComponent(token)}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("Connected to Crawler WebSocket");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);
        // Handle backend control/status messages
        if (data.status) {
          if (data.status === "stopped") {
            setStatus("stopped");
          } else if (data.status === "completed") {
            setStatus("completed");
          }
          return;
        }

        // Allow rendering if it's an SEO result (has title or metrics) even if url is missing
        if (!data.url && !data.title && typeof data.total_images === 'undefined') return;

        const entryUrl = data.url || "";

        // Prepend new results so the newest pages show at the top of the page continuously
        setResults((prev) => {
          // Avoid duplicate entries if the crawler revisits a page
          if (entryUrl && prev.some((p) => p.url === entryUrl)) return prev;
          if (!entryUrl && data.title && prev.some((p) => p.title === data.title)) return prev;
          return [{...data, url: entryUrl}, ...prev];
        });
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from Crawler WebSocket");
      setStatus((prev) => (prev === "stopped" ? "stopped" : "completed"));
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [jobId]);

  const startCrawl = async (type: "crawl" | "crawl-seo") => {
    if (!targetUrl) {
      toast.error("Please enter a valid URL to crawl.");
      return;
    }

    setStatus("starting");
    setResults([]);
    setJobId(null);

    try {
      const response = await api.post(`/crawler/${type}?target_url=${encodeURIComponent(targetUrl)}`);
      setJobId(response.data.job_id);
      setStatus("running");
      toast.success("Crawl job started successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("failed");
      toast.error("Failed to start crawl job. Check backend server.");
    }
  };

  const stopCrawl = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "stop" }));
      setStatus("stopped");
      toast.info("Crawl job stopped manually.");
    }
  };

  return (
    <div className="flex flex-col space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Live Web Crawler
          </h1>
          <p className="text-muted-foreground text-sm">
            Map out site navigation links or deploy crawl agents to compile technical SEO audits on all pages.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border bg-card text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Crawler Engine Enabled</span>
        </div>
      </div>

      {/* Crawl Form */}
      <Card className="border border-border/60 shadow-xl bg-card/65 backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Enter root domain or page to start crawl (e.g. https://mywebsite.com)"
                className="pl-11 py-6 text-md rounded-xl bg-background/50 border-muted focus-visible:ring-primary/20"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                disabled={status === "running" || status === "starting"}
                required
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              {status === "running" ? (
                <Button
                  variant="destructive"
                  onClick={stopCrawl}
                  size="lg"
                  className="h-auto py-3.5 px-6 text-md font-semibold rounded-xl flex-1 md:flex-none cursor-pointer"
                >
                  <StopCircle className="mr-2 h-4.5 w-4.5" />
                  <span>Stop Crawling</span>
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => startCrawl("crawl")}
                    size="lg"
                    variant="outline"
                    className="h-auto py-3.5 px-6 text-md font-semibold rounded-xl flex-1 md:flex-none hover:bg-muted/50 cursor-pointer"
                    disabled={status === "starting"}
                  >
                    <Compass className="mr-2 h-4.5 w-4.5 text-muted-foreground" />
                    <span>Crawl Map</span>
                  </Button>
                  <Button
                    onClick={() => startCrawl("crawl-seo")}
                    size="lg"
                    className="h-auto py-3.5 px-6 text-md font-semibold rounded-xl flex-1 md:flex-none bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10"
                    disabled={status === "starting"}
                  >
                    <Search className="mr-2 h-4.5 w-4.5" />
                    <span>Crawl + SEO</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {status !== "idle" && (
            <div className="mt-6 grid grid-cols-2 gap-4 p-5 bg-muted/30 rounded-xl border border-border/50">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Crawl Job Status</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {status === "running" && <span className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />}
                  {status === "completed" && <span className="h-3 w-3 bg-emerald-500 rounded-full" />}
                  {status === "stopped" && <span className="h-3 w-3 bg-amber-500 rounded-full" />}
                  {status === "failed" && <span className="h-3 w-3 bg-red-500 rounded-full" />}
                  <span className="font-extrabold capitalize text-md text-foreground/90">{status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pages Scanned</p>
                <p className="font-black text-2xl mt-1 text-foreground/90">{results.length}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crawled Pages Listings */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground/80 flex items-center gap-2 px-1">
            <FileCheck className="h-5 w-5 text-primary" /> Live Scanned Index
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {results.map((res, i) => (
              <Card key={i} className="flex flex-col border border-border/80 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md bg-card/60">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-md truncate text-foreground/90" title={res.title || "Untitled Page"}>
                    {res.title || "Untitled Page"}
                  </CardTitle>
                  <CardDescription className="truncate text-xs">
                    {res.url ? (
                      <a href={res.url} target="_blank" rel="noreferrer" className="hover:underline text-primary/80">
                        {res.url}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">URL unavailable</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                        <ImageIcon className="h-3 w-3" /> Images
                      </span>
                      <span className="font-bold text-md mt-0.5 text-foreground/90">{res.total_images}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                        <AlertTriangle className="h-3 w-3" /> Missing Alt
                      </span>
                      <span className={`font-bold text-md mt-0.5 ${res.missing_alt_images > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                        {res.missing_alt_images}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                        <LinkIcon className="h-3 w-3" /> Outbound links
                      </span>
                      <span className="font-bold text-md mt-0.5 text-foreground/90">{res.total_links}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                        <FileText className="h-3 w-3" /> Meta Tag
                      </span>
                      <span className="font-bold text-md mt-0.5 flex items-center gap-1 text-foreground/90">
                        {res.meta_description ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {res.meta_description ? "Configured" : "Missing"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
