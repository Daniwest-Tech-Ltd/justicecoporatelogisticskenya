import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageCircle,
  Check,
  ChevronDown
} from "lucide-react";

const DL_CLASSES = [
  {
    category: "Category B: Light Motor Vehicles",
    classes: [
      { id: "B1", name: "Class B1 (Manual/Universal)", desc: "Standard light passenger cars, SUVs, and light pickups (up to 3,500 kg, 7 passengers). Min age: 18." },
      { id: "B2", name: "Class B2 (Automatic Only)", desc: "Light passenger cars restricted to automatic transmission only. Min age: 18." },
      { id: "B3", name: "Class B3 (Professional)", desc: "Professional/commercial light vehicles (taxis, ride-hailing). Min age: 21." },
    ]
  },
  {
    category: "Category C: Commercial and Heavy Trucks",
    classes: [
      { id: "C1", name: "Class C1", desc: "Light commercial trucks (3,500 kg to 7,500 kg). Min age: 22." },
      { id: "C", name: "Class C", desc: "Medium and heavy trucks/lorries (> 7,500 kg). Min age: 24." },
      { id: "CE", name: "Class CE", desc: "Heavy articulated commercial trucks with trailers. Min age: 28." },
      { id: "CD", name: "Class CD", desc: "Specialized transport (hazardous materials). Min age: 30." },
    ]
  },
  {
    category: "Category D: Passenger Service Vehicles (PSV)",
    classes: [
      { id: "D1", name: "Class D1", desc: "Light passenger vans/mini-cars (up to 14 passengers). Min age: 22." },
      { id: "D2", name: "Class D2", desc: "Medium passenger minibuses (14 to 32 passengers). Min age: 25." },
      { id: "D3", name: "Class D3", desc: "Large public service buses (33+ passengers). Min age: 30." },
    ]
  }
];

const CONTACT_METHODS = [
  { id: "email", label: "Email Node", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "call", label: "Direct Call", icon: Phone },
  { id: "sms", label: "SMS Protocol", icon: FileText },
];

const DriverApplication = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingID, setUploadingID] = useState(false);
  const [uploadingDL, setUploadingDL] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    license_number: "",
    years_experience: "1",
    location: "",
    bio: "",
    date_of_birth: "",
    preferred_contact: "email",
    id_card_url: "",
    dl_copy_url: "",
    availability_hours_start: "05:00",
    availability_hours_end: "17:00",
    work_duration_hours: "8",
    shift_preference: "day"
  });

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const toggleClass = (id: string) => {
    setSelectedClasses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'dl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'id') setUploadingID(true);
    else setUploadingDL(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${type}.${fileExt}`;

    // Note: Ensuring bucket 'driver-docs' exists in Supabase
    const { error: uploadError } = await supabase.storage
      .from('driver-docs')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload Failed", description: "Failed to transmit document to secure vault.", variant: "destructive" });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('driver-docs').getPublicUrl(fileName);
      if (type === 'id') setFormData({ ...formData, id_card_url: publicUrl });
      else setFormData({ ...formData, dl_copy_url: publicUrl });
      toast({ title: "Document Synchronized", description: `${type.toUpperCase()} verified and stored.` });
    }

    if (type === 'id') setUploadingID(false);
    else setUploadingDL(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_card_url || !formData.dl_copy_url) {
      toast({ title: "Documentation Missing", description: "Please upload your ID and Driving License to proceed.", variant: "destructive" });
      return;
    }
    if (selectedClasses.length === 0) {
      toast({ title: "Selection Required", description: "Please select at least one Driving License class.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("driver_applications")
      .insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          license_number: formData.license_number,
          years_experience: parseInt(formData.years_experience),
          location: formData.location,
          bio: formData.bio,
          date_of_birth: formData.date_of_birth,
          preferred_contact: formData.preferred_contact,
          id_card_url: formData.id_card_url,
          dl_copy_url: formData.dl_copy_url,
          dl_classes: selectedClasses,
          availability_hours_start: formData.availability_hours_start,
          availability_hours_end: formData.availability_hours_end,
          work_duration_hours: parseInt(formData.work_duration_hours),
          shift_preference: formData.shift_preference
        }
      ]);

    if (error) {
      toast({ title: "Transmission Error", description: "Failed to submit application. Link unstable.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Registry Updated", description: "Your credentials have been encrypted and stored." });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <main className="flex-1 relative flex items-center justify-center p-4">
          <div className="absolute inset-0 z-0">
            <img src="/rental.png" alt="Background" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
          </div>

          <div className="relative z-20 max-w-2xl w-full p-12 border border-white/10 bg-black/40 backdrop-blur-xl rounded-sm text-center space-y-8 animate-fade-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Personnel Registry Updated!</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 leading-relaxed">
              Your application has been successfully synchronized with the JCK Personnel Command.
              <br /><br />
              <span className="text-primary font-black">Current Status: PENDING APPROVAL</span>
              <br />
              Our tactical team will review your credentials and documentation.
              Please standby for communication regarding mission availability.
            </p>
            <button onClick={() => window.location.href = '/'} className="btn-scan w-full h-16 uppercase tracking-widest text-xs font-black">Return to Terminal</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-1 relative py-32 px-4">
        <div className="absolute inset-0 z-0">
          <img src="/rental.png" alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        </div>

        <div className="container mx-auto relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                <Zap className="w-4 h-4" />
                Fleet Personnel Recruitment
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                Are you a <span className="text-primary">Driver?</span>
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 max-w-2xl mx-auto leading-relaxed">
                Log your technical credentials, upload mandatory documentation, and standby for mission assignments within the JCK network.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>

              {/* SECTION 1: IDENTITY & COMMS */}
              <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">01 // Identity & Comms Protocol</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white uppercase text-[11px]" placeholder="NAME AS PER ID" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Date of Birth</label>
                    <input required type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none px-6 text-white text-[11px]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Phone Line (Verified)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input required type="tel" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white text-[11px]" placeholder="07XX XXX XXX" />
                    </div>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Email Node</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white text-[11px]" placeholder="SECURE@EMAIL.COM" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Base Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white uppercase text-[11px]" placeholder="CITY / TOWN" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Preferred Contact Strategy</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CONTACT_METHODS.map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({...formData, preferred_contact: method.id})}
                        className={`flex items-center gap-3 h-14 px-6 border rounded-sm transition-all ${
                          formData.preferred_contact === method.id
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        <method.icon className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: TECHNICAL CREDENTIALS */}
              <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">02 // Technical & Experience Registry</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Years of Operational Experience ({formData.years_experience} Years)</label>
                      <input
                        type="range" min="1" max="30" step="1"
                        value={formData.years_experience}
                        onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest">
                        <span>1 Year</span>
                        <span>30 Years</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Driving License ID Number</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <input required value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} className="audit-input w-full h-14 bg-white/[0.03] border border-white/10 rounded-sm outline-none pl-12 text-white uppercase text-[11px]" placeholder="DL XXXXXXXX" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Select Licensed Classes (Multi-Select)</label>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {DL_CLASSES.map((cat, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 border-l border-primary pl-2">{cat.category}</h4>
                          <div className="space-y-2">
                            {cat.classes.map(cls => (
                              <div
                                key={cls.id}
                                onClick={() => toggleClass(cls.id)}
                                className={`p-4 border rounded-sm cursor-pointer transition-all flex items-start gap-4 group ${
                                  selectedClasses.includes(cls.id) ? "bg-primary/10 border-primary" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                }`}
                              >
                                <div className={`w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center transition-all ${
                                  selectedClasses.includes(cls.id) ? "bg-primary border-primary" : "border-white/20"
                                }`}>
                                  {selectedClasses.includes(cls.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] font-black uppercase text-white mb-1 group-hover:text-primary transition-colors">{cls.name}</p>
                                  <p className="text-[8px] font-bold text-white/30 uppercase leading-relaxed">{cls.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MANDATORY DOCUMENTATION */}
              <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">03 // Mandatory Document Transmission</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">ID Card / Passport Copy (PDF/JPG/PNG)</label>
                    <div className="relative border border-dashed border-white/10 rounded-sm p-8 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                      {formData.id_card_url ? (
                        <div className="flex flex-col items-center gap-4">
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Identification Locked</span>
                          <button type="button" onClick={() => setFormData({...formData, id_card_url: ""})} className="text-[8px] font-bold uppercase text-red-500 hover:underline">Re-upload</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4">
                          {uploadingID ? <Loader2 className="w-12 h-12 text-primary animate-spin" /> : <Upload className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors" />}
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-white/60">Upload Secure Visual</p>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Maximum File Size: 10MB</p>
                          </div>
                          <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'id')} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Driving License Copy (PDF/JPG/PNG)</label>
                    <div className="relative border border-dashed border-white/10 rounded-sm p-8 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                      {formData.dl_copy_url ? (
                        <div className="flex flex-col items-center gap-4">
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/60">License Locked</span>
                          <button type="button" onClick={() => setFormData({...formData, dl_copy_url: ""})} className="text-[8px] font-bold uppercase text-red-500 hover:underline">Re-upload</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4">
                          {uploadingDL ? <Loader2 className="w-12 h-12 text-primary animate-spin" /> : <Upload className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors" />}
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-white/60">Upload Secure Visual</p>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Maximum File Size: 10MB</p>
                          </div>
                          <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'dl')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: BIO */}
              <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">04 // Professional Overview</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Brief Bio / Specialized Experience (Hazardous materials, VIP, etc.)</label>
                  <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="audit-input w-full bg-white/[0.03] border border-white/10 rounded-sm outline-none p-6 text-white uppercase text-[11px] resize-none" placeholder="TELL US ABOUT YOUR OPERATIONAL CAPABILITIES..." />
                </div>
              </div>

              {/* SECTION 5: AVAILABILITY */}
              <div className="p-10 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm space-y-10">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">05 // Operational Availability</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Daily Available Timeframe</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Start Time</label>
                        <input
                          type="time"
                          value={formData.availability_hours_start}
                          onChange={(e) => setFormData({...formData, availability_hours_start: e.target.value})}
                          className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-4 text-white text-[11px] outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">End Time</label>
                        <input
                          type="time"
                          value={formData.availability_hours_end}
                          onChange={(e) => setFormData({...formData, availability_hours_end: e.target.value})}
                          className="audit-input w-full h-12 bg-white/[0.03] border border-white/10 rounded-sm px-4 text-white text-[11px] outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Maximum Work Duration ({formData.work_duration_hours} Hours/Day)</label>
                      <input
                        type="range" min="1" max="10" step="1"
                        value={formData.work_duration_hours}
                        onChange={(e) => setFormData({...formData, work_duration_hours: e.target.value})}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest">
                        <span>1 Hour</span>
                        <span>10 Hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Shift Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['day', 'night', 'both'].map((shift) => (
                        <button
                          key={shift}
                          type="button"
                          onClick={() => setFormData({...formData, shift_preference: shift})}
                          className={`h-16 border rounded-sm transition-all flex flex-col items-center justify-center gap-1 group ${
                            formData.shift_preference === shift
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{shift}</span>
                          <span className="text-[7px] font-bold uppercase text-white/20 group-hover:text-white/40">Shift</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      <p className="text-[8px] font-bold uppercase text-white/20 leading-relaxed italic">
                        * Note: Selecting "Both" indicates you are available for flexible dispatch across 24-hour mission cycles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-primary/5 border border-primary/20 rounded-sm flex gap-5 items-start relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Application Verification Cycle</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                    By submitting, you certify that all information provided is accurate and all documents are genuine. Your profile will be vetted by JCK Command within 48-72 hours.
                  </p>
                </div>
              </div>

              <button type="submit" disabled={loading || uploadingDL || uploadingID} className="btn-scan w-full h-24 text-xl flex items-center justify-center gap-6 disabled:opacity-50">
                {loading ? <><Loader2 className="w-8 h-8 animate-spin" /> TRANSMITTING OPERATIONS...</> : <><ShieldCheck className="w-8 h-8" /> EXECUTE SUBMISSION</>}
              </button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DriverApplication;
