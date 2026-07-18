"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Bot, User, ArrowLeft, Loader2, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatWithWebsitePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am ready to answer any questions about the website you just scraped. What would you like to know?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userQuery };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const payload = {
        query: userQuery,
        job_id: jobId,
        match_count: 5,
        filter_metadata: {}
      };

      const response = await api.post("/chat/ask", payload);
      
      // Assuming response.data.answer or response.data contains the text string
      // Adjust this based on exactly what the backend returns
      const assistantText = response.data?.answer || response.data?.response || response.data || "I couldn't process the response properly.";
      
      const newAssistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof assistantText === 'string' ? assistantText : JSON.stringify(assistantText)
      };

      setMessages((prev) => [...prev, newAssistantMsg]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get response from AI");
      setMessages((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error while trying to fetch the answer. Please ensure the backend is running." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl hover:bg-muted border cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2 text-foreground/90">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Chat with Site Data</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Query semantic content scraped under Job ID: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border/80">{jobId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-2 px-1 space-y-6 scroll-smooth pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            
            {/* Avatar */}
            <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center shadow-sm border ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground border-primary/20" 
                : "bg-card border-border/85 text-primary"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4.5 w-4.5" />}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4.5 py-3 text-sm rounded-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm shadow-md" 
                  : "bg-card border border-border/80 shadow-sm rounded-tl-sm text-card-foreground leading-relaxed"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>

          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4.5 flex-row animate-in fade-in duration-300">
            <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center bg-card border shadow-sm text-primary">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col max-w-[80%] items-start">
              <div className="px-4.5 py-3 rounded-2xl bg-card border border-border/80 shadow-sm rounded-tl-sm text-card-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground animate-pulse font-medium">Analyzing document vectors...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t">
        <Card className="bg-card shadow-lg border border-border/60 overflow-hidden rounded-2xl">
          <CardContent className="p-1.5 flex gap-2">
            <form onSubmit={handleSend} className="flex w-full items-center gap-2">
              <div className="bg-muted p-2 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-4.5 w-4.5 text-muted-foreground ml-0.5" />
              </div>
              <Input
                placeholder="Ask about pages, links, headers, or alt text gaps..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10 rounded-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer shrink-0"
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
