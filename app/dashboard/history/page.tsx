"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileSearch, Globe, Calendar, ArrowRight, RefreshCcw, LayoutDashboard, AlertCircle, Database, MessageSquareText, Trash2, Loader2, AlertTriangle } from "lucide-react";

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
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [confirmDeleteJob, setConfirmDeleteJob] = useState<CrawlJob | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/crawler/jobs");

      // Assume the response is directly an array or inside a `data` key
      const fetchedJobs = Array.isArray(response.data) ? response.data : (response.data.jobs || []);
      setJobs(fetchedJobs);
      toast.success("Site list refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load indexed sites from backend. Showing demo data.");
      setJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    setDeletingJobId(jobId);
    try {
      await api.delete("/chat/", {
        data: { job_id: jobId }
      });
      setJobs((prev) => prev.filter((job) => (job.job_id || job.id) !== jobId));
      toast.success("Website data deleted successfully");
      setConfirmDeleteJob(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMsg = error?.response?.data?.detail || error?.response?.data?.message || "Failed to delete website data";
      toast.error(errorMsg);
    } finally {
      setDeletingJobId(null);
    }
  };

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
            Find in Website
          </h1>
          <p className="text-muted-foreground text-sm">
            Ask questions, search content, and conduct AI RAG conversations with your crawled websites.
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
          <CardTitle className="text-xl font-bold mb-2">No Indexed Websites</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
            You haven't crawled any websites yet. Launch a new crawl to generate RAG embeddings and start asking questions.
          </CardDescription>
          <Link href="/dashboard/crawl">
            <Button className="rounded-xl font-semibold cursor-pointer px-6">
              Crawl a Website
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

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize border ${
                        job.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        job.status === "failed" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                        job.status === "running" ? "bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse" :
                        "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      }`}>
                        {job.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDeleteJob(job)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete website data"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <Link href={`/dashboard/history/${jobId}`}>
                      <Button variant="ghost" className="group-hover:text-primary transition-colors gap-1.5 text-xs font-bold" size="sm">
                        <MessageSquareText className="h-3.5 w-3.5 text-primary" />
                        <span>Find & RAG Chat</span>
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

      {/* Delete Confirmation Modal */}
      {confirmDeleteJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Delete Crawled Website</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-foreground">{confirmDeleteJob.target_url}</span>? This will permanently remove all indexed pages and chat embeddings for this website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteJob(null)}
                disabled={deletingJobId !== null}
                className="rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const jobId = confirmDeleteJob.job_id || confirmDeleteJob.id;
                  if (jobId) handleDeleteJob(jobId);
                }}
                disabled={deletingJobId !== null}
                className="rounded-xl font-semibold cursor-pointer gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingJobId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

