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
  MessageSquare,
  Send,
  Users
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
  
  // Reply form
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Broadcast form
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastRecipient, setBroadcastRecipient] = useState("");
  const [broadcastType, setBroadcastType] = useState<"single" | "all">("single");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

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

  const handleReply = async () => {
    if (!selectedMessage || !replySubject || !replyMessage) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setSendingReply(true);

    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          to: selectedMessage.email,
          subject: replySubject,
          type: "general",
          data: {
            message: replyMessage,
            customerName: selectedMessage.name,
          },
        },
      });

      toast({ title: "Success", description: `Reply sent to ${selectedMessage.email}` });
      setShowReplyModal(false);
      setReplySubject("");
      setReplyMessage("");
    } catch (error) {
      console.error("Reply failed:", error);
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    }

    setSendingReply(false);
  };

  const handleBroadcast = async () => {
    if (!broadcastSubject || !broadcastMessage) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (broadcastType === "single" && !broadcastRecipient) {
      toast({ title: "Error", description: "Please enter recipient email", variant: "destructive" });
      return;
    }

    setSendingBroadcast(true);

    try {
      if (broadcastType === "single") {
        await supabase.functions.invoke("send-notification", {
          body: {
            to: broadcastRecipient,
            subject: broadcastSubject,
            type: "general",
            data: {
              message: broadcastMessage,
            },
          },
        });
        toast({ title: "Success", description: `Email sent to ${broadcastRecipient}` });
      } else {
        // Send to all unique emails from messages
        const uniqueEmails = [...new Set(messages.map(m => m.email))];
        let successCount = 0;

        for (const email of uniqueEmails) {
          try {
            await supabase.functions.invoke("send-notification", {
              body: {
                to: email,
                subject: broadcastSubject,
                type: "general",
                data: {
                  message: broadcastMessage,
                },
              },
            });
            successCount++;
          } catch (e) {
            console.error(`Failed to send to ${email}:`, e);
          }
        }

        toast({ 
          title: "Broadcast Complete", 
          description: `Sent to ${successCount} of ${uniqueEmails.length} recipients` 
        });
      }

      setShowBroadcastModal(false);
      setBroadcastSubject("");
      setBroadcastMessage("");
      setBroadcastRecipient("");
    } catch (error) {
      console.error("Broadcast failed:", error);
      toast({ title: "Error", description: "Failed to send broadcast", variant: "destructive" });
    }

    setSendingBroadcast(false);
  };

  const openReplyModal = () => {
    if (!selectedMessage) return;
    setReplySubject(`Re: ${selectedMessage.subject}`);
    setReplyMessage(`\n\n---\nOriginal message from ${selectedMessage.name}:\n${selectedMessage.message}`);
    setShowReplyModal(true);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold">Message Inbox</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="btn-primary-gradient px-4 py-2 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
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
                <button
                  onClick={openReplyModal}
                  className="flex-1 btn-primary-gradient py-3 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Reply via Email
                </button>
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

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowReplyModal(false)} />
          <div className="relative bg-card rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">Reply to {selectedMessage.name}</h3>
              <button onClick={() => setShowReplyModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">To</label>
                <input
                  type="email"
                  value={selectedMessage.email}
                  disabled
                  className="glass-input bg-muted/50"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Subject</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="glass-input bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Message</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="glass-input bg-background resize-none"
                />
              </div>

              <button
                onClick={handleReply}
                disabled={sendingReply}
                className="w-full btn-primary-gradient py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {sendingReply ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowBroadcastModal(false)} />
          <div className="relative bg-card rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">Send Email</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Recipient Type */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastType("single")}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                    broadcastType === "single"
                      ? "bg-primary text-primary-foreground"
                      : "glass-button"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Single User
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType("all")}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                    broadcastType === "all"
                      ? "bg-primary text-primary-foreground"
                      : "glass-button"
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  All Contacts ({[...new Set(messages.map(m => m.email))].length})
                </button>
              </div>

              {broadcastType === "single" && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={broadcastRecipient}
                    onChange={(e) => setBroadcastRecipient(e.target.value)}
                    placeholder="email@example.com"
                    className="glass-input bg-background"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Subject</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="glass-input bg-background"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">Message</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={6}
                  placeholder="Your message..."
                  className="glass-input bg-background resize-none"
                />
              </div>

              <button
                onClick={handleBroadcast}
                disabled={sendingBroadcast}
                className="w-full btn-primary-gradient py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingBroadcast ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {sendingBroadcast ? "Sending..." : broadcastType === "all" ? "Send to All" : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInbox;
