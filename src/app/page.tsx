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
  Stethoscope,
  Scissors,
  Microscope,
  GraduationCap,
  Activity,
  Box,
  Layout,
  FileUp,
  Workflow,
  CalendarPlus,
  Monitor,
  ArrowUpDown,
  Eye
} from "lucide-react";

import { CaseDetailsSidebar } from "@/components/CaseDetailsSidebar";
import { CaseVisualizerView } from "@/components/CaseVisualizerView";
import { SpecialtiesCarousel } from "@/components/SpecialtiesCarousel";
import { Simple3DViewer } from "@/components/Simple3DViewer";
import { LoginPage } from "@/components/LoginPage";
import { useRouter } from "next/navigation";
import { hierarchyData } from "@/app/request-case/step-2/page";
import { CellaLogo } from "@/components/CellaLogo";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

// ---------------------------------------------------------------------------
// Shared case data — single source of truth
// ---------------------------------------------------------------------------
type CaseItem = {
  id: string;
  clave: string;
  subID: string;
  proyecto: string;
  subProject: string;
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
    id: '1', clave: 'ID224593', subID: 'General', proyecto: 'Tumor desmoplásico',
    subProject: 'JER AN1309531635', date: '13 DIC 2025', dateObj: new Date(2025, 11, 13),
    estimatedDelivery: '18 DIC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }, { initials: 'CM', name: 'Claudio Martínez' }],
    status: 'Bloqueado', subStatus: 'Documentación incompleta', statusColor: 'bg-red-500', showEdit: true, isPidi: true,
  },
  {
    id: '2', clave: 'ID224594', subID: 'Neurología', proyecto: 'Meningioma atípico',
    subProject: 'PTR AN1309531640', date: '12 DIC 2025', dateObj: new Date(2025, 11, 12),
    estimatedDelivery: '16 DIC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }],
    status: 'En progreso', subStatus: 'Est. input 12/12/25', statusColor: 'bg-[#fbbc04]', isPidi: true,
  },
  {
    id: '3', clave: 'ID224580', subID: 'Cardiología', proyecto: 'Revisión de válvula',
    subProject: 'MNT AN1309531622', date: '10 DIC 2025', dateObj: new Date(2025, 11, 10),
    estimatedDelivery: '12 DIC 2025',
    avatars: [{ initials: 'CM', name: 'Claudio Martínez' }, { initials: 'DR', name: 'Daniela Ríos' }],
    status: 'Completado', subStatus: 'Ver modelo', statusColor: 'bg-ai-success', isLink: true,
  },
  {
    id: '4', clave: 'ID224582', subID: 'Hepatobiliopancreática', proyecto: 'Metástasis hepáticas',
    subProject: 'ALV AN1309531641', date: '09 DIC 2025', dateObj: new Date(2025, 11, 9),
    estimatedDelivery: '14 DIC 2025',
    avatars: [{ initials: 'AL', name: 'Antonio López' }, { initials: 'CM', name: 'Claudio Martínez' }],
    status: 'Pendiente', subStatus: 'Esperando imágenes', statusColor: 'bg-gray-300 dark:bg-[#e3e3e3]',
  },
  {
    id: '5', clave: 'ID224585', subID: 'Oncología', proyecto: 'Lesión pancreática',
    subProject: 'GRC AN1309531645', date: '08 DIC 2025', dateObj: new Date(2025, 11, 8),
    estimatedDelivery: '12 DIC 2025',
    avatars: [{ initials: 'AS', name: 'Ana Silva' }, { initials: 'DR', name: 'Daniela Ríos' }],
    status: 'En progreso', subStatus: 'Procesando datos', statusColor: 'bg-[#fbbc04]',
  },
  {
    id: '6', clave: 'ID224578', subID: 'Urología', proyecto: 'Tumor renal',
    subProject: 'REN AN1309531610', date: '05 DIC 2025', dateObj: new Date(2025, 11, 5),
    estimatedDelivery: '10 DIC 2025',
    avatars: [{ initials: 'CM', name: 'Claudio Martínez' }],
    status: 'Completado', subStatus: 'Ver modelo', statusColor: 'bg-ai-success', isLink: true,
  },
  {
    id: '7', clave: 'ID224570', subID: 'Colorrectal', proyecto: 'Cáncer de colon',
    subProject: 'COL AN1309531600', date: '01 DIC 2025', dateObj: new Date(2025, 11, 1),
    estimatedDelivery: '05 DIC 2025',
    avatars: [{ initials: 'DR', name: 'Daniela Ríos' }],
    status: 'Bloqueado', subStatus: 'Revisión técnica', statusColor: 'bg-red-500',
  }
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
  status: 'Pagada' | 'Pendiente' | 'Vencida';
};

const BILLING_DATA: BillingItem[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    caseId: 'ID224593',
    caseTitle: 'Tumor desmoplásico',
    caseSubtitle: 'JER AN1309531635',
    amount: 1250.00,
    date: '15 DIC 2025',
    dateObj: new Date(2025, 11, 15),
    status: 'Pagada'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    caseId: 'ID224594',
    caseTitle: 'Meningioma atípico',
    caseSubtitle: 'PTR AN1309531640',
    amount: 1800.00,
    date: '14 DIC 2025',
    dateObj: new Date(2025, 11, 14),
    status: 'Pendiente'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    caseId: 'ID224580',
    caseTitle: 'Revisión de válvula',
    caseSubtitle: 'MNT AN1309531622',
    amount: 950.00,
    date: '12 DIC 2025',
    dateObj: new Date(2025, 11, 12),
    status: 'Pagada'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    caseId: 'ID224582',
    caseTitle: 'Metástasis hepáticas',
    caseSubtitle: 'ALV AN1309531641',
    amount: 2100.00,
    date: '10 DIC 2025',
    dateObj: new Date(2025, 11, 10),
    status: 'Vencida'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-005',
    caseId: 'ID224585',
    caseTitle: 'Lesión pancreática',
    caseSubtitle: 'GRC AN1309531645',
    amount: 1550.00,
    date: '09 DIC 2025',
    dateObj: new Date(2025, 11, 9),
    status: 'Pendiente'
  }
];

const ARTICLES_DATA = [
  {
    id: 'cella-2-0',
    title: 'Cella Studio 2.0 Disponible',
    subtitle: 'La próxima generación de visualización clínica ya está aquí, con segmentación en segundos y colaboración en tiempo real.',
    date: '10 de Abril, 2026',
    author: 'Equipo de Ingeniería Cella',
    readTime: '5 min de lectura',
    category: 'Actualización de Producto',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>Estamos encantados de anunciar el lanzamiento oficial de Cella Studio 2.0. Esta actualización trae un gran salto en velocidad y precisión de visualización clínica, diseñada específicamente para la planificación quirúrgica y la educación del paciente.</p>
      <h3>Segmentación anatómica en sub-segundos</h3>
      <p>Nuestro nuevo núcleo de IA ahora puede segmentar estructuras complejas como redes vasculares y órganos parenquimales en menos de un segundo. Esto reduce el tiempo que los especialistas dedican a la preparación del modelo hasta en un 85%.</p>
      <h3>Colaboración multiusuario mejorada</h3>
      <p>Los equipos ahora pueden trabajar en el mismo caso simultáneamente. La presencia del cursor en tiempo real y la sincronización instantánea de comentarios aseguran que cada especialista esté en la misma página.</p>
      <p>Descarga la última versión hoy mismo desde tu panel de control o contacta con tu representante para una demostración completa.</p>
    `
  },
  {
    id: 'auto-segmentación',
    title: 'Nueva IA de Auto-segmentación',
    subtitle: 'Nuestras redes neuronales patentadas ahora pueden segmentar estructuras vasculares complejas en segundos con una precisión sin precedentes.',
    date: '05 de Abril, 2026',
    author: 'Laboratorio de Investigación IA',
    readTime: '3 min de lectura',
    category: 'Investigación',
    image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>Nuestro equipo de investigación ha integrado con éxito la última generación de algoritmos de mapeo vascular. Esta nueva IA de auto-segmentación ha sido entrenada con más de 500,000 escaneos clínicos diversos.</p>
      <h3>Hito de precisión del 99%</h3>
      <p>En validaciones clínicas independientes, el sistema logró un coeficiente de similitud Dice del 99.2% en los principales troncos vasculares. Este nivel de precisión no tiene precedentes en las herramientas clínicas automatizadas.</p>
      <p>El sistema detecta automáticamente calcificaciones y variaciones anatómicas, marcando áreas potenciales de interés para la revisión manual por parte del médico.</p>
    `
  },
  {
    id: 'dicom-export',
    title: 'Exportación DICOM Mejorada',
    subtitle: 'Exporta sin problemas modelos de alta fidelidad de vuelta a los sistemas PACS del hospital y sistemas de navegación quirúrgica.',
    date: '28 de Marzo, 2026',
    author: 'Equipo de Integraciones',
    readTime: '4 min de lectura',
    category: 'Técnico',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p>La interoperabilidad es fundamental en Cella Studio. Con el nuevo módulo de Exportación DICOM Mejorada, llevar tus modelos 3D a otros sistemas clínicos ahora es un proceso fluido.</p>
      <h3>Formatos médicos nativos</h3>
      <p>Ahora puedes exportar modelos directamente en varios formatos, incluyendo superposiciones DICOM estándar, asegurando la compatibilidad con PACS y sistemas avanzados de navegación intraoperatoria.</p>
    `
  }
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
      c.subID.toLowerCase().includes(q) ||
      c.subProject.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  }

  if (filterBy && filterBy !== 'Todos') {
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
    case 'Más recientes': result.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()); break;
    case 'Menos recientes': result.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); break;
    case 'A-Z': result.sort((a, b) => a.proyecto.localeCompare(b.proyecto)); break;
    case 'Z-A': result.sort((a, b) => b.proyecto.localeCompare(a.proyecto)); break;
  }
  return result;
}

export default function CellaStudioDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("cella_authorized");
    if (auth === "true") setIsAuthorized(true);
    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  if (!isAuthorized) {
    return <LoginPage onLogin={() => setIsAuthorized(true)} />;
  }

  return <CellaStudioDashboardContent />;
}


function CellaStudioDashboardContent() {
  const router = useRouter();
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

  // DYNAMIC PRODUCTS STATE
  const [recentProducts, setRecentProducts] = useState([
    { id: '1', title: 'Nefrectomía parcial', specialty: 'Urología', initial: 'U' },
    { id: '2', title: 'Resección hepática', specialty: 'Hepatobiliopancreática', initial: 'H' }
  ]);

  const [initialSpecialty, setInitialSpecialty] = useState<string | null>(null);

  const handleRequestProduct = (productName: string) => {
    setInitialSpecialty(productName);
    router.push("/request-case/step-1");
  };


  // SHARED COMMENTS STATE
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "1",
      user: "Claudio Martínez",
      initials: "CM",
      color: "bg-purple-600",
      text: "He revisado la segmentación del tumor y parece que falta incluir una pequeña porción del margen distal. ¿Podéis revisarlo?",
      time: "2h atrás",
      type: 'general',
      replies: [
        {
          id: 2,
          user: "Laura Ruiz (Cella Specialist)",
          initials: "LR",
          color: "bg-[var(--ai-accent)]",
          text: "Entendido, Claudio. Lo revisamos ahora mismo con el equipo de radiología.",
          time: "1h atrás"
        }
      ]
    },
    {
      id: "3",
      user: "Pedro García",
      initials: "PG",
      color: "bg-teal-600",
      text: "Check the clearance around the superior mesenteric artery on this specific view.",
      time: "45m atrás",
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
      title: 'Herramientas Estratégicas',
      content: 'Gestione su carga de trabajo creando nuevos casos quirúrgicos o utilizando nuestro motor de búsqueda clínica avanzado.',
      position: 'bottom'
    },
    {
      target: 'tour-action-center',
      title: 'Acción Requerida',
      content: 'Alertas clave y tareas pendientes que requieren su intervención inmediata. Los elementos de alta prioridad se marcan aquí.',
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
        setChatMessages(prev => [...prev, { id: 'msg-1', role: 'agent', text: "¡Hola! Soy el Bot de Soporte de Cella, estoy aquí para ayudarte 👋" }]);

        setIsAgentTyping(true);
        const timer2 = setTimeout(() => {
          setIsAgentTyping(false);
          setChatMessages(prev => [...prev, { id: 'msg-2', role: 'agent', text: "Veo que estás explorando tu espacio de trabajo. ¿Cómo puedo ayudarte hoy?" }]);
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
        text: "¡Gracias por contactar con nosotros! Un especialista revisará tu solicitud en breve."
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
    "Proyecto de equipo": "Proyecto de equipo",
    "Proyecto invitado": "Proyecto invitado",
    "Proyectos PIDI": "Proyectos PIDI"
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 11, 31),
  });
  // Shared cases state
  const [cases, setCases] = useState<CaseItem[]>(CASES_DATA);
  const [homeSearch, setHomeSearch] = useState('');
  const [homeFilter, setHomeFilter] = useState('Todos');
  const [homeSort, setHomeSort] = useState('Más recientes');
  const [docsSection, setDocsSection] = useState("Primeros pasos");

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
  const [billingFilter, setBillingFilter] = useState("Todos");
  const [billingSort, setBillingSort] = useState("Más nuevos");
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
                  {leftNavOpen && <span className="text-[14px] font-semibold text-ai-text tracking-tight">Documentación</span>}
                </div>

                {/* Search */}
                {leftNavOpen && (
                  <div className="px-3 mt-2 mb-3">
                    <div className="flex items-center h-[32px] px-2.5 rounded-[7px] border border-ai-border bg-ai-surface gap-2 focus-within:ring-1 ring-ai-border">
                      <Search size={12} className="text-ai-text-tertiary shrink-0" />
                      <input id="docs-search" type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-[12px] text-ai-text w-full placeholder:text-ai-text-tertiary" />
                    </div>
                  </div>
                )}

                {/* Nav sections */}
                <div className="flex flex-col gap-0.5 px-2 overflow-y-auto flex-1">
                  {["Primeros pasos", "Referencia de API", "Guías"].map(section => (
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
                <div className="flex items-center h-[60px] px-3 mt-2 shrink-0 justify-between">
                  {leftNavOpen ? (
                    <div className="flex items-center px-2 py-1.5 cursor-default flex-1">
                      <CellaLogo height={24} />
                    </div>
                  ) : (
                    <div className="flex items-center px-2 py-1.5 cursor-default flex-1 justify-center">
                      <CellaLogo height={16} />
                    </div>
                  )}
                </div>

                {/* Top Nav Items - Block 1 */}
                <div className="flex flex-col gap-[2px] px-3 mt-4 w-full">
                  <NavItem icon={<Home size={18} />} label="Inicio" expanded={leftNavOpen} active={currentView === 'home'} onClick={() => setCurrentView('home')} />
                  <NavItem icon={<Folder size={18} />} label="Casos" expanded={leftNavOpen} active={currentView === 'cases'} onClick={() => setCurrentView('cases')} />
                  <NavItem
                    icon={<Briefcase size={18} />}
                    label="Proyectos"
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
                      <Button variant="ghost" onClick={() => { setActiveProject('Proyecto de equipo'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Proyecto de equipo' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Proyecto de equipo']}</Button>
                      <Button variant="ghost" onClick={() => { setActiveProject('Proyecto invitado'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Proyecto invitado' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Proyecto invitado']}</Button>
                      <Button variant="ghost" onClick={() => { setActiveProject('Proyectos PIDI'); setCurrentView('project_detail'); }} className={`h-[30px] w-full flex items-center justify-start rounded-[8px] px-3 font-medium text-[13px] relative group transition-colors cursor-pointer ${activeProject === 'Proyectos PIDI' && currentView === 'project_detail' ? 'text-[var(--ai-accent)] bg-[var(--ai-accent)]/10 dark:bg-[var(--ai-accent)]/15 hover:bg-[var(--ai-accent)]/20' : 'text-ai-text-secondary hover:text-ai-text hover:bg-ai-hover-1'}`}>{projectNames['Proyectos PIDI']}</Button>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="w-full h-4" />

                {/* Top Nav Items - Block 2 */}
                <div className="flex flex-col gap-[2px] px-3 w-full">
                  <NavItem icon={<SquareTerminal size={18} />} label="Explorar" expanded={leftNavOpen} active={currentView === 'discover'} onClick={() => setCurrentView('discover')} />
                  <NavItem icon={<CreditCard size={18} />} label="Facturación" expanded={leftNavOpen} active={currentView === 'billing'} onClick={() => setCurrentView('billing')} />
                  <NavItem icon={<FileText size={18} />} label="Documentación" expanded={leftNavOpen} active={currentView === 'docs'} onClick={() => setCurrentView('docs')} />
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
                          <p className="font-semibold text-ai-text text-[15px]">Su opinión es importante para nosotros</p>
                          <div className="bg-ai-base border border-ai-border flex items-start h-[100px] p-3 rounded-[8px] w-full focus-within:ring-1 focus-within:ring-[var(--ai-accent)] transition-shadow">
                            <textarea className="bg-transparent border-none outline-none resize-none flex-1 text-[13px] text-ai-text placeholder:text-ai-text-tertiary w-full h-full" placeholder="Escriba sus comentarios y opiniones aquí..." />
                          </div>
                        </div>
                        <div className="flex justify-end w-full">
                          <Button className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white px-4 py-2 rounded-[8px] flex items-center gap-2 h-auto text-[14px]">Enviar<ArrowRight size={16} /></Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <NavItem icon={<Settings size={18} />} label="Ajustes" expanded={leftNavOpen} active={false} onClick={() => setIsSettingsOpen(true)} />
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
                      <span className="font-medium text-[14px]">Habla con Cella</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => router.push("/request-case/step-1")}
                      className="h-[36px] bg-[#1a73e8] hover:bg-[#155ebd] text-white dark:bg-[#a8c7fa] dark:text-[#041e49] dark:hover:bg-[#d3e3fd] border-none shadow-none rounded-[8px] px-4 text-[13px] font-medium flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Plus size={16} />Crear nuevo caso</Button>

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
                            <span className="font-semibold text-[14px] text-ai-text">Notificaciones</span>
                            <span className="text-[12px] text-[var(--ai-accent)] cursor-pointer hover:underline">Marcar todo como leído</span>
                          </div>

                          <DropdownMenuItem className="focus:bg-transparent rounded-lg p-2.5 flex flex-col items-start gap-1 cursor-pointer">
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-[8px] h-[8px] rounded-full bg-red-500" />
                              <span className="font-medium text-[13px] text-ai-text">Acción requerida</span>
                              <span className="text-[11px] text-ai-text-tertiary ml-auto">2h atrás</span>
                            </div>
                            <p className="text-[12px] text-ai-text-secondary pl-4">Falta documentación para Tumor desmoplásico (ID224593)</p>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="focus:bg-transparent rounded-lg p-2.5 flex flex-col items-start gap-1 cursor-pointer">
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-[8px] h-[8px] rounded-full bg-ai-success" />
                              <span className="font-medium text-[13px] text-ai-text">Modelo Listo</span>
                              <span className="text-[11px] text-ai-text-tertiary ml-auto">5h atrás</span>
                            </div>
                            <p className="text-[12px] text-ai-text-secondary pl-4">Revisión de válvula (ID224580) está construido y listo para revisión.</p>
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
                      <h1 className="text-[28px] font-medium text-ai-text">Bienvenido de nuevo, Alex</h1>
                      <p className="text-ai-text-secondary text-[14px] mt-1">Tienes 2 casos bloqueados que requieren tu atención para proceder con la producción.</p>
                    </div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Lado izquierdo 66% */}
                      <div className="lg:col-span-2 flex flex-col">

                        {/* ACTION CENTER - Contained in single bordered div */}
                        <div id="tour-action-center" className="w-full bg-[#fef2f2]/60 dark:bg-[#450a0a]/10 border border-[#ef4444]/20 dark:border-[#ef4444]/20 rounded-[8px] overflow-hidden mb-8">
                          <div className="px-5 py-3 border-b border-[#ef4444]/10 bg-[#ef4444]/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                              <span className="text-[12px] font-bold text-[#991b1b] dark:text-[#fca5a5] uppercase tracking-wider">Acción Requerida</span>
                            </div>
                            <span className="text-[11px] font-medium text-[#ef4444] bg-white dark:bg-[#ef4444]/20 px-2 py-0.5 rounded-full border border-[#ef4444]/10">2 Pendientes</span>
                          </div>
                          <div className="p-1">
                            <div className="flex items-center justify-between p-4 rounded-[12px] hover:bg-white/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444]">
                                  <XCircle size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Tumor desmoplásico (ID224593)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Falta documentación para proceder a producción</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 text-ai-text font-normal text-[13px] opacity-80 group-hover:opacity-100 transition-opacity mr-2">
                                <span>Resolver</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-[12px] hover:bg-white/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#450a0a]/20 border border-[#ef4444]/10 flex items-center justify-center text-[#ef4444]">
                                  <RotateCcw size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-ai-text">Revisión de válvula (ID224580)</span>
                                  <span className="text-[13px] text-[#b91c1c] dark:text-[#fca5a5]/70">Revisión requerida por especialista</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 text-ai-text font-normal text-[13px] opacity-80 group-hover:opacity-100 transition-opacity mr-2">
                                <span>Resolver</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex flex-col">
                          <div className="w-full flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-medium text-ai-text shrink-0">
                              Cases Recientes
                            </h2>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('cases')}>Ver todo</span>
                          </div>

                          <div id="tour-recent-cases" className="border border-ai-border rounded-[8px] overflow-hidden w-full">
                            <Table className="w-full text-[13px] table-fixed">
                              <TableHeader>
                                <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
                                  <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Caso</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Creado</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[15%]">Entrega</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[12%]">Usuarios</TableHead>
                                  <TableHead className="text-ai-text-secondary font-medium w-[18%]">Estado</TableHead>
                                  <TableHead className="text-right w-[15%] pr-4"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {applyFilters(cases, homeSearch, homeFilter, homeSort).length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center text-ai-text-tertiary text-[13px] py-8">No se encontraron casos</TableCell>
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
                          <div 
                            onClick={() => setIsContactSidebarOpen(true)}
                            className="border border-ai-border dark:border-white/10 bg-white dark:bg-[#131416] rounded-[8px] p-6 flex flex-row items-start gap-6 text-left relative overflow-hidden group transition-all duration-300"
                          >
                            {/* Background decoration */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10" />
                            
                            <div className="relative shrink-0">
                               <Avatar className="w-[96px] h-[96px] max-[1680px]:w-[72px] max-[1680px]:h-[72px] border-4 border-white dark:border-[#131416] transition-all duration-500 z-10 shadow-sm">
                                 <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" />
                                 <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-[32px] max-[1680px]:text-[24px]">LG</AvatarFallback>
                               </Avatar>
                               <div className="absolute bottom-1 right-1 w-5 h-5 max-[1680px]:bottom-0 max-[1680px]:right-0 max-[1680px]:w-4 max-[1680px]:h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#131416] z-20" />
                            </div>
                            
                            <div className="flex flex-col gap-3 min-w-0 relative z-10 flex-1">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-ai-text font-bold text-[20px] max-[1680px]:text-[16px] leading-tight transition-colors">Laura Gómez</span>
                                <span className="text-[#1a73e8] dark:text-[var(--ai-accent-hover)] font-semibold text-[13px] uppercase tracking-wider max-[1680px]:lowercase max-[1680px]:tracking-normal max-[1680px]:font-medium">Representante de Ventas CellaMS</span>
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
                            <h3 className="text-[20px] font-medium text-ai-text">Productos Recientes</h3>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('discover')}>Ver todo</span>
                          </div>
                          <div className="grid grid-cols-2 max-[1680px]:grid-cols-1 gap-3">
                            {recentProducts.map((product) => (
                              <div 
                                key={product.id}
                                onClick={() => handleRequestProduct(product.specialty)}
                                className="border border-ai-border dark:border-white/10 bg-transparent dark:bg-[#131416] rounded-[8px] p-4 flex flex-row items-center gap-4 cursor-pointer group hover:border-[var(--ai-accent)] transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center text-ai-text font-bold text-[15px] border border-ai-border group-hover:border-[var(--ai-accent)] transition-colors shrink-0">{product.initial}</div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[14px] font-semibold text-ai-text leading-tight group-hover:text-[var(--ai-accent)] transition-colors truncate">{product.title}</span>
                                  <span className="text-[11px] font-medium text-ai-text-tertiary">{product.specialty}</span>
                                  <span className="text-[var(--ai-accent)] dark:text-[var(--ai-accent-hover)] text-[11px] font-bold mt-1">Solicitar ahora →</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* NOVEDADES */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[20px] font-medium text-ai-text">Novedades</h3>
                            <span className="text-[13px] text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] cursor-pointer transition-colors" onClick={() => setCurrentView('blog')}>Ver todo</span>
                          </div>
                          <div className="flex flex-col gap-2 border border-ai-border rounded-[8px] bg-white dark:bg-transparent p-6">
                            {ARTICLES_DATA.slice(0, 3).map((article, idx) => (
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
                                  <span className="text-ai-text-tertiary text-[12px] leading-relaxed line-clamp-2">{article.id === 'cella-2-0' ? 'Inteligencia visual clínica avanzada con segmentación anatómica en sub-segundos.' : article.id === 'auto-segmentación' ? 'Mapea estructuras vasculares automáticamente con un 99% de precisión.' : 'Exporta directamente a formatos de imagen médica estándar de forma nativa.'}</span>
                                  <div className="mt-1">
                                    <span className="text-[var(--ai-accent)] dark:text-[var(--ai-accent-hover)] text-[12px] font-bold">Leer más</span>
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
                  <DiscoverView onViewModel={handleViewModel} onRequest={handleRequestProduct} />
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
                  <span className="font-bold text-[14px] text-ai-text leading-tight">Equipo de Soporte Cella</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] text-ai-text-tertiary">En línea</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-ai-text-tertiary">
                <button className="p-2 hover:bg-ai-hover-1 hover:text-ai-text rounded-[8px] transition-colors cursor-pointer" title="Refrescar">
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
                  placeholder="Pregunta cualquier cosa..."
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
            <DialogTitle className="text-[16px] font-medium font-sans">Compartir</DialogTitle>
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
              <span>{linkCopied ? '¡Copiado!' : 'Copiar enlace'}</span>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 focus-within:ring-1 focus-within:ring-ai-text-secondary/40 transition-shadow">
                <input
                  type="email"
                  placeholder="Introduce un email"
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
                Invitar
              </Button>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-ai-border bg-ai-base cursor-pointer hover:bg-ai-hover-1 transition-colors">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span className="text-[13px] text-ai-text">Solo las personas invitadas tienen acceso</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

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
                        <span className="text-[11px] px-2 py-0.5 rounded-[8px] font-medium shrink-0 bg-purple-500/10 text-purple-400">Propietario</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-[8px] shrink-0 transition-colors hover:opacity-80 ${collab.role === 'Editor' ? 'bg-blue-500/10 text-[var(--ai-accent-hover)]' : 'bg-gray-500/10 text-gray-400'
                               }`}>
                              {collab.role === 'Editor' ? 'Editor' : 'Lector'}
                              <ChevronDown size={10} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-1">
                            {['Editor', 'Lector', 'Eliminar'].map(role => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => setCollaborators(prev => prev.map(c => c.email === collab.email ? { ...c, role: role === 'Lector' ? 'Viewer' : role === 'Eliminar' ? 'Remove' : 'Editor' } : c))}
                                className={`cursor-pointer text-[13px] rounded-[6px] ${role === 'Eliminar' ? 'text-red-500 focus:text-red-500 focus:bg-red-500/10' : 'text-ai-text focus:bg-ai-hover-1'}`}
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
  subID,
  proyecto,
  subProject,
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
  subID?: string;
  proyecto?: string;
  subProject?: string;
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
          <span className="font-bold text-[15px] max-[1680px]:text-[13.5px] truncate w-full leading-tight uppercase tracking-tight">{subProject}</span>
          <div className="flex items-center gap-2 text-[11.5px] text-ai-text-secondary font-medium truncate w-full">
            <span className="text-ai-text-secondary/70 font-mono text-[10px] bg-ai-base px-1.5 py-0.5 rounded-[8px] border border-ai-border shrink-0">{clave}</span>
            {isPidi && (
              <span className="text-blue-500 font-bold text-[8.5px] px-1.5 py-0.5 rounded-[6px] border border-blue-500/20 uppercase tracking-[0.05em] shrink-0 bg-blue-500/5">PIDI</span>
            )}
            <span className="text-ai-text-secondary/80 truncate">{subID}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-ai-text-secondary text-[13px] lowercase max-[1680px]:hidden">{date}</TableCell>
      <TableCell className="text-ai-text text-[13px] font-medium">
        {status === 'Completado' || status === 'En progreso' ? (
          <div className="flex items-center gap-2">
            {status === 'Completado' ? (
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
              if (status === "Completado") {
                e.preventDefault();
                e.stopPropagation();
                onViewModel?.({ clave, subID, proyecto, subProject, status, subStatus, statusColor, avatars });
              }
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-[8px] text-[12px] font-bold border w-fit transition-all ${
              status === 'Completado' ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/15' :
              status === 'En progreso' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
              status === 'Bloqueado' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
              'bg-gray-100 dark:bg-ai-base/50 text-ai-text-secondary border-ai-border'
            } ${status === "Completado" ? "cursor-pointer" : ""}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              status === 'Completado' ? 'bg-green-600' :
              status === 'En progreso' ? 'bg-amber-600' :
              status === 'Bloqueado' ? 'bg-red-600' :
              'bg-gray-400'
            }`} />
            <span className="whitespace-nowrap flex items-center gap-1.5">
              {status === 'Completado' ? (
                <>
                  Ver modelo
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
                onClick={() => onViewDetails && onViewDetails({ clave, subID, proyecto, subProject, status, subStatus, statusColor, avatars })}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <ExternalLink size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Ver detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                <ArrowLeftRight size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Comparar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                <FileText size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Ver PDF del modelo</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleMoveClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Folder size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Mover</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onCommentsClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <MessageCircle size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Comentarios</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleInviteClick}
                className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
              >
                <Share2 size={18} className="text-ai-text-secondary" />
                <span className="font-medium text-[14px]">Compartir</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" strokeWidth={2.5} />
                <span className="font-medium text-[14px]">Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
            <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[480px] p-0 rounded-[8px] overflow-hidden gap-0">
              {moveStep === 'select' ? (
                <>
                  <div className="p-5 pb-4 border-b border-ai-border flex flex-col gap-1">
                    <DialogTitle className="text-[16px] font-medium font-sans">Mover {clave}</DialogTitle>
                    <p className="text-[14px] text-ai-text-secondary">Selecciona un proyecto al que mover este caso.</p>
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto flex flex-col gap-1">
                    {['Proyecto invitado', 'Proyecto de equipo', 'General - Hepatobiliopancreática'].map(proj => (
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
                      + Nueva carpeta
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="text-ai-text-secondary hover:text-ai-text h-[36px]">Cancelar</Button>
                      <Button disabled={!selectedProject} onClick={() => setIsMoveOpen(false)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white rounded-[8px] px-6 h-[36px]">Mover</Button>
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
                    <p className="text-[13px] text-ai-text-secondary">Escribe un nombre para la carpeta</p>
                    <input
                      autoFocus
                      placeholder="Nombre de la carpeta"
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-ai-border bg-transparent px-3 py-2 text-[14px] text-ai-text placeholder:text-ai-text-tertiary focus:outline-none focus:ring-1 focus:ring-ai-text-secondary transition-shadow"
                    />
                  </div>
                  <div className="p-4 border-t border-ai-border flex justify-end gap-2 bg-black/10 dark:bg-black/20">
                    <Button variant="ghost" onClick={() => setIsMoveOpen(false)} className="text-ai-text-secondary hover:text-ai-text h-[36px]">Cancelar</Button>
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
                <DialogTitle className="text-[16px] font-medium font-sans">Compartir</DialogTitle>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 text-[12px] font-medium px-2 py-1.5 rounded-[8px] transition-all ${linkCopied
                    ? 'text-green-500 bg-green-500/5'
                    : 'text-ai-text-secondary hover:text-ai-accent'
                    }`}
                >
                  <Link size={14} className={linkCopied ? 'text-green-500' : 'text-ai-text-tertiary'} />
                  <span>{linkCopied ? '¡Copiado!' : 'Copiar enlace'}</span>
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Email input + invite button row */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center h-[40px] rounded-[8px] border border-ai-border bg-ai-base px-3 gap-2 focus-within:ring-1 focus-within:ring-ai-text-secondary/40 transition-shadow">
                    <input
                      type="email"
                      placeholder="Introduce un email"
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
                    Invitar
                  </Button>
                </div>

                {/* Access level indicator */}
                <div className="flex items-center justify-between px-3 py-2 rounded-[8px] border border-ai-border bg-ai-base cursor-pointer hover:bg-ai-hover-1 transition-colors">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ai-text-secondary shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <span className="text-[13px] text-ai-text">Solo las personas invitadas tienen acceso</span>
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
                            <span className="text-[11px] px-2 py-0.5 rounded-[8px] font-medium shrink-0 bg-purple-500/10 text-purple-400">Propietario</span>
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
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState('Más recientes');
  const filtered = applyFilters(cases, search, filter, sort, dateRange);

  return (
    <div className="w-full h-full flex flex-col mt-5 pb-16 animate-in fade-in duration-300">
      <div className="w-full flex flex-col gap-8 mb-6 cursor-default">
        <h2 className="text-[28px] font-medium text-ai-text shrink-0 mr-auto">Casos</h2>
        <div className="flex items-center w-full justify-between">
          <SmartSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar casos..."
            suggestions={Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subID, c.subProject])))}
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
                {['Todos', 'Bloqueado', 'Pendiente', 'En progreso', 'Completado'].map(f => (
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
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Fecha</span>}</span>
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
                {['Más recientes', 'Menos recientes', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSort(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sort === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {sort !== s && <span className="w-3" />}
                    {s === 'A-Z' ? 'Alfabético (A-Z)' : s === 'Z-A' ? 'Alfabético (Z-A)' : s}
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
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Caso</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Creado</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Entrega</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[12%]">Usuarios</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[18%]">Estado</TableHead>
              <TableHead className="text-right w-[15%] pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-ai-text-tertiary text-[13px] py-8">No se han encontrado casos</TableCell>
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
                <SheetTitle className="text-[18px] font-bold text-ai-text">Comentarios</SheetTitle>
                <span className="text-[12px] text-ai-text-tertiary">{comments.length} mensajes en este caso</span>
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
                          Ver en 3D
                        </button>
                      )}
                    </div>
                    <button className="text-[12px] font-bold text-[var(--ai-accent)] hover:text-[var(--ai-accent-hover)] w-fit transition-colors">Responder</button>
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
                  placeholder="Haz una pregunta o danos tu opinión..."
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
                   Enviar Mensaje
                 </Button>
               </div>
             </div>
             <p className="text-[11px] text-ai-text-tertiary px-1">Los especialistas suelen responder en 2-4 horas.</p>
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
            <span className="text-[12px] font-bold text-[var(--ai-accent)] uppercase tracking-widest leading-none">Contactar Especialista</span>
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
              <span className="text-[14px] font-semibold text-ai-text">¿En qué puedo ayudarte hoy?</span>
              <p className="text-[13px] text-ai-text-secondary mt-1">Soy tu especialista clínico dedicado. No dudes en contactarme para cualquier consulta o soporte.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-ai-text-secondary uppercase">Asunto</label>
              <input 
                className="h-10 px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-[var(--ai-accent)] outline-none" 
                placeholder="Caso #ID224593 - Consulta documentación"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-ai-text-secondary uppercase">Mensaje</label>
              <textarea 
                className="h-[150px] p-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] focus:ring-1 focus:ring-[var(--ai-accent)] outline-none resize-none" 
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
          </div>

          <Button className="w-full bg-[var(--ai-accent)] hover:bg-[var(--ai-accent-hover)] text-white dark:text-[#041e49] rounded-[8px] h-[48px] font-bold active:scale-[0.98] transition-all">
            Enviar Mensaje
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
  const [projSort, setProjSort] = useState("Más recientes");
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
    const name = newName.trim() || "Nuevo Project";
    const count = skipCases ? 0 : selectedCases.length;
    setExtraProjects(prev => [...prev, {
      id: Date.now(), keyName: name, title: name,
      stats: count === 0 ? "0 casos" : `${count} caso${count !== 1 ? "s" : ""}`,
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
      title: projectNames["Guest Project"] || "Project Invitado",
      stats: "1 caso",
      color: "bg-blue-500",
      collaborators: [
        { name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Propietario" },
        { name: "Claudio Martínez", initials: "CM", color: "bg-purple-600", role: "Editor" }
      ],
      thumbnails: [<ThumbnailCell key="1" letter="G" />, <ThumbnailCell key="2" letter="S" />, <ThumbnailCell key="3" letter="C" />, <ThumbnailCell key="4" letter="N" />]
    },
    {
      id: 2,
      keyName: "Team project",
      title: projectNames["Team project"] || "Project de Equipo",
      stats: "4 casos",
      color: "bg-purple-500",
      collaborators: [
        { name: "Claudio Martínez", initials: "CM", color: "bg-purple-600", role: "Propietario" },
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
      title: projectNames["PIDI Projects"] || "Projects PIDI",
      stats: "2 casos",
      color: "bg-amber-500",
      collaborators: [
        { name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Propietario" }
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
    collaborators: [{ name: "Ana Silva", initials: "AS", color: "bg-blue-600", role: "Propietario" }],
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
      if (projSort === "Alfabético (A-Z)") return a.title.localeCompare(b.title);
      if (projSort === "Alfabético (Z-A)") return b.title.localeCompare(a.title);
      if (projSort === "Menos recientes") return b.id - a.id; 
      return a.id - b.id; 
    });

  const projectSuggestions = allProjects.map(p => p.title);

  // Modal case list
  const filteredModalCases = [...cases]
    .filter(c => !modalSearch.trim() ||
      c.proyecto.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.clave.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.subID.toLowerCase().includes(modalSearch.toLowerCase()) ||
      c.subProject.toLowerCase().includes(modalSearch.toLowerCase())
    )
    .sort((a, b) => modalSort === "Alfabético (A-Z)" ? a.proyecto.localeCompare(b.proyecto) : modalSort === "Alfabético (Z-A)" ? b.proyecto.localeCompare(a.proyecto) : 0);

  const caseSuggestions = Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subID, c.subProject])));

  return (
    <div className="w-full h-full flex flex-col mt-5 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 cursor-default">
        <h2 className="text-[28px] font-medium text-ai-text">Proyectos</h2>
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
              Crear nuevo proyecto
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Filter row — same pattern as Cases */}
      <div className="flex items-center w-full justify-between mb-6">
        <SmartSearchInput
          value={projSearch}
          onChange={setProjSearch}
          placeholder="Buscar proyectos..."
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
              <span className="text-[12px] font-medium">Cuadrícula</span>
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
              <span className="text-[12px] font-medium">Lista</span>
            </button>
          </div>
          <div className="w-px h-5 bg-ai-border mx-1" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer">
                <CalendarIcon size={14} className="text-ai-text-tertiary" />
                <span>{projDateRange?.from ? (projDateRange.to ? <>{format(projDateRange.from, "LLL dd, y")} - {format(projDateRange.to, "LLL dd, y")}</> : format(projDateRange.from, "LLL dd, y")) : <span>Fecha</span>}</span>
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
              {['Más recientes', 'Menos recientes', 'Alfabético (A-Z)', 'Alfabético (Z-A)'].map(s => (
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
            <DialogTitle className="text-[15px] font-semibold text-ai-text">Renombrar proyecto</DialogTitle>
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
            <Button variant="ghost" onClick={() => setRenameId(null)} className="text-[13px] cursor-pointer">Cancelar</Button>
            <Button
              onClick={() => handleSaveTitle(renameId!, allProjects.find(p => p.id === renameId)?.keyName ?? "", renameValue)}
              className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer"
            >Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Modal */}
      <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
        <DialogContent className="bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-0 overflow-hidden max-w-[490px]">
          {modalStep === 1 ? (
            <div className="flex flex-col">
              <div className="px-6 pt-6 pb-4 border-b border-ai-border">
                <DialogTitle className="text-[16px] font-semibold text-ai-text mb-1">Nuevo proyecto</DialogTitle>
                <p className="text-[13px] text-ai-text-secondary">Dale un nombre a tu proyecto para comenzar.</p>
              </div>
              <div className="px-6 py-5 flex flex-col gap-2">
                <label className="text-[12px] font-medium text-ai-text-secondary">Nombre del proyecto</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Cardiología T1 2025"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) setModalStep(2); }}
                  className="w-full h-[40px] px-3 rounded-[8px] border border-ai-border bg-ai-base text-[13px] text-ai-text placeholder:text-ai-text-tertiary outline-none focus:ring-1 focus:ring-[var(--ai-accent)] transition"
                />
              </div>
              <div className="flex items-center justify-end gap-2 px-6 pb-6">
                <Button variant="ghost" onClick={() => setShowNewModal(false)} className="text-[13px] text-ai-text-secondary hover:text-ai-text cursor-pointer">Cancelar</Button>
                <Button disabled={!newName.trim()} onClick={() => setModalStep(2)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer">Continuar</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="px-6 pt-6 pb-4 border-b border-ai-border">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setModalStep(1)} className="text-ai-text-tertiary hover:text-ai-text cursor-pointer transition-colors"><ChevronLeft size={16} /></button>
                  <DialogTitle className="text-[15px] font-semibold text-ai-text">Añadir casos a &quot;{newName.trim()}&quot;</DialogTitle>
                </div>
                <p className="text-[12px] text-ai-text-secondary ml-6">Selecciona casos para incluir. Puedes añadir más después.</p>
              </div>
              {/* Search + sort in modal */}
              <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                <SmartSearchInput
                  value={modalSearch}
                  onChange={setModalSearch}
                  placeholder="Buscar casos..."
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
                    {['Alfabético (A-Z)', 'Alfabético (Z-A)'].map(s => (
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
                {filteredModalCases.length === 0 && <p className="text-[13px] text-ai-text-tertiary py-4 text-center">No se encontraron casos.</p>}
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
                <button onClick={() => handleCreateProject(true)} className="text-[13px] text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">Saltar por ahora</button>
                <Button onClick={() => handleCreateProject(false)} className="bg-[var(--ai-accent)] hover:bg-[var(--ai-accent)]/90 text-white text-[13px] rounded-[8px] cursor-pointer">
                  Crear proyecto{selectedCases.length > 0 ? ` (${selectedCases.length})` : ""}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Content — Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in fade-in duration-500">
          {sortedProjects.map(project => (
            <div key={project.id} onClick={() => onProjectClick(project.keyName)} className="bg-ai-surface border border-ai-border rounded-[8px] overflow-hidden cursor-pointer hover:border-ai-border-strong transition-colors group relative flex flex-col">

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-[4px] w-full bg-ai-base dark:bg-[#101113] p-[8px]" style={{ aspectRatio: '1/1' }}>
                {project.thumbnails}
              </div>

              {/* Title / Stats */}
              <div className="flex flex-col gap-0.5 px-3 py-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-ai-text group-hover:text-[var(--ai-accent)] transition-colors leading-tight truncate pr-2">
                    {project.title}
                  </span>
                  <div className="flex -space-x-1.5 shrink-0">
                    {project.collaborators?.map((collab: any, idx: number) => (
                      <TooltipProvider key={idx} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-[22px] h-[22px] rounded-full border border-white dark:border-ai-surface bg-[#f3f4f6] dark:bg-[#282a2c] flex items-center justify-center shrink-0 relative transition-transform hover:scale-110">
                              <span className="text-[8px] font-bold text-ai-text-secondary">{collab.initials}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white border-none text-[12px] px-2 py-1 rounded-[6px]">
                            <p>{collab.name} ({collab.role})</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-ai-text-tertiary">{project.stats}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-transparent hover:bg-ai-hover-1 rounded-[8px] transition-colors cursor-pointer text-ai-text-tertiary hover:text-ai-text">
                        <MoreHorizontal size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      onClick={(e) => e.stopPropagation()} 
                      align="end" 
                      className="w-[200px] bg-white dark:bg-white dark:bg-ai-surface border-ai-border rounded-[8px] p-2 space-y-1"
                    >
                      <DropdownMenuItem className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text">
                        <ExternalLink size={16} className="text-ai-text-secondary" />
                        <span className="font-medium text-[13px]">Abrir proyecto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenameId(project.id);
                          setRenameValue(project.title);
                        }}
                      >
                        <Edit size={16} className="text-ai-text-secondary" />
                        <span className="font-medium text-[13px]">Renombrar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-ai-border" />
                      <DropdownMenuItem 
                        className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                        <span className="font-medium text-[13px]">Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
          {sortedProjects.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-16 text-[13px] text-ai-text-tertiary">No hay proyectos que coincidan con tu búsqueda.</div>
          )}
        </div>
      ) : (
        <div className="w-full border border-ai-border rounded-[8px] overflow-hidden animate-in fade-in duration-500">
          <Table className="w-full text-[13px]">
            <TableHeader>
              <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
                <TableHead className="text-ai-text-secondary font-medium px-4">Nombre</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Casos</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Participantes</TableHead>
                <TableHead className="text-ai-text-secondary font-medium">Última modificación</TableHead>
                <TableHead className="text-right px-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-ai-text-tertiary">No hay proyectos que coincidan con tu búsqueda.</TableCell>
                </TableRow>
              ) : (
                sortedProjects.map((project: any) => (
                  <TableRow 
                    key={project.id} 
                    onClick={() => onProjectClick(project.keyName)}
                    className="border-b border-ai-border hover:bg-ai-base/40 dark:hover:bg-white/[0.02] cursor-pointer group transition-colors h-[64px]"
                  >
                    <TableCell className="px-4 py-4">
                      <span className="text-[14px] font-medium text-ai-text group-hover:text-[var(--ai-accent)] transition-colors">{project.title}</span>
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
                    <TableCell className="text-[13px] text-ai-text-tertiary">Justo ahora</TableCell>
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
                            <span className="font-medium text-[14px]">Abrir en pestaña nueva</span>
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
                            <span className="font-medium text-[14px]">Renombrar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-ai-hover-1 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-ai-text"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShareClick();
                            }}
                          >
                            <Share2 size={18} className="text-ai-text-secondary" />
                            <span className="font-medium text-[14px]">Compartir</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-ai-border" />
                          <DropdownMenuItem 
                            className="focus:bg-red-500/10 focus:text-red-500 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer text-red-500 transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" strokeWidth={2.5} />
                            <span className="font-medium text-[14px]">Eliminar</span>
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
  const [filterBy, setFilterBy] = useState('Todos');
  const [sortBy, setSortBy] = useState('Más recientes');
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
              className="text-[28px] font-medium text-ai-text bg-transparent border-b border-blue-50 outline-none flex-1 max-w-[400px]"
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
            placeholder="Buscar casos..."
            suggestions={Array.from(new Set(cases.flatMap(c => [c.proyecto, c.clave, c.subID, c.subProject])))}
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
                {['Todos', 'Bloqueado', 'Pendiente', 'En progreso', 'Completado'].map(s => (
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
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Fecha</span>}</span>
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
                  Más recientes <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Más recientes</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Menos recientes</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Alfabético (A-Z)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px]">Alfabético (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="border border-ai-border rounded-[8px] overflow-hidden w-full">
        <Table className="w-full text-[13px] table-fixed">
          <TableHeader>
            <TableRow className="border-b border-ai-border h-[40px] bg-ai-surface hover:bg-ai-surface cursor-default">
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-4">Caso</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[10%] max-[1680px]:hidden">Creado</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Entrega</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[12%]">Usuarios</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[18%]">Estado</TableHead>
              <TableHead className="text-right w-[15%] pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <DataRow
              clave="ID224601"
              subID="Cirugía General"
              proyecto={projectTitle}
              subProject="JER AN1309531635"
              date="14 DIC 2025"
              estimatedDelivery="15 DIC 2025"
              avatars={[
                { initials: "AS", name: "Ana Silva" }
              ]}
              status="En progreso"
              subStatus="Est. Delivery 15/12/25"
              onViewModel={onViewModel}
              onViewDetails={(c) => onCaseSelect(c)}
              onCommentsClick={onCommentsClick}
            />
            <DataRow
              clave="ID224602"
              subID="Cardiología"
              proyecto={projectTitle}
              subProject="MNT AN1309531622"
              date="10 DIC 2025"
              estimatedDelivery="12 DIC 2025"
              avatars={[
                { initials: "CM", name: "Claudio Martínez" },
                { initials: "DR", name: "Daniela Ríos" }
              ]}
              status="Completado"
              subStatus="Ver modelo"
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
                <span className="text-[12px] font-bold text-[var(--ai-accent)] uppercase tracking-widest">Detalles de Factura</span>
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
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Monto Total</span>
                  <span className="text-[28px] font-bold text-ai-text">€{invoice.amount.toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${invoice.status === 'Pagada'
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : invoice.status === 'Pendiente'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                  {invoice.status === 'Pagada' ? 'Pagado' : invoice.status === 'Pendiente' ? 'Pendiente' : 'Vencido'}
                </div>
              </div>

              {/* Bill To Section */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Facturar a</span>
                  <div className="flex flex-col text-[14px] text-ai-text-secondary leading-relaxed">
                    <span className="font-bold text-ai-text">St. Mary&#39;s Hospital</span>
                    <span>Radiología</span>
                    <span>Londres, UK</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Info de Factura</span>
                  <div className="flex flex-col text-[14px] text-ai-text-secondary">
                    <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{invoice.date}</span></div>
                    <div className="flex justify-between"><span>ID:</span> <span className="font-medium">#88{invoice.id}</span></div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Detalles de Servicio</span>
                <div className="border border-ai-border rounded-[8px] overflow-hidden">
                  <div className="bg-ai-base/30 px-4 py-3 border-b border-ai-border flex justify-between text-[12px] font-bold text-ai-text-secondary">
                    <span>Descripción</span>
                    <span>Precio</span>
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
                      <span className="text-ai-text-secondary">IVA (21%)</span>
                      <span className="text-ai-text-secondary">Incluido</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-ai-text-tertiary uppercase font-bold tracking-tight">Método de Pago</span>
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
                Descargar factura PDF
              </Button>
              <p className="text-center text-[11px] text-ai-text-tertiary mt-2">Si tienes alguna duda, contacta con billing@cella.studio</p>
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
          Volver al panel
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
              <span className="text-[14px] text-ai-text-tertiary">Compartir artículo:</span>
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
              Volver al panel
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
    const matchesStatus = filterBy === 'Todos' || item.status === filterBy;
    
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
          <h1 className="text-[28px] font-medium text-ai-text">Facturación</h1>
          <p className="text-[14px] text-ai-text-secondary">Gestiona tus facturas y historial de pagos.</p>
        </div>

        {/* TOP FILTERS - Standardized with app style */}
        <div className="flex items-center w-full justify-between">
          <SmartSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por ID o número..."
            suggestions={Array.from(new Set(BILLING_DATA.flatMap(b => [b.invoiceNumber, b.caseId, b.caseTitle])))}
            className="w-[340px]"
          />

          <div className="flex items-center gap-4 shrink-0">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-[36px] bg-white dark:bg-ai-surface border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[8px] px-3 text-[13px] font-normal gap-2 flex items-center cursor-pointer transition-colors">
                  {filterBy === 'All' ? 'Todos' : filterBy} <ChevronDown size={14} className="text-ai-text-tertiary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-ai-surface border-ai-border rounded-[8px]">
                {['Todos', 'Pagada', 'Pendiente', 'Vencida'].map(s => (
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
                  <span>{dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Periodo</span>}</span>
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
                {['Más recientes', 'Menos recientes', 'A-Z', 'Z-A'].map(s => (
                  <DropdownMenuItem key={s} onClick={() => setSortBy(s)} className="cursor-pointer text-ai-text focus:bg-ai-hover-1 text-[13px] flex items-center gap-2">
                    {sortBy === s && <Check size={12} className="text-[var(--ai-accent)]" />}
                    {sortBy !== s && <span className="w-3" />}
                    {s === 'A-Z' ? 'Alfabético (A-Z)' : s === 'Z-A' ? 'Alfabético (Z-A)' : s}
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
              <TableHead className="text-ai-text-secondary font-medium w-[30%] px-6">Caso</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Núm. Factura</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%]">Fecha</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%] text-right">Monto</TableHead>
              <TableHead className="text-ai-text-secondary font-medium w-[15%] text-center">Estado</TableHead>
              <TableHead className="w-[15%] text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-ai-text-tertiary">No se encontraron facturas.</TableCell>
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
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border w-fit ${item.status === 'Pagada'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : item.status === 'Pendiente'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Pagada' ? 'bg-green-600' :
                        item.status === 'Pendiente' ? 'bg-amber-600' :
                        'bg-red-600'
                      }`} />
                      {item.status === 'Pagada' ? 'Pagado' : item.status === 'Pendiente' ? 'Pendiente' : 'Vencido'}
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
                        <TooltipContent className="bg-ai-surface border-ai-border text-ai-text text-[12px]">Ver Detalles</TooltipContent>
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
                        <TooltipContent className="bg-ai-surface border-ai-border text-ai-text text-[12px]">Descargar PDF</TooltipContent>
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
  const feedArticles = [
    {
      id: 'cella-2-0',
      title: "Cella Studio 2.0 disponible: Una nueva era en planificación quirúrgica",
      subtitle: "Descubre cómo nuestra última plataforma en la nube está transformando la simulación preoperatoria con colaboración 3D en tiempo real.",
      category: "Producto",
      date: "06 mayo, 2026",
      image: "https://images.unsplash.com/photo-1576091160550-2173dad99a01?q=80&w=2070&auto=format&fit=crop",
      author: "Cella Engineering",
      avatar: "CE",
      readTime: "5 min de lectura"
    },
    {
      id: 'auto-segmentación',
      title: "Nueva IA de auto-segmentación: Rompiendo límites de precisión",
      subtitle: "Nuestras redes neuronales propietarias ahora segmentan estructuras vasculares complejas en segundos con 99.8% de precisión.",
      category: "Investigación IA",
      date: "04 mayo, 2026",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536ad39?q=80&w=2070&auto=format&fit=crop",
      author: "Dra. Elena Vance",
      avatar: "EV",
      readTime: "3 min de lectura"
    },
    {
      id: 'dicom-export',
      title: "Exportaración DICOM mejorada: Integración hospitalaria fluida",
      subtitle: "Compatibilidad total con PACS y sistemas de navegación quirúrgica líder ahora disponible nativamente.",
      category: "Actualización",
      date: "01 mayo, 2026",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
      author: "Marcus Wright",
      avatar: "MW",
      readTime: "4 min de lectura"
    },
    {
      id: 'mixed-reality',
      title: "El futuro de la guía intraoperatoria: Realidad mixta",
      subtitle: "Explorando cómo HoloLens 2 y los datos espaciales de Cella ayudan a cirujanos a visualizar anatomía directamente sobre el paciente.",
      category: "Innovación",
      date: "28 abril, 2026",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop",
      author: "Sarah Chen",
      avatar: "SC",
      readTime: "8 min de lectura"
    }
  ];

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[720px] mx-auto pb-32 pt-16 font-sans">
      {/* Medium-style Header */}
      <div className="flex items-center justify-between mb-16 border-b border-ai-border pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[42px] font-bold text-ai-text tracking-tight leading-tight">Novedades</h1>
          <p className="text-[16px] text-ai-text-secondary font-medium">Insights, actualizaciones e innovaciones de Cella Medical Solutions.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 h-11 rounded-full border border-ai-border hover:bg-ai-hover-1 text-ai-text text-[14px] font-semibold transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Volver al panel
        </button>
      </div>

      {/* FEED LIST */}
      <div className="flex flex-col gap-12">
        {feedArticles.map((article) => (
          <div 
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="flex gap-8 sm:gap-12 justify-between items-start group cursor-pointer"
          >
            <div className="flex flex-col flex-1 min-w-0">
              {/* Author & Date Metadata */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[var(--ai-accent)] flex items-center justify-center text-[10px] font-bold text-white">
                  {article.avatar}
                </div>
                <div className="flex items-center gap-1.5 text-[13px]">
                  <span className="font-bold text-ai-text hover:underline">{article.author}</span>
                  <span className="text-ai-text-tertiary">en</span>
                  <span className="font-bold text-ai-text hover:underline">Cella Engineering</span>
                  <span className="text-ai-text-tertiary">·</span>
                  <span className="text-ai-text-tertiary">{article.date}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-[22px] font-bold text-ai-text leading-[1.3] mb-2 group-hover:text-ai-text-secondary transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-[16px] text-ai-text-tertiary leading-[1.5] line-clamp-2 mb-6 font-normal">
                {article.subtitle}
              </p>
              
              {/* Actions Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <span className="bg-ai-base/50 px-2.5 py-1 rounded-full text-[12px] font-semibold text-ai-text-secondary">
                    {article.category}
                  </span>
                  <span className="text-[13px] text-ai-text-tertiary font-medium">{article.readTime}</span>
                  <span className="text-ai-text-tertiary">·</span>
                  <span className="text-[13px] text-ai-text-tertiary font-medium">Seleccionado para ti</span>
                </div>
                <div className="flex items-center gap-5 text-ai-text-tertiary">
                  <button className="hover:text-ai-text transition-all"><Plus size={20} /></button>
                  <button className="hover:text-ai-text transition-all"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </div>

            {/* Thumbnail Image */}
            <div className="w-[112px] h-[112px] sm:w-[160px] sm:h-[112px] rounded-[4px] overflow-hidden shrink-0 bg-ai-base border border-ai-border shadow-sm group-hover:shadow-md transition-shadow">
              <img 
                src={article.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={article.title} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop";
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 text-center">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="rounded-full px-8 h-12 text-[15px] font-medium border-ai-border text-ai-text hover:bg-ai-hover-1"
        >
          Volver al panel
        </Button>
      </div>
    </div>
  );
}



// -------------------------------------------------------------------------------- //
// DOCS VIEW
// -------------------------------------------------------------------------------- //

const DOCS_SECTIONS = [
  {
    title: 'Primeros Pasos',
    icon: '🚀',
    color: 'text-[var(--ai-accent-hover)]',
    bg: 'bg-blue-500/10',
    articles: [
      { title: '¿Qué es Cella Studio?', time: '3 min', tag: 'Intro' },
      { title: 'Guía de inicio rápido', time: '5 min', tag: 'Guía' },
      { title: 'Creando tu primer caso', time: '4 min', tag: 'Guía' },
      { title: 'Navegando el panel', time: '2 min', tag: 'Intro' },
    ],
  },
  {
    title: 'Gestión de Cases',
    icon: '📁',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    articles: [
      { title: 'Ciclo de vida y estados', time: '4 min', tag: 'Concepto' },
      { title: 'Subiendo datos (DICOM)', time: '6 min', tag: 'Guía' },
      { title: 'Asignando equipo', time: '3 min', tag: 'Guía' },
      { title: 'Filtros y búsqueda', time: '2 min', tag: 'Guía' },
      { title: 'Mover casos entre proyectos', time: '2 min', tag: 'Guía' },
    ],
  },
  {
    title: 'IA y Análisis',
    icon: '🧠',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    articles: [
      { title: 'Cómo funciona la IA', time: '7 min', tag: 'Concepto' },
      { title: 'Ejecutar un modelo', time: '5 min', tag: 'Guía' },
      { title: 'Interpretar resultados', time: '5 min', tag: 'Guía' },
      { title: 'Regiones anatómicas', time: '3 min', tag: 'Referencia' },
    ],
  },
  {
    title: 'Projects y Colaboración',
    icon: '🤝',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    articles: [
      { title: 'Crear proyectos', time: '3 min', tag: 'Guía' },
      { title: 'Invitar colaboradores', time: '2 min', tag: 'Guía' },
      { title: 'Permisos y roles', time: '4 min', tag: 'Referencia' },
      { title: 'Compartir enlaces', time: '2 min', tag: 'Guía' },
    ],
  },
  {
    title: 'Referencia API',
    icon: '⚡',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    articles: [
      { title: 'Autenticación', time: '5 min', tag: 'Referencia' },
      { title: 'Endpoint Cases', time: '6 min', tag: 'Referencia' },
      { title: 'Webhooks', time: '4 min', tag: 'Referencia' },
      { title: 'Límites de uso', time: '3 min', tag: 'Referencia' },
    ],
  },
];

const QUICKSTART = [
  { icon: '📤', title: 'Sube tu primer DICOM', desc: 'Arrastra archivos o conecta PACS.', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
  { icon: '🤖', title: 'Ejecuta IA', desc: 'Elige un modelo y obtén resultados.', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
  { icon: '🔗', title: 'Invita a tu equipo', desc: 'Comparte casos con roles definidos.', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
  { icon: '📊', title: 'Exportara reporte', desc: 'Descarga PDF o envía a tu HCE.', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20' },
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
    { id: 'profile', label: 'Perfil', icon: <User size={18} /> },
    { id: 'security', label: 'Seguridad', icon: <Lock size={18} /> },
    { id: 'logistics', label: 'Envío', icon: <Truck size={18} /> },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text max-w-[900px] h-[750px] p-0 rounded-[8px] overflow-hidden flex flex-row gap-0 [&>button]:top-6 [&>button]:right-6 [&>button]:opacity-50 hover:[&>button]:opacity-100 transition-all">
        {/* MODAL SIDEBAR */}
        <div className="w-[240px] border-r border-ai-border flex flex-col p-6 gap-6 shrink-0 h-full">
          <div className="flex flex-col gap-1.5 px-2">
            <h2 className="text-[20px] font-bold text-ai-text tracking-tight">Ajustes</h2>
            <p className="text-[12px] text-ai-text-tertiary font-medium">Gestiona tu cuenta y preferencias.</p>
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
              {activeTab === 'profile' && "Perfil Personal"}
              {activeTab === 'security' && "Seguridad"}
              {activeTab === 'logistics' && "Direcciones de Envío"}
            </h3>
            <p className="text-[13px] text-ai-text-tertiary font-medium">
              {activeTab === 'profile' && "Gestiona tu identidad clínica e información de contacto profesional."}
              {activeTab === 'security' && "Gestiona la seguridad de tu cuenta médica."}
              {activeTab === 'logistics' && "Configura direcciones para entregas de modelos anatómicos y prototipos."}
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
                    <h4 className="text-[18px] font-bold text-ai-text tracking-tight">Dr. Alex Salmerón</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--ai-accent)] text-[12px] font-bold">Cirujano Jefe</span>
                      <span className="w-1 h-1 rounded-full bg-ai-border" />
                      <span className="text-[13px] text-ai-text-tertiary font-medium">Cella Medical Solutions</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <ProfileItem label="Especialidad médica" value="Cirugía general - Hepatobiliopancreática" />
                    <ProfileItem label="Hospital principal" value="Cella Medical Solutions" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    <SettingsInput label="Correo electrónico" defaultValue="alejandrosalmeron+1@cellams.com" icon={<Mail size={16} />} />
                    <SettingsInput label="Teléfono" placeholder="+34 600 000 000" icon={<MessageSquare size={16} />} />
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
                    <span className="text-[15px] font-bold text-ai-text tracking-tight">Actualizar contraseña</span>
                    <span className="text-[13px] text-ai-text-tertiary font-medium">Mantén tus casos seguros. Cambiada hace 3 meses.</span>
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
                      <p className="text-[15px] text-ai-text font-bold leading-tight tracking-tight mb-1">Dirección del hospital</p>
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
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-[40px] px-6 rounded-[8px] font-medium border border-ai-border transition-all active:scale-95">Cancelar</Button>
            <Button onClick={() => onOpenChange(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[40px] px-8 rounded-[8px] font-bold active:scale-95 transition-all">Guardar Cambios</Button>
          </div>
        </div>

        {/* SUB-MODALS */}
        <Dialog open={isLogisticsOpen} onOpenChange={setIsLogisticsOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[500px] p-0 rounded-[8px] overflow-hidden">
            <div className="p-8 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[22px] font-bold tracking-tight">Editar dirección</DialogTitle>
              <p className="text-[14px] text-ai-text-tertiary">Establece tu destino de entrega de prototipos.</p>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Calle</label>
                <input 
                  className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" 
                  defaultValue={address.street} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Ciudad</label>
                  <input 
                    className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                    defaultValue={address.city}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">CP</label>
                  <input 
                    className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                    defaultValue={address.zip}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Teléfono</label>
                <input 
                  className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]"
                  defaultValue={address.phone}
                />
              </div>
            </div>
            <div className="p-8 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsLogisticsOpen(false)} className="h-[44px] px-8 rounded-[8px] font-bold border border-ai-border transition-all hover:bg-white dark:hover:bg-ai-surface">Cancelar</Button>
              <Button onClick={() => setIsLogisticsOpen(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[44px] px-10 rounded-[8px] font-bold transition-all active:scale-95">Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogContent className="bg-white dark:bg-ai-surface border-ai-border text-ai-text sm:max-w-[460px] p-0 rounded-[8px] overflow-hidden">
            <div className="p-8 border-b border-ai-border flex flex-col gap-1">
              <DialogTitle className="text-[20px] font-bold tracking-tight">Cambiar contraseña</DialogTitle>
              <p className="text-[14px] text-ai-text-tertiary">Asegúrate de usar una contraseña segura.</p>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Contraseña actual</label>
                <input type="password" placeholder="••••••••" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
              <div className="h-px bg-ai-border/60 w-full my-2" />
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Nueva contraseña</label>
                <input type="password" placeholder="Nueva contraseña" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[12px] font-bold text-ai-text-tertiary uppercase tracking-widest">Confirmar contraseña</label>
                <input type="password" placeholder="Repetir nueva contraseña" className="w-full h-[52px] px-4 rounded-[8px] border border-ai-border bg-ai-base outline-none focus:ring-2 focus:ring-[var(--ai-accent)]/20 focus:border-[var(--ai-accent)] transition-all text-[15px]" />
              </div>
            </div>
            <div className="p-8 bg-ai-base/30 border-t border-ai-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPasswordOpen(false)} className="h-[44px] px-8 rounded-[8px] font-bold border border-ai-border transition-all hover:bg-white dark:hover:bg-ai-surface">Cancelar</Button>
              <Button onClick={() => setIsPasswordOpen(false)} className="bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white h-[44px] px-10 rounded-[8px] font-bold transition-all active:scale-95">Cambiar</Button>
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
              <p className="text-[11px] font-medium text-ai-text-tertiary uppercase tracking-widest mb-2">Documentación</p>
              <h1 className="text-[26px] font-semibold text-ai-text">{currentSection.title}</h1>
              <p className="text-[14px] text-ai-text-secondary leading-relaxed mt-2">
                {currentSection.title === 'Primeros Pasos' && 'Todo lo necesario para pasar de cero a tu primer caso asistido por IA en minutos.'}
                {currentSection.title === 'Gestión de Cases' && 'Gestiona, organiza y rastrea casos de imagen médica en tu espacio de trabajo.'}
                {currentSection.title === 'IA y Análisis' && 'Entiende los modelos de IA y cómo sacar el máximo provecho del análisis automático.'}
                {currentSection.title === 'Projects y Colaboración' && 'Configura proyectos, gestiona accesos y colabora con tu equipo clínico.'}
                {currentSection.title === 'Referencia API' && 'Integra Cella Studio en tus flujos con nuestra API REST y webhooks.'}
              </p>
            </div>

            {/* Quickstart grid (Getting Started only) */}
            {currentSection.title === 'Primeros Pasos' && (
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
                    <p className="text-[11px] text-ai-text-tertiary mt-0.5">{article.time} de lectura</p>
                  </div>
                  <span className="text-[11px] text-ai-text-tertiary shrink-0">{article.tag}</span>
                  <ChevronRight size={13} className="text-ai-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            {/* Other sections */}
            <div className="mt-10">
              <p className="text-[11px] font-medium text-ai-text-tertiary uppercase tracking-widest mb-3">Otras secciones</p>
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
              <span className="text-[11px] text-ai-text-tertiary">{currentSection.articles.find(a => a.title === activeArticle)?.time} de lectura</span>
            </div>
            <h1 className="text-[24px] font-semibold text-ai-text mb-6">{activeArticle}</h1>
            <div className="w-full h-px bg-ai-border mb-8" />

            <div className="flex flex-col gap-5 text-[14px] text-ai-text-secondary leading-[1.8]">
              <p>
                Este artículo cubre <strong className="text-ai-text font-medium">{activeArticle}</strong> en detalle. Cella Studio optimiza la gestión de casos radiológicos a través de automatización con IA, herramientas de colaboración y una interfaz rápida.
              </p>
              <h2 className="text-[17px] font-semibold text-ai-text mt-1">Visión general</h2>
              <p>
                Ya sea un radiólogo procesando estudios o un cirujano revisando datos preoperatorios, Cella Studio se adapta a tu flujo. Esta sección revisa los conceptos clave y guía paso a paso.
              </p>
              <div className="rounded-[8px] border border-ai-border bg-ai-surface p-4">
                <p className="text-[12px] font-medium text-ai-text mb-1.5">💡 Tip</p>
                <p className="text-[13px] text-ai-text-secondary leading-relaxed">
                  Puedes saltar directamente a cualquier sección usando la barra izquierda, o presionar <kbd className="bg-ai-hover-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-ai-text border border-ai-border">⌘K</kbd> para abrir la paleta de comandos.
                </p>
              </div>
              <h2 className="text-[17px] font-semibold text-ai-text mt-1">Pasos</h2>
              {['Comienza desde el panel principal', 'Selecciona o crea un caso', 'Sube los datos de imagen relevantes', 'Configura los parámetros del modelo si es necesario', 'Revisa el resultado de la IA y anota', 'Comparte con tu equipo o exporta'].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-ai-border flex items-center justify-center shrink-0 text-[11px] font-semibold text-ai-text-secondary mt-0.5">{i + 1}</div>
                  <p className="text-ai-text">{step}</p>
                </div>
              ))}
              <div className="rounded-[8px] border border-ai-border bg-ai-surface p-4 mt-1">
                <p className="text-[12px] font-medium text-ai-text mb-1.5">⚠️ Importante</p>
                <p className="text-[13px] text-ai-text-secondary leading-relaxed">Verifica siempre las anotaciones de la IA contra los datos originales antes de incluirlos en un informe clínico.</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-ai-border flex items-center justify-between">
              <p className="text-[12px] text-ai-text-tertiary">¿Fue útil?</p>
              <div className="flex gap-2">
                <button className="text-[12px] px-3 py-1.5 rounded-[8px] border border-ai-border hover:bg-ai-hover-1 text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer">Sí</button>
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
              <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">En esta página</p>
              <div className="flex flex-col gap-1.5">
                {(currentSection.title === 'Primeros Pasos'
                  ? ['Visión general', 'Inicio rápido', 'Artículos', 'Otras secciones']
                  : ['Visión general', 'Artículos', 'Otras secciones']
                ).map(item => (
                  <button key={item} className="text-left text-[12px] text-ai-text-secondary hover:text-ai-text transition-colors cursor-pointer py-0.5">{item}</button>
                ))}
              </div>
            </div>
            <div className="w-full h-px bg-ai-border" />
            <div>
              <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">Changelog</p>
              <div className="flex flex-col gap-3">
                {[{ v: 'v2.4', note: 'DICOM multi-serie' }, { v: 'v2.3', note: 'Reintentos webhook' }, { v: 'v2.2', note: 'Modelo hepático' }].map(u => (
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
            <p className="text-[10px] font-semibold text-ai-text-tertiary uppercase tracking-widest mb-3">Contenido</p>
            <div className="flex flex-col gap-1.5">
              {['Visión general', 'Pasos', 'Importante', 'Feedback'].map(item => (
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

function DiscoverView({ onViewModel, onRequest }: { onViewModel?: (caseData: any) => void, onRequest?: (productName: string) => void }) {
  const router = useRouter();
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Recomendados");
   const [filterType, setFilterType] = useState("Colorrectal");

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

  const featuredScrollItems = Object.keys(hierarchyData).map(key => ({
    title: key,
    category: key,
    description: `${hierarchyData[key].length} procedimientos`,
    letter: key[0],
    gradient: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20"
  }));

  const subcategories = activeCategory ? (hierarchyData[activeCategory] || []).map((sub: string) => ({
    name: sub,
    count: Math.floor(Math.random() * 10) + 2
  })) : [];

  const productIndications = [
    {
      label: "Tumores malignos primarios",
      items: ["Carcinoma hepatocelular (CHC)", "Colangiocarcinoma intrahepático", "Angiosarcoma hepático"]
    },
    {
      label: "Tumores malignos metastásicos",
      items: []
    },
    {
      label: "Lesiones benignas o premalignas",
      items: []
    },
    {
      label: "Enfermedades quísticas y congénitas",
      items: []
    },
    {
      label: "Patologías vasculares",
      items: []
    }
  ];

  const [caseCardsLevel1, setCaseCardsLevel1] = useState([
    { 
      isForMe: true, 
      category: "Hepatobiliopancreática", 
      title: "Hepático", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.3 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.5 mm", phase: "Arterial/Venosa", contrast: "Sí" }
    },
    { 
      isForMe: false, 
      category: "Urología", 
      title: "Nefrectomía parcial", 
      image: "/images/models/kidneys_3d_1772712147028.png",
      layers: [
        { url: "/models/rinones.stl", color: "#ffccd1", opacity: 0.5 },
        { url: "/models/ureteres.stl", color: "#fbbf24" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT/MRI", format: "DICOM", thickness: "< 2.0 mm", phase: "Nefrográfica", contrast: "Sí" }
    },
    { 
      isForMe: true, 
      category: "Colorrectal", 
      title: "Fístulas rectales", 
      image: "/images/models/intestines_3d_1772712054852.png",
      layers: [
        { url: "/models/higado.stl", color: "#ffcc99", opacity: 0.5 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" },
        { url: "/models/tumor_arterial.stl", color: "#ef4444" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.0 mm", phase: "Multifase", contrast: "Sí" }
    },
    { 
      isForMe: false, 
      category: "Torácica", 
      title: "Tumor pulmonar", 
      image: "/images/models/lungs_3d_1772712131331.png",
      layers: [
        { url: "/models/costillas.stl", color: "#e2e8f0", opacity: 0.2 },
        { url: "/models/vasculatura_arterial.stl", color: "#ef4444" },
        { url: "/models/tumor_arterial.stl", color: "#fbbf24" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.25 mm", phase: "Fase única", contrast: "Sí" }
    },
    { 
      isForMe: false, 
      category: "Esofagogástrica", 
      title: "Esofagogástrico", 
      image: "/images/models/intestines_3d_1772712054852.png",
      layers: [
        { url: "/models/parenquima_funcional.stl", color: "#f87171", opacity: 0.4 },
        { url: "/models/vasculatura_portal.stl", color: "#3b82f6" }
      ],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 2.0 mm", phase: "Portal", contrast: "Sí" }
    },
    { 
      isForMe: false, 
      category: "Vascular", 
      title: "Aneurisma Aórtico", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.0 mm", phase: "CTA", contrast: "Sí" }
    },
    { 
      isForMe: false, 
      category: "Ortopédica", 
      title: "Reemplazo de cadera", 
      image: "/images/models/liver_3d_1772712040731.png",
      layers: [],
      indications: productIndications,
      requirements: { modality: "CT", format: "DICOM", thickness: "< 1.0 mm", phase: "N/A", contrast: "No" }
    }
  ]);


  const sortedCards = useMemo(() => {
    const list = [...caseCardsLevel1];
    if (sortBy === "Recomendados") {
      return list.sort((a, b) => (a.isForMe === b.isForMe ? 0 : a.isForMe ? -1 : 1));
    }
    if (sortBy === "Alfabético (A-Z)") {
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

  return (
    <div className="flex flex-col gap-[35px] w-full mt-6 pb-16 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="text-[28px] font-bold text-ai-text tracking-tight">Catálogo</h1>
          <p className="text-ai-text-tertiary text-[14px]">Explora nuestros modelos quirúrgicos especializados y soluciones clínicas.</p>
        </div>
        
        {level > 1 && (
          <button 
            onClick={() => setLevel(level === 3 ? 2 : 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ai-surface border border-ai-border text-[13px] font-bold text-blue-500 hover:bg-ai-hover-1 transition-all"
          >
            <ArrowLeft size={16} />
            Volver a {level === 3 ? 'Especialidades' : 'Catálogo'}
          </button>
        )}
      </div>

      {/* Level 1: Specialties */}
      {level === 1 && (
        <div className="mb-8">
          <h3 className="text-[13px] font-bold text-ai-text-tertiary uppercase tracking-[0.2em] mb-6">Seleccionar Especialidad Médica</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 scroll-smooth snap-x">
            {featuredScrollItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center h-[42px] px-6 rounded-full bg-white dark:bg-ai-surface border border-ai-border hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)] transition-all duration-300 cursor-pointer shrink-0 snap-start text-[13px] font-bold text-ai-text-secondary"
                onClick={() => handleCategoryClick(item.category)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level 2: Procedimientos */}
      {level === 2 && activeCategory && (
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-[13px] font-bold text-ai-text-tertiary uppercase tracking-[0.2em]">Procedimientos para {activeCategory}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {subcategories.map((sub: any) => (
              <div 
                key={sub.name}
                onClick={() => handleSubcategoryClick(sub.name)}
                className="h-[42px] px-6 rounded-full border border-ai-border bg-white dark:bg-ai-surface hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)] transition-all cursor-pointer flex items-center justify-center text-[13px] font-bold text-ai-text-secondary whitespace-nowrap"
              >
                {sub.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Level 3: Active Filter Badge */}
      {level === 3 && (
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
           <div className="flex items-center gap-2">
             <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500 text-blue-500 text-[13px] font-bold">
               {activeSubcategory}
             </div>
           </div>
        </div>
      )}

      {/* All products header section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-semibold text-[20px] text-ai-text tracking-tight">
            {level === 1 && "Todos los Productos"}
            {level === 2 && activeCategory}
            {level === 3 && activeSubcategory}
          </h2>

          {/* Search & Filters Row */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group/search">
               <SmartSearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar productos..."
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
                {['Recomendados', 'Más populares', 'Más nuevos', 'Alfabético (A-Z)'].map(s => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
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
                      <span className="text-[11px] font-semibold text-ai-text capitalize tracking-wider">Recomendado</span>
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
                    <span>Ver Modelo 3D</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequest?.(card.title);
                    }}
                    className="h-[32px] px-4 bg-[var(--ai-accent)] hover:opacity-90 text-white dark:text-black rounded-[8px] font-bold text-[12px] transition-all active:scale-95"
                  >
                    Solicitar
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-[1100px] w-[95vw] h-[80vh] max-h-[800px] p-0 overflow-hidden bg-white dark:bg-ai-surface border-ai-border rounded-[16px] flex flex-col md:flex-row shadow-2xl z-[500]">
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
                         Indicaciones de Uso
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
                         Requisitos Técnicos
                       </h3>
                       <div className="rounded-[12px] border border-ai-border overflow-hidden bg-white dark:bg-ai-surface shadow-sm text-ai-text">
                          <table className="w-full text-left text-[13px]">
                             <tbody>
                                {[
                                  { label: "Modalidad", value: selectedProduct.requirements.modality },
                                  { label: "Formato", value: selectedProduct.requirements.format },
                                  { label: "Grosor de corte", value: selectedProduct.requirements.thickness },
                                  { label: "Fase", value: selectedProduct.requirements.phase },
                                  { label: "Contraste", value: selectedProduct.requirements.contrast }
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
                    <Button 
                      onClick={() => router.push("/request-case/step-1")}
                      className="w-full h-[48px] bg-[var(--ai-accent)] hover:opacity-90 text-white dark:text-black rounded-[10px] font-bold text-[14px] active:scale-95 transition-all shadow-lg shadow-[var(--ai-accent)]/10"
                    >Solicitar</Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (selectedProduct && onViewModel) {
                          onViewModel({
                            ...selectedProduct,
                            clave: "DEMO-CASE",
                            subID: selectedProduct.category,
                            subProject: selectedProduct.title,
                            proyecto: "Product Preview",
                            status: "Demo",
                            avatars: [{ initials: "CS", name: "Cella Specialist" }]
                          });
                          setSelectedProduct(null);
                        }
                      }}
                      className="w-full h-[48px] bg-transparent border-ai-border hover:bg-ai-hover-1 text-ai-text rounded-[10px] font-bold text-[14px] active:scale-95 transition-all"
                    >Probar Modelo</Button>
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
              {current === total ? 'Finish' : 'Siguiente'}
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
