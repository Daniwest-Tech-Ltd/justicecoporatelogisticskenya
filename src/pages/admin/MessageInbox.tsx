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
  Users,
  ShieldCheck,
  Zap,
  Activity
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
  
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

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
    if (!confirm("Are you sure you want to delete this communication node?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Node deleted from registry" });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replySubject || !replyMessage) {
      toast({ title: "Error", description: "All telemetry fields required", variant: "destructive" });
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
      toast({ title: "Success", description: `Transmission sent to ${selectedMessage.email}` });
      setShowReplyModal(false);
      setReplySubject("");
      setReplyMessage("");
    } catch (error) {
      toast({ title: "Error", description: "Transmission failure", variant: "destructive" });
    }
    setSendingReply(false);
  };

  const handleBroadcast = async () => {
    if (!broadcastSubject || !broadcastMessage) {
      toast({ title: "Error", description: "Subject and Message required", variant: "destructive" });
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
            data: { message: broadcastMessage },
          },
        });
        toast({ title: "Success", description: `Unicast transmission complete` });
      } else {
        const uniqueEmails = [...new Set(messages.map(m => m.email))];
        for (const email of uniqueEmails) {
          await supabase.functions.invoke("send-notification", {
            body: {
              to: email,
              subject: broadcastSubject,
              type: "general",
              data: { message: broadcastMessage },
            },
          });
        }
        toast({ title: "Broadcast Complete", description: `Sector-wide transmission successful` });
      }
      setShowBroadcastModal(false);
      setBroadcastSubject("");
      setBroadcastMessage("");
      setBroadcastRecipient("");
    } catch (error) {
      toast({ title: "Error", description: "Broadcast failure", variant: "destructive" });
    }
    setSendingBroadcast(false);
  };

  const openReplyModal = () => {
    if (!selectedMessage) return;
    setReplySubject(`SECURE RE: ${selectedMessage.subject.toUpperCase()}`);
    setReplyMessage(`\n\n---\nLOG ENTRY FROM ${selectedMessage.name.toUpperCase()}:\n${selectedMessage.message}`);
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
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Syncing Secure Comms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-sm">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Secure Communication Hub</h2>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Inbound Message Registry</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="btn-scan h-10 flex items-center gap-3 px-6"
          >
            <Send className="w-4 h-4" />
            Execute Broadcast
          </button>

          <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-sm gap-1">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? "bg-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-white text-black">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Messages Tactical List */}
        <div className="lg:col-span-5 space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="p-16 border border-dashed border-white/10 rounded-sm text-center">
              <Mail className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Registry Empty</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleView(message)}
                className={`p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-sm cursor-pointer transition-all hover:border-primary/30 relative overflow-hidden group ${
                  !message.is_read ? "border-l-primary border-l-2" : ""
                } ${selectedMessage?.id === message.id ? "border-primary/50 bg-white/[0.03]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 ${!message.is_read ? "text-primary" : "text-white/20"}`}>
                        {message.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest truncate ${!message.is_read ? "text-white" : "text-white/40"}`}>
                        {message.name}
                      </span>
                    </div>
                    <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 truncate ${!message.is_read ? "text-primary" : "text-white/60"}`}>
                      {message.subject}
                    </p>
                    <p className="text-[9px] font-mono text-white/20 truncate uppercase">
                      {message.message}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-white/20 uppercase whitespace-nowrap mb-3">{format(new Date(message.created_at), "HH:mm // MM.dd")}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                      className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Command View */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-8 border border-white/10 bg-black/60 backdrop-blur-xl rounded-sm relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-4">
                <Activity className="w-4 h-4 text-white/5" />
              </div>

              <div className="flex items-start justify-between mb-10 pb-6 border-b border-white/5">
                <div>
                  <span className="block text-[8px] font-mono text-primary mb-2 tracking-[0.3em]">SECURE INBOUND TRANSMISSION</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white leading-tight">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-white/30 uppercase mt-2 tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    REGISTERED: {format(new Date(selectedMessage.created_at), "yyyy.MM.dd // HH:mm:ss")}
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 text-white/20 hover:text-white lg:hidden"><X /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-2">Personnel</span>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-white">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="p-4 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-2">Communication Node</span>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-mono text-white/60">{selectedMessage.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm relative mb-8">
                <div className="absolute top-4 right-4 opacity-10"><MessageSquare className="w-12 h-12" /></div>
                <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20 mb-4">Message Decryption</span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  onClick={openReplyModal}
                  className="flex-1 btn-scan h-14 flex items-center justify-center gap-3"
                >
                  <Send className="w-4 h-4" />
                  Initialize Reply Transmission
                </button>
                {selectedMessage.phone && (
                  <a 
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-terminal h-14 flex items-center justify-center gap-3 px-8 hover:border-green-500/50 text-green-500"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Secure WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-20 border border-white/5 bg-black/20 backdrop-blur-sm rounded-sm text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 mb-8">
                <Eye className="w-10 h-10 text-white/10" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20">Select Transmission Node For Oversight</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Terminal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowReplyModal(false)} />
          <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-xl shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Registry Reply Matrix</h3>
              </div>
              <button onClick={() => setShowReplyModal(false)} className="p-2 text-white/30 hover:text-white"><X /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Target Node</label>
                <input type="email" value={selectedMessage.email} disabled className="audit-input w-full h-12 bg-white/5 border border-white/10 rounded-sm opacity-50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Transmission Subject</label>
                <input type="text" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Secure Message Content</label>
                <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={8} className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-white uppercase outline-none focus:border-primary/50 resize-none" />
              </div>
              <button onClick={handleReply} disabled={sendingReply} className="w-full btn-scan h-16 flex items-center justify-center gap-4 disabled:opacity-30">
                {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Execute Transmission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Terminal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBroadcastModal(false)} />
          <div className="relative bg-black border border-white/10 rounded-sm w-full max-w-xl shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Broadcast Command Interface</h3>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="p-2 text-white/30 hover:text-white"><X /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-sm">
                <button type="button" onClick={() => setBroadcastType("single")} className={`flex-1 h-12 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${broadcastType === "single" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}>Unicast</button>
                <button type="button" onClick={() => setBroadcastType("all")} className={`flex-1 h-12 text-[9px] font-black uppercase tracking-widest transition-all rounded-sm ${broadcastType === "all" ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}>Registry Broadcast</button>
              </div>

              {broadcastType === "single" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Recipient Node</label>
                  <input type="email" value={broadcastRecipient} onChange={(e) => setBroadcastRecipient(e.target.value)} placeholder="ENTER TARGET EMAIL" className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase outline-none focus:border-primary/50" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Broadcast Subject</label>
                <input type="text" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} placeholder="ENTER TRANSMISSION SUBJECT" className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-6 text-white uppercase outline-none focus:border-primary/50" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Mission Broadcast Message</label>
                <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows={8} placeholder="ENTER SECURE BROADCAST CONTENT..." className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm p-6 text-white uppercase outline-none focus:border-primary/50 resize-none" />
              </div>

              <button onClick={handleBroadcast} disabled={sendingBroadcast} className="w-full btn-scan h-16 flex items-center justify-center gap-4 disabled:opacity-30">
                {sendingBroadcast ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {broadcastType === "all" ? "Execute Registry-Wide Transmission" : "Execute Direct Transmission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInbox;
