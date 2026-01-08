import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Eye,
  X,
  Loader2,
  Clock,
  User,
  Phone,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessageInbox = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    }
  };

  const handleView = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Message deleted" });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold">Message Inbox</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "glass-button"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">No messages</p>
              <p className="text-muted-foreground">
                {filter === "unread" ? "No unread messages" : 
                 filter === "read" ? "No read messages" : 
                 "Your inbox is empty"}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleView(message)}
                className={`glass-card p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  !message.is_read ? "border-l-4 border-l-primary" : ""
                } ${selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {message.is_read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                      <span className={`font-medium truncate ${!message.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                        {message.name}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 truncate ${!message.is_read ? "font-semibold" : ""}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.message.substring(0, 80)}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(message.created_at), "MMM d, h:mm a")}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                      className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:sticky lg:top-6">
          {selectedMessage ? (
            <div className="glass-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-heading text-lg font-bold mb-1">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-muted rounded-lg lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${selectedMessage.phone}`} className="font-medium text-primary hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Message</span>
                </div>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 btn-primary-gradient py-3 text-center"
                >
                  Reply via Email
                </a>
                {selectedMessage.phone && (
                  <a 
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button py-3 px-6"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center hidden lg:block">
              <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">Select a message</p>
              <p className="text-muted-foreground">Click on a message to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInbox;
