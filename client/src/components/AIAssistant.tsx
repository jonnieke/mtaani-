import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface AssistantMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "1",
      message: "Niaje fam! Mchambuzi Halisi niko hapa kukusort na football analysis, tactics, na player vibes! Ask me anything about teams, form, au strategies. (Psst: Check Today's Matches section below for live scores!)",
      isBot: true,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (question.trim()) {
      const userMessage: AssistantMessage = {
        id: Date.now().toString(),
        message: question.trim(),
        isBot: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setQuestion("");
      setIsLoading(true);

      try {
        // Build conversation history for context (exclude the welcome message)
        const conversationHistory = messages
          .slice(1) // Skip the initial welcome message
          .map(msg => ({
            role: msg.isBot ? 'model' as const : 'user' as const,
            content: msg.message
          }));

        const response = await apiRequest('POST', '/api/ai/chat', { 
          message: userMessage.message,
          conversationHistory 
        });
        const data = await response.json();
        
        const botMessage: AssistantMessage = {
          id: (Date.now() + 1).toString(),
          message: data.response,
          isBot: true,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('AI error:', error);
        const errorMessage: AssistantMessage = {
          id: (Date.now() + 1).toString(),
          message: "Eish! Something went wrong. Try asking me again, fam!",
          isBot: true,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-6 w-6 text-chart-2" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Mchambuzi Halisi</h2>
        <Badge className="bg-chart-2 text-white">AI Assistant</Badge>
      </div>

      <Card className="overflow-hidden border-2 border-chart-2/20">
        <div className="bg-gradient-to-r from-chart-2/10 to-chart-2/5 p-3">
          <p className="text-sm text-muted-foreground">
            Your AI football companion speaking Sheng + English
          </p>
          <p className="mt-2 text-xs text-muted-foreground" data-testid="text-live-scores-guidance">
            <strong>Need live scores?</strong> Check the "Today's Matches" section below for match results and fixtures
          </p>
        </div>

        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                data-testid={`ai-message-${msg.id}`}
              >
                {msg.isBot && (
                  <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-chart-2/20">
                    <Bot className="h-4 w-4 text-chart-2" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.isBot
                      ? "border-2 border-chart-2/30 bg-chart-2/10 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className={`text-sm ${msg.isBot ? "italic" : ""}`}>{msg.message}</p>
                  <div className="mt-1 text-xs opacity-70">{getTimestamp(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-chart-2/20">
                  <Bot className="h-4 w-4 text-chart-2 animate-pulse" />
                </div>
                <div className="rounded-lg border-2 border-chart-2/30 bg-chart-2/10 px-4 py-2">
                  <p className="text-sm italic">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Mchambuzi anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAsk()}
              disabled={isLoading}
              data-testid="input-ai-question"
            />
            <Button
              size="icon"
              onClick={handleAsk}
              className="bg-chart-2 hover:bg-chart-2/90"
              disabled={isLoading}
              data-testid="button-ask-ai"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
