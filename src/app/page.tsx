"use client";

import { useState, useEffect, useRef } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  LayoutGrid,
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
  CalendarPlus
} from "lucide-react";

import { CaseDetailsSidebar } from "@/components/CaseDetailsSidebar";
import { CaseVisualizerView } from "@/components/CaseVisualizerView";
import { SpecialtiesCarousel } from "@/components/SpecialtiesCarousel";
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
    status: 'Blocked', subStatus: 'Incomplete documentation', statusColor: 'bg-red-500', showEdit: true,
  },
  {
    id: '2', clave: 'ID224594', subClave: 'Neurology', proyecto: 'Atypical meningioma',
    subProyecto: 'PTR AN1309531640', date: '12 DEC 2025', dateObj: new Date(2025, 11, 12),
    estimatedDelivery: '16 DEC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }],
    status: 'In progress', subStatus: 'Est. delivery 12/12/25', statusColor: 'bg-[#fbbc04]',
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
    status: 'Pending', subStatus: 'Awaiting imaging', statusColor: 'bg-gray-300 dark:bg-[#e3e3e3] shadow-none dark:shadow-[0_0_4px_rgba(227,227,227,0.5)]',
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

  if (isLoading) return null;

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#0a0a0b] text-white font-sans overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        
        <div className="relative w-full max-w-[400px] px-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex flex-col items-center gap-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/20">
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
                  <Lock size={18} className={error ? 'text-red-400' : 'text-gray-500 group-focus-within:text-blue-400'} />
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
                type="submit"
                className="h-14 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/5"
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
    "Guest Project": "Guest Project"
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

  const handleViewModel = (caseData: any) => {
    setSelectedCase(caseData);
    setCurrentView('visualizer');
  };
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSearch, setInviteSearch] = useState("");
  const [collaborators, setCollaborators] = useState<{ initials: string; name: string; email: string; role: string; color: string }[]>([
    { initials: 'CM', name: 'Claudio Martínez', email: 'claudio@hospital.es', role: 'Owner', color: 'bg-purple-600' },
    { initials: 'LR', name: 'Laura Ruiz', email: 'laura@hospital.es', role: 'Editor', color: 'bg-blue-600' },
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
      <div className={`flex transition-all duration-300 flex-1 overflow-hidden ${chatSidebarOpen ? "bg-white dark:bg-[#0f1112] my-3 ml-3 rounded-[16px] border border-solid border-ai-border" : "h-full bg-transparent"}`}>

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
                    className="flex items-center justify-center w-7 h-7 rounded-[6px] hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer shrink-0"
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
                      className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-[7px] text-left transition-colors cursor-pointer ${docsSection === section
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
                      <Button variant="ghost" onClick={() => { setActiveProject('Team project'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Team project' && currentView === 'project_detail' ? 'text-[#0782f5] bg-[#0782f5]/10 dark:bg-[#0782f5]/15 hover:bg-[#0782f5]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Team project']}</Button>
                      <Button variant="ghost" onClick={() => { setActiveProject('Guest Project'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Guest Project' && currentView === 'project_detail' ? 'text-[#0782f5] bg-[#0782f5]/10 dark:bg-[#0782f5]/15 hover:bg-[#0782f5]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Guest Project']}</Button>
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
                    <PopoverContent side="right" align="end" sideOffset={16} className="w-[400px] p-4 rounded-[16px] shadow-lg border-ai-border bg-white dark:bg-[#131314]">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-3 w-full">
                          <p className="font-semibold text-ai-text text-[15px]">Your feedback is important to us</p>
                          <div className="bg-ai-base border border-ai-border flex items-start h-[100px] p-3 rounded-[8px] w-full focus-within:ring-1 focus-within:ring-[#0782f5] transition-shadow">
                            <textarea className="bg-transparent border-none outline-none resize-none flex-1 text-[13px] text-ai-text placeholder:text-ai-text-tertiary w-full h-full" placeholder="Write your feedback and opinions here..." />
                          </div>
                        </div>
                        <div className="flex justify-end w-full">
                          <Button className="bg-[#0782f5] hover:bg-[#0782f5]/90 text-white px-4 py-2 rounded-[8px] flex items-center gap-2 h-auto text-[14px]">Send <ArrowRight size={16} /></Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <NavItem icon={<Settings size={18} />} label="Settings" expanded={leftNavOpen} active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
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
                      className={`h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-full px-4 gap-2 flex items-center shadow-none cursor-pointer transition-colors ${chatSidebarOpen ? "bg-ai-hover-1 border-ai-border-strong" : ""}`}
                    >
                      <Avatar className="w-[20px] h-[20px] border border-ai-border">
                        <AvatarFallback className="text-[9px] font-bold bg-blue-500 text-white">CS</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[14px]">Talk to Cella</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button className="h-[36px] bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] border-none shadow-none rounded-full px-4 text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors">
                      <Plus size={16} />
                      Create new case
                    </Button>

                    {/* Notifications */}
                    <div className="flex items-center mt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[36px] w-[36px] rounded-full text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text flex shrink-0 justify-center items-center border border-transparent mr-1"
                        onClick={() => { setIsTourOpen(true); setCurrentTourStep(0); }}
                        title="Start Tour"
                      >
                        <HelpCircle size={20} />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-[36px] w-[36px] rounded-full text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text flex shrink-0 justify-center items-center border border-transparent relative">
                            <Bell size={20} strokeWidth={2} />
                            <div className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-red-500 border-2 border-ai-surface"></div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[320px] bg-white dark:bg-ai-surface border-ai-border rounded-xl p-2 shadow-2xl space-y-1">
                          <div className="px-2 py-2 mb-1 border-b border-ai-border flex items-center justify-between">
                            <span className="font-semibold text-[14px] text-ai-text">Notifications</span>
                            <span className="text-[12px] text-[#0782f5] cursor-pointer hover:underline">Mark all as read</span>
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

                    <div className="w-px h-5 bg-ai-border mx-1" />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[36px] w-[36px] rounded-full text-ai-text-secondary hover:bg-ai-hover-1 hover:text-ai-text flex shrink-0 justify-center items-center border border-transparent"
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
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444] shadow-sm">
                                  <XCircle size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Desmoplastic tumor (ID224593)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Missing documentation to proceed to production</span>
                                </div>
                              </div>
                              <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-[12px] h-[32px] px-4 rounded-[6px] transition-all shadow-sm active:scale-95 border-none">
                                Fix Case
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-[12px] hover:bg-white/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444] shadow-sm">
                                  <RotateCcw size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Valve revision (ID224580)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Revision required by specialist</span>
                                </div>
                              </div>
                              <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-[12px] h-[32px] px-4 rounded-[6px] transition-all shadow-sm active:scale-95 border-none">
                                Review
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex flex-col">
                          <div className="w-full flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-medium text-ai-text shrink-0">
                              Recent Cases
                            </h2>
                            <span className="text-[13px] text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentView('cases')}>View all</span>
                          </div>

                          <div id="tour-recent-cases" className="border border-ai-border rounded-[8px] bg-white dark:bg-transparent overflow-hidden w-full">
                            <Table className="w-full text-[13px] table-fixed">
                              <TableHeader className="bg-transparent">
                                <TableRow className="border-b border-ai-border hover:bg-transparent h-[40px]">
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
                          <div className="border border-ai-border dark:border-white/10 bg-white dark:bg-[#131416] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[8px] p-6 flex flex-row items-start gap-6 text-left relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                            {/* Background decoration */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10" />
                            
                            <div className="relative shrink-0">
                               <Avatar className="w-[96px] h-[96px] max-[1680px]:w-[72px] max-[1680px]:h-[72px] border-4 border-white dark:border-[#131416] shadow-xl group-hover:scale-105 transition-transform duration-300 z-10">
                                 <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" />
                                 <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[32px] max-[1680px]:text-[24px]">LG</AvatarFallback>
                               </Avatar>
                               <div className="absolute bottom-1 right-1 w-5 h-5 max-[1680px]:bottom-0 max-[1680px]:right-0 max-[1680px]:w-4 max-[1680px]:h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#131416] z-20" />
                            </div>
                            
                            <div className="flex flex-col gap-3 min-w-0 relative z-10 flex-1">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-ai-text font-bold text-[20px] max-[1680px]:text-[16px] leading-tight">Laura Gómez</span>
                                <span className="text-[#1a73e8] dark:text-blue-400 font-semibold text-[13px] uppercase tracking-wider max-[1680px]:lowercase max-[1680px]:tracking-normal max-[1680px]:font-medium">CellaMS Sales Rep</span>
                              </div>

                              <div className="flex flex-col gap-2 w-full text-ai-text-secondary text-[13px]">
                                 <div 
                                    onClick={() => setIsContactSidebarOpen(true)}
                                    className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer group/item"
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
                            <span className="text-[13px] text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentView('discover')}>View all</span>
                          </div>
                          <div className="grid grid-cols-2 max-[1680px]:grid-cols-1 gap-3">
                            <div className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] shadow-sm rounded-[8px] p-4 flex flex-row items-center gap-4 cursor-pointer group hover:border-[#0782f5] transition-colors">
                              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[15px] border border-ai-border group-hover:border-[#0782f5] transition-colors shrink-0">C</div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-blue-600 transition-colors truncate">Ischemic colitis</span>
                                <span className="text-[11px] font-medium text-ai-text-tertiary">Colorectal</span>
                                <span className="text-[#0782f5] dark:text-blue-400 text-[11px] font-bold mt-1">Request now →</span>
                              </div>
                            </div>
                            <div className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] shadow-sm rounded-[8px] p-4 flex flex-row items-center gap-4 cursor-pointer group hover:border-[#0782f5] transition-colors">
                              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[15px] border border-ai-border group-hover:border-[#0782f5] transition-colors shrink-0">G</div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-blue-600 transition-colors truncate">Desmoplastic tumor</span>
                                <span className="text-[11px] font-medium text-ai-text-tertiary">General Surgery</span>
                                <span className="text-[#0782f5] dark:text-blue-400 text-[11px] font-bold mt-1">Request now →</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* NOVEDADES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[20px] font-medium text-ai-text">What's New</h3>
                            <span className="text-[13px] text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentView('blog')}>View all</span>
                          </div>
                          <div className="flex flex-col gap-2 border border-ai-border rounded-[8px] bg-white dark:bg-transparent p-6 shadow-sm">
                            {ARTICLES_DATA.map((article, idx) => (
                              <div 
                                key={article.id}
                                onClick={() => { setSelectedArticle(article); setCurrentView('article'); }}
                                className="bg-transparent py-2 flex items-start gap-4 rounded-xl cursor-pointer transition-colors duration-200 group border border-transparent"
                              >
                                <div className="bg-white dark:bg-[#131416] border border-ai-border p-2 rounded-lg shrink-0 mt-0.5 shadow-sm">
                                  {idx === 0 ? <ImageIcon size={18} className="text-ai-text-secondary" /> : 
                                   idx === 1 ? <Sparkles size={18} className="text-ai-text-secondary" /> : 
                                   <Settings size={18} className="text-ai-text-secondary" />}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                  <span className="text-ai-text font-semibold text-[15px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{article.title}</span>
                                  <span className="text-ai-text-tertiary text-[12px] leading-relaxed line-clamp-2">{article.id === 'cella-2-0' ? 'Advanced clinical visual intelligence with sub-second anatomical segmentation.' : article.id === 'auto-segmentation' ? 'Map vascular structures automatically with 99% accuracy.' : 'Export directly to standard medical imaging formats natively.'}</span>
                                  <div className="mt-1">
                                    <span className="text-[#0782f5] dark:text-blue-400 text-[12px] font-bold">Read more →</span>
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
                  />
                )}

                {currentView === 'project_detail' && activeProject && (
                  <ProjectDetailView
                    projectTitle={projectNames[activeProject] || activeProject}
                    cases={cases}
                    onCaseSelect={setSelectedCase}
                    onTitleChange={(newTitle) => setProjectNames(prev => ({ ...prev, [activeProject]: newTitle }))}
                    onViewModel={handleViewModel}
                    onBack={() => setCurrentView('projects')}
                  />
                )}

                {currentView === 'cases' && (
                  <CasesView onCaseSelect={setSelectedCase} onViewModel={handleViewModel} cases={cases} setCases={setCases} />
                )}

                {currentView === 'discover' && (
                  <DiscoverView />
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

                {currentView === 'settings' && (
                  <SettingsView onBack={() => setCurrentView('home')} />
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
                <button className="p-2 hover:bg-ai-hover-1 hover:text-ai-text rounded-full transition-colors cursor-pointer" title="Refresh">
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setChatSidebarOpen(false)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors cursor-pointer group"
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
                  <div className={`p-3 rounded-[16px] max-w-[85%] ${msg.role === 'user'
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
                  <div className="p-4 rounded-[16px] rounded-tl-[4px] bg-ai-surface border border-ai-border w-[60px] flex items-center justify-center gap-1.5 h-[40px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ai-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <div className="p-4 shrink-0 w-full">
              <div className="relative w-full rounded-[16px] bg-ai-hover-1 border border-ai-border p-3 flex flex-col min-h-[120px] focus-within:border-ai-border-strong transition-colors">
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
                    className="w-[32px] h-[32px] rounded-full bg-black dark:bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
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

      {/* Invite Collaborator Modal (Dashboard Level) */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0">
          <div className="p-5 pb-4 border-b border-ai-border flex items-center justify-between">
            <DialogTitle className="text-[16px] font-medium font-sans">Invite collaborator</DialogTitle>
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
                className="h-[40px] px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-[8px] text-[13px] font-medium shrink-0"
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
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 bg-purple-500/10 text-purple-400">Owner</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full shrink-0 transition-colors hover:opacity-80 ${collab.role === 'Editor' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}`}>
                              {collab.role}
                              <ChevronDown size={10} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px] p-1">
                            <DropdownMenuItem onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Editor' } : c))} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2">
                              {collab.role === 'Editor' && <Check size={12} className="text-blue-500" />}
                              {collab.role !== 'Editor' && <span className="w-3" />}
                              Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Viewer' } : c))} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2">
                              {collab.role === 'Viewer' && <Check size={12} className="text-blue-500" />}
                              {collab.role !== 'Viewer' && <span className="w-3" />}
                              Viewer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-ai-border my-1" />
                            <DropdownMenuItem onClick={() => setCollaborators(prev => prev.filter(c => c.email !== collab.email))} className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400 text-[13px] rounded-md flex items-center gap-2">
                              <Trash2 size={13} /> Remove
                            </DropdownMenuItem>
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
        } ${active ? "text-[#0782f5] font-medium shadow-none bg-[#0782f5]/10 dark:bg-[#0782f5]/15 hover:bg-[#0782f5]/20" : "hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text font-medium"} text-[14px]`}
      title={!expanded ? label : undefined}
    >
      <div className="flex items-center">
        <div className={`flex items-center justify-center shrink-0 ${expanded ? "mr-3" : ""} ${active ? "text-ai-text" : "text-ai-text-secondary"}`}>
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
  onViewDetails,
  onViewModel,
  onDelete
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
  onViewDetails?: (caseData: any) => void;
  onViewModel?: (caseData: any) => void;
  onDelete?: () => void;
}) {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveStep, setMoveStep] = useState<'select' | 'create'>('select');

  if (!clave || !proyecto) return null;
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSearch, setInviteSearch] = useState("");
  const [collaborators, setCollaborators] = useState<{ initials: string; name: string; email: string; role: string; color: string }[]>([
    { initials: 'CM', name: 'Claudio Martínez', email: 'claudio@hospital.es', role: 'Owner', color: 'bg-purple-600' },
    { initials: 'LR', name: 'Laura Ruiz', email: 'laura@hospital.es', role: 'Editor', color: 'bg-blue-600' },
    { initials: 'PG', name: 'Pedro García', email: 'pedro@hospital.es', role: 'Viewer', color: 'bg-teal-600' },
  ]);

  const handleMoveClick = () => {
    setIsMoveOpen(true);
    setMoveStep('select');
  };

  const handleShareClick = () => {
    setIsShareOpen(true);
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
          <span className="font-bold text-[15px] truncate w-full leading-tight uppercase tracking-tight">{subProyecto}</span>
          <div className="flex items-center gap-2 text-[11.5px] text-ai-text-secondary font-medium truncate w-full">
            <span className="text-ai-text-secondary/70 font-mono text-[10px] bg-ai-base px-1.5 py-0.5 rounded border border-ai-border shrink-0">{clave}</span>
            <span className="text-ai-text-secondary/80 truncate">{proyecto}</span>
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
                <TooltipContent className="bg-gray-800 text-white border-none shadow-lg text-[13px]">
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
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold border w-fit transition-all ${
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
              <Button variant="ghost" size="icon" className="h-[28px] w-[28px] text-ai-text-tertiary hover:text-ai-text hover:bg-ai-hover-1 rounded-full cursor-pointer">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[240px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 shadow-2xl space-y-1"
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
              <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                <MessageCircle size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Comments</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Share2 size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Share link</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleInviteClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Lock size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Invite collaborator</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-ai-border mx-1 opacity-50" />
              <DropdownMenuItem
                onClick={onDelete}
                className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
              >
                <Trash2 size={18} />
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
                          <Folder size={18} className={selectedProject === proj ? 'text-blue-500' : 'text-ai-text-secondary'} />
                          <span className={`text-[14px] ${selectedProject === proj ? 'text-blue-500 font-medium' : 'text-ai-text'}`}>{proj}</span>
                        </div>
                        {selectedProject === proj && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-ai-border flex justify-between items-center bg-black/10 dark:bg-black/20">
                    <Button variant="ghost" onClick={() => setMoveStep('create')} className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 px-3 h-[36px]">
                      + New folder
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="text-ai-text-secondary hover:text-ai-text h-[36px]">Cancel</Button>
                      <Button disabled={!selectedProject} onClick={() => setIsMoveOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] px-6 h-[36px]">Move</Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 pb-4 border-b border-ai-border flex items-center gap-3 w-full">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full shrink-0" onClick={() => setMoveStep('select')}>
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
                    <Button disabled={!newProjectName.trim()} onClick={() => setIsMoveOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] px-6 h-[36px]">Mover</Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Share Link Modal */}
          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0">
              <div className="p-5 pb-4 border-b border-ai-border">
                <DialogTitle className="text-[16px] font-medium font-sans">Share case</DialogTitle>
                <p className="text-[13px] text-ai-text-secondary mt-0.5">Share this case with others via link or platform</p>
              </div>

              {/* Copy Link Row */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 overflow-hidden group">
                  <Link size={14} className="text-ai-text-tertiary shrink-0" />
                  <span className="text-[12px] text-ai-text-secondary truncate flex-1 font-mono">
                    https://cella.studio/case/{clave.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className={`shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[6px] transition-all ${linkCopied
                      ? 'text-green-500 bg-green-500/10'
                      : 'text-blue-500 hover:bg-blue-500/10'
                      }`}
                  >
                    {linkCopied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                  </button>
                </div>

                {/* Social Share Options */}
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] text-ai-text-tertiary uppercase tracking-wide font-medium">Share via</p>
                  <div className="grid grid-cols-5 gap-2">
                    {/* Email */}
                    <a
                      href={`mailto:?subject=Check this case&body=https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-gray-100 dark:bg-[#1e1f22] hover:bg-gray-200 dark:hover:bg-[#27282c] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center">
                        <Mail size={18} className="text-white" />
                      </div>
                      <span className="text-[11px] text-ai-text-secondary group-hover:text-ai-text">Email</span>
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Check this case: https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-gray-100 dark:bg-[#1e1f22] hover:bg-gray-200 dark:hover:bg-[#27282c] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.857L0 24l6.335-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.367l-.36-.213-3.72.893.942-3.61-.234-.37A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" /></svg>
                      </div>
                      <span className="text-[11px] text-ai-text-secondary group-hover:text-ai-text">WhatsApp</span>
                    </a>
                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(`https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`)}&text=${encodeURIComponent('Check this case')}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-gray-100 dark:bg-[#1e1f22] hover:bg-gray-200 dark:hover:bg-[#27282c] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#2CA5E0] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.48 14.026 5.514 13.1c-.652-.204-.665-.652.136-.966l10.857-4.187c.544-.196 1.02.131.855.96z" /></svg>
                      </div>
                      <span className="text-[11px] text-ai-text-secondary group-hover:text-ai-text">Telegram</span>
                    </a>
                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-gray-100 dark:bg-[#1e1f22] hover:bg-gray-200 dark:hover:bg-[#27282c] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#0077B5] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </div>
                      <span className="text-[11px] text-ai-text-secondary group-hover:text-ai-text">LinkedIn</span>
                    </a>
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cella.studio/case/${clave.toLowerCase().replace(/\s+/g, '-')}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-gray-100 dark:bg-[#1e1f22] hover:bg-gray-200 dark:hover:bg-[#27282c] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </div>
                      <span className="text-[11px] text-ai-text-secondary group-hover:text-ai-text">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Invite Collaborator Modal */}
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-xl overflow-hidden gap-0">
              {/* Header */}
              <div className="p-5 pb-4 border-b border-ai-border flex items-center justify-between">
                <DialogTitle className="text-[16px] font-medium font-sans">Invitar colaborador</DialogTitle>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Email input + invite button row */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 focus-within:ring-1 focus-within:ring-ai-text-secondary/40 transition-shadow">
                    <input
                      type="email"
                      placeholder="Introduzca un email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="bg-transparent border-none outline-none text-[13px] text-ai-text w-full placeholder:text-ai-text-tertiary"
                    />
                  </div>
                  <Button
                    disabled={!inviteEmail.includes('@')}
                    onClick={() => setInviteEmail('')}
                    className="h-[40px] px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-[8px] text-[13px] font-medium shrink-0"
                  >
                    Invitar
                  </Button>
                </div>

                {/* Access level indicator */}
                <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-ai-border bg-ai-base cursor-pointer hover:bg-ai-hover-1 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <span className="text-[13px] text-ai-text">Solo tienen acceso las personas invitadas</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                {/* Search collaborators */}
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] text-ai-text-tertiary uppercase tracking-wide font-medium">Colaboradores actuales</p>
                  <div className="flex items-center h-[36px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2">
                    <Search size={14} className="text-ai-text-tertiary shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o email"
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
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 bg-purple-500/10 text-purple-400">Owner</span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full shrink-0 transition-colors hover:opacity-80 ${collab.role === 'Editor' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                                  }`}>
                                  {collab.role}
                                  <ChevronDown size={10} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px] p-1">
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Editor' } : c))}
                                  className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  {collab.role === 'Editor' && <Check size={12} className="text-blue-500" />}
                                  {collab.role !== 'Editor' && <span className="w-3" />}
                                  Editor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: 'Viewer' } : c))}
                                  className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  {collab.role === 'Viewer' && <Check size={12} className="text-blue-500" />}
                                  {collab.role !== 'Viewer' && <span className="w-3" />}
                                  Viewer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-ai-border my-1" />
                                <DropdownMenuItem
                                  onClick={() => setCollaborators(prev => prev.filter(c => c.email !== collab.email))}
                                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400 text-[13px] rounded-md flex items-center gap-2"
                                >
                                  <Trash2 size={13} />
                                  Remove
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

function CasesView({ onCaseSelect, onViewModel, cases, setCases }: { onCaseSelect: (c: any) => void; onViewModel: (c: any) => void; cases: CaseItem[]; setCases: React.Dispatch<React.SetStateAction<CaseItem[]>> }) {
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
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                {['All', 'Blocked', 'Pending', 'In progress', 'Completed'].map(f => (
                  <DropdownMenuItem key={f} onClick={() => setFilter(f)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filter === f && <Check size={12} className="text-blue-500" />}
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
              <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                {['Most recent', 'Least recent', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sort === s && <Check size={12} className="text-blue-500" />}
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
            <TableRow className="border-b border-ai-border hover:bg-transparent h-[40px] bg-ai-surface cursor-default">
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
        className={`fixed top-0 right-0 h-full w-[450px] bg-white dark:bg-ai-surface border-l border-ai-border shadow-2xl z-[100] transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-ai-border flex items-center justify-between bg-white dark:bg-ai-surface">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-blue-500 uppercase tracking-widest leading-none">Contact Specialist</span>
            <h2 className="text-[20px] font-semibold text-ai-text">Laura Gómez</h2>
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

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-ai-border/50">
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
                className="h-10 px-3 rounded-lg border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-blue-500 outline-none" 
                placeholder="Case #ID224593 - Documentation inquiry"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-ai-text-secondary uppercase">Message</label>
              <textarea 
                className="h-[150px] p-3 rounded-lg border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-blue-500 outline-none resize-none" 
                placeholder="Write your message here..."
              />
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-[48px] font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
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
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-white dark:bg-ai-surface border border-ai-border rounded-[8px] shadow-lg overflow-hidden">
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
function ProjectsView({ onProjectClick, projectNames, onTitleChange, cases }: {
  onProjectClick: (key: string) => void;
  projectNames: Record<string, string>;
  onTitleChange: (key: string, newTitle: string) => void;
  cases: CaseItem[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localTitle, setLocalTitle] = useState("");

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
    <div className="rounded-lg flex items-center justify-center bg-ai-hover-1 dark:bg-[#1d1f22]">
      <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">{letter}</span>
    </div>
  );

  const staticProjects = [
    {
      id: 1,
      keyName: "Guest Project",
      title: projectNames["Guest Project"] || "Guest Project",
      stats: "1 case",
      thumbnails: [<ThumbnailCell key="1" letter="G" />, <ThumbnailCell key="2" letter="S" />, <ThumbnailCell key="3" letter="C" />, <ThumbnailCell key="4" letter="N" />]
    },
    {
      id: 2,
      keyName: "Team project",
      title: projectNames["Team project"] || "Team project",
      stats: "4 cases",
      thumbnails: [
        <div key="1" className="bg-ai-hover-1 dark:bg-[#1d1f22] rounded-lg flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/20 select-none">T</span>
        </div>,
        <div key="2" className="bg-blue-500/10 dark:bg-[#0052ff]/20 rounded-lg flex items-center justify-center">
          <span className="text-[18px] font-semibold text-black/20 dark:text-white/25 select-none">M</span>
        </div>,
        <ThumbnailCell key="3" letter="A" />,
        <ThumbnailCell key="4" letter="R" />,
      ]
    }
  ];

  const extraProjectCards = extraProjects.map(p => ({
    ...p,
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
                className="flex items-center justify-center w-7 h-7 rounded-full border border-ai-border bg-ai-surface hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer shrink-0"
              >
                <Plus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-white dark:bg-ai-surface border-ai-border text-ai-text-secondary text-[12px] px-3 py-1.5 shadow-md [&>svg]:fill-ai-surface">
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                <CalendarIcon size={14} className="text-ai-text-tertiary" />
                <span>{projDateRange?.from ? (projDateRange.to ? <>{format(projDateRange.from, "LLL dd, y")} - {format(projDateRange.to, "LLL dd, y")}</> : format(projDateRange.from, "LLL dd, y")) : <span>Date</span>}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-ai-border bg-ai-surface shadow-md rounded-[8px]" align="end">
              <Calendar initialFocus mode="range" defaultMonth={projDateRange?.from} selected={projDateRange} onSelect={setProjDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                {projSort} <ChevronDown size={14} className="text-ai-text-tertiary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
              {['Most recent', 'Least recent', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                <DropdownMenuItem key={s} onClick={() => setProjSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                  {projSort === s && <Check size={12} className="text-blue-500" />}
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
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border rounded-[16px] p-0 overflow-hidden max-w-[380px] shadow-xl">
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
              className="w-full h-[40px] px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] text-ai-text outline-none focus:ring-1 focus:ring-[#0782f5] transition"
            />
          </div>
          <div className="flex justify-end gap-2 px-6 pb-5">
            <Button variant="ghost" onClick={() => setRenameId(null)} className="text-[13px] cursor-pointer">Cancel</Button>
            <Button
              onClick={() => handleSaveTitle(renameId!, allProjects.find(p => p.id === renameId)?.keyName ?? "", renameValue)}
              className="bg-[#0782f5] hover:bg-[#0782f5]/90 text-white text-[13px] rounded-[8px] cursor-pointer"
            >Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border rounded-[20px] p-0 overflow-hidden max-w-[490px] shadow-xl">
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
                  className="w-full h-[40px] px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] text-ai-text placeholder:text-ai-text-tertiary outline-none focus:ring-1 focus:ring-[#0782f5] transition"
                />
              </div>
              <div className="flex items-center justify-end gap-2 px-6 pb-6">
                <Button variant="ghost" onClick={() => setShowNewModal(false)} className="text-[13px] text-ai-text-secondary hover:text-ai-text cursor-pointer">Cancel</Button>
                <Button disabled={!newName.trim()} onClick={() => setModalStep(2)} className="bg-[#0782f5] hover:bg-[#0782f5]/90 text-white text-[13px] rounded-[8px] cursor-pointer">Continue</Button>
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
                  <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                    {['Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                      <DropdownMenuItem key={s} onClick={() => setModalSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                        {modalSort === s && <Check size={12} className="text-blue-500" />}
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-left transition-colors cursor-pointer ${selected ? 'bg-[#0782f5]/10 border border-[#0782f5]/30' : 'hover:bg-ai-hover-1 border border-transparent'}`}>
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-[#0782f5] border-[#0782f5]' : 'border-ai-border'}`}>
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
                <Button onClick={() => handleCreateProject(false)} className="bg-[#0782f5] hover:bg-[#0782f5]/90 text-white text-[13px] rounded-[8px] cursor-pointer">
                  Create project{selectedCases.length > 0 ? ` (${selectedCases.length})` : ""}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProjects.map(project => (
          <div key={project.id} onClick={() => onProjectClick(project.keyName)} className="bg-ai-surface border border-ai-border rounded-[20px] overflow-hidden cursor-pointer hover:border-ai-border-strong transition-colors group relative flex flex-col">

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-[3px] w-full bg-ai-base dark:bg-[#101113] p-[10px]" style={{ aspectRatio: '1/1' }}>
              {project.thumbnails}
            </div>

            {/* Title / Stats */}
            <div className="flex flex-col gap-0.5 px-4 py-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-ai-text group-hover:text-blue-500 transition-colors leading-tight truncate pr-2">
                  {project.title}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[13px] text-ai-text-secondary">{project.stats}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button onClick={(e) => e.stopPropagation()} className="p-1 bg-transparent hover:bg-ai-hover-1 rounded-md transition-colors cursor-pointer">
                      <MoreHorizontal size={16} className="text-ai-text-secondary" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border p-1.5 rounded-xl shadow-lg">
                    <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 rounded-md py-2">Open in new tab</DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-ai-text focus:bg-ai-hover-1 rounded-md py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameId(project.id);
                        setRenameValue(project.title);
                      }}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-ai-border" />
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 rounded-md py-2 flex items-center justify-between">
                      <span className="font-medium">Delete</span>
                      <Trash2 size={16} className="text-red-500" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
        {sortedProjects.length === 0 && (
          <div className="col-span-4 flex items-center justify-center py-16 text-[13px] text-ai-text-tertiary">No projects match your search.</div>
        )}
      </div>
    </div>
  );
}


function ProjectDetailView({
  projectTitle,
  cases,
  onCaseSelect,
  onViewModel,
  onTitleChange,
  onBack
}: {
  projectTitle: string,
  cases: CaseItem[],
  onCaseSelect: (c: any) => void,
  onViewModel: (c: any) => void,
  onTitleChange: (newTitle: string) => void,
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
    <div className="w-full flex flex-col mt-[100px] pb-16 animate-in fade-in duration-300">
      <div className="w-full flex flex-col gap-8 mb-6">
        <div className="w-full flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="w-[36px] h-[36px] rounded-full border-ai-border hover:bg-ai-hover-1 shadow-sm shrink-0"
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
              className="h-[28px] w-[28px] text-ai-text-tertiary hover:text-ai-text hover:bg-ai-hover-1 rounded-full self-end ml-[-4px] shrink-0"
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
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                {['All', 'Blocked', 'Pending', 'In progress', 'Completed'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filterBy === s && <Check size={12} className="text-blue-500" />}
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
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
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
            <TableRow className="border-b border-ai-border hover:bg-transparent h-[40px] bg-ai-surface cursor-default">
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
              statusColor="bg-gray-300 dark:bg-[#e3e3e3] shadow-none dark:shadow-[0_0_4px_rgba(227,227,227,0.5)]"
              onViewModel={onViewModel}
              onViewDetails={(c) => onCaseSelect(c)}
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
              isLink
              onViewModel={onViewModel}
              onViewDetails={(c) => onCaseSelect(c)}
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
        className={`fixed top-0 right-0 h-full w-[570px] bg-white dark:bg-ai-surface border-l border-ai-border shadow-2xl z-[100] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {invoice && (
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-ai-border flex items-center justify-between sticky top-0 bg-white/80 dark:bg-ai-surface/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-blue-500 uppercase tracking-widest">Invoice Details</span>
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
                <div className={`px-4 py-1.5 rounded-full text-[12px] font-bold shadow-sm border ${invoice.status === 'Paid'
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
                <div className="border border-ai-border rounded-[8px] overflow-hidden shadow-sm">
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
              <Button className="w-full bg-[#0782f5] hover:bg-[#0782f5]/90 text-white font-bold h-[48px] rounded-[8px] flex items-center gap-2 shadow-lg shadow-blue-500/20">
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
            <span className="text-[14px] font-bold text-[#0782f5] uppercase tracking-widest">{article.category}</span>
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
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-[44px]">
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
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setFilterBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {filterBy === s && <Check size={12} className="text-blue-500" />}
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
              <PopoverContent className="w-auto p-0 border-ai-border bg-ai-surface shadow-md rounded-[8px]" align="end">
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
              <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                {['Most recent', 'Least recent', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSortBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sortBy === s && <Check size={12} className="text-blue-500" />}
                    {sortBy !== s && <span className="w-3" />}
                    {s === 'A-Z' ? 'Alphabetical (A-Z)' : s === 'Z-A' ? 'Alphabetical (Z-A)' : s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border border-ai-border rounded-[8px] overflow-hidden w-full bg-white dark:bg-ai-surface/50 shadow-sm">
        <Table className="w-full text-[13px] table-fixed">
          <TableHeader>
            <TableRow className="border-b border-ai-border hover:bg-transparent h-[40px] bg-ai-surface cursor-default">
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
          className="relative w-full h-[400px] rounded-[24px] overflow-hidden group cursor-pointer border border-ai-border shadow-xl bg-ai-surface"
          onClick={() => onSelectArticle(featuredArticle)}
        >
          <img src={featuredArticle.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-3 max-w-2xl">
            <div className="flex gap-2">
              <span className="bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">{featuredArticle.category}</span>
              <span className="bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">{featuredArticle.date}</span>
            </div>
            <h2 className="text-[32px] font-bold text-white leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{featuredArticle.title}</h2>
            <p className="text-white/80 text-[16px] leading-relaxed line-clamp-2">Latest clinical advancements and product updates from the Cella Studio core engineering team.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white font-bold text-[14px]">Read full article</span>
              <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
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
                  <span className="text-blue-500">{article.category}</span>
                  <div className="w-1 h-1 rounded-full bg-ai-text-tertiary"></div>
                  <span>{article.date}</span>
                </div>
                <h4 className="text-[18px] font-bold text-ai-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{article.title}</h4>
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
    color: 'text-blue-400',
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
// SETTINGS VIEW
// -------------------------------------------------------------------------------- //

function SettingsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'logistics'>('profile');
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [address, setAddress] = useState({
    street: "Calle Dr. Fleming, 12",
    city: "Murcia",
    zip: "30001",
    phone: "+34 968 123 456"
  });

  return (
    <div className="w-full h-full animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-10 px-8 flex flex-col gap-10 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <Button variant="ghost" onClick={onBack} className="p-0 h-auto w-fit hover:bg-transparent text-ai-text-secondary hover:text-ai-text flex items-center gap-2">
              <ArrowLeft size={16} />
              <span className="text-[14px]">Back to Dashboard</span>
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] font-bold text-ai-text">Account Settings</h1>
              <p className="text-[15px] text-ai-text-secondary">Manage your professional profile, preferences, and security settings.</p>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex items-center gap-1 border-b border-ai-border pb-px">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-[14px] font-bold transition-all border-b-2 hover:text-ai-text ${activeTab === 'profile' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-ai-text-tertiary hover:bg-ai-hover-1/50'}`}
            >
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-[14px] font-bold transition-all border-b-2 hover:text-ai-text ${activeTab === 'security' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-ai-text-tertiary hover:bg-ai-hover-1/50'}`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab('logistics')}
              className={`px-4 py-3 text-[14px] font-bold transition-all border-b-2 hover:text-ai-text ${activeTab === 'logistics' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-ai-text-tertiary hover:bg-ai-hover-1/50'}`}
            >
              Logistics & Shipping
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. MY PROFILE CARD */}
            <section className="bg-white dark:bg-[#131416] border border-ai-border rounded-[8px] overflow-hidden">
              <div className="px-8 py-6 border-b border-ai-border bg-ai-base/30">
                <h2 className="text-[18px] font-bold text-ai-text">My Profile</h2>
              </div>
              <div className="p-8 flex flex-col gap-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-ai-border shadow-md">
                      <AvatarFallback className="bg-blue-600 text-white font-bold text-[28px]">AS</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                    <h3 className="text-[24px] font-bold text-ai-text">Dr. Prueba Alex Salmerón</h3>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">Doctor Profile</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                  <ProfileItem label="Medical Specialty" value="Cirugía general - Hepatobiliopancreática" />
                  <ProfileItem label="Primary Hospital" value="Cella Medical Solutions" />
                  <ProfileItem label="Platform Access Since" value="09-07-2025" />
                  <ProfileItem label="Last Active Session" value="10-04-2026 10:04:10" />
                </div>
              </div>
            </section>

            {/* 2. PERSONAL DETAILS CARD */}
            <section className="bg-white dark:bg-[#131416] border border-ai-border rounded-[8px] overflow-hidden">
              <div className="px-8 py-6 border-b border-ai-border bg-ai-base/30">
                <h2 className="text-[18px] font-bold text-ai-text">Personal Details</h2>
              </div>
              <div className="p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingsInput label="Primary Email" defaultValue="alejandrosalmeron+1@cellams.com" icon={<Mail size={16} />} />
                  <SettingsInput label="Alternative Email" placeholder="Optional contact email" icon={<Mail size={16} />} />
                  <SettingsInput label="Phone Number" placeholder="+34 600 000 000" icon={<MessageSquare size={16} />} />
                  <SettingsInput label="Colegiado Number" defaultValue="1" icon={<Sparkles size={16} />} />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Interface Language</label>
                  <div className="relative w-full max-w-[320px]">
                    <select className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px] text-ai-text appearance-none cursor-pointer">
                      <option value="es">🇪🇸 Español (ES)</option>
                      <option value="en">🇬🇧 English (EN)</option>
                      <option value="fr">🇫🇷 Français (FR)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ai-text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 4. SECURITY & AUTHENTICATION CARD */}
            <section className="bg-white dark:bg-[#131416] border border-ai-border rounded-[8px] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-ai-border bg-ai-base/30">
                <h2 className="text-[18px] font-bold text-ai-text">Security & Privacy</h2>
              </div>
              <div className="p-8 flex flex-col gap-6">
                <div 
                  onClick={() => setIsPasswordOpen(true)}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-ai-base/10 border border-ai-border hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ai-surface border border-ai-border flex items-center justify-center text-ai-text-secondary group-hover:bg-[#1a73e8] group-hover:text-white group-hover:border-[#1a73e8] transition-all shadow-sm shrink-0">
                    <Lock size={22} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[16px] font-bold text-ai-text">Change Password</span>
                    <span className="text-[13px] text-ai-text-tertiary font-medium">Strengthen your account security with a new password.</span>
                  </div>
                  <ChevronRight size={20} className="text-ai-text-tertiary group-hover:text-ai-text group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 3. LOGISTICS & SHIPPING CARD */}
            <section className="bg-white dark:bg-[#131416] border border-ai-border rounded-[8px] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-ai-border bg-ai-base/30">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-[18px] font-bold text-ai-text">Logistics & Shipping</h2>
                </div>
              </div>
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-ai-base/10 border border-ai-border group transition-all">
                  <div className="w-10 h-10 rounded-xl bg-ai-surface border border-ai-border flex items-center justify-center text-ai-text-secondary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-ai-text-tertiary uppercase tracking-wider">Default Delivery Address</span>
                    <p className="text-[15px] text-ai-text font-medium leading-relaxed">
                      {address.street}<br />
                      {address.zip} {address.city}<br />
                      <span className="text-ai-text-tertiary text-[13px] mt-1 block">{address.phone}</span>
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsLogisticsOpen(true)}
                    className="h-10 w-10 rounded-full border border-ai-border hover:bg-ai-hover-1 text-ai-text-tertiary transition-all ml-auto"
                  >
                    <Edit size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <Info size={16} className="text-blue-500 shrink-0" />
                  <p className="text-[12px] text-ai-text-tertiary italic font-medium">This address will be used as the default destination for all your surgical prototypes.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* FINAL SAVE ACTIONS - Non sticky as requested */}
        <div className="flex items-center justify-end gap-5 pt-10 border-t border-ai-border mt-4 pb-10">
          <Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white h-[44px] px-10 rounded-full font-bold shadow-none active:scale-95 transition-all text-[14px]">Save All Settings</Button>
        </div>

        {/* MODALS */}
        <Dialog open={isLogisticsOpen} onOpenChange={setIsLogisticsOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[480px] p-0 rounded-[8px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[18px] font-bold">Edit Shipping Address</DialogTitle>
              <p className="text-[13px] text-ai-text-tertiary">Provide a physical address for anatomical model deliveries.</p>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Street Address</label>
                <input 
                  className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]"
                  defaultValue={address.street}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">City</label>
                  <input 
                    className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]"
                    defaultValue={address.city}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Zip Code</label>
                  <input 
                    className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]"
                    defaultValue={address.zip}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Contact Phone</label>
                <input 
                  className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]"
                  defaultValue={address.phone}
                />
              </div>
            </div>
            <div className="p-6 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsLogisticsOpen(false)} className="h-[40px] px-6 rounded-full font-medium border border-ai-border">Cancel</Button>
              <Button onClick={() => setIsLogisticsOpen(false)} className="bg-[#1a73e8] hover:bg-[#155ebd] text-white h-[40px] px-8 rounded-full font-medium shadow-none">Update Address</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[440px] p-0 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[18px] font-bold">Update Password</DialogTitle>
              <p className="text-[13px] text-ai-text-tertiary">Ensure your account is using a secure, long password.</p>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]" />
              </div>
              <div className="h-px bg-ai-border w-full my-1" />
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Confirm New Password</label>
                <input type="password" placeholder="Repeat new password" className="w-full h-[48px] px-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[14px]" />
              </div>
            </div>
            <div className="p-6 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPasswordOpen(false)} className="h-[40px] px-6 rounded-full font-medium border border-ai-border">Cancel</Button>
              <Button onClick={() => setIsPasswordOpen(false)} className="bg-[#1a73e8] hover:bg-[#155ebd] text-white h-[40px] px-8 rounded-full font-medium shadow-none">Change Password</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">{label}</span>
      <span className="text-[16px] font-medium text-ai-text">{value}</span>
    </div>
  );
}

function SettingsInput({ label, defaultValue, placeholder, icon }: { label: string, defaultValue?: string, placeholder?: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ai-text-tertiary group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          className="w-full h-[48px] pl-11 pr-4 rounded-xl border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] text-ai-text"
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
                    className="text-[12px] px-3 py-1.5 rounded-[7px] border border-ai-border bg-ai-surface hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer"
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
                <button className="text-[12px] px-3 py-1.5 rounded-[7px] border border-ai-border hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">Yes</button>
                <button className="text-[12px] px-3 py-1.5 rounded-[7px] border border-ai-border hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">No</button>
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

function DiscoverView() {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Most popular");
  const [filterType, setFilterType] = useState("All");

  const specialtiesScrollRef = useRef<HTMLDivElement>(null);

  const scrollSpecialtiesLeft = () => {
    if (specialtiesScrollRef.current) {
      specialtiesScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollSpecialtiesRight = () => {
    if (specialtiesScrollRef.current) {
      specialtiesScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const featuredScrollItems = [
    { title: "Colorectal Surgery", category: "Colorectal", letter: "C", gradient: "from-[#d1d5db] to-[#9ca3af]", textColors: "text-gray-900" },
    { title: "General Surgery", category: "General Surgery", letter: "G", gradient: "from-[#bef264] to-[#84cc16]", textColors: "text-[#4d7c0f]" },
    { title: "Cardiac Surgery", category: "Cardiac Surgery", letter: "C", gradient: "from-[#93c5fd] to-[#3b82f6]", textColors: "text-blue-900" },
    { title: "Urology", category: "Urology", letter: "U", gradient: "from-[#86efac] to-[#22c55e]", textColors: "text-green-900" },
    { title: "Hepatobiliary Surgery", category: "Hepatobiliary", letter: "H", gradient: "from-[#fcd34d] to-[#f59e0b]", textColors: "text-amber-900" },
    { title: "Thoracic Surgery", category: "Thoracic Surgery", letter: "T", gradient: "from-[#d8b4fe] to-[#a855f7]", textColors: "text-purple-900" },
  ];

  const subcategories = [
    { name: "Hepatobiliar", count: 6 },
    { name: "Colorrectal", count: 12 },
    { name: "Esofagogástrica", count: 8 },
    { name: "Páncreas", count: 4 },
  ];

  const caseCardsLevel1 = [
    { isForMe: true, category: "Esofagogástrica", title: "Unión esofagogástrica", image: "/images/models/intestines_3d_1772712054852.png" },
    { isForMe: false, category: "General", title: "Hepatobiliopancreática", image: "/images/models/liver_3d_1772712040731.png" },
    { isForMe: false, category: "Renal", title: "Carcinoma de células renales", image: "/images/models/kidneys_3d_1772712147028.png" },
    { isForMe: true, category: "General", title: "Hepatobiliopancreática", image: "/images/models/liver_3d_1772712040731.png" },
    { isForMe: false, category: "Tórax", title: "Adenoma bronquial", image: "/images/models/lungs_3d_1772712131331.png" },
    { isForMe: false, category: "Cabeza y cuello", title: "Carcinomas orofaríngeos", image: "/images/models/brain_3d_1772712116509.png" },
    { isForMe: false, category: "Esofagogástrica", title: "Vólvulo gástrico", image: "/images/models/intestines_3d_1772712054852.png" },
    { isForMe: false, category: "General", title: "Acalasia", image: "/images/models/liver_3d_1772712040731.png" },
  ];

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
    <div className="flex flex-col gap-[35px] w-full mt-[100px] pb-16 animate-in fade-in duration-300">

      <div className="flex flex-col gap-[27px]">
        {/* Section Title & Nav */}
        <div className="flex items-center justify-between mb-0">
          <h2 className="text-[22px] font-medium text-ai-text">Specialties</h2>
          {level === 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollSpecialtiesLeft}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={scrollSpecialtiesRight}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Top Filters Row */}
        <div ref={specialtiesScrollRef} className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full pb-2 -mb-2 scroll-smooth">
          {level === 1 ? (
            featuredScrollItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-1.5 pr-6 rounded-full bg-white dark:bg-[#131416] border border-[#e5e7eb] dark:border-white/10 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 cursor-pointer shrink-0 snap-start group/pill"
                onClick={() => handleCategoryClick(item.category)}
              >
                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/pill:scale-[1.08] bg-gradient-to-br ${item.gradient}`}>
                  <div className="absolute inset-0 rounded-full border border-white/40 mix-blend-overlay" />
                  <div className="absolute inset-x-1 top-0.5 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full opacity-50" />
                  <span className={`text-[16px] font-bold text-white drop-shadow-sm z-10`}>{item.letter}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[13px] font-semibold text-[#191a1c] dark:text-ai-text leading-tight group-hover/pill:text-blue-600 dark:group-hover/pill:text-blue-400 transition-colors">{item.title}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-6 shrink-0 w-full border-b border-ai-border pb-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-ai-hover-1 transition-colors text-ai-text"
              >
                <ArrowLeft size={18} />
                <span className="font-medium text-[14px]">Volver atrás</span>
              </button>
              <div className="h-8 w-px bg-ai-border" />

              {level === 2 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {subcategories.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubcategoryClick(s.name)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-ai-surface border border-ai-border hover:bg-ai-hover-1 text-ai-text text-[14px] font-medium whitespace-nowrap transition-colors"
                    >
                      {s.name} <span className="text-ai-text-secondary font-normal">({s.count})</span>
                    </button>
                  ))}
                </div>
              )}

              {level === 3 && (
                <h2 className="font-semibold text-[18px] text-ai-text">{activeSubcategory}</h2>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All products header section */}
      <div className="flex flex-col gap-8">
        <h2 className="font-semibold text-[22px] text-ai-text leading-[1]">
          {level === 1 && "All products"}
          {level === 2 && activeCategory}
          {level === 3 && activeSubcategory}
        </h2>

        {/* Search & Filters Row - Moved below title */}
        {level === 1 && (
          <div className="flex items-center w-full justify-between mb-2">
            <SmartSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by products or pathologies..."
              suggestions={['Ischemic colitis', 'Desmoplastic tumor', 'Valve revision', 'Renal carcinoma', 'Liver Metastases', 'Tracheal stenosis']}
              className="w-[320px]"
            />
            <div className="flex items-center gap-4 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                    {filterType} <ChevronDown size={14} className="text-ai-text-tertiary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                  {['All', ...Array.from(new Set(featuredScrollItems.map(item => item.category)))].map(s => (
                    <DropdownMenuItem key={s as string} onClick={() => setFilterType(s as string)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                      {filterType === s && <Check size={12} className="text-blue-500" />}
                      {filterType !== s && <span className="w-3" />}
                      {s as React.ReactNode}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                    {sortBy} <ChevronDown size={14} className="text-ai-text-tertiary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border shadow-md rounded-[8px]">
                  {['Most popular', 'Newest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)'].map(s => (
                    <DropdownMenuItem key={s} onClick={() => setSortBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                      {sortBy === s && <Check size={12} className="text-blue-500" />}
                      {sortBy !== s && <span className="w-3" />}
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
        {caseCardsLevel1.map((card, idx) => (
          <div key={idx} className="flex flex-col gap-[16px] p-[16px] rounded-[16px] border border-ai-border bg-ai-surface hover:shadow-md transition-shadow cursor-pointer group relative">

            {/* Image Box */}
            <div className="relative w-full h-[136px] bg-[#f9fafa] dark:bg-[#1f1f21] rounded-[12px] overflow-hidden flex flex-col justify-start items-end p-2 border border-black/5 dark:border-white/5">
              {card.isForMe && (
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-[20px] p-1.5 flex items-center justify-center transition-all duration-300 border border-ai-border dark:border-white/10 shadow-sm z-10 group/help cursor-help">
                  <span className="text-[12px] font-medium text-ai-text whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/help:max-w-[200px] group-hover/help:opacity-100 group-hover/help:px-1 group-hover/help:mr-1 transition-all duration-300">Is this for me?</span>
                  <HelpCircle size={14} className="text-ai-text-secondary" />
                </div>
              )}
              {/* Product render */}
              <div className="absolute inset-0 flex items-center justify-center p-3 mix-blend-multiply dark:mix-blend-normal">
                <img src={card.image} alt={card.title} className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-1 w-full pl-1">
              <p className="font-normal text-[12px] text-ai-text-tertiary">{card.category}</p>
              <p className="font-semibold text-[14px] text-ai-text leading-tight">{card.title}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-2 w-full">
              <button className="w-full h-[36px] bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] rounded-[6px] font-medium text-[13px] transition-colors shadow-sm">
                Request
              </button>
              <button className="w-full h-[36px] bg-transparent hover:bg-ai-hover-1 text-[#a6b6c5] dark:text-[#a8c7fa] border border-transparent hover:border-ai-border rounded-[6px] font-medium text-[13px] transition-colors">
                View model
              </button>
            </div>
          </div>
        ))}
      </div>
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
        className="absolute z-[1002] pointer-events-auto bg-white dark:bg-ai-surface border border-ai-border shadow-2xl rounded-xl w-[320px] p-5 animate-in slide-in-from-bottom-2 duration-300"
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
              className="bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] border-none shadow-none rounded-full px-5 h-[36px] text-[13px] font-semibold flex items-center transition-colors"
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
