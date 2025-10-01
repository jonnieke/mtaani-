import { Bot, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface AssistantMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
}

export default function AIAssistant() {
  //todo: remove mock functionality
  const [messages] = useState<AssistantMessage[]>([
    {
      id: "1",
      message: "Niaje fam! Mchambuzi Halisi niko hapa kukusort na latest football vibes. Ask me anything!",
      isBot: true,
      timestamp: "Just now",
    },
  ]);

  const [question, setQuestion] = useState("");

  const handleAsk = () => {
    if (question.trim()) {
      console.log("Ask AI:", question);
      setQuestion("");
    }
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
                  <div className="mt-1 text-xs opacity-70">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Mchambuzi anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              data-testid="input-ai-question"
            />
            <Button
              size="icon"
              onClick={handleAsk}
              className="bg-chart-2 hover:bg-chart-2/90"
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
