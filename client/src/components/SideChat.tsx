import { MessageCircle, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Message {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  isSelf?: boolean;
}

export default function SideChat() {
  //todo: remove mock functionality
  const [messages] = useState<Message[]>([
    {
      id: "1",
      user: "KipchogeFan",
      message: "Bruno ameanza kupiga sana leo!",
      timestamp: "2m ago",
      isSelf: false,
    },
    {
      id: "2",
      user: "You",
      message: "Salah is the GOAT, no debate! 🐐",
      timestamp: "1m ago",
      isSelf: true,
    },
    {
      id: "3",
      user: "NairobiBlues",
      message: "Chelsea wamelost form kabisa",
      timestamp: "Just now",
      isSelf: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log("Send message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Join the Side Chat</h2>
      </div>

      <Card className="flex h-[400px] flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.id}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.isSelf
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {!msg.isSelf && (
                    <div className="mb-1 text-xs font-semibold text-muted-foreground">
                      {msg.user}
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <div className="mt-1 text-xs opacity-70">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              data-testid="input-chat-message"
            />
            <Button
              size="icon"
              onClick={handleSend}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
