"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { History, Globe, Calendar, ArrowRight, RefreshCcw, LayoutDashboard, AlertCircle, Database } from "lucide-react";

interface CrawlJob {
  job_id?: string;
  id?: string;
  target_url: string;
  status: "completed" | "failed" | "running" | "stopped";
  created_at: string;
  pages_crawled: number;
}

// Fallback data in case the API isn't fully implemented yet
const mockJobs: CrawlJob[] = [
  {
    job_id: "job-101",
    target_url: "https://pageupsoft.com",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    pages_crawled: 45
  },
  {
    job_id: "job-102",
    target_url: "https://example.com",
    status: "failed",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    pages_crawled: 2
  },
  {
    job_id: "job-103",
    target_url: "https://vercel.com",
    status: "completed",
    created_at: new Date().toISOString(),
    pages_crawled: 120
  }
];

export default function CrawlHistoryPage() {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/crawler/jobs");
      
      // Assume the response is directly an array or inside a `data` key
      const fetchedJobs = Array.isArray(response.data) ? response.data : (response.data.jobs || []);
      setJobs(fetchedJobs);
      toast.success("History refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load history from backend. Showing demo data.");
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Crawl History
          </h1>
          <p className="text-muted-foreground text-sm">
            Review past website crawls, their execution status, and audit summaries.
          </p>
        </div>
        <Button 
          onClick={fetchJobs} 
          variant="outline" 
          className="gap-2 rounded-xl py-5 hover:bg-muted/50 font-semibold cursor-pointer border border-border/80" 
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4.5 w-4.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl border">
              <CardContent className="h-40 bg-muted/20" />
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 border-dashed border-2 border-muted text-center max-w-md mx-auto rounded-3xl bg-card/40">
          <Database className="h-14 w-14 text-muted-foreground mb-4 opacity-40" />
          <CardTitle className="text-xl font-bold mb-2">No Crawl Records</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
            You haven't run any website crawler sessions yet. Start a new scan to track page optimizations.
          </CardDescription>
          <Link href="/dashboard/crawl">
            <Button className="rounded-xl font-semibold cursor-pointer px-6">
              Launch Crawler
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {jobs.map((job) => {
            const jobId = job.job_id || job.id;
            return (
              <Card key={jobId} className="border border-border/80 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col group bg-card/60 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/40">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 overflow-hidden flex-1">
                      <CardTitle className="flex items-center gap-2 text-md truncate font-bold text-foreground/90" title={job.target_url}>
                        <Globe className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                        <span className="truncate">{job.target_url}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(job.created_at)}</span>
                      </CardDescription>
                    </div>
                    
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize flex-shrink-0 border ${
                      job.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      job.status === "failed" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                      job.status === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse" :
                      "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pages Scanned</p>
                      <p className="font-extrabold text-lg mt-0.5 text-foreground/90">{job.pages_crawled || 0}</p>
                    </div>
                    <Link href={`/dashboard/history/${jobId}`}>
                      <Button variant="ghost" className="group-hover:text-primary transition-colors gap-1.5 text-xs font-bold" size="sm">
                        <span>Analyze Reports</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
