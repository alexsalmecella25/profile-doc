"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecommendedCarousel } from "@/components/RecommendedCarousel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Settings,
  Menu,
  MoreVertical,
  FileText,
  Home,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  PenTool,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Key,
  LayoutDashboard,
  Hammer,
  SquareTerminal,
  ArrowRight,
  Copy,
  DollarSign,
  Moon,
  Sun,
  MessageSquare,
  Edit,
  Plus,
  X,
  ArrowLeftRight,
  Folder,
  Briefcase,
  MessageCircle,
  Lock,
  XCircle,
  PanelLeft,
  Star,
  Search,
  Clock,
  LayoutGrid,
  List,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
  Bell,
  Heart,
  Pencil,
  MoreHorizontal,
  Trash2,
  Share2,
  Calendar as CalendarIcon,
  Crown,
  Link,
  Check,
  Mail,
  CreditCard,
  Zap,
  CheckCircle,
  Download,
  MapPin,
  Info,
  Truck,
  User,
  CalendarPlus,
  Box,
  Monitor,
  ArrowUpDown,
  Eye
} from "lucide-react";

import { CaseDetailsSidebar } from "@/components/CaseDetailsSidebar";
import { CaseVisualizerView } from "@/components/CaseVisualizerView";
import { SpecialtiesCarousel } from "@/components/SpecialtiesCarousel";
import { Simple3DViewer } from "@/components/Simple3DViewer";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// ---------------------------------------------------------------------------
// Shared case data — single source of truth
// ---------------------------------------------------------------------------
type CaseItem = {
  id: string;
  clave: string;
  subClave: string;
  proyecto: string;
  subProyecto: string;
  date: string;
  dateObj: Date;
  avatars: { initials: string; name: string }[];
  status: string;
  subStatus: string;
  statusColor: string;
  estimatedDelivery: string;
  showEdit?: boolean;
  isLink?: boolean;
  isPidi?: boolean;
};

type CommentItem = {
  id: string;
  user: string;
  initials: string;
  color: string;
  text: string;
  time: string;
  type: 'general' | 'model';
  position?: [number, number, number];
  cameraState?: any;
  replies: {
    id: number;
    user: string;
    initials: string;
    color: string;
    text: string;
    time: string;
  }[];
};

// ---------------------------------------------------------------------------
// Shared view types
// ---------------------------------------------------------------------------
type CellaView = 'home' | 'cases' | 'projects' | 'docs' | 'billing' | 'visualizer' | 'discover' | 'project_detail' | 'blog' | 'settings' | 'article';

const CASES_DATA: CaseItem[] = [
  {
    id: '1', clave: 'ID224593', subClave: 'General', proyecto: 'Desmoplastic tumor',
    subProyecto: 'JER AN1309531635', date: '13 DEC 2025', dateObj: new Date(2025, 11, 13),
    estimatedDelivery: '18 DEC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }, { initials: 'CM', name: 'Claudio Martínez' }],
    status: 'Blocked', subStatus: 'Incomplete documentation', statusColor: 'bg-red-500', showEdit: true, isPidi: true,
  },
  {
    id: '2', clave: 'ID224594', subClave: 'Neurology', proyecto: 'Atypical meningioma',
    subProyecto: 'PTR AN1309531640', date: '12 DEC 2025', dateObj: new Date(2025, 11, 12),
    estimatedDelivery: '16 DEC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }],
    status: 'In progress', subStatus: 'Est. delivery 12/12/25', statusColor: 'bg-[#fbbc04]', isPidi: true,
  },
  {
    id: '3', clave: 'ID224580', subClave: 'Cardiology', proyecto: 'Valve revision',
    subProyecto: 'MNT AN1309531622', date: '10 DEC 2025', dateObj: new Date(2025, 11, 10),
    estimatedDelivery: '12 DEC 2025',
    avatars: [{ initials: 'CM', name: 'Claudio Martínez' }, { initials: 'DR', name: 'Daniela Ríos' }],
    status: 'Completed', subStatus: 'View model', statusColor: 'bg-ai-success', isLink: true,
  },
  {
    id: '4', clave: 'ID224582', subClave: 'Hepatobiliopancreatic', proyecto: 'Hepatic metastases',
    subProyecto: 'ALV AN1309531641', date: '09 DEC 2025', dateObj: new Date(2025, 11, 9),
    estimatedDelivery: '14 DEC 2025',
    avatars: [{ initials: 'AL', name: 'Antonio López' }, { initials: 'CM', name: 'Claudio Martínez' }],
    status: 'Pending', subStatus: 'Awaiting imaging', statusColor: 'bg-gray-300 dark:bg-[#e3e3e3]',
  },
  {
    id: '5', clave: 'ID224585', subClave: 'Oncology', proyecto: 'Pancreatic lesion',
    subProyecto: 'GRC AN1309531645', date: '08 DEC 2025', dateObj: new Date(2025, 11, 8),
    estimatedDelivery: '12 DEC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }, { initials: 'DR', name: 'Daniela Ríos' }],
    status: 'In progress', subStatus: 'Processing data', statusColor: 'bg-[#fbbc04]',
  },
];

type BillingItem = {
  id: string;
  invoiceNumber: string;
  caseId: string;
  caseTitle: string;
  caseSubtitle: string;
  amount: number;
  date: string;
  dateObj: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
};

const ARTICLES_DATA = [
  {
    id: 'cella-2-0',
    title: 'Cella Studio 2.0 Available',
    date: 'April 10, 2026',
    author: 'Cella Engineering Team',
    category: 'Product Update',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000',
    content: `
      <p>We are thrilled to announce the official release of Cella Studio 2.0. This update brings a massive leap in clinical visualization speed and accuracy, tailored specifically for surgical planning and patient education.</p>
      <h3>Sub-second Anatomical Segmentation</h3>
      <p>Our new AI core can now segment complex structures like vascular networks and parenchymal organs in less than a second. This reduces the time specialists spend on model preparation by up to 85%.</p>
      <h3>Enhanced Multi-user Collaboration</h3>
      <p>Teams can now work on the same case simultaneously. Real-time cursor presence and instant comment syncing ensure that every specialist is on the same page.</p>
      <p>Download the latest version today from your dashboard or contact your representative for a full walkthrough.</p>
    `
  },
  {
    id: 'auto-segmentation',
    title: 'New Auto-Segmentation AI',
    date: 'April 05, 2026',
    author: 'AI Research Lab',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=1000',
    content: `
      <p>Our research team has successfully integrated the latest generation of vascular mapping algorithms. This new auto-segmentation AI has been trained on over 500,000 diverse clinical scans.</p>
      <h3>99% Accuracy Milestone</h3>
      <p>In independent clinical validations, the system achieved a 99.2% Dice similarity coefficient on major vascular trunks. This level of precision is unprecedented in automated clinical tools.</p>
      <p>The system automatically detects calcifications and anatomical variations, flagging potential areas of interest for manual review by the clinician.</p>
    `
  },
  {
    id: 'dicom-export',
    title: 'Enhanced DICOM Export',
    date: 'March 28, 2026',
    author: 'Integrations Team',
    category: 'Technical',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
    content: `
      <p>Interoperability is at the core of Cella Studio. With the new Enhanced DICOM Export module, taking your 3D models into other clinical systems is now seamless.</p>
      <h3>Native Medical Formats</h3>
      <p>You can now export models directly into various formats including standard DICOM overlays, ensuring compatibility with PACS and advanced intraoperative navigation systems.</p>
    `
  }
];

const BILLING_DATA: BillingItem[] = [
  { 
    id: '1', invoiceNumber: 'INV-2025-001', date: '12 DEC 2025', 
    dateObj: new Date(2025, 11, 12), amount: 1250.00, status: 'Paid', 
    caseTitle: 'Valve revision', caseId: 'ID224580', caseSubtitle: 'MNT AN1309531622' 
  },
  { 
    id: '2', invoiceNumber: 'INV-2025-002', date: '01 DEC 2025', 
    dateObj: new Date(2025, 11, 1), amount: 850.00, status: 'Pending', 
    caseTitle: 'Desmoplastic tumor', caseId: 'ID224593', caseSubtitle: 'JER AN1309531635' 
  },
  { 
    id: '3', invoiceNumber: 'INV-2025-003', date: '28 NOV 2025', 
    dateObj: new Date(2025, 10, 28), amount: 2100.00, status: 'Paid', 
    caseTitle: 'Atypical meningioma', caseId: 'ID224594', caseSubtitle: 'PTR AN1309531640' 
  },
  { 
    id: '4', invoiceNumber: 'INV-2025-004', date: '15 NOV 2025', 
    dateObj: new Date(2025, 10, 15), amount: 450.00, status: 'Overdue', 
    caseTitle: 'Renal tumor', caseId: 'ID224578', caseSubtitle: 'REN AN1309531610' 
  },
];

function applyFilters(
  items: CaseItem[],
  search: string,
  filterBy: string,
  sortBy: string,
  dateRange?: DateRange | undefined
): CaseItem[] {
  let result = [...items];
  
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.clave.toLowerCase().includes(q) ||
      c.proyecto.toLowerCase().includes(q) ||
      c.subClave.toLowerCase().includes(q) ||
      c.subProyecto.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  }

  if (filterBy && filterBy !== 'All') {
    result = result.filter(c => c.status === filterBy);
  }

  if (dateRange?.from) {
    const from = dateRange.from;
    const to = dateRange.to;
    result = result.filter(c => {
      const itemDate = c.dateObj;
      if (to) {
        return itemDate >= from && itemDate <= to;
      }
      return itemDate.toDateString() === from.toDateString();
    });
  }

  switch (sortBy) {
    case 'Most recent': result.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()); break;
    case 'Least recent': result.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); break;
    case 'A-Z': result.sort((a, b) => a.proyecto.localeCompare(b.proyecto)); break;
    case 'Z-A': result.sort((a, b) => b.proyecto.localeCompare(a.proyecto)); break;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Gatekeeper Component — Password protection for the demo
// ---------------------------------------------------------------------------
function Gatekeeper({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CORRECT_PASSWORD = "C3ll4.2025%";

  useEffect(() => {
    const auth = sessionStorage.getItem('cella_authorized');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('cella_authorized', 'true');
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      // Subtle shake effect could be added here
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLoading || !mounted) return null;

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#0a0a0b] text-white font-sans overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--ai-accent)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        
        <div className="relative w-full max-w-[400px] px-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex flex-col items-center gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Sparkles className="text-white" size={32} />
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold tracking-tight">Cella Studio</h1>
                <p className="text-sm text-gray-400 mt-1">Clinical Visualization & Surgical Planning</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              <div className="relative group">
                <div className={`absolute inset-0 bg-white/5 rounded-xl border transition-all duration-300 ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 group-focus-within:border-blue-500/50 group-focus-within:bg-white/10'}`} />
                <div className="relative flex items-center h-14 px-4 gap-3">
                  <Lock size={18} className={error ? 'text-red-400' : 'text-gray-500 group-focus-within:text-[var(--ai-accent-hover)]'} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access code"
                    className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-gray-600"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    {error && <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Incorrect</span>}
                  </div>
                </div>
              </div>

              <Button
                className="h-14 rounded-[8px] bg-white text-black font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group border-none"
              >
                Access Portal
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="pt-4">
              <span className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-medium">Protected Preview Environment</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function CellaStudioDashboard() {
  return (
    <Gatekeeper>
      <CellaStudioDashboardContent />
    </Gatekeeper>
  );
}

function CellaStudioDashboardContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [leftNavOpen, setLeftNavOpen] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<string>('home');
  const [pointerMode, setPointerMode] = useState<'select' | 'hand' | 'rotate' | 'comments'>('rotate');
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; role: 'agent' | 'user'; text: string }[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);


  // SHARED COMMENTS STATE
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "1",
      user: "Claudio Martínez",
      initials: "CM",
      color: "bg-purple-600",
      text: "He revisado la segmentación del tumor y parece que falta incluir una pequeña porción del margen distal. ¿Podéis revisarlo?",
      time: "2h ago",
      type: 'general',
      replies: [
        {
          id: 2,
          user: "Laura Ruiz (Cella Specialist)",
          initials: "LR",
          color: "bg-[var(--ai-accent)]",
          text: "Entendido, Claudio. Lo revisamos ahora mismo con el equipo de radiología.",
          time: "1h ago"
        }
      ]
    },
    {
      id: "3",
      user: "Pedro García",
      initials: "PG",
      color: "bg-teal-600",
      text: "Check the clearance around the superior mesenteric artery on this specific view.",
      time: "45m ago",
      type: 'model',
      position: [2.5, 1.2, -0.5],
      replies: []
    }
  ]);

  // TOUR STATE
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('cella_tour_seen');
    if (!hasSeenTour) {
      setTimeout(() => setIsTourOpen(true), 1500);
    }
  }, []);

  const TOUR_STEPS = [
    {
      target: 'tour-topbar-actions',
      title: 'Strategic Tools',
      content: 'Manage your workload by creating new surgical cases or utilizing our advanced clinical search engine.',
      position: 'bottom'
    },
    {
      target: 'tour-action-center',
      title: 'Action Required',
      content: 'Key alerts and pending tasks that require your immediate intervention. High-priority items are flagged here.',
      position: 'bottom'
    },
    {
      target: 'tour-recent-cases',
      title: 'Active Protocols',
      content: 'Overview of your most recent case flow. Monitor real-time status and delivery estimations at a glance.',
      position: 'top'
    },
    {
      target: 'tour-support-chat',
      title: 'Intelligent AI Support',
      content: 'Access Cella\'s expert assistant for immediate guidance on clinical modeling or platform navigation.',
      position: 'left'
    }
  ];

  const handleAddComment = (text: string) => {
    const newComment: CommentItem = {
      id: Date.now().toString(),
      user: "Claudio Martínez",
      initials: "CM",
      color: "bg-purple-600",
      text,
      time: "Just now",
      type: 'general',
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleViewComment3D = (comment: CommentItem) => {
    if (comment.type === 'model') {
      setCurrentView('visualizer');
      setIsCommentsSidebarOpen(false);
      // Logic to focus camera would happen in CaseVisualizerView via props
    }
  };

  const handleNextTour = () => {
    if (currentTourStep < TOUR_STEPS.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      localStorage.setItem('cella_tour_seen', 'true');
      setIsTourOpen(false);
    }
  };

  const skipTour = () => {
    localStorage.setItem('cella_tour_seen', 'true');
    setIsTourOpen(false);
  };

  // Chat Simulation Logic
  useEffect(() => {
    if (chatSidebarOpen && chatMessages.length === 0) {
      setIsAgentTyping(true);
      const timer1 = setTimeout(() => {
        setIsAgentTyping(false);
        setChatMessages(prev => [...prev, { id: 'msg-1', role: 'agent', text: "Hi there! I'm Cella Support Bot, here to help you 👋" }]);

        setIsAgentTyping(true);
        const timer2 = setTimeout(() => {
          setIsAgentTyping(false);
          setChatMessages(prev => [...prev, { id: 'msg-2', role: 'agent', text: "I see you're currently browsing your workspace. How can I help you today?" }]);
        }, 2000);

        return () => clearTimeout(timer2);
      }, 1500);

      return () => clearTimeout(timer1);
    }
  }, [chatSidebarOpen, chatMessages.length]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAgentTyping]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newUserMsg = { id: `msg-${Date.now()}`, role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput("");

    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      setChatMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        text: "Thanks for reaching out! A specialist will review your request shortly."
      }]);
    }, 2500);
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [projectNames, setProjectNames] = useState<Record<string, string>>({
    "Team project": "Team project",
    "Guest Project": "Guest Project",
    "PIDI Projects": "PIDI Projects"
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 11, 31),
  });
  // Shared cases state
  const [cases, setCases] = useState<CaseItem[]>(CASES_DATA);
  const [homeSearch, setHomeSearch] = useState('');
  const [homeFilter, setHomeFilter] = useState('All');
  const [homeSort, setHomeSort] = useState('Most recent');
  const [docsSection, setDocsSection] = useState("Getting Started");

  // Invite modal state for Dashboard
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [homeDateRange, setHomeDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 11, 31),
  });

  const [selectedInvoice, setSelectedInvoice] = useState<BillingItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isContactSidebarOpen, setIsContactSidebarOpen] = useState(false);
  const [billingDateRange, setBillingDateRange] = useState<DateRange | undefined>({ from: new Date(2025, 10, 1), to: new Date(2025, 11, 31) });
  const [billingSearch, setBillingSearch] = useState("");
  const [billingFilter, setBillingFilter] = useState("All");
  const [billingSort, setBillingSort] = useState("Newest");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommentsSidebarOpen, setIsCommentsSidebarOpen] = useState(false);

  const handleViewModel = (caseData: any) => {
    setSelectedCase(caseData);
    setCurrentView('visualizer');
  };
  const [inviteEmail, setInviteEmail] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [collaborators, setCollaborators] = useState<{ initials: string; name: string; email: string; role: string; color: string }[]>([
    { initials: 'CM', name: 'Claudio Martínez', email: 'claudio@hospital.es', role: 'Owner', color: 'bg-purple-600' },
    { initials: 'LR', name: 'Laura Ruiz', email: 'laura@hospital.es', role: 'Editor', color: 'bg-[var(--ai-accent)]' },
    { initials: 'PG', name: 'Pedro García', email: 'pedro@hospital.es', role: 'Viewer', color: 'bg-teal-600' },
  ]);

  const handleInviteClick = () => {
    setIsInviteOpen(true);
  };

  // Toggle dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-ai-base text-ai-text font-sans overflow-hidden transition-colors duration-300">

      {/* VIRTUAL TOUR OVERLAY */}
      {isTourOpen && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <div className="relative w-full h-full">
             {/* Tour Card is rendered within the same portal scope */}
             <TourCard 
                step={TOUR_STEPS[currentTourStep]} 
                onNext={handleNextTour} 
                onSkip={skipTour} 
                current={currentTourStep + 1} 
                total={TOUR_STEPS.length} 
              />
          </div>
        </div>
      )}

      {/* MAIN APP CONTENT (Island when Chat is Open) */}

      {/* MAIN APP CONTENT (Island when Chat is Open) */}
      <div className={`flex transition-all duration-300 flex-1 overflow-hidden ${chatSidebarOpen ? "bg-white dark:bg-[#0f1112] my-3 ml-3 rounded-[8px] border border-solid border-ai-border" : "h-full bg-transparent"}`}>

        {/* If Visualizer, take full space */}
        {currentView === 'visualizer' ? (
          <CaseVisualizerView
            caseData={selectedCase}
            onBack={() => setCurrentView('cases')}
            isDark={isDark}
            setIsDark={setIsDark}
            pointerMode={pointerMode}
            setPointerMode={setPointerMode}
            onInviteClick={handleInviteClick}
            comments={comments}
            setComments={setComments}
          />
        ) : (
          <>
            {currentView === 'docs' ? (
              /* DOCS SIDEBAR — replaces main nav */
              <aside className={`flex flex-col border-r border-ai-border transition-all duration-300 pt-[20px] shrink-0 h-full ${leftNavOpen ? 'w-[240px]' : 'w-[68px]'}`}>
                {/* Header with back button */}
                <div className="flex items-center gap-2 h-[56px] px-4 mt-2 shrink-0">
                  <button
                    onClick={() => setCurrentView('home')}
                    className="flex items-center justify-center w-7 h-7 rounded-[8px] hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {leftNavOpen && <span className="text-[14px] font-semibold text-ai-text tracking-tight">Documentation</span>}
                </div>

                {/* Search */}
                {leftNavOpen && (
                  <div className="px-3 mt-2 mb-3">
                    <div className="flex items-center h-[32px] px-2.5 rounded-[7px] border border-ai-border bg-ai-surface gap-2 focus-within:ring-1 ring-ai-border">
                      <Search size={12} className="text-ai-text-tertiary shrink-0" />
                      <input id="docs-search" type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[12px] text-ai-text w-full placeholder:text-ai-text-tertiary" />
                    </div>
                  </div>
                )}

                {/* Nav sections */}
                <div className="flex flex-col gap-0.5 px-2 overflow-y-auto flex-1">
                  {["Getting Started", "API Reference", "Guides"].map(section => (
                    <button
                      key={section}
                      onClick={() => setDocsSection(section)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[8px] text-left transition-colors cursor-pointer ${docsSection === section
                        ? 'bg-ai-hover-1 text-ai-text'
                        : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'
                        }`}
                    >
                      {leftNavOpen
                        ? <span className="text-[13px] truncate">{section}</span>
                        : <span className="text-[11px] font-bold text-ai-text-tertiary">{section.charAt(0)}</span>
                      }
                    </button>
                  ))}
                </div>

                {/* Bottom user */}
                <div className="mt-auto mb-4 px-3 flex flex-col gap-1 w-full">
                  <div className={`flex items-center gap-3 px-3 py-2 mt-2 rounded-lg cursor-pointer hover:bg-ai-hover-1 transition-colors ${!leftNavOpen ? 'justify-center px-0' : ''}`}>
                    <Avatar className="w-[24px] h-[24px] rounded-full border border-ai-border bg-ai-surface">
                      <AvatarFallback className="bg-transparent text-ai-text text-[10px]">A</AvatarFallback>
                    </Avatar>
                    {leftNavOpen && <span className="text-[13px] text-ai-text truncate">alex@cellams.com</span>}
                  </div>
                </div>
              </aside>
            ) : (
              /* MAIN SIDEBAR */
              <aside
                className={`flex flex-col border-r border-ai-border transition-all duration-300 pt-[20px] shrink-0 h-full ${leftNavOpen ? 'w-[240px]' : 'w-[68px]'}`}
              >
                {/* Brand & Toggle */}
                <div className="flex items-center h-[56px] px-3 mt-2 shrink-0 justify-between">
                  {leftNavOpen ? (
                    <div className="flex items-center hover:bg-ai-hover-1 rounded-lg px-2 py-1.5 cursor-pointer flex-1 transition-colors">
                      <span className="font-medium text-[16px] text-ai-text">Cella Studio</span>
                      <ChevronDown size={16} className="text-ai-text-secondary ml-2" />
                    </div>
                  ) : (
                    <div className="flex items-center hover:bg-ai-hover-1 rounded-lg px-2 py-1.5 cursor-pointer flex-1 transition-colors justify-center">
                      <span className="font-bold text-[18px] text-ai-text">C</span>
                    </div>
                  )}
                </div>

                {/* Top Nav Items - Block 1 */}
                <div className="flex flex-col gap-[2px] px-3 mt-4 w-full">
                  <NavItem icon={<Home size={18} />} label="Home" expanded={leftNavOpen} active={currentView === 'home'} onClick={() => setCurrentView('home')} />
                  <NavItem icon={<Folder size={18} />} label="Cases" expanded={leftNavOpen} active={currentView === 'cases'} onClick={() => setCurrentView('cases')} />
                  <NavItem
                    icon={<Briefcase size={18} />}
                    label="Projects"
                    expanded={leftNavOpen}
                    active={currentView === 'projects'}
                    onClick={() => { setCurrentView('projects'); setIsProjectsExpanded(true); }}
                    rightIcon={leftNavOpen ? (
                      <div onClick={(e) => { e.stopPropagation(); setIsProjectsExpanded(!isProjectsExpanded); }} className="p-1 -mr-1 rounded-full hover:bg-ai-border/50 cursor-pointer">
                        <ChevronDown size={14} className={`transition-transform duration-200 text-ai-text-secondary ${isProjectsExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    ) : undefined}
                  />
                  {leftNavOpen && isProjectsExpanded && (
                    <div className="flex flex-col gap-[2px] ml-[21px] pl-3 py-1 border-l border-ai-border my-1 relative animate-in slide-in-from-top-2 fade-in duration-200">
                      <Button variant="ghost" onClick={() => { setActiveProject('Team project'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Team project' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Team project']}</Button>
                      <Button variant="ghost" onClick={() => { setActiveProject('Guest Project'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Guest Project' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Guest Project']}</Button>
                      <Button variant="ghost" onClick={() => { setActiveProject('PIDI Projects'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'PIDI Projects' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['PIDI Projects']}</Button>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="w-full h-4" />

                {/* Top Nav Items - Block 2 */}
                <div className="flex flex-col gap-[2px] px-3 w-full">
                  <NavItem icon={<SquareTerminal size={18} />} label="Discover" expanded={leftNavOpen} active={currentView === 'discover'} onClick={() => setCurrentView('discover')} />
                  <NavItem icon={<CreditCard size={18} />} label="Billing" expanded={leftNavOpen} active={currentView === 'billing'} onClick={() => setCurrentView('billing')} />
                  <NavItem icon={<FileText size={18} />} label="Documentation" expanded={leftNavOpen} active={currentView === 'docs'} onClick={() => setCurrentView('docs')} />
                </div>

                {/* Bottom Config Items */}
                <div className="mt-auto mb-4 px-3 flex flex-col gap-1 w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="w-full cursor-pointer">
                        <NavItem icon={<HelpCircle size={18} />} label="Feedback" expanded={leftNavOpen} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="end" sideOffset={16} className="w-[400px] p-4 rounded-[8px] border-ai-border bg-white dark:bg-[#131314]">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-3 w-full">
                          <p className="font-semibold text-ai-text text-[15px]">Your feedback is important to us</p>
                          <div className="bg-ai-base border border-ai-border flex items-start h-[100px] p-3 rounded-[8px] w-full focus-within:ring-1 focus-within:ring-[var(--ai-accent)] transition-shadow">
                            <textarea className="bg-transparent border-none outline-none resize-none flex-1 text-[13px] text-ai-text placeholder:text-ai-text-tertiary w-full h-full" placeholder="Write your feedback and opinions here..." />
                          </div>
                        </div>
                        <div className="flex justify-end w-full">
                          <Button className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white px-4 py-2 rounded-[8px] flex items-center gap-2 h-auto text-[14px]">Send <ArrowRight size={16} /></Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <NavItem icon={<Settings size={18} />} label="Settings" expanded={leftNavOpen} active={false} onClick={() => setIsSettingsOpen(true)} />
                  <div className={`flex items-center gap-3 px-3 py-2 mt-2 rounded-lg cursor-pointer hover:bg-ai-hover-1 transition-colors ${!leftNavOpen ? 'justify-center px-0' : ''}`}>
                    <Avatar className="w-[24px] h-[24px] rounded-full border border-ai-border bg-ai-surface">
                      <AvatarFallback className="bg-transparent text-ai-text text-[10px]">A</AvatarFallback>
                    </Avatar>
                    {leftNavOpen && <span className="text-[13px] text-ai-text truncate">alex@cellams.com</span>}
                  </div>
                </div>
              </aside>
            )}

            {/* CENTER CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">

              {/* TOPBAR */}
              <header className="h-[64px] w-full flex items-center justify-between px-6 shrink-0 border-b border-transparent">

                {/* Sidebar Toggle & Home */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-ai-hover-1 py-1.5 px-2 rounded-lg transition-colors group" onClick={() => setLeftNavOpen(!leftNavOpen)}>
                    <div className="flex items-center justify-center text-ai-text-secondary group-hover:text-ai-text transition-colors">
                      <PanelLeft size={20} />
                    </div>
                  </div>
                </div>

                <div id="tour-topbar-actions" className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <Button
                      id="tour-support-chat"
                      variant="outline"
                      onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                      className={`h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-4 gap-2 flex items-center shadow-none cursor-pointer transition-colors ${chatSidebarOpen ? "bg-ai-hover-1 border-ai-border-strong" : ""}`}
                    >
                      <span className="font-medium text-[14px]">Talk to Cella</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button className="h-[36px] bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] border-none shadow-none rounded-[8px] px-4 text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors">
                      <Plus size={16} />
                      Create new case
                    </Button>

                    {/* Notifications */}
                    <div className="flex items-center mt-1">
                      

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-[36px] w-[36px] rounded-[8px] text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text flex shrink-0 justify-center items-center border border-transparent relative">
                            <Bell size={20} strokeWidth={2} />
                            <div className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-red-500 border-2 border-ai-surface"></div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[320px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 space-y-1">
                          <div className="px-2 py-2 mb-1 border-b border-ai-border flex items-center justify-between">
                            <span className="font-semibold text-[14px] text-ai-text">Notifications</span>
                            <span className="text-[12px] text-[var(--ai-accent)] cursor-pointer hover:underline">Mark all as read</span>
                          </div>

                          <DropdownMenuItem className="focus:bg-transparent rounded-lg p-2.5 flex flex-col items-start gap-1 cursor-pointer">
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-[8px] h-[8px] rounded-full bg-red-500" />
                              <span className="font-medium text-[13px] text-ai-text">Action required</span>
                              <span className="text-[11px] text-ai-text-tertiary ml-auto">2h ago</span>
                            </div>
                            <p className="text-[12px] text-ai-text-secondary pl-4">Documentation missing for Desmoplastic tumor (ID224593)</p>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="focus:bg-transparent rounded-lg p-2.5 flex flex-col items-start gap-1 cursor-pointer">
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-[8px] h-[8px] rounded-full bg-ai-success" />
                              <span className="font-medium text-[13px] text-ai-text">Model Ready</span>
                              <span className="text-[11px] text-ai-text-tertiary ml-auto">5h ago</span>
                            </div>
                            <p className="text-[12px] text-ai-text-secondary pl-4">Valve revision (ID224580) is built and ready for review.</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                     

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[36px] w-[36px] rounded-[8px] text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text flex shrink-0 justify-center items-center border border-transparent"
                      onClick={() => setIsDark(!isDark)}
                    >
                      {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                  </div>
                </div>
              </header>

              <div className={`flex-1 w-full px-10 pb-16 overflow-y-auto ${chatSidebarOpen ? "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : ""}`}>

                {currentView === 'home' && (
                  <div className="animate-in fade-in duration-300">
                    {/* SIMPLE WELCOME HEADER */}
                    <div className="mb-6 mt-5">
                      <h1 className="text-[28px] font-medium text-ai-text">Welcome back, Alex</h1>
                      <p className="text-ai-text-secondary text-[14px] mt-1">You have 2 cases blocked that require your attention to proceed with production.</p>
                    </div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Lado izquierdo 66% */}
                      <div className="lg:col-span-2 flex flex-col">

                        {/* ACTION CENTER - Contained in single bordered div */}
                        <div id="tour-action-center" className="w-full bg-[#fef2f2]/60 dark:bg-[#450a0a]/10 border border-[#ef4444]/20 dark:border-[#ef4444]/20 rounded-[8px] overflow-hidden mb-8">
                          <div className="px-5 py-3 border-b border-[#ef4444]/10 bg-[#ef4444]/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                              <span className="text-[12px] font-bold text-[#991b1b] dark:text-[#fca5a5] uppercase tracking-wider">Action Required</span>
                            </div>
                            <span className="text-[11px] font-medium text-[#ef4444] bg-white dark:bg-[#ef4444]/20 px-2 py-0.5 rounded-full border border-[#ef4444]/10">2 Pending</span>
                          </div>
                          <div className="p-1">
                            <div className="flex items-center justify-between p-4 rounded-[12px] hover:bg-white/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444]">
                                  <XCircle size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Desmoplastic tumor (ID224593)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Missing documentation to proceed to production</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 text-ai-text font-normal text-[13px] opacity-80 group-hover:opacity-100 transition-opacity mr-2">
                                <span>Resolve</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-[12px] hover:bg-white/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444]">
                                  <RotateCcw size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Valve revision (ID224580)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Revision required by specialist</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 text-ai-text font-normal text-[13px] opacity-80 group-hover:opacity-100 transition-opacity mr-2">
                                <span>Resolve</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex flex-col">
                          <div className="w-full flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-medium text-ai-text shrink-0">
                              Recent Cases
                            </h2>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('cases')}>View all</span>
                          </div>

                          <div id="tour-recent-cases" className="border border-ai-border rounded-[8px] overflow-hidden w-full">
                            <Table className="w-full text-[13px] table-fixed">
                              <TableHeader>
                                <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
                                  <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Case</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Created</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[15%]">Delivery</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[12%]">Users</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[18%]">Status</TableHead>
                                  <TableHead className="text-right w-[15%] pr-4"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {applyFilters(cases, homeSearch, homeFilter, homeSort).length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center text-ai-text-tertiary text-[13px] py-8">No cases found</TableCell>
                                  </TableRow>
                                  ) : applyFilters(cases, homeSearch, homeFilter, homeSort).slice(0, 5).map(c => (
                                    <DataRow
                                      key={c.id}
                                      {...c}
                                      onViewModel={handleViewModel}
                                      onViewDetails={setSelectedCase}
                                      onDelete={() => setCases(prev => prev.filter(x => x.id !== c.id))}
                                      onCommentsClick={() => setIsCommentsSidebarOpen(true)}
                                    />
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {/* Lado derecho 33% */}
                      <div className="lg:col-span-1 flex flex-col gap-10">
                        <div className="flex flex-col">
                          <div className="border border-ai-border dark:border-white/10 bg-white dark:bg-[#131416] rounded-[8px] p-6 flex flex-row items-start gap-6 text-left relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                            {/* Background decoration */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10" />
                            
                            <div className="relative shrink-0">
                               <Avatar className="w-[96px] h-[96px] max-[1680px]:w-[72px] max-[1680px]:h-[72px] border-4 border-white dark:border-[#131416] group-hover:scale-105 transition-transform duration-300 z-10">
                                 <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" />
                                 <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[32px] max-[1680px]:text-[24px]">LG</AvatarFallback>
                               </Avatar>
                               <div className="absolute bottom-1 right-1 w-5 h-5 max-[1680px]:bottom-0 max-[1680px]:right-0 max-[1680px]:w-4 max-[1680px]:h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#131416] z-20" />
                            </div>
                            
                            <div className="flex flex-col gap-3 min-w-0 relative z-10 flex-1">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-ai-text font-bold text-[20px] max-[1680px]:text-[16px] leading-tight">Laura Gómez</span>
                                <span className="text-[#1a73e8] dark:text-[var(--ai-accent-hover)] font-semibold text-[13px] uppercase tracking-wider max-[1680px]:lowercase max-[1680px]:tracking-normal max-[1680px]:font-medium">CellaMS Sales Rep</span>
                              </div>

                              <div className="flex flex-col gap-2 w-full text-ai-text-secondary text-[13px]">
                                 <div 
                                    onClick={() => setIsContactSidebarOpen(true)}
                                    className="flex items-center gap-2 hover:text-[var(--ai-accent)] transition-colors cursor-pointer group/item"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-ai-border/50 group-hover/item:bg-blue-50 transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    </div>
                                    <span className="truncate underline font-medium">laura.g@cellams.com</span>
                                 </div>
                                 <div className="flex items-center gap-2 hover:text-ai-text transition-colors cursor-pointer group/item">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-ai-border/50 group-hover/item:bg-blue-50 transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    </div>
                                    <span>+34 91 123 45 67</span>
                                 </div>
                              </div>

                            </div>
                          </div>
                        </div>

                        {/* PRODUCTOS RECIENTES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[20px] font-medium text-ai-text">Recent Products</h3>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('discover')}>View all</span>
                          </div>
                          <div className="grid grid-cols-2 max-[1680px]:grid-cols-1 gap-3">
                            <div className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] rounded-[8px] p-4 flex flex-row items-center gap-4 cursor-pointer group hover:border-[var(--ai-accent)] transition-colors">
                              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[15px] border border-ai-border group-hover:border-[var(--ai-accent)] transition-colors shrink-0">C</div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-[var(--ai-accent)] transition-colors truncate">Ischemic colitis</span>
                                <span className="text-[11px] font-medium text-ai-text-tertiary">Colorectal</span>
                                <span className="text-[var(--ai-accent)] dark:text-[var(--ai-accent-hover)] text-[11px] font-bold mt-1">Request now →</span>
                              </div>
                            </div>
                            <div className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] rounded-[8px] p-4 flex flex-row items-center gap-4 cursor-pointer group hover:border-[var(--ai-accent)] transition-colors">
                              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[15px] border border-ai-border group-hover:border-[var(--ai-accent)] transition-colors shrink-0">G</div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-[var(--ai-accent)] transition-colors truncate">Desmoplastic tumor</span>
                                <span className="text-[11px] font-medium text-ai-text-tertiary">General Surgery</span>
                                <span className="text-[var(--ai-accent)] dark:text-[var(--ai-accent-hover)] text-[11px] font-bold mt-1">Request now →</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* NOVEDADES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[20px] font-medium text-ai-text">What's New</h3>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('blog')}>View all</span>
                          </div>
                          <div className="flex flex-col gap-2 border border-ai-border rounded-[8px] bg-white dark:bg-transparent p-6">
                            {ARTICLES_DATA.map((article, idx) => (
                              <div 
                                key={article.id}
                                onClick={() => { setSelectedArticle(article); setCurrentView('article'); }}
                                className="bg-transparent py-2 flex items-start gap-4 rounded-[8px] cursor-pointer transition-colors duration-200 group border border-transparent"
                              >
                                <div className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5">
                                  {idx === 0 ? <ImageIcon size={18} className="text-ai-text-secondary" /> : 
                                   idx === 1 ? <Sparkles size={18} className="text-ai-text-secondary" /> : 
                                   <Settings size={18} className="text-ai-text-secondary" />}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                  <span className="text-ai-text font-semibold text-[15px] group-hover:text-[var(--ai-accent)] dark:group-hover:text-[var(--ai-accent-hover)] transition-colors">{article.title}</span>
                                  <span className="text-ai-text-tertiary text-[12px] leading-relaxed line-clamp-2">{article.id === 'cella-2-0' ? 'Advanced clinical visual intelligence with sub-second anatomical segmentation.' : article.id === 'auto-segmentation' ? 'Map vascular structures automatically with 99% accuracy.' : 'Export directly to standard medical imaging formats natively.'}</span>
                                  <div className="mt-1">
                                    <span className="text-[var(--ai-accent)] dark:text-[var(--ai-accent-hover)] text-[12px] font-bold">Read more →</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                 {currentView === 'billing' && (
                   <BillingView
                     search={billingSearch}
                     setSearch={setBillingSearch}
                     onInvoiceSelect={setSelectedInvoice}
                     filterBy={billingFilter}
                     setFilterBy={setBillingFilter}
                     sortBy={billingSort}
                     setSortBy={setBillingSort}
                     dateRange={billingDateRange}
                     setDateRange={setBillingDateRange}
                   />
                 )}

                 {currentView === 'article' && selectedArticle && (
                    <ArticleView 
                      article={selectedArticle} 
                      onBack={() => setCurrentView('home')} 
                    />
                 )}

                 {currentView === 'projects' && (

                  <ProjectsView
                    projectNames={projectNames}
                    cases={cases}
                    onProjectClick={(projectKey) => { setActiveProject(projectKey); setCurrentView('project_detail'); }}
                    onTitleChange={(key, newTitle) => setProjectNames(prev => ({ ...prev, [key]: newTitle }))}
                    onShareClick={() => setIsInviteOpen(true)}
                  />
                )}

                {currentView === 'project_detail' && activeProject && (
                  <ProjectDetailView
                    projectTitle={projectNames[activeProject] || activeProject}
                    cases={cases}
                    onCaseSelect={setSelectedCase}
                    onTitleChange={(newTitle) => setProjectNames(prev => ({ ...prev, [activeProject]: newTitle }))}
                    onViewModel={handleViewModel}
                    onCommentsClick={() => setIsCommentsSidebarOpen(true)}
                    onBack={() => setCurrentView('projects')}
                  />
                )}

                {currentView === 'cases' && (
                  <CasesView onCaseSelect={setSelectedCase} onViewModel={handleViewModel} cases={cases} setCases={setCases} onCommentsClick={() => setIsCommentsSidebarOpen(true)} />
                )}

                {currentView === 'discover' && (
                  <DiscoverView onViewModel={handleViewModel} />
                )}

                {currentView === 'docs' && (
                  <DocsView activeSection={docsSection} setActiveSection={setDocsSection} />
                )}

                {currentView === 'blog' && (
                  <BlogView 
                    articles={ARTICLES_DATA} 
                    onBack={() => setCurrentView('home')} 
                    onSelectArticle={(article) => { setSelectedArticle(article); setCurrentView('blog'); }} 
                  />
                )}


              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT CHAT SIDEBAR (Collapsible) */}
      <aside
        className={`flex flex-col bg-transparent transition-all duration-300 shrink-0 h-full ${chatSidebarOpen ? "w-[380px]" : "w-0"
          } overflow-hidden`}
      >
        {chatSidebarOpen && (
          <div className="flex flex-col h-full w-[380px] shrink-0 animate-in fade-in duration-300">
            {/* Chat header */}
            <div className="flex items-center justify-between h-[64px] px-6 shrink-0 border-b border-ai-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-ai-border">
                  <AvatarFallback className="text-[10px] font-bold bg-blue-500 text-white leading-none flex items-center justify-center">CS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-ai-text leading-tight">Cella Support Team</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] text-ai-text-tertiary">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-ai-text-tertiary">
                <button className="p-2 hover:bg-ai-hover-1 hover:text-ai-text rounded-[8px] transition-colors cursor-pointer" title="Refresh">
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setChatSidebarOpen(false)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-[8px] transition-colors cursor-pointer group"
                >
                  <X size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatScrollRef} className="flex-1 flex flex-col p-6 overflow-y-auto w-full gap-4 scroll-smooth">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'agent' && (
                    <div className="w-[28px] h-[28px] rounded-full bg-blue-500 shrink-0 border border-ai-border flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-bold text-white">CS</span>
                    </div>
                  )}
                  <div className={`p-3 rounded-[8px] max-w-[85%] ${msg.role === 'user'
                    ? 'bg-[#1a73e8] dark:bg-[#a8c7fa] text-white dark:text-[#041e49] rounded-tr-[4px]'
                    : 'bg-ai-surface border border-ai-border text-ai-text rounded-tl-[4px]'
                    }`}>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isAgentTyping && (
                <div className="flex items-start gap-3 w-full">
                  <div className="w-[28px] h-[28px] rounded-full bg-blue-500 shrink-0 border border-ai-border flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-white">CS</span>
                  </div>
                  <div className="p-4 rounded-[8px] rounded-tl-[4px] bg-ai-surface border border-ai-border w-[60px] flex items-center justify-center gap-1.5 h-[40px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <div className="p-4 shrink-0 w-full">
              <div className="relative w-full rounded-[8px] bg-ai-hover-1 border border-ai-border p-3 flex flex-col min-h-[120px] focus-within:border-ai-border-strong transition-colors">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeyDown}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent border-none outline-none resize-none flex-1 text-[14px] text-ai-text placeholder:text-ai-text-tertiary"
                />
                <div className="flex justify-end mt-2">
                  <div
                    onClick={handleSendMessage}
                    className="w-[32px] h-[32px] rounded-[8px] bg-black dark:bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center justify-center gap-[2px]">
                      <div className="w-[2px] h-[8px] bg-white dark:bg-black rounded-full animate-pulse object-center" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-[2px] h-[12px] bg-white dark:bg-black rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-[2px] h-[8px] bg-white dark:bg-black rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>


      {
        currentView !== 'visualizer' && (
          <CaseDetailsSidebar
            open={!!selectedCase && currentView !== 'visualizer'}
            onOpenChange={(open) => !open && setSelectedCase(null)}
            caseData={selectedCase}
            onOpenVisualizer={() => setCurrentView('visualizer')}
          />
        )
      }

      <InvoiceDetailSidebar
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />

      <ContactSidebar 
        open={isContactSidebarOpen}
        onOpenChange={setIsContactSidebarOpen}
      />

      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <CommentsSidebar
        open={isCommentsSidebarOpen}
        onOpenChange={setIsCommentsSidebarOpen}
        comments={comments}
        onAddComment={handleAddComment}
        onViewIn3D={handleViewComment3D}
      />

      {/* Unified Share Modal (Dashboard Level - used for Projects) */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0 [&>button]:top-[23px]">
          {/* Header */}
          <div className="px-5 h-[64px] border-b border-ai-border flex items-center justify-between pr-12">
            <DialogTitle className="text-[16px] font-medium font-sans">Share</DialogTitle>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-2 py-1.5 rounded-[8px] transition-all ${linkCopied
                ? 'text-green-500 bg-green-500/5'
                : 'text-ai-text-secondary hover:text-ai-accent'
                }`}
            >
              <Link size={14} className={linkCopied ? 'text-green-500' : 'text-ai-text-tertiary'} />
              <span>{linkCopied ? 'Copied!' : 'Copy link'}</span>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 focus-within:ring-1 focus-within:ring-ai-text-secondary/40 transition-shadow">
                <input
                  type="email"
                  placeholder="Enter an email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
                />
              </div>
              <Button
                disabled={!inviteEmail.includes('@')}
                onClick={() => setInviteEmail('')}
                className="h-[40px] px-5 bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] disabled:opacity-40 text-white rounded-[8px] text-[13px] font-medium shrink-0"
              >
                Invite
              </Button>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-ai-border bg-ai-base cursor-pointer hover:bg-ai-hover-1 transition-colors">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span className="text-[13px] text-ai-text">Only invited people have access</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[12px] text-ai-text-tertiary uppercase tracking-wide font-medium">Current collaborators</p>
              <div className="flex items-center h-[36px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2">
                <Search size={14} className="text-ai-text-tertiary shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={inviteSearch}
                  onChange={e => setInviteSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
                />
              </div>

              <div className="flex flex-col">
                {collaborators
                  .filter(c => !inviteSearch || c.name.toLowerCase().includes(inviteSearch.toLowerCase()) || c.email.toLowerCase().includes(inviteSearch.toLowerCase()))
                  .map(collab => (
                    <div key={collab.email} className="flex items-center gap-3 py-2.5 border-b border-ai-border/50 last:border-0">
                      <div className={`w-8 h-8 rounded-full ${collab.color} flex items-center justify-center shrink-0`}>
                        <span className="text-[11px] font-medium text-white">{collab.initials}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[13px] text-ai-text font-medium truncate">{collab.name}</span>
                        <span className="text-[11px] text-ai-text-tertiary truncate">{collab.email}</span>
                      </div>
                      {collab.role === 'Owner' ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-[8px] font-medium shrink-0 bg-purple-500/10 text-purple-400">Owner</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-[8px] shrink-0 transition-colors hover:opacity-80 ${collab.role === 'Editor' ? 'bg-blue-500/10 text-[var(--ai-accent-hover)]' : 'bg-gray-500/10 text-gray-400'
                              }`}>
                              {collab.role}
                              <ChevronDown size={10} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-1">
                            {['Editor', 'Viewer', 'Remove'].map(role => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: role } : c))}
                                className={`cursor-pointer text-[13px] rounded-[6px] ${role === 'Remove' ? 'text-red-500 focus:text-red-500 focus:bg-red-500/10' : 'text-ai-text focus:bg-ai-hover-1'}`}
                              >
                                {role}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}

// Subcomponents

function NavItem({
  icon,
  label,
  expanded,
  rightIcon,
  active,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  rightIcon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`h-[36px] w-full flex items-center justify-between rounded-[8px] cursor-pointer transition-all ${!expanded ? "px-0 justify-center w-[36px] mx-auto" : "px-3"
        } ${active ? "text-[var(--ai-accent)] font-medium shadow-none bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20" : "hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text font-medium"} text-[14px]`}
      title={!expanded ? label : undefined}
    >
      <div className="flex items-center">
        <div className={`flex items-center justify-center shrink-0 ${expanded ? "mr-3" : ""} ${active ? "text-[var(--ai-accent)]" : "text-ai-text-secondary"}`}>
          {icon}
        </div>
        {expanded && <span>{label}</span>}
      </div>
      {expanded && rightIcon && (
        <div className={active ? "text-ai-text-secondary" : "text-ai-text-tertiary"}>
          {rightIcon}
        </div>
      )}
    </Button>
  );
}

function DataRow({
  clave,
  subClave,
  proyecto,
  subProyecto,
  date,
  avatars = [],
  status,
  subStatus,
  statusColor,
  estimatedDelivery,
  showEdit,
  isLink,
  disabled,
  isPidi,
  onViewDetails,
  onViewModel,
  onDelete,
  onCommentsClick
}: {
  clave?: string;
  subClave?: string;
  proyecto?: string;
  subProyecto?: string;
  date?: string;
  avatars?: { initials: string; name: string }[];
  status?: string;
  subStatus?: string;
  statusColor?: string;
  estimatedDelivery?: string;
  showEdit?: boolean;
  isLink?: boolean;
  disabled?: boolean;
  isPidi?: boolean;
  onViewDetails?: (caseData: any) => void;
  onViewModel?: (caseData: any) => void;
  onDelete?: () => void;
  onCommentsClick?: () => void;
}) {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveStep, setMoveStep] = useState<'select' | 'create'>('select');

  if (!clave) return null;
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSearch, setInviteSearch] = useState("");
  const [collaborators, setCollaborators] = useState<{ initials: string; name: string; email: string; role: string; color: string }[]>([
    { initials: 'CM', name: 'Claudio Martínez', email: 'claudio@hospital.es', role: 'Owner', color: 'bg-purple-600' },
    { initials: 'LR', name: 'Laura Ruiz', email: 'laura@hospital.es', role: 'Editor', color: 'bg-[var(--ai-accent)]' },
    { initials: 'PG', name: 'Pedro García', email: 'pedro@hospital.es', role: 'Viewer', color: 'bg-teal-600' },
  ]);

  const handleMoveClick = () => {
    setIsMoveOpen(true);
    setMoveStep('select');
  };


  const handleInviteClick = () => {
    setIsInviteOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TableRow className={`border-b border-ai-border hover:bg-gray-50/50 dark:hover:bg-white/[0.02] h-[60px] cursor-pointer transition-colors ${disabled ? "opacity-50" : ""}`}>
      <TableCell className="font-medium text-ai-text px-4">
        <div className="flex flex-col gap-1 items-start min-w-0">
          <span className="font-bold text-[15px] max-[1680px]:text-[13.5px] truncate w-full leading-tight uppercase tracking-tight">{subProyecto}</span>
          <div className="flex items-center gap-2 text-[11.5px] text-ai-text-secondary font-medium truncate w-full">
            <span className="text-ai-text-secondary/70 font-mono text-[10px] bg-ai-base px-1.5 py-0.5 rounded-[8px] border border-ai-border shrink-0">{clave}</span>
            {isPidi && (
              <span className="text-blue-500 font-bold text-[8.5px] px-1.5 py-0.5 rounded-[6px] border border-blue-500/20 uppercase tracking-[0.05em] shrink-0 bg-blue-500/5">PIDI</span>
            )}
            <span className="text-ai-text-secondary/80 truncate">{subClave}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-ai-text-secondary text-[13px] lowercase max-[1680px]:hidden">{date}</TableCell>
      <TableCell className="text-ai-text text-[13px] font-medium">
        {status === 'Completed' || status === 'In progress' ? (
          <div className="flex items-center gap-2">
            {status === 'Completed' ? (
              <Truck size={14} className="text-green-600 shrink-0" />
            ) : (
              <CalendarPlus size={14} className="text-amber-600 shrink-0" />
            )}
            <span className="shrink-0">{estimatedDelivery?.toLowerCase()}</span>
          </div>
        ) : (
          <span className="text-ai-text-tertiary">——</span>
        )}
      </TableCell>
      <TableCell className="px-4">
        <div className="flex -space-x-2">
          {avatars.slice(0, 2).map((avatar, i) => (
            <TooltipProvider key={i} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-[30px] h-[30px] rounded-full border-2 border-white dark:border-[#131416] bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-[11px] font-bold text-ai-text-secondary z-[20-i] cursor-pointer transition-transform hover:scale-110">
                    {avatar.initials}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-none text-[13px]">
                  <p>{avatar.name} {i === 0 ? "(Owner)" : ""}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {avatars.length > 2 && (
            <div className="w-[30px] h-[30px] rounded-full border-2 border-white dark:border-[#131416] bg-gray-100 dark:bg-[#282a2c] flex items-center justify-center text-[10px] text-ai-text-tertiary z-0">
              +{avatars.length - 2}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-[220px]">
        <div className="flex items-center min-w-0 w-full">
          <div
            onClick={(e) => {
              if (status === "Completed") {
                e.preventDefault();
                e.stopPropagation();
                onViewModel?.({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars });
              }
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-[8px] text-[12px] font-bold border w-fit transition-all ${
              status === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/15' :
              status === 'In progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
              status === 'Blocked' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
              'bg-gray-100 dark:bg-ai-base/50 text-ai-text-secondary border-ai-border'
            } ${status === "Completed" ? "cursor-pointer" : ""}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'Completed' ? 'bg-green-600' :
              status === 'In progress' ? 'bg-amber-600' :
              status === 'Blocked' ? 'bg-red-600' :
              'bg-gray-400'
            }`} />
            <span className="whitespace-nowrap flex items-center gap-1.5">
              {status === 'Completed' ? (
                <>
                  View model
                  <ExternalLink size={12} className="opacity-70" />
                </>
              ) : status}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 text-ai-text-tertiary">
          {showEdit && <Edit size={16} className="cursor-pointer hover:text-ai-text transition-colors mr-2" />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-[28px] w-[28px] text-ai-text-tertiary hover:text-ai-text hover:bg-ai-hover-1 rounded-[8px] cursor-pointer">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 space-y-1"
            >
              <DropdownMenuItem
                onClick={() => onViewDetails && onViewDetails({ clave, subClave, proyecto, subProyecto, status, subStatus, statusColor, avatars })}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <ExternalLink size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">View details</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                <ArrowLeftRight size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Compare</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                <FileText size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">View PDF model</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleMoveClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Folder size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Move</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onCommentsClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <MessageCircle size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Comments</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleInviteClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Share2 size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" strokeWidth={2.5} />
                <span className="font-medium text-[14px]">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
            <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[480px] p-0 rounded-[8px] overflow-hidden gap-0">
              {moveStep === 'select' ? (
                <>
                  <div className="p-5 pb-4 border-b border-ai-border flex flex-col gap-1">
                    <DialogTitle className="text-[16px] font-medium font-sans">Move {clave}</DialogTitle>
                    <p className="text-[14px] text-ai-text-secondary">Select a project to move this case to.</p>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto flex flex-col gap-1">
                    {['Guest Project', 'Team project', 'General - Hepatobiliopancreática'].map(proj => (
                      <div key={proj} onClick={() => setSelectedProject(proj)} className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${selectedProject === proj ? 'bg-blue-500/10 border border-blue-500/50' : 'hover:bg-ai-hover-1 border border-transparent'}`}>
                        <div className="flex items-center gap-3">
                          <Folder size={18} className={selectedProject === proj ? 'text-[var(--ai-accent)]' : 'text-ai-text-secondary'} />
                          <span className={`text-[14px] ${selectedProject === proj ? 'text-[var(--ai-accent)] font-medium' : 'text-ai-text'}`}>{proj}</span>
                        </div>
                        {selectedProject === proj && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-ai-border flex justify-between items-center bg-black/10 dark:bg-black/20">
                    <Button variant="ghost" onClick={() => setMoveStep('create')} className="text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] hover:bg-blue-500/10 px-3 h-[36px]">
                      + New folder
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="text-ai-text-secondary hover:text-ai-text h-[36px]">Cancel</Button>
                      <Button disabled={!selectedProject} onClick={() => setIsMoveOpen(false)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white rounded-[8px] px-6 h-[36px]">Move</Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 pb-4 border-b border-ai-border flex items-center gap-3 w-full">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-[8px] shrink-0" onClick={() => setMoveStep('select')}>
                      <ArrowLeft size={16} className="text-ai-text-secondary" />
                    </Button>
                    <DialogTitle className="text-[16px] font-medium font-sans truncate pr-4">Move {clave}</DialogTitle>
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <p className="text-[13px] text-ai-text-secondary">Escriba un nombre para la carpeta</p>
                    <input
                      autoFocus
                      placeholder="Folder name"
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-ai-border bg-transparent px-3 py-2 text-[14px] text-ai-text placeholder:text-ai-text-tertiary focus:outline-none focus:ring-1 focus:ring-ai-text-secondary transition-shadow"
                    />
                  </div>
                  <div className="p-4 border-t border-ai-border flex justify-end gap-2 bg-black/10 dark:bg-black/20">
                    <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="text-ai-text-secondary hover:text-ai-text h-[36px]">Cancel</Button>
                    <Button disabled={!newProjectName.trim()} onClick={() => setIsMoveOpen(false)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white rounded-[8px] px-6 h-[36px]">Mover</Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>


          {/* Invite Collaborator Modal */}
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0 [&>button]:top-[23px]">
              {/* Header */}
              <div className="px-5 h-[64px] border-b border-ai-border flex items-center justify-between pr-12">
                <DialogTitle className="text-[16px] font-medium font-sans">Share</DialogTitle>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 text-[12px] font-medium px-2 py-1.5 rounded-[8px] transition-all ${linkCopied
                    ? 'text-green-500 bg-green-500/5'
                    : 'text-ai-text-secondary hover:text-ai-accent'
                    }`}
                >
                  <Link size={14} className={linkCopied ? 'text-green-500' : 'text-ai-text-tertiary'} />
                  <span>{linkCopied ? 'Copied!' : 'Copy link'}</span>
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Email input + invite button row */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 focus-within:ring-1 focus-within:ring-ai-text-secondary/40 transition-shadow">
                    <input
                      type="email"
                      placeholder="Enter an email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
                    />
                  </div>
                  <Button
                    disabled={!inviteEmail.includes('@')}
                    onClick={() => setInviteEmail('')}
                    className="h-[40px] px-5 bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] disabled:opacity-40 text-white rounded-[8px] text-[13px] font-medium shrink-0"
                  >
                    Invite
                  </Button>
                </div>

                {/* Access level indicator */}
                <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-ai-border bg-ai-base cursor-pointer hover:bg-ai-hover-1 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <span className="text-[13px] text-ai-text">Only invited people have access</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                {/* Search collaborators */}
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] text-ai-text-tertiary uppercase tracking-wide font-medium">Current collaborators</p>
                  <div className="flex items-center h-[36px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2">
                    <Search size={14} className="text-ai-text-tertiary shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={inviteSearch}
                      onChange={e => setInviteSearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
                    />
                  </div>

                  {/* Collaborator list with role dropdown + remove */}
                  <div className="flex flex-col">
                    {collaborators
                      .filter(c => !inviteSearch || c.name.toLowerCase().includes(inviteSearch.toLowerCase()) || c.email.toLowerCase().includes(inviteSearch.toLowerCase()))
                      .map(collab => (
                        <div key={collab.email} className="flex items-center gap-3 py-2.5 border-b border-ai-border/50 last:border-0">
                          <div className={`w-8 h-8 rounded-full ${collab.color} flex items-center justify-center shrink-0`}>
                            <span className="text-[11px] font-medium text-white">{collab.initials}</span>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[13px] text-ai-text font-medium truncate">{collab.name}</span>
                            <span className="text-[11px] text-ai-text-tertiary truncate">{collab.email}</span>
                          </div>
                          {collab.role === 'Owner' ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-[8px] font-medium shrink-0 bg-purple-500/10 text-purple-400">Owner</span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-[8px] shrink-0 transition-colors hover:opacity-80 ${collab.role === 'Editor' ? 'bg-blue-500/10 text-[var(--ai-accent-hover)]' : 'bg-gray-500/10 text-gray-400'
                                  }`}>
                                  {collab.role}
                                  <ChevronDown size={10} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-1">
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Editor' } : c))}
                                  className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  {collab.role === 'Editor' && <Check size={12} className="text-[var(--ai-accent)]" />}
                                  {collab.role !== 'Editor' && <span className="w-3" />}
                                  Editor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Viewer' } : c))}
                                  className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  {collab.role === 'Viewer' && <Check size={12} className="text-[var(--ai-accent)]" />}
                                  {collab.role !== 'Viewer' && <span className="w-3" />}
                                  Viewer
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.filter(c => c.email !== collab.email))}
                                  className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  <Trash2 size={13} className="text-red-500" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

function CasesView({ 
  onCaseSelect, 
  onViewModel, 
  cases, 
  setCases,
  onCommentsClick 
}: { 
  onCaseSelect: (c: any) => void; 
  onViewModel: (c: any) => void; 
  cases: CaseItem[]; 
  setCases: React.Dispatch<React.SetStateAction<CaseItem[]>>;
  onCommentsClick: () => void;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Most recent');
  const filtered = applyFilters(cases, search, filter, sort, dateRange);

  return (
    <div className="w-full h-full flex flex-col mt-5 pb-16 animate-in fade-in duration-300">
      <div className="w-full flex flex-col gap-8 mb-6 cursor-default">
        <h2 className="text-[28px] font-medium text-ai-text shrink-0 mr-auto">Cases</h2>
        <div className="flex items-center w-full justify-between">
          <SmartSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search cases..."
            suggestions={Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subClave, c.subProyecto])))}
            className="w-[320px]"
          />
          <div className="flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  {filter} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['All', 'Blocked', 'Pending', 'In progress', 'Completed'].map(f => (
                  <DropdownMenuItem key={f} onClick={() => setFilter(f)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filter === f && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {filter !== f && <span className="w-3" />}
                    {f}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  <CalendarIcon size={14} className="text-ai-text-secondary" />
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Date</span>}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <div className="w-px h-5 bg-ai-border shrink-0" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  {sort} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['Most recent', 'Least recent', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sort === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {sort !== s && <span className="w-3" />}
                    {s === 'A-Z' ? 'Alphabetical (A-Z)' : s === 'Z-A' ? 'Alphabetical (Z-A)' : s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border border-ai-border rounded-[8px] overflow-hidden w-full">
        <Table className="w-full text-[13px]">
          <TableHeader>
            <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Case</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Created</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Delivery</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[12%]">Users</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[18%]">Status</TableHead>
              <TableHead className="text-right w-[15%] pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-ai-text-tertiary text-[13px] py-8">No cases found</TableCell>
              </TableRow>
            ) : filtered.map(c => (
              <DataRow
                key={c.id}
                {...c}
                onViewModel={onViewModel}
                onViewDetails={onCaseSelect}
                onDelete={() => setCases(prev => prev.filter(x => x.id !== c.id))}
                onCommentsClick={onCommentsClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CommentsSidebar({ 
  open, 
  onOpenChange, 
  comments, 
  onAddComment,
  onViewIn3D 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  onViewIn3D?: (comment: CommentItem) => void;
}) {
  const [newComment, setNewComment] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:w-[540px] bg-white dark:bg-ai-surface border-ai-border p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 py-5 border-b border-ai-border shrink-0">
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ai-base flex items-center justify-center border border-ai-border">
                <MessageSquare size={20} className="text-ai-text-secondary" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-[18px] font-bold text-ai-text">Comments</SheetTitle>
                <span className="text-[12px] text-ai-text-tertiary">{comments.length} messages in this case</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Avatar className="w-9 h-9 border border-ai-border shrink-0">
                    <AvatarFallback className={`${comment.color} text-white text-[11px] font-bold`}>{comment.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-ai-text">{comment.user}</span>
                      <span className="text-[11px] text-ai-text-tertiary">{comment.time}</span>
                    </div>
                    <div className="bg-ai-base/50 dark:bg-black/20 p-4 rounded-[8px] rounded-tl-none border border-ai-border/40 relative">
                      {comment.type === 'model' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white dark:border-ai-surface shadow-sm" title="Model annotation">
                          <Box size={12} />
                        </div>
                      )}
                      <p className="text-[13px] text-ai-text leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                      
                      {comment.type === 'model' && onViewIn3D && (
                        <button 
                          onClick={() => onViewIn3D(comment)}
                          className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer uppercase tracking-wider group/btn"
                        >
                          <Monitor size={12} className="group-hover/btn:scale-110 transition-transform" />
                          View in 3D
                        </button>
                      )}
                    </div>
                    <button className="text-[12px] font-bold text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] w-fit transition-colors">Reply</button>
                  </div>
                </div>

                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex gap-4 ml-12">
                    <Avatar className="w-8 h-8 border border-ai-border shrink-0">
                      <AvatarFallback className={`${reply.color} text-white text-[10px] font-bold`}>{reply.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-ai-text">{reply.user}</span>
                        <span className="text-[11px] text-ai-text-tertiary">{reply.time}</span>
                      </div>
                      <div className="bg-blue-500/5 dark:bg-blue-500/10 p-3.5 rounded-[8px] rounded-tl-none border border-blue-500/10">
                        <p className="text-[13px] text-ai-text leading-relaxed font-medium">{reply.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-ai-border bg-ai-base/30 dark:bg-black/20 shrink-0">
          <div className="flex flex-col gap-3">
             <div className="relative group">
               <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question or provide feedback..."
                  className="w-full min-h-[120px] p-4 rounded-[8px] border border-ai-border bg-white dark:bg-ai-surface outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[14px] text-ai-text resize-none"
               />
               <div className="absolute right-3 bottom-3 flex items-center gap-2">
                 <Button 
                   onClick={() => {
                     if (newComment.trim()) {
                       onAddComment(newComment);
                       setNewComment("");
                     }
                   }}
                   disabled={!newComment.trim()}
                   className="h-9 px-5 bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white rounded-[8px] text-[13px] font-bold disabled:opacity-50"
                 >
                   Send Message
                 </Button>
               </div>
             </div>
             <p className="text-[11px] text-ai-text-tertiary px-1">Specialists usually respond within 2-4 hours.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ContactSidebar({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] animate-in fade-in duration-200"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white dark:bg-ai-surface border-l border-ai-border z-[100] transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-ai-border flex items-center justify-between bg-white dark:bg-ai-surface">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[var(--ai-accent)] uppercase tracking-widest leading-none">Contact Specialist</span>
            <h2 className="text-[20px] font-semibold text-ai-text">Laura Gómez</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-[8px] hover:bg-ai-hover-1 text-ai-text-tertiary"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-start gap-4 p-4 rounded-[8px] bg-blue-500/5 border border-blue-500/10">
            <div className="w-12 h-12 rounded-[8px] overflow-hidden shrink-0 border border-ai-border/50">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" alt="Laura Gómez" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-ai-text">How can I help you today?</span>
              <p className="text-[13px] text-ai-text-secondary mt-1">I am your dedicated sales representative. Feel free to reach out for any inquiries or support.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-ai-text-secondary uppercase">Subject</label>
              <input 
                className="h-10 px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-[var(--ai-accent)] outline-none" 
                placeholder="Case #ID224593 - Documentation inquiry"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-ai-text-secondary uppercase">Message</label>
              <textarea 
                className="h-[150px] p-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-[var(--ai-accent)] outline-none resize-none" 
                placeholder="Write your message here..."
              />
            </div>
          </div>

          <Button className="w-full bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white dark:text-[#041e49] rounded-[8px] h-[48px] font-bold active:scale-[0.98] transition-all">
            Send Message
          </Button>
        </div>
      </div>
    </>
  );
}

function SmartSearchInput({
  value, onChange, placeholder, suggestions, className = ""
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suggestions: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = value.trim()
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center h-[36px] px-3 rounded-[8px] border border-ai-border bg-ai-surface focus-within:ring-2 ring-[#a6b6c5]/30 transition-shadow w-full">
        <Search size={15} className="text-ai-text-secondary mr-2 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
        />
        {value && (
          <button onClick={() => onChange("")} className="text-ai-text-tertiary hover:text-ai-text ml-1 cursor-pointer">
            <X size={13} />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-white dark:bg-ai-surface border border-ai-border rounded-[8px] overflow-hidden">
          {filtered.map(s => (
            <button
              key={s}
              onMouseDown={() => { onChange(s); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-[13px] text-ai-text hover:bg-ai-hover-1 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ProjectsView({ onProjectClick, projectNames, onTitleChange, cases, onShareClick }: {
  onProjectClick: (key: string) => void;
  projectNames: Record<string, string>;
  onTitleChange: (key: string, newTitle: string) => void;
  cases: CaseItem[];
  onShareClick: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localTitle, setLocalTitle] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter / sort state
  const [projSearch, setProjSearch] = useState("");
  const [projSort, setProjSort] = useState("Most recent");
  const [projDateRange, setProjDateRange] = useState<DateRange | undefined>(undefined);

  // New project modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [newName, setNewName] = useState("");
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [modalSearch, setModalSearch] = useState("");
  const [modalSort, setModalSort] = useState("A-Z");
  const [extraProjects, setExtraProjects] = useState<{ id: number; keyName: string; title: string; stats: string }[]>([]);

  // Rename modal
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleSaveTitle = (id: number, keyName: string, val: string) => {
    if (val.trim() && val !== projectNames[keyName]) onTitleChange(keyName, val.trim());
    setRenameId(null);
  };

  const openNewModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalStep(1);
    setNewName("");
    setSelectedCases([]);
    setModalSearch("");
    setModalSort("A-Z");
    setShowNewModal(true);
  };

  const handleCreateProject = (skipCases = false) => {
    const name = newName.trim() || "New Project";
    const count = skipCases ? 0 : selectedCases.length;
    setExtraProjects(prev => [...prev, {
      id: Date.now(), keyName: name, title: name,
      stats: count === 0 ? "0 cases" : `${count} case${count !== 1 ? "s" : ""}`,
    }]);
    setShowNewModal(false);
  };

  const toggleCase = (id: string) =>
    setSelectedCases(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  // Theme-aware thumbnail cell (no dots, no decorations)
  const ThumbnailCell = ({ letter }: { letter: string }) => (
    <div className="rounded-[8px] flex items-center justify-center bg-ai-hover-1 dark:bg-[#1d1f22]">
      <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">{letter}</span>
    </div>
  );

  const staticProjects = [
    {
      id: 1,
      keyName: "Guest Project",
      title: projectNames["Guest Project"] || "Guest Project",
      stats: "1 case",
      color: "bg-blue-500",
      collaborators: [
        { name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Owner" },
        { name: "Claudio Martínez", initials: "CM", color: "bg-purple-600", role: "Editor" }
      ],
      thumbnails: [<ThumbnailCell key="1" letter="G" />, <ThumbnailCell key="2" letter="S" />, <ThumbnailCell key="3" letter="C" />, <ThumbnailCell key="4" letter="N" />]
    },
    {
      id: 2,
      keyName: "Team project",
      title: projectNames["Team project"] || "Team project",
      stats: "4 cases",
      color: "bg-purple-500",
      collaborators: [
        { name: "Claudio Martínez", initials: "CM", color: "bg-purple-600", role: "Owner" },
        { name: "Daniela Ríos", initials: "DR", color: "bg-teal-600", role: "Editor" }
      ],
      thumbnails: [
        <div key="1" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-[8px] flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">T</span>
        </div>,
        <div key="2" className="bg-blue-500/10 dark:bg-[#0052ff]/20 rounded-[8px] flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/25 select-none">M</span>
        </div>,
        <ThumbnailCell key="3" letter="A" />,
        <ThumbnailCell key="4" letter="R" />,
      ]
    },
    {
      id: 3,
      keyName: "PIDI Projects",
      title: projectNames["PIDI Projects"] || "PIDI Projects",
      stats: "2 cases",
      color: "bg-amber-500",
      collaborators: [
        { name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Owner" }
      ],
      thumbnails: [
        <div key="1" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-[8px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5" />
          <span className="text-[18px] font-semibold text-blue-500/20 select-none z-10">P</span>
        </div>,
        <div key="2" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-[8px] flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">I</span>
        </div>,
        <div key="3" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-[8px] flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">D</span>
        </div>,
        <div key="4" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-[8px] flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">I</span>
        </div>
      ]
    }
  ];

  const extraProjectCards = extraProjects.map(p => ({
    ...p,
    color: "bg-gray-500",
    collaborators: [{ name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Owner" }],
    thumbnails: [
      <ThumbnailCell key="1" letter={p.title.charAt(0).toUpperCase()} />,
      <ThumbnailCell key="2" letter="+" />,
      <ThumbnailCell key="3" letter="+" />,
      <ThumbnailCell key="4" letter="+" />,
    ]
  }));

  const allProjects = [...staticProjects, ...extraProjectCards];

  // Filter + sort
  const sortedProjects = [...allProjects]
    .filter(p => !projSearch.trim() || p.title.toLowerCase().includes(projSearch.toLowerCase()))
    .sort((a, b) => {
      if (projSort === "Alphabetical (A-Z)") return a.title.localeCompare(b.title);
      if (projSort === "Alphabetical (Z-A)") return b.title.localeCompare(a.title);
      if (projSort === "Least recent") return b.id - a.id; // Just as mock fallback since we use IDs
      return a.id - b.id; // Most recent = insertion order (simplification for mock)
    });

  const projectSuggestions = allProjects.map(p => p.title);

  // Modal case list
  const filteredModalCases = [...cases]
    .filter(c => !modalSearch.trim() ||
      c.proyecto.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.clave.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.subClave.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.subProyecto.toLowerCase().includes(modalSearch.toLowerCase())
    )
    .sort((a, b) => modalSort === "Alphabetical (A-Z)" ? a.proyecto.localeCompare(b.proyecto) : modalSort === "Alphabetical (Z-A)" ? b.proyecto.localeCompare(a.proyecto) : 0);

  const caseSuggestions = Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subClave, c.subProyecto])));

  return (
    <div className="w-full h-full flex flex-col mt-5 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 cursor-default">
        <h2 className="text-[28px] font-medium text-ai-text">Projects</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={openNewModal}
                className="flex items-center justify-center w-7 h-7 rounded-[8px] border border-ai-border bg-ai-surface hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer shrink-0"
              >
                <Plus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-white dark:bg-ai-surface border-ai-border text-ai-text-secondary text-[12px] px-3 py-1.5 rounded-[8px] [&>svg]:fill-ai-surface">
              Create new project
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Filter row — same pattern as Cases */}
      <div className="flex items-center w-full justify-between mb-6">
        <SmartSearchInput
          value={projSearch}
          onChange={setProjSearch}
          placeholder="Search projects..."
          suggestions={projectSuggestions}
          className="w-[320px]"
        />
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center bg-ai-base dark:bg-ai-surface/50 p-1 rounded-[8px] border border-ai-border h-[36px]">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center px-3 h-[28px] rounded-[6px] transition-all cursor-pointer gap-2 ${
                viewMode === 'grid' 
                  ? "bg-white dark:bg-ai-hover-1 text-ai-text border border-ai-border/50" 
                  : "text-ai-text-secondary hover:text-ai-text"
              }`}
            >
              <LayoutGrid size={13} />
              <span className="text-[12px] font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center px-3 h-[28px] rounded-[6px] transition-all cursor-pointer gap-2 ${
                viewMode === 'list' 
                  ? "bg-white dark:bg-ai-hover-1 text-ai-text border border-ai-border/50" 
                  : "text-ai-text-secondary hover:text-ai-text"
              }`}
            >
              <List size={13} />
              <span className="text-[12px] font-medium">List</span>
            </button>
          </div>
          <div className="w-px h-5 bg-ai-border mx-1" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                <CalendarIcon size={14} className="text-ai-text-tertiary" />
                <span>{projDateRange?.from ? (projDateRange.to ? <>{format(projDateRange.from, "LLL dd, y")} - {format(projDateRange.to, "LLL dd, y")}</> : format(projDateRange.from, "LLL dd, y")) : <span>Date</span>}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-ai-border bg-ai-surface rounded-[8px]" align="end">
              <Calendar initialFocus mode="range" defaultMonth={projDateRange?.from} selected={projDateRange} onSelect={setProjDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                {projSort} <ChevronDown size={14} className="text-ai-text-tertiary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
              {['Most recent', 'Least recent', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                <DropdownMenuItem key={s} onClick={() => setProjSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                  {projSort === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                  {projSort !== s && <span className="w-3" />}
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rename modal */}
      <Dialog open={renameId !== null} onOpenChange={() => setRenameId(null)}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-0 overflow-hidden max-w-[380px]">
          <div className="px-6 pt-6 pb-4 border-b border-ai-border">
            <DialogTitle className="text-[15px] font-semibold text-ai-text">Rename project</DialogTitle>
          </div>
          <div className="px-6 py-4 flex flex-col gap-2">
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveTitle(renameId!, allProjects.find(p => p.id === renameId)?.keyName ?? "", renameValue);
                if (e.key === 'Escape') setRenameId(null);
              }}
              className="w-full h-[40px] px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] text-ai-text outline-none focus:ring-1 focus:ring-[var(--ai-accent)] transition"
            />
          </div>
          <div className="flex justify-end gap-2 px-6 pb-5">
            <Button variant="ghost" onClick={() => setRenameId(null)} className="text-[13px] cursor-pointer">Cancel</Button>
            <Button
              onClick={() => handleSaveTitle(renameId!, allProjects.find(p => p.id === renameId)?.keyName ?? "", renameValue)}
              className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer"
            >Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-0 overflow-hidden max-w-[490px]">
          {modalStep === 1 ? (
            <div className="flex flex-col">
              <div className="px-6 pt-6 pb-4 border-b border-ai-border">
                <DialogTitle className="text-[16px] font-semibold text-ai-text mb-1">New project</DialogTitle>
                <p className="text-[13px] text-ai-text-secondary">Give your project a name to get started.</p>
              </div>
              <div className="px-6 py-5 flex flex-col gap-2">
                <label className="text-[12px] font-medium text-ai-text-secondary">Project name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Cardiology Q1 2025"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) setModalStep(2); }}
                  className="w-full h-[40px] px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] text-ai-text placeholder:text-ai-text-tertiary outline-none focus:ring-1 focus:ring-[var(--ai-accent)] transition"
                />
              </div>
              <div className="flex items-center justify-end gap-2 px-6 pb-6">
                <Button variant="ghost" onClick={() => setShowNewModal(false)} className="text-[13px] text-ai-text-secondary hover:text-ai-text cursor-pointer">Cancel</Button>
                <Button disabled={!newName.trim()} onClick={() => setModalStep(2)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer">Continue</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="px-6 pt-6 pb-4 border-b border-ai-border">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setModalStep(1)} className="text-ai-text-tertiary hover:text-ai-text cursor-pointer transition-colors"><ChevronLeft size={16} /></button>
                  <DialogTitle className="text-[15px] font-semibold text-ai-text">Add cases to &quot;{newName.trim()}&quot;</DialogTitle>
                </div>
                <p className="text-[12px] text-ai-text-secondary ml-6">Select cases to include. You can add more later.</p>
              </div>
              {/* Search + sort in modal */}
              <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                <SmartSearchInput
                  value={modalSearch}
                  onChange={setModalSearch}
                  placeholder="Search cases..."
                  suggestions={caseSuggestions}
                  className="flex-1"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-1.5 flex items-center cursor-pointer shrink-0">
                      {modalSort} <ChevronDown size={13} className="text-ai-text-tertiary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                    {['Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                      <DropdownMenuItem key={s} onClick={() => setModalSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                        {modalSort === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                        {modalSort !== s && <span className="w-3" />}
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="px-6 py-2 flex flex-col gap-0.5 max-h-[260px] overflow-y-auto">
                {filteredModalCases.length === 0 && <p className="text-[13px] text-ai-text-tertiary py-4 text-center">No cases found.</p>}
                {filteredModalCases.map(c => {
                  const selected = selectedCases.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleCase(c.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-left transition-colors cursor-pointer ${selected ? 'bg-[var(--ai-accent)]/10 border border-[var(--ai-accent)]/30' : 'hover:bg-ai-hover-1 border border-transparent'}`}>
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-[var(--ai-accent)] border-[var(--ai-accent)]' : 'border-ai-border'}`}>
                        {selected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-ai-text truncate">{c.proyecto}</p>
                        <p className="text-[11px] text-ai-text-tertiary">{c.status} · {c.id}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between px-6 pb-5 pt-3 border-t border-ai-border">
                <button onClick={() => handleCreateProject(true)} className="text-[13px] text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">Skip for now</button>
                <Button onClick={() => handleCreateProject(false)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer">
                  Create project{selectedCases.length > 0 ? ` (${selectedCases.length})` : ""}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Content — Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {sortedProjects.map(project => (
            <div key={project.id} onClick={() => onProjectClick(project.keyName)} className="bg-ai-surface border border-ai-border rounded-[8px] overflow-hidden cursor-pointer hover:border-ai-border-strong transition-colors group relative flex flex-col">

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-[3px] w-full bg-ai-base dark:bg-[#101113] p-[10px]" style={{ aspectRatio: '1/1' }}>
                {project.thumbnails}
              </div>

              {/* Title / Stats */}
              <div className="flex flex-col gap-0.5 px-4 py-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-medium text-ai-text group-hover:text-[var(--ai-accent)] transition-colors leading-tight truncate pr-2">
                    {project.title}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex -space-x-2">
                    {project.collaborators?.map((collab: any, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-ai-surface bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center shrink-0 relative">
                              <span className="text-[9px] font-bold text-ai-text-secondary">{collab.initials}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-[11px] bg-ai-base border border-ai-border p-1.5 rounded-[8px]">
                            {collab.name} ({collab.role})
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button onClick={(e) => e.stopPropagation()} className="p-1 bg-transparent hover:bg-ai-hover-1 rounded-[8px] transition-colors cursor-pointer">
                        <MoreHorizontal size={16} className="text-ai-text-secondary" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      onClick={(e) => e.stopPropagation()} 
                      align="end" 
                      className="w-[240px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 space-y-1"
                    >
                      <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                        <ExternalLink size={18} className="text-ai-text-secondary" />
                        <span className="font-medium text-[14px]">Open in new tab</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameId(project.id);
                          setRenameValue(project.title);
                        }}
                      >
                        <Edit size={18} className="text-ai-text-secondary" />
                        <span className="font-medium text-[14px]">Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareClick();
                        }}
                      >
                        <Share2 size={18} className="text-ai-text-secondary" />
                        <span className="font-medium text-[14px]">Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-ai-border" />
                      <DropdownMenuItem 
                        className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
                      >
                        <Trash2 size={18} className="text-red-500" strokeWidth={2.5} />
                        <span className="font-medium text-[14px]">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] text-ai-text-tertiary">{project.stats}</span>
                  <span className="text-[11px] text-ai-text-tertiary/70">Modified 2d ago</span>
                </div>
              </div>
            </div>
          ))}
          {sortedProjects.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-16 text-[13px] text-ai-text-tertiary">No projects match your search.</div>
          )}
        </div>
      ) : (
        <div className="w-full border border-ai-border rounded-[8px] overflow-hidden animate-in fade-in duration-500">
          <Table className="w-full text-[13px]">
            <TableHeader>
              <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
                <TableHead className="text-ai-text-secondary font-medium px-4">Name</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Cases</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Participants</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Last modified</TableHead>
                <TableHead className="text-right px-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-ai-text-tertiary">No projects match your search.</TableCell>
                </TableRow>
              ) : (
                sortedProjects.map((project: any) => (
                  <TableRow 
                    key={project.id} 
                    onClick={() => onProjectClick(project.keyName)}
                    className="border-b border-ai-border hover:bg-ai-base/40 dark:hover:bg-white/[0.02] cursor-pointer group transition-colors h-[64px]"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[8px] bg-[#f3f7f9] dark:bg-[#1d1f22] flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                          <span className="text-[14px] font-bold text-ai-text-secondary">{project.title.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-[14px] font-medium text-ai-text group-hover:text-[var(--ai-accent)] transition-colors">{project.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-ai-text-secondary">{project.stats}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-1.5">
                        {project.collaborators?.map((collab: any, idx: number) => (
                          <div key={idx} className="w-[30px] h-[30px] rounded-full border-2 border-white dark:border-[#131416] bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center shrink-0 relative">
                            <span className="text-[11px] font-bold text-ai-text-secondary">{collab.initials}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-ai-text-tertiary">Just now</TableCell>
                    <TableCell className="text-right px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-ai-hover-1 rounded-[8px] transition-colors cursor-pointer">
                            <MoreVertical size={16} className="text-ai-text-tertiary" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          onClick={(e) => e.stopPropagation()} 
                          align="end" 
                          className="w-[240px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 space-y-1"
                        >
                          <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                            <ExternalLink size={18} className="text-ai-text-secondary" />
                            <span className="font-medium text-[14px]">Open in new tab</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameId(project.id);
                              setRenameValue(project.title);
                            }}
                          >
                            <Edit size={18} className="text-ai-text-secondary" />
                            <span className="font-medium text-[14px]">Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShareClick();
                            }}
                          >
                            <Share2 size={18} className="text-ai-text-secondary" />
                            <span className="font-medium text-[14px]">Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-ai-border" />
                          <DropdownMenuItem 
                            className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" strokeWidth={2.5} />
                            <span className="font-medium text-[14px]">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}


function ProjectDetailView({
  projectTitle,
  cases,
  onCaseSelect,
  onViewModel,
  onTitleChange,
  onCommentsClick,
  onBack
}: {
  projectTitle: string,
  cases: CaseItem[],
  onCaseSelect: (caseData: any) => void,
  onViewModel: (caseData: any) => void,
  onTitleChange: (newTitle: string) => void,
  onCommentsClick: () => void,
  onBack: () => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(projectTitle);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Most recent');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: new Date(2025, 1, 20),
  });

  useEffect(() => {
    setLocalTitle(projectTitle);
  }, [projectTitle]);

  const handleSave = () => {
    setIsEditing(false);
    if (localTitle.trim() && localTitle !== projectTitle) {
      onTitleChange(localTitle.trim());
    } else {
      setLocalTitle(projectTitle);
    }
  };

  return (
    <div className="w-full flex flex-col mt-5 pb-16 animate-in fade-in duration-300">
      <div className="w-full flex flex-col gap-8 mb-6">
        <div className="w-full flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="w-[36px] h-[36px] rounded-[8px] border-ai-border hover:bg-ai-hover-1 shrink-0"
          >
            <ArrowLeft size={16} />
          </Button>

          {isEditing ? (
            <input
              autoFocus
              className="text-[28px] font-medium text-ai-text bg-transparent border-b border-blue-500 outline-none flex-1 max-w-[400px]"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                  if (localTitle.trim() && localTitle !== projectTitle) {
                    onTitleChange(localTitle.trim());
                  }
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setLocalTitle(projectTitle);
                }
              }}
              onBlur={() => {
                setIsEditing(false);
                if (localTitle.trim() && localTitle !== projectTitle) {
                  onTitleChange(localTitle.trim());
                } else {
                  setLocalTitle(projectTitle);
                }
              }}
            />
          ) : (
            <h2 className="text-[28px] font-medium text-ai-text truncate group-hover:block transition-all">
              {projectTitle}
            </h2>
          )}
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-[28px] w-[28px] text-ai-text-tertiary hover:text-ai-text hover:bg-ai-hover-1 rounded-[8px] self-end ml-[-4px] shrink-0"
            >
              <Edit size={16} />
            </Button>
          )}
        </div>

        <div className="flex items-center w-full justify-between">
          <SmartSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search cases..."
            suggestions={Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subClave, c.subProyecto])))}
            className="w-[320px]"
          />
          <div className="flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  {filterBy} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['All', 'Blocked', 'Pending', 'In progress', 'Completed'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filterBy === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {filterBy !== s && <span className="w-3" />}
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  <CalendarIcon size={14} className="text-ai-text-secondary" />
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Date</span>}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <div className="w-px h-5 bg-ai-border shrink-0" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                  Most recent <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Most recent</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Least recent</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Alphabetical (A-Z)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Alphabetical (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="border border-ai-border rounded-[8px] overflow-hidden w-full">
        <Table className="w-full text-[13px] table-fixed">
          <TableHeader>
            <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Case</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Created</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Delivery</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[12%]">Users</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[18%]">Status</TableHead>
              <TableHead className="text-right w-[15%] pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataRow
              clave="ID224601"
              subClave="General Surgery"
              proyecto={projectTitle}
              subProyecto="JER AN1309531635"
              date="14 DIC 2025"
              estimatedDelivery="15 DIC 2025"
              avatars={[
                { initials: "AS", name: "Ana Silva" }
              ]}
              status="In progress"
              subStatus="Est. delivery 15/12/25"
              onViewModel={onViewModel}
              onViewDetails={(c) => onCaseSelect(c)}
              onCommentsClick={onCommentsClick}
            />
            <DataRow
              clave="ID224602"
              subClave="Cardiology"
              proyecto={projectTitle}
              subProyecto="MNT AN1309531622"
              date="10 DIC 2025"
              estimatedDelivery="12 DIC 2025"
              avatars={[
                { initials: "CM", name: "Claudio Martínez" },
                { initials: "DR", name: "Daniela Ríos" }
              ]}
              status="Completed"
              subStatus="View model"
              statusColor="bg-ai-success"
              onViewModel={onViewModel}
              onViewDetails={(c) => onCaseSelect(c)}
              onCommentsClick={onCommentsClick}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------- //
// BILLING MODULE COMPONENTS
// -------------------------------------------------------------------------------- //

function InvoiceDetailSidebar({
  open,
  onOpenChange,
  invoice
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: BillingItem | null;
}) {
  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] animate-in fade-in duration-200"
          onClick={() => onOpenChange(false)}
        />
      )}
      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[570px] bg-white dark:bg-ai-surface border-l border-ai-border z-[100] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {invoice && (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-ai-border flex items-center justify-between sticky top-0 bg-white/80 dark:bg-ai-surface/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-[var(--ai-accent)] uppercase tracking-widest">Invoice Details</span>
                <h2 className="text-[20px] font-semibold text-ai-text">{invoice.invoiceNumber}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full hover:bg-ai-hover-1 text-ai-text-tertiary"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="p-8 flex flex-col gap-8 flex-1">
              {/* Status & Amount */}
              <div className="flex items-center justify-between bg-ai-base/50 p-6 rounded-[8px] border border-ai-border">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Total Amount</span>
                  <span className="text-[28px] font-bold text-ai-text">€{invoice.amount.toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${invoice.status === 'Paid'
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : invoice.status === 'Pending'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                  {invoice.status}
                </div>
              </div>

              {/* Bill To Section */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Bill To</span>
                  <div className="flex flex-col text-[14px] text-ai-text-secondary leading-relaxed">
                    <span className="font-bold text-ai-text">St. Mary&#39;s Hospital</span>
                    <span>Radiology Dept.</span>
                    <span>London, UK</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Invoice Info</span>
                  <div className="flex flex-col text-[14px] text-ai-text-secondary">
                    <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{invoice.date}</span></div>
                    <div className="flex justify-between"><span>ID:</span> <span className="font-medium">#88{invoice.id}</span></div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Service Details</span>
                <div className="border border-ai-border rounded-[8px] overflow-hidden">
                  <div className="bg-ai-base/30 px-4 py-3 border-b border-ai-border flex justify-between text-[12px] font-bold text-ai-text-secondary">
                    <span>Description</span>
                    <span>Price</span>
                  </div>
                  <div className="px-4 py-4 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <span className="text-[14px] font-medium text-ai-text">{invoice.caseTitle}</span>
                        <span className="text-[12px] text-ai-text-tertiary font-mono">{invoice.caseId}</span>
                      </div>
                      <span className="text-[14px] font-bold text-ai-text">€{invoice.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-ai-border/50" />
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-ai-text-secondary">VAT (21%)</span>
                      <span className="text-ai-text-secondary">Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Payment Method</span>
                <div className="flex items-center gap-3 p-4 rounded-[8px] border border-ai-border bg-ai-surface">
                  <div className="w-10 h-7 rounded bg-gray-100 dark:bg-ai-base border border-ai-border flex items-center justify-center">
                    <span className="text-[10px] font-bold">VISA</span>
                  </div>
                  <span className="text-[13px] text-ai-text-secondary font-medium">•••• •••• •••• 4242</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 border-t border-ai-border bg-ai-base/30 flex flex-col gap-3 shrink-0">
              <Button className="w-full bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white font-bold h-[48px] rounded-[8px] flex items-center gap-2">
                <FileText size={18} />
                Download PDF Invoice
              </Button>
              <p className="text-center text-[11px] text-ai-text-tertiary mt-2">If you have any questions, please contact billing@cella.studio</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ArticleView({ article, onBack }: { article: any, onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-ai-surface p-8">
      <div className="max-w-[800px] mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-8 text-ai-text-secondary hover:text-ai-text gap-2 px-0 hover:bg-transparent"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-bold text-[var(--ai-accent)] uppercase tracking-widest">{article.category}</span>
            <h1 className="text-[42px] font-bold text-ai-text leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 text-ai-text-tertiary text-[14px]">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px] bg-ai-base">C</AvatarFallback>
                </Avatar>
                <span className="font-medium text-ai-text-secondary">{article.author}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-ai-border" />
              <span>{article.date}</span>
            </div>
          </div>

          <div className="w-full aspect-video rounded-[8px] overflow-hidden border border-ai-border bg-ai-base/50">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          <div 
            className="prose prose-ai max-w-none text-ai-text-secondary text-[17px] leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 pt-8 border-t border-ai-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[14px] text-ai-text-tertiary">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-ai-border hover:bg-ai-hover-1">
                  <Share2 size={16} className="text-ai-text-secondary" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-ai-border hover:bg-ai-hover-1">
                  <Link size={16} className="text-ai-text-secondary" />
                </Button>
              </div>
            </div>
            <Button onClick={onBack} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white rounded-xl px-8 h-[44px]">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingView({
  search,
  setSearch,
  onInvoiceSelect,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange
}: {
  search: string;
  setSearch: (s: string) => void;
  onInvoiceSelect: (item: BillingItem) => void;
  filterBy: string;
  setFilterBy: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (dr: DateRange | undefined) => void;
}) {
  const filtered = BILLING_DATA.filter(item => {
    const matchesSearch = item.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.caseId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterBy === 'All' || item.status === filterBy;
    
    let matchesDate = true;
    if (dateRange?.from) {
      const itemDate = item.dateObj;
      if (dateRange.to) {
        matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to;
      } else {
        matchesDate = itemDate.toDateString() === dateRange.from.toDateString();
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 mt-5">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-medium text-ai-text">Billing & Invoices</h1>
          <p className="text-[14px] text-ai-text-secondary">View and manage your service invoices and payment history.</p>
        </div>

        {/* TOP FILTERS - Standardized with app style */}
        <div className="flex items-center w-full justify-between">
          <SmartSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by ID or Number..."
            suggestions={Array.from(new Set(BILLING_DATA.flatMap(b => [b.invoiceNumber, b.caseId, b.caseTitle])))}
            className="w-[340px]"
          />

          <div className="flex items-center gap-4 shrink-0">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer transition-colors">
                  {filterBy} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filterBy === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {filterBy !== s && <span className="w-3" />}
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer transition-colors">
                  <CalendarIcon size={14} className="text-ai-text-tertiary" />
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Period</span>}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-ai-border bg-ai-surface rounded-[8px]" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <div className="w-px h-5 bg-ai-border shrink-0" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer transition-colors">
                  {sortBy} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['Most recent', 'Least recent', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSortBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sortBy === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {sortBy !== s && <span className="w-3" />}
                    {s === 'A-Z' ? 'Alphabetical (A-Z)' : s === 'Z-A' ? 'Alphabetical (Z-A)' : s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border border-ai-border rounded-[8px] overflow-hidden w-full">
        <Table className="w-full text-[13px] table-fixed">
          <TableHeader>
            <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-6">Case</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Inv. Number</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Date</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%] text-right">Amount</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%] text-center">Status</TableHead>
              <TableHead className="w-[15%] text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-ai-text-tertiary">No invoices found for the current selection.</TableCell>
              </TableRow>
            ) : filtered.map(item => (
              <TableRow 
                key={item.id} 
                className="border-b border-ai-border hover:bg-ai-hover-1/30 h-[60px] group transition-colors"
                onClick={() => onInvoiceSelect(item)}
              >
                <TableCell className="px-6">
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="font-bold text-[14px] text-ai-text uppercase tracking-tight leading-tight">{item.caseSubtitle}</span>
                    <div className="flex items-center gap-2 text-[11px] text-ai-text-tertiary font-medium truncate w-full">
                      <span className="text-ai-text-tertiary/60 font-mono text-[9px] bg-ai-base px-1.5 py-0.5 rounded border border-ai-border shrink-0">{item.caseId}</span>
                      <span className="truncate">{item.caseTitle}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-ai-text">{item.invoiceNumber}</TableCell>
                <TableCell className="text-ai-text-secondary">{item.date}</TableCell>
                <TableCell className="text-right font-bold text-ai-text">€{item.amount.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border w-fit ${item.status === 'Paid'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : item.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Paid' ? 'bg-green-600' :
                        item.status === 'Pending' ? 'bg-amber-600' :
                        'bg-red-600'
                      }`} />
                      {item.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end items-center gap-1">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); onInvoiceSelect(item); }}
                            className="h-8 w-8 rounded-lg hover:bg-ai-base text-ai-text-tertiary hover:text-ai-text"
                          >
                            <FileText size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-ai-surface border-ai-border text-ai-text text-[12px]">View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-ai-base text-ai-text-tertiary hover:text-ai-text"
                          >
                            <Download size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-ai-surface border-ai-border text-ai-text text-[12px]">Download PDF</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------- //
// BLOG VIEW
// -------------------------------------------------------------------------------- //

function BlogView({ articles, onBack, onSelectArticle }: { articles: any[], onBack: () => void, onSelectArticle: (article: any) => void }) {
  const featuredArticle = articles[0];
  const listArticles = articles.slice(1);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2 h-9 w-9 rounded-full flex items-center justify-center hover:bg-ai-hover-1 text-ai-text-secondary">
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-[28px] font-medium text-ai-text">What's New</h1>
        </div>
      </div>

      {/* FEATURED ARTICLE */}
      {featuredArticle && (
        <div 
          className="relative w-full h-[400px] rounded-[8px] overflow-hidden group cursor-pointer border border-ai-border bg-ai-surface"
          onClick={() => onSelectArticle(featuredArticle)}
        >
          <img src={featuredArticle.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3 max-w-2xl">
            <div className="flex gap-2">
              <span className="bg-[var(--ai-accent)] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">{featuredArticle.category}</span>
              <span className="bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">{featuredArticle.date}</span>
            </div>
            <h2 className="text-[32px] font-bold text-white leading-tight group-hover:text-[var(--ai-accent-hover)] transition-colors uppercase tracking-tight">{featuredArticle.title}</h2>
            <p className="text-white/80 text-[16px] leading-relaxed line-clamp-2">Latest clinical advancements and product updates from the Cella Studio core engineering team.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white font-bold text-[14px]">Read full article</span>
              <ArrowRight size={18} className="text-[var(--ai-accent-hover)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE LIST */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[18px] font-bold text-ai-text uppercase tracking-widest border-b border-ai-border pb-4">Recent Articles</h3>
        <div className="flex flex-col gap-4">
          {listArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="flex gap-8 p-6 rounded-[20px] bg-ai-surface/30 border border-ai-border hover:border-blue-500/30 hover:bg-ai-hover-1 transition-all group cursor-pointer"
            >
              <div className="w-[180px] h-[120px] rounded-[12px] overflow-hidden shrink-0 border border-ai-border">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tile" />
              </div>
              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-ai-text-tertiary">
                  <span className="text-[var(--ai-accent)]">{article.category}</span>
                  <div className="w-1 h-1 rounded-full bg-ai-text-tertiary"></div>
                  <span>{article.date}</span>
                </div>
                <h4 className="text-[18px] font-bold text-ai-text group-hover:text-[var(--ai-accent)] dark:group-hover:text-[var(--ai-accent-hover)] transition-colors">{article.title}</h4>
                <p className="text-ai-text-secondary text-[14px] leading-relaxed line-clamp-2 max-w-2xl">Discover how our latest updates are transforming clinical workflows across the globe.</p>
              </div>
              <div className="ml-auto flex items-center pr-4">
                <div className="w-10 h-10 rounded-full bg-ai-base border border-ai-border flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------- //
// DOCS VIEW
// -------------------------------------------------------------------------------- //

const DOCS_SECTIONS = [
  {
    title: 'Getting Started',
    icon: '🚀',
    color: 'text-[var(--ai-accent-hover)]',
    bg: 'bg-blue-500/10',
    articles: [
      { title: 'What is Cella Studio?', time: '3 min', tag: 'Intro' },
      { title: 'Quick start guide', time: '5 min', tag: 'Guide' },
      { title: 'Creating your first case', time: '4 min', tag: 'Guide' },
      { title: 'Navigating the dashboard', time: '2 min', tag: 'Intro' },
    ],
  },
  {
    title: 'Case Management',
    icon: '📁',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    articles: [
      { title: 'Case lifecycle & statuses', time: '4 min', tag: 'Concept' },
      { title: 'Uploading imaging data (DICOM)', time: '6 min', tag: 'Guide' },
      { title: 'Assigning team members', time: '3 min', tag: 'Guide' },
      { title: 'Filtering and searching cases', time: '2 min', tag: 'Guide' },
      { title: 'Moving cases between projects', time: '2 min', tag: 'Guide' },
    ],
  },
  {
    title: 'AI & Analysis',
    icon: '🧠',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    articles: [
      { title: 'How AI segmentation works', time: '7 min', tag: 'Concept' },
      { title: 'Running a model on a case', time: '5 min', tag: 'Guide' },
      { title: 'Interpreting model output', time: '5 min', tag: 'Guide' },
      { title: 'Supported anatomical regions', time: '3 min', tag: 'Reference' },
    ],
  },
  {
    title: 'Projects & Collaboration',
    icon: '🤝',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    articles: [
      { title: 'Creating and managing projects', time: '3 min', tag: 'Guide' },
      { title: 'Inviting collaborators', time: '2 min', tag: 'Guide' },
      { title: 'Permissions & roles', time: '4 min', tag: 'Reference' },
      { title: 'Sharing a case link', time: '2 min', tag: 'Guide' },
    ],
  },
  {
    title: 'API Reference',
    icon: '⚡',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    articles: [
      { title: 'Authentication & API keys', time: '5 min', tag: 'Reference' },
      { title: 'Cases endpoint', time: '6 min', tag: 'Reference' },
      { title: 'Webhooks', time: '4 min', tag: 'Reference' },
      { title: 'Rate limits & quotas', time: '3 min', tag: 'Reference' },
    ],
  },
];

const QUICKSTART = [
  { icon: '📤', title: 'Upload your first DICOM', desc: 'Drag and drop or connect your PACS.', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
  { icon: '🤖', title: 'Run AI segmentation', desc: 'Select a model and get results in seconds.', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
  { icon: '🔗', title: 'Invite your team', desc: 'Share cases and control access with roles.', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
  { icon: '📊', title: 'Export report', desc: 'Download PDF reports or push to your EHR.', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20' },
];

// -------------------------------------------------------------------------------- //
// SETTINGS MODAL
// -------------------------------------------------------------------------------- //

function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'logistics'>('profile');
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [address, setAddress] = useState({
    street: "Calle Dr. Fleming, 12",
    city: "Murcia",
    zip: "30001",
    phone: "+34 968 123 456"
  });

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'logistics', label: 'Shipping', icon: <Truck size={18} /> },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text max-w-[900px] h-[750px] p-0 rounded-[8px] overflow-hidden flex flex-row gap-0 [&>button]:top-6 [&>button]:right-6 [&>button]:opacity-50 hover:[&>button]:opacity-100 transition-all">
        {/* MODAL SIDEBAR */}
        <div className="w-[240px] border-r border-ai-border flex flex-col p-6 gap-6 shrink-0 h-full">
          <div className="flex flex-col gap-1.5 px-2">
            <h2 className="text-[20px] font-bold text-ai-text tracking-tight">Settings</h2>
            <p className="text-[12px] text-ai-text-tertiary font-medium">Manage your account and preferences.</p>
          </div>
          
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all group ${
                  activeTab === item.id 
                    ? 'bg-[var(--ai-accent)]/10 text-[var(--ai-accent)]' 
                    : 'text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text'
                }`}
              >
                <div className={activeTab === item.id ? 'text-[var(--ai-accent)]' : 'text-ai-text-tertiary group-hover:text-ai-text'}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent">
          {/* DYNAMIC HEADER */}
          <div className="px-12 py-8 border-b border-ai-border flex flex-col gap-1 shrink-0 relative">
            <h3 className="text-[20px] font-bold text-ai-text tracking-tight">
              {activeTab === 'profile' && "Personal Profile"}
              {activeTab === 'security' && "Security"}
              {activeTab === 'logistics' && "Shipping"}
            </h3>
            <p className="text-[13px] text-ai-text-tertiary font-medium">
              {activeTab === 'profile' && "Manage your clinical identity and professional contact information."}
              {activeTab === 'security' && "Manage your medical account security and authentication methods."}
              {activeTab === 'logistics' && "Configure your primary hospital addresses for anatomical model and prototype deliveries."}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-12 pt-8">
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="flex items-center gap-6 group">
                  <Avatar className="w-16 h-16 border border-ai-border">
                    <AvatarFallback className="bg-[var(--ai-accent)] text-white font-bold text-[24px]">AS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[18px] font-bold text-ai-text tracking-tight">Dr. Prueba Alex Salmerón</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--ai-accent)] text-[12px] font-bold">Chief Surgeon</span>
                      <span className="w-1 h-1 rounded-full bg-ai-border" />
                      <span className="text-[13px] text-ai-text-tertiary font-medium">Cella Medical Solutions</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <ProfileItem label="Medical specialty" value="Cirugía general - Hepatobiliopancreática" />
                    <ProfileItem label="Primary hospital" value="Cella Medical Solutions" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <SettingsInput label="Primary email" defaultValue="alejandrosalmeron+1@cellams.com" icon={<Mail size={16} />} />
                    <SettingsInput label="Phone number" placeholder="+34 600 000 000" icon={<MessageSquare size={16} />} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div 
                  onClick={() => setIsPasswordOpen(true)}
                  className="flex items-center gap-5 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-[8px] bg-ai-base border border-ai-border flex items-center justify-center text-ai-text-tertiary group-hover:text-[var(--ai-accent)] group-hover:border-[var(--ai-accent)]/30 transition-all shrink-0">
                    <Lock size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-ai-text tracking-tight">Update password</span>
                    <span className="text-[13px] text-ai-text-tertiary font-medium">Keep your surgical cases secure. Last changed 3 months ago.</span>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-ai-text-tertiary group-hover:text-ai-text group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {activeTab === 'logistics' && (
              <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-5 group">
                    <div className="w-10 h-10 rounded-[8px] bg-ai-base border border-ai-border flex items-center justify-center text-ai-text-tertiary shrink-0 group-hover:text-[var(--ai-accent)] group-hover:border-[var(--ai-accent)]/30 transition-all">
                      <MapPin size={20} />
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <p className="text-[15px] text-ai-text font-bold leading-tight tracking-tight mb-1">Primary hospital address</p>
                      <p className="text-[14px] text-ai-text-secondary leading-relaxed font-medium">
                        {address.street}<br />
                        {address.zip} {address.city}<br />
                        <span className="text-[var(--ai-accent)] text-[12px] font-bold mt-1.5 inline-block">{address.phone}</span>
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsLogisticsOpen(true)}
                      className="h-9 w-9 rounded-[8px] text-ai-text-tertiary hover:text-[var(--ai-accent)] transition-all"
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="p-6 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3 shrink-0">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-[40px] px-6 rounded-[8px] font-medium border border-ai-border transition-all active:scale-95">Cancel</Button>
            <Button onClick={() => onOpenChange(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[40px] px-8 rounded-[8px] font-bold active:scale-95 transition-all">Save Changes</Button>
          </div>
        </div>

        {/* SUB-MODALS */}
        <Dialog open={isLogisticsOpen} onOpenChange={setIsLogisticsOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[500px] p-0 rounded-[8px] overflow-hidden">
            <div className="p-8 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[22px] font-bold tracking-tight">Update Shipping Address</DialogTitle>
              <p className="text-[14px] text-ai-text-tertiary">Set your primary clinical destination for surgical prototypes.</p>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Street Address</label>
                <input 
                  className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" 
                  defaultValue={address.street} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">City</label>
                  <input 
                    className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                    defaultValue={address.city}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Zip Code</label>
                  <input 
                    className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                    defaultValue={address.zip}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Contact Phone</label>
                <input 
                  className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                  defaultValue={address.phone}
                />
              </div>
            </div>
            <div className="p-8 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsLogisticsOpen(false)} className="h-[44px] px-8 rounded-[8px] font-bold border border-ai-border transition-all hover:bg-white dark:hover:bg-ai-surface">Cancel</Button>
              <Button onClick={() => setIsLogisticsOpen(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[44px] px-10 rounded-[8px] font-bold transition-all active:scale-95">Update Address</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[460px] p-0 rounded-[8px] overflow-hidden">
            <div className="p-8 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[20px] font-bold tracking-tight">Update Password</DialogTitle>
              <p className="text-[14px] text-ai-text-tertiary">Ensure your account is using a secure, long password.</p>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
              <div className="h-px bg-ai-border/60 w-full my-2" />
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Confirm New Password</label>
                <input type="password" placeholder="Repeat new password" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
            </div>
            <div className="p-8 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPasswordOpen(false)} className="h-[44px] px-8 rounded-[8px] font-bold border border-ai-border transition-all hover:bg-white dark:hover:bg-ai-surface">Cancel</Button>
              <Button onClick={() => setIsPasswordOpen(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[44px] px-10 rounded-[8px] font-bold transition-all active:scale-95">Change Password</Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

function ProfileItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <span className="text-[13px] font-medium text-ai-text-tertiary">{label}</span>
      <span className="text-[15px] font-bold text-ai-text tracking-tight">{value}</span>
    </div>
  );
}

function SettingsInput({ label, defaultValue, placeholder, icon }: { label: string, defaultValue?: string, placeholder?: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-medium text-ai-text-tertiary pl-0.5 transition-colors group-focus-within:text-[var(--ai-accent)]">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ai-text-tertiary group-focus-within:text-[var(--ai-accent)] transition-colors">
          {icon}
        </div>
        <input 
          className="w-full h-[48px] pl-11 pr-4 rounded-[8px] border border-ai-border bg-ai-base/20 outline-none focus:ring-1 focus:ring-[var(--ai-accent)] focus:border-[var(--ai-accent)] transition-all text-[14px] font-medium text-ai-text placeholder:text-ai-text-tertiary"
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function DocsView({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (s: string) => void }) {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);

  const currentSection = DOCS_SECTIONS.find(s => s.title === activeSection) ?? DOCS_SECTIONS[0];

  return (
    <div className="w-full h-full flex animate-in fade-in duration-300 overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {!activeArticle ? (
          <div className="max-w-[680px] mx-auto pt-5 pb-16 px-8">

            {/* Section header */}
            <div className="mb-8 border-b border-ai-border pb-6">
              <p className="text-[11px] font-medium text-ai-text-tertiary uppercase tracking-widest mb-2">Documentation</p>
              <h1 className="text-[26px] font-semibold text-ai-text">{currentSection.title}</h1>
              <p className="text-[14px] text-ai-text-secondary leading-relaxed mt-2">
                {currentSection.title === 'Getting Started' && 'Everything you need to go from zero to your first AI-assisted case in minutes.'}
                {currentSection.title === 'Case Management' && 'Manage, organize, and track medical imaging cases across your workspace.'}
                {currentSection.title === 'AI & Analysis' && 'Understand AI models and how to get the most out of automated analysis.'}
                {currentSection.title === 'Projects & Collaboration' && 'Set up projects, manage access, and collaborate with your clinical team.'}
                {currentSection.title === 'API Reference' && 'Integrate Cella Studio into your workflows with our REST API and webhooks.'}
              </p>
            </div>

            {/* Quickstart grid (Getting Started only) */}
            {currentSection.title === 'Getting Started' && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {QUICKSTART.map(q => (
                  <div key={q.title} className="rounded-[10px] border border-ai-border bg-ai-surface hover:bg-ai-hover-1 transition-colors p-4 flex gap-3 items-start cursor-pointer">
                    <div className="w-8 h-8 rounded-[8px] bg-ai-hover-1 flex items-center justify-center shrink-0 text-[16px]">{q.icon}</div>
                    <div>
                      <p className="text-[13px] font-medium text-ai-text">{q.title}</p>
                      <p className="text-[12px] text-ai-text-tertiary mt-0.5 leading-relaxed">{q.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Articles */}
            <div className="flex flex-col gap-px border border-ai-border rounded-[10px] overflow-hidden">
              {currentSection.articles.map((article, i) => (
                <button
                  key={i}
                  onClick={() => setActiveArticle(article.title)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 bg-ai-surface hover:bg-ai-hover-1 transition-colors text-left cursor-pointer group border-b border-ai-border last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ai-text truncate">{article.title}</p>
                    <p className="text-[11px] text-ai-text-tertiary mt-0.5">{article.time} read</p>
                  </div>
                  <span className="text-[11px] text-ai-text-tertiary shrink-0">{article.tag}</span>
                  <ChevronRight size={13} className="text-ai-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            {/* Other sections */}
            <div className="mt-10">
              <p className="text-[11px] font-medium text-ai-text-tertiary uppercase tracking-widest mb-3">Other sections</p>
              <div className="flex flex-wrap gap-2">
                {DOCS_SECTIONS.filter(s => s.title !== currentSection.title).map(s => (
                  <button
                    key={s.title}
                    onClick={() => { setActiveSection(s.title); setActiveArticle(null); }}
                    className="text-[12px] px-3 py-1.5 rounded-[8px] border border-ai-border bg-ai-surface hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ARTICLE READER */
          <div className="max-w-[680px] mx-auto pt-10 pb-16 px-8 animate-in fade-in duration-200">
            <button
              onClick={() => setActiveArticle(null)}
              className="flex items-center gap-1.5 text-[12px] text-ai-text-tertiary hover:text-ai-text mb-8 transition-colors cursor-pointer"
            >
              <ChevronLeft size={13} /> {currentSection.title}
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-ai-text-tertiary">{currentSection.articles.find(a => a.title === activeArticle)?.tag}</span>
              <span className="text-ai-text-tertiary">·</span>
              <span className="text-[11px] text-ai-text-tertiary">{currentSection.articles.find(a => a.title === activeArticle)?.time} read</span>
            </div>
            <h1 className="text-[24px] font-semibold text-ai-text mb-6">{activeArticle}</h1>
            <div className="w-full h-px bg-ai-border mb-8" />

            <div className="flex flex-col gap-5 text-[14px] text-ai-text-secondary leading-[1.8]">
              <p>
                This article covers <strong className="text-ai-text font-medium">{activeArticle}</strong> in detail. Cella Studio streamlines radiological case management through AI-powered automation, seamless collaboration tools, and a clean, fast interface.
              </p>
              <h2 className="text-[17px] font-semibold text-ai-text mt-1">Overview</h2>
              <p>
                Whether you're a radiologist processing high-volume imaging studies or a surgeon reviewing pre-operative data, Cella Studio adapts to your workflow. This section walks through the core concepts and provides step-by-step guidance.
              </p>
              <div className="rounded-[8px] border border-ai-border bg-ai-surface p-4">
                <p className="text-[12px] font-medium text-ai-text mb-1.5">💡 Pro tip</p>
                <p className="text-[13px] text-ai-text-secondary leading-relaxed">
                  You can jump directly to any section using the sidebar on the left, or press <kbd className="bg-ai-hover-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-ai-text border border-ai-border">⌘K</kbd> to open the command palette.
                </p>
              </div>
              <h2 className="text-[17px] font-semibold text-ai-text mt-1">Steps</h2>
              {['Start from the main dashboard', 'Select or create a case', 'Upload the relevant imaging data', 'Configure model parameters if needed', 'Review AI output and annotate as required', 'Share with your team or export the results'].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-ai-border flex items-center justify-center shrink-0 text-[11px] font-semibold text-ai-text-secondary mt-0.5">{i + 1}</div>
                  <p className="text-ai-text">{step}</p>
                </div>
              ))}
              <div className="rounded-[8px] border border-ai-border bg-ai-surface p-4 mt-1">
                <p className="text-[12px] font-medium text-ai-text mb-1.5">⚠️ Important</p>
                <p className="text-[13px] text-ai-text-secondary leading-relaxed">Always verify AI-generated annotations against the source imaging data before including findings in a clinical report.</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-ai-border flex items-center justify-between">
              <p className="text-[12px] text-ai-text-tertiary">Was this helpful?</p>
              <div className="flex gap-2">
                <button className="text-[12px] px-3 py-1.5 rounded-[8px] border border-ai-border hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">Yes</button>
                <button className="text-[12px] px-3 py-1.5 rounded-[8px] border border-ai-border hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">No</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT TOC */}
      <div className="w-[180px] shrink-0 border-l border-ai-border pt-10 pb-4 px-4 flex flex-col gap-6 overflow-y-auto">
        {!activeArticle ? (
          <>
            <div>
              <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">On this page</p>
              <div className="flex flex-col gap-1.5">
                {(currentSection.title === 'Getting Started'
                  ? ['Overview', 'Quick start', 'Articles', 'Other sections']
                  : ['Overview', 'Articles', 'Other sections']
                ).map(item => (
                  <button key={item} className="text-left text-[12px] text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer py-0.5">{item}</button>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-ai-border" />
            <div>
              <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">Changelog</p>
              <div className="flex flex-col gap-3">
                {[{ v: 'v2.4', note: 'DICOM multi-series' }, { v: 'v2.3', note: 'Webhook retries' }, { v: 'v2.2', note: 'Liver model' }].map(u => (
                  <div key={u.v} className="flex flex-col">
                    <span className="text-[10px] font-semibold text-ai-text-tertiary">{u.v}</span>
                    <span className="text-[11px] text-ai-text-secondary leading-snug">{u.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">Contents</p>
            <div className="flex flex-col gap-1.5">
              {['Overview', 'Steps', 'Important', 'Feedback'].map(item => (
                <button key={item} className="text-left text-[12px] text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer py-0.5">{item}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




// -------------------------------------------------------------------------------- //
// DISCOVER VIEW (Marketplace)
// Navigates down to subcategories: All Cases -> Category -> Subcategory
// -------------------------------------------------------------------------------- //

function DiscoverView({ onViewModel }: { onViewModel?: (caseData: any) => void }) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
   const [filterType, setFilterType] = useState("Colorectal");

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const specialtiesScrollRef = useRef<HTMLDivElement>(null);

  const scrollSpecialtiesLeft = () => {
    if (specialtiesScrollRef.current) {
      specialtiesScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollSpecialtiesRight = () => {
    if (specialtiesScrollRef.current) {
      specialtiesScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const featuredScrollItems = [
    { title: "Colorectal", category: "Colorectal", description: "Advanced guides", letter: "C", gradient: "from-[#FFB7B7] to-[#FF7B7B]", glow: "shadow-red-500/20" },
    { title: "General", category: "General Surgery", description: "Standard models", letter: "G", gradient: "from-[#BEF264] to-[#84CC16]", glow: "shadow-lime-500/20" },
    { title: "Cardiac", category: "Cardiac Surgery", description: "Valve & tissue", letter: "C", gradient: "from-[#93C5FD] to-[#3B82F6]", glow: "shadow-blue-500/20" },
    { title: "Urology", category: "Urology", description: "Renal & Pelvic", letter: "U", gradient: "from-[#86EFAC] to-[#22C55E]", glow: "shadow-green-500/20" },
    { title: "Hepatobiliary", category: "Hepatobiliary", description: "Liver expert", letter: "H", gradient: "from-[#FCD34D] to-[#F59E0B]", glow: "shadow-amber-500/20" },
    { title: "Thoracic", category: "Thoracic Surgery", description: "Pulmonary path", letter: "T", gradient: "from-[#D8B4FE] to-[#A855F7]", glow: "shadow-purple-500/20" },
  ];

  const subcategories = [
    { name: "Hepatobiliary", count: 6 },
    { name: "Colorectal", count: 12 },
    { name: "Esophagogastric", count: 8 },
    { name: "Pancreatics", count: 4 },
  ];

  const productIndications = [
    {
      label: "Primary Malignant Tumors",
      items: ["Hepatocellular Carcinoma (HCC)", "Intrahepatic Cholangiocarcinoma", "Hepatic Angiosarcoma"]
    },
    {
      label: "Metastatic Malignant Tumors",
      items: []
    },
    {
      label: "Benign or Premalignant Lesions",
      items: []
    },
    {
      label: "Cystic and Congenital Liver Diseases",
      items: []
    },
    {
      label: "Vascular Pathologies",
      items: []
    }
  ];

  const [caseCardsLevel1, setCaseCardsLevel1] = useState([
    { 
      isForMe: true, 
      category: "Esophagogastric", 
      title: "Esophagogastric Junction", 
      image: "/images/models/intestines_3d_1772712054852.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.3 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.5 mm", phase: "Arterial/Venous", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "General Surgery", 
      title: "Hepatobiliopancreatic", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.5 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" },
        { url: "/models/vasculatura_venosa.stl", color: "#1d4ed8" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.0 mm", phase: "Multiphase", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "Renal", 
      title: "Renal Cell Carcinoma", 
      image: "/images/models/kidneys_3d_1772712147028.png",
      layers: [
        { url: "/models/rinones.stl", color: "#ffccd1", opacity: 0.5 },
        { url: "/models/ureteres.stl", color: "#fbbf24" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT/MRI", format: "DICOM", thickness: "< 2.0 mm", phase: "Nephrographic", contrast: "Yes" }
    },
    { 
      isForMe: true, 
      category: "General Surgery", 
      title: "Hepatobiliopancreatic (Standard)", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.5 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.0 mm", phase: "Multiphase", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "Thoracic", 
      title: "Bronchial Adenoma", 
      image: "/images/models/lungs_3d_1772712131331.png",
      layers: [
        { url: "/models/costillas.stl", color: "#e2e8f0", opacity: 0.2 },
        { url: "/models/vasculatura_arterial.stl", color: "#ef4444" },
        { url: "/models/tumor_arterial.stl", color: "#fbbf24" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.25 mm", phase: "Single phase", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "Head & Neck", 
      title: "Oropharyngeal Carcinomas", 
      image: "/images/models/brain_3d_1772712116509.png",
      layers: [
        { url: "/models/vasculatura_arterial.stl", color: "#ef4444" },
        { url: "/models/tumor_arterial.stl", color: "#fbbf24" }
      ],
      indications: productIndications,
      requirements: { modality: "MRI", format: "DICOM", thickness: "< 1.0 mm", phase: "T1/T2 Gado", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "Esophagogastric", 
      title: "Gastric Volvulus", 
      image: "/images/models/intestines_3d_1772712054852.png",
      layers: [
        { url: "/models/parenquima_funcional.stl", color: "#f87171", opacity: 0.4 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 2.0 mm", phase: "Portal", contrast: "Yes" }
    },
    { 
      isForMe: false, 
      category: "General Surgery", 
      title: "Achalasia", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.6 }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 2.0 mm", phase: "Single phase", contrast: "No" }
    },
  ]);


  const sortedCards = useMemo(() => {
    const list = [...caseCardsLevel1];
    if (sortBy === "Recommended") {
      return list.sort((a, b) => (a.isForMe === b.isForMe ? 0 : a.isForMe ? -1 : 1));
    }
    if (sortBy === "Alphabetical (A-Z)") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [caseCardsLevel1, sortBy]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setLevel(2);
  };

  const handleSubcategoryClick = (sub: string) => {
    setActiveSubcategory(sub);
    setLevel(3);
  };

  const handleBack = () => {
    if (level === 3) {
      setLevel(2);
      setActiveSubcategory(null);
    } else if (level === 2) {
      setLevel(1);
      setActiveCategory(null);
    }
  };

  return (
    <div className="flex flex-col gap-[35px] w-full mt-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-medium text-ai-text tracking-tight">Discover</h1>
        <p className="text-[14px] text-ai-text-secondary">
          Find the surgical guide or 3D model that fits your needs.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {/* Section Title & Nav */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-semibold text-ai-text">{level === 1 ? "Specialties" : activeCategory}</h2>
          </div>
          {level === 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollSpecialtiesLeft}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white dark:bg-ai-surface border border-ai-border hover:bg-ai-hover-1 text-ai-text transition-all cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollSpecialtiesRight}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white dark:bg-ai-surface border border-ai-border hover:bg-ai-hover-1 text-ai-text transition-all cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Categories Row */}
        <div ref={specialtiesScrollRef} className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full pb-4 -mb-4 scroll-smooth">
          {level === 1 ? (
            featuredScrollItems.map((item, i) => (
              <div
                key={i}
                className={`flex flex-row items-center w-auto min-w-[170px] p-2.5 rounded-[8px] bg-white dark:bg-ai-surface border border-ai-border hover:border-ai-text-secondary/30 transition-all duration-300 cursor-pointer shrink-0 snap-start active:scale-95 group/category relative`}
                onClick={() => handleCategoryClick(item.category)}
              >
                <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 bg-gradient-to-br ${item.gradient} relative`}>
                  <span className="text-[16px] font-bold text-white uppercase">{item.letter}</span>
                </div>
                
                <div className="flex flex-col ml-4">
                  <h3 className="text-[14px] font-bold text-ai-text leading-tight">{item.title}</h3>
                  <p className="text-[11px] text-ai-text-tertiary">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-4 shrink-0 w-full animate-in fade-in slide-in-from-left-2 duration-300">
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 h-[36px] px-4 rounded-[8px] bg-ai-surface border border-ai-border hover:bg-ai-hover-1 transition-all text-ai-text"
              >
                <ArrowLeft size={16} />
                <span className="font-medium text-[13px]">Back</span>
              </button>
              
              <div className="h-[24px] w-px bg-ai-border" />

              {level === 2 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {subcategories.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubcategoryClick(s.name)}
                      className="group flex items-center h-[36px] px-4 rounded-[8px] bg-white dark:bg-ai-surface border border-ai-border hover:bg-ai-hover-1 text-ai-text text-[13px] font-medium whitespace-nowrap transition-all"
                    >
                      {s.name} 
                      <span className="ml-2 text-ai-text-tertiary">
                        ({s.count})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {level === 3 && (
                <div className="flex items-center gap-3">
                   <div className="px-3 py-1 rounded-[8px] bg-ai-hover-1 border border-ai-border">
                     <h2 className="font-bold text-[13px] text-ai-text-secondary">{activeSubcategory}</h2>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All products header section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-semibold text-[20px] text-ai-text tracking-tight">
            {level === 1 && "All Products"}
            {level === 2 && activeCategory}
            {level === 3 && activeSubcategory}
          </h2>

          {/* Search & Filters Row */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group/search">
               <SmartSearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search products..."
                suggestions={['Ischemic colitis', 'Liver Metastases', 'Renal carcinoma']}
                className="w-[260px] h-[36px] bg-white dark:bg-ai-surface border-ai-border transition-all rounded-[8px]"
              />
            </div>
            

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer transition-all">
                  <ArrowUpDown size={14} className="text-ai-text-tertiary" />
                  {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-1 shadow-md">
                {['Recommended', 'Most popular', 'Newest', 'Alphabetical (A-Z)'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSortBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-[6px] flex items-center gap-2 p-2">
                    {sortBy === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {sortBy !== s && <span className="w-3" />}
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {sortedCards.map((card, idx) => (
          <div 
            key={idx} 
            className="group flex flex-col bg-white dark:bg-ai-surface rounded-[8px] overflow-hidden transition-all duration-300 cursor-pointer relative"
          >
            {/* Visual Header - 3D Canvas Thumbnail */}
            <div 
              onClick={() => setSelectedProduct(card)}
              className="relative aspect-square bg-[#f8fafc] dark:bg-[#1a1b1e] overflow-hidden group/thumb cursor-pointer"
            >
               {card.isForMe && (
                <div className="absolute top-3 left-3 z-20">
                   <div className="flex items-center gap-1.5 px-[13px] py-[7px] rounded-full bg-white/90 dark:bg-ai-surface/90 border border-ai-border backdrop-blur-sm">
                      <Zap size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[11px] font-semibold text-ai-text capitalize tracking-wider">Recommended</span>
                   </div>
                </div>
               )}

              {/* Product render - NOW INTERACTIVE 3D */}
              <div className="w-full h-full group-hover/thumb:scale-[1.02] transition-transform duration-500">
                <Simple3DViewer layers={card.layers} showBadge={false} showControls={false} />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center mb-1">
                 <span className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                   {card.category}
                 </span>
              </div>
              
              <h3 className="font-bold text-[14px] text-ai-text leading-tight mb-4">
                {card.title}
              </h3>

               <div className="mt-auto flex items-center justify-between">
                  <div 
                    onClick={() => setSelectedProduct(card)}
                    className="flex items-center gap-1.5 text-[12px] font-bold text-ai-text-secondary hover:text-ai-text transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View 3D Model</span>
                  </div>
                 <button className="h-[32px] px-4 bg-[var(--ai-accent)] hover:opacity-90 text-white dark:text-black rounded-[8px] font-bold text-[12px] transition-all active:scale-95">
                   Request
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-[1000px] w-[95vw] h-[80vh] p-0 overflow-hidden bg-white dark:bg-ai-surface border-ai-border rounded-[16px] flex flex-col md:flex-row shadow-2xl">
          {selectedProduct && (
            <>
              {/* Left: 3D Preview */}
              <div className="w-full md:w-[58%] h-full relative border-b md:border-b-0 md:border-r border-ai-border bg-[#f8fafc] dark:bg-ai-surface/10">
                <Simple3DViewer layers={selectedProduct.layers} />
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                   <DialogTitle className="text-[20px] font-bold text-ai-text">{selectedProduct.title}</DialogTitle>
                   <DialogDescription className="text-[12px] font-bold text-blue-500 uppercase tracking-widest">
                     {selectedProduct.category}
                   </DialogDescription>
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-ai-surface/30">
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
                    
                    {/* Indications */}
                    <div className="flex flex-col gap-3.5">
                       <h3 className="text-[13px] font-bold text-ai-text uppercase tracking-widest flex items-center gap-2 px-1">
                         <Info size={15} className="text-blue-500" />
                         Indications of Use
                       </h3>
                       <div className="flex flex-col gap-2">
                          {selectedProduct.indications.map((group: any, i: number) => (
                            <CollapsibleIndication key={i} group={group} />
                          ))}
                       </div>
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col gap-3.5">
                       <h3 className="text-[13px] font-bold text-ai-text uppercase tracking-widest flex items-center gap-2 px-1">
                         <Box size={15} className="text-blue-500" />
                         Technical Requirements
                       </h3>
                       <div className="rounded-[12px] border border-ai-border overflow-hidden bg-white dark:bg-ai-surface shadow-sm text-ai-text">
                          <table className="w-full text-left text-[13px]">
                             <tbody>
                                {[
                                  { label: "Modality", value: selectedProduct.requirements.modality },
                                  { label: "Format", value: selectedProduct.requirements.format },
                                  { label: "Slice Thickness", value: selectedProduct.requirements.thickness },
                                  { label: "Phase", value: selectedProduct.requirements.phase },
                                  { label: "Contrast", value: selectedProduct.requirements.contrast }
                                ].map((row, i) => (
                                  <tr key={i} className={`border-b border-ai-border last:border-0 hover:bg-ai-hover-1/20 transition-colors`}>
                                    <td className="px-4 py-3 font-bold text-ai-text-secondary text-[10px] uppercase tracking-wider w-2/5 border-r border-ai-border/50">
                                      {row.label}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-ai-text">
                                      {row.value}
                                    </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>

                 {/* Fixed Footer with Button */}
                 <div className="p-6 border-t border-ai-border bg-white dark:bg-ai-surface/50 backdrop-blur-md flex flex-col gap-3">
                    <Button className="w-full h-[48px] bg-[var(--ai-accent)] hover:opacity-90 text-white dark:text-black rounded-[10px] font-bold text-[14px] active:scale-95 transition-all shadow-lg shadow-[var(--ai-accent)]/10">
                      Request
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (selectedProduct && onViewModel) {
                          onViewModel({
                            ...selectedProduct,
                            clave: "DEMO-CASE",
                            subClave: selectedProduct.category,
                            subProyecto: selectedProduct.title,
                            proyecto: "Product Preview",
                            status: "Demo",
                            avatars: [{ initials: "CS", name: "Cella Specialist" }]
                          });
                          setSelectedProduct(null);
                        }
                      }}
                      className="w-full h-[48px] bg-transparent border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[10px] font-bold text-[14px] active:scale-95 transition-all"
                    >
                      Try Model
                    </Button>
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CollapsibleIndication({ group }: { group: { label: string; items: string[] } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col border border-ai-border/50 rounded-[12px] overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3.5 bg-ai-hover-1/30 hover:bg-ai-hover-1 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-blue-500' : 'bg-ai-text-tertiary shadow-sm'}`} />
          <span className={`text-[13.5px] font-bold ${open ? 'text-ai-text' : 'text-ai-text-secondary'} transition-colors`}>
            {group.label}
          </span>
        </div>
        <ChevronDown size={14} className={`text-ai-text-tertiary transition-transform duration-300 ${open ? 'rotate-180 text-blue-500' : ''}`} />
      </button>
      {open && (
        <div className="p-3.5 pt-1 bg-white dark:bg-ai-surface/20 flex flex-col gap-2.5 animate-in slide-in-from-top-1 duration-200">
          {group.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 ml-1">
              <CheckCircle size={13} className="text-blue-500/80 mt-0.5 shrink-0" />
              <span className="text-[12.5px] text-ai-text-secondary leading-tight">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Tour Component
function TourCard({ 
  step, 
  onNext, 
  onSkip, 
  current, 
  total 
}: { 
  step: { target: string; title: string; content: string; position: string }; 
  onNext: () => void; 
  onSkip: () => void; 
  current: number; 
  total: number;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateCoords = () => {
      const el = document.getElementById(step.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateCoords();
    window.addEventListener('resize', updateCoords);
    return () => window.removeEventListener('resize', updateCoords);
  }, [step.target]);

  const getPositionStyles = () => {
    const PADDING = 20;
    const CARD_HEIGHT = 160; 
    const CARD_WIDTH = 320;

    let { top, left, width, height } = coords;
    let finalTop = 0;
    let finalLeft = 0;
    let finalTransform = '';
    let arrowPos = step.position;

    switch(step.position) {
      case 'right':
        finalTop = top + height/2;
        finalLeft = left + width + 20;
        finalTransform = 'translateY(-50%)';
        break;
      case 'bottom':
        finalTop = top + height + 20;
        finalLeft = left + width/2;
        finalTransform = 'translateX(-50%)';
        break;
      case 'left':
        finalTop = top + height/2;
        finalLeft = left - (CARD_WIDTH + 20);
        finalTransform = 'translateY(-50%)';
        break;
      case 'top':
      default:
        finalTop = top - (CARD_HEIGHT + 20);
        finalLeft = left + width/2;
        finalTransform = 'translateX(-50%)';
        if (finalTop < PADDING) {
          finalTop = top + height + 20;
          arrowPos = 'bottom';
        }
        break;
    }

    return { 
      top: finalTop, 
      left: finalLeft, 
      transform: finalTransform,
      arrowPos
    };
  };

  const pos = getPositionStyles();

  return (
    <>
      {/* SHARP SVG MASK OVERLAY */}
      <svg 
        className="fixed inset-0 w-full h-full pointer-events-auto cursor-pointer z-[1001]"
        onClick={onSkip}
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White area is visible (the dark overlay) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black area is hidden (the hole) - Perfectly sharp, no anti-aliasing artifacts */}
            <rect 
              x={coords.left} 
              y={coords.top} 
              width={coords.width} 
              height={coords.height} 
              rx="12" 
              fill="black" 
            />
          </mask>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          fill="rgba(0, 0, 0, 0.5)" 
          mask="url(#spotlight-mask)" 
        />
      </svg>

      {/* BLUE FOCUS RING (Visual decoration only) */}
      <div 
        className="absolute z-[1001] pointer-events-none rounded-[12px] ring-[2px] ring-blue-500 transition-all duration-500 ease-in-out"
        style={{
          top: coords.top,
          left: coords.left,
          width: coords.width,
          height: coords.height,
        }}
      />
      
      {/* SOLID WHITE CARD */}
      <div 
        className="absolute z-[1002] pointer-events-auto bg-white dark:bg-ai-surface border border-ai-border rounded-[8px] w-[320px] p-5 animate-in slide-in-from-bottom-2 duration-300"
        style={{
          top: pos.top,
          left: pos.left,
          transform: pos.transform
        }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ai-text-tertiary uppercase tracking-wider">Step {current} of {total}</span>
            <button onClick={onSkip} className="h-6 w-6 flex items-center justify-center text-ai-text-tertiary hover:text-ai-text transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-[15px] font-bold text-ai-text tracking-tight">{step.title}</h4>
            <p className="text-[13px] text-ai-text-secondary leading-normal">{step.content}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={onSkip} className="text-[13px] font-medium text-ai-text-tertiary hover:text-ai-text transition-colors">Skip</button>
            <Button 
              onClick={onNext}
              className="bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] border-none shadow-none rounded-[8px] px-5 h-[36px] text-[13px] font-semibold flex items-center transition-colors"
            >
              {current === total ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>

        {/* REFINED ARROW */}
        <div 
          className="absolute w-3 h-3 bg-white dark:bg-ai-surface border-ai-border border-l border-t transition-all duration-300"
          style={{
            ...(pos.arrowPos === 'right' ? { left: -6, top: '50%', transform: 'translateY(-50%) rotate(-45deg)' } : 
               pos.arrowPos === 'bottom' ? { top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)' } :
               pos.arrowPos === 'left' ? { right: -6, top: '50%', transform: 'translateY(-50%) rotate(135deg)' } :
               { bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(225deg)' })
          }}
        />
      </div>
    </>
  );
}
