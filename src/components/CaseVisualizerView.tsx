import React, { useState, Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls, Center, Stage, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
    ChevronRight,
    Moon,
    Sun,
    ZoomIn,
    ZoomOut,
    Stethoscope,
    Layers,
    Move,
    Palette,
    Ruler,
    Scissors,
    Save,
    Share2,
    Users,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Plus,
    PanelLeft,
    Image as ImageIcon,
    Video,
    Music,
    Eye,
    EyeOff,
    Trash2,
    Edit2,
    Play,
    RotateCw,
    MessageSquare,
    Clipboard,
    MousePointer2,
    Hand,
    LogOut,
    Settings,
    Globe,
    Building2,
    RotateCcw,
    MoreHorizontal,
    HelpCircle,
    RotateCcw as RotateCcwIcon,
    Search,
    Monitor,
    Camera,
    Circle,
    Type,
    Maximize,
    Send,
    CheckCircle,
    Home,
    FlipVertical,
    FlipHorizontal,
    X,
    PanelRight,
    Info,
    Check,
    Clock,
    ArrowUp,
    Mic,
    AudioLines,
    SlidersHorizontal,
    Smile,
    AtSign,
    Image as LucideImage,
    FileDown,
    MapPin,
    Target,
    Settings2
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Reply {
    id: string;
    author: string;
    text: string;
    timestamp: string;
}

interface Comment {
    id: string;
    x: number;
    y: number;
    author: string;
    timestamp: string;
    text: string;
    replies: Reply[];
    resolved: boolean;
}

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
}

interface Mark {
    id: string;
    name: string;
    description: string;
    color: string;
    position: [number, number, number];
    opacity: number;
    visible: boolean;
    isDraft?: boolean;
    layerId: string;
}

interface AnatomyLayer {
    id: string;
    name: string;
    url: string;
    color: string;
    visible: boolean;
    opacity?: number;
    category?: 'vasculature' | 'organ' | 'tumor' | 'skeletal';
    volume?: number;
    transverse?: number;
    craniocaudal?: number;
    anteroposterior?: number;
}

interface Measurement {
    id: string;
    name: string;
    points: THREE.Vector3[];
    totalDistance: number;
    visible: boolean;
    layerId?: string;
}

interface CustomView {
    id: string;
    name: string;
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    visibleLayers: string[];
    zoom: number;
}

function ContextMenuItem({ isDark, icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2.5 w-full px-3 py-1.5 rounded-[8px] text-[13px] transition-colors ${isDark ? "hover:bg-white/10 text-[#EDEDED]" : "hover:bg-black/5 text-[#11181C]"}`}
        >
            <span className="opacity-70">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function ToolButton({ isDark, icon, label, active = false, onClick }: { isDark?: boolean, icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <button
                        onClick={onClick}
                        className={`w-[32px] h-[32px] flex items-center justify-center rounded-[8px] cursor-pointer transition-all duration-200 focus:outline-none ${active
                            ? "bg-[#3B82F6] text-white"
                            : "text-[#a3a3a3] hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={14} className={`${isDark ? "bg-[#1f2128] border border-white/10 text-[#ededed]" : "bg-white border border-black/5 text-gray-900"} rounded-lg px-3 py-1.5`}><p className="text-[12px] font-medium">{label}</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function SplitToolButton({ isDark, icon, label, active = false, onClick, dropdownItems }: any) {
    return (
        <div className="flex items-center gap-0.5">
            <ToolButton isDark={isDark} icon={icon} label={label} active={active} onClick={onClick} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={`w-[14px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-white/10 transition-all cursor-pointer outline-none focus:outline-none ${active ? "opacity-100 text-white" : "opacity-40 text-[#a3a3a3] hover:opacity-100"}`}>
                        <ChevronUp size={10} strokeWidth={2.5} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" sideOffset={10} className={`rounded-[8px] p-1.5 border min-w-[140px] bg-[#1f2128] border-white/10 text-[#ededed]`}>
                    {dropdownItems}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function CommentPin({ author = "User", active, onClick }: any) {
    const avatarColor = useMemo(() => {
        const colors = ['#FF5C00', '#0ACF83', '#1ABCFE', '#A259FF', '#F24E1E'];
        const safeAuthor = author || "User";
        let hash = 0;
        for (let i = 0; i < safeAuthor.length; i++) hash = safeAuthor.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }, [author]);

    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold cursor-pointer border-2 transition-transform ${active ? 'border-blue-500 scale-110' : 'border-white hover:scale-110'}`}
            style={{ backgroundColor: avatarColor }}
            onClick={onClick}
        >
            {(author || "U").charAt(0).toUpperCase()}
        </div>
    );
}

function MinimalistCommentInput({ isDark, value, onValueChange, onSubmit, onCancel, author }: any) {
    const isEmpty = !value.trim();
    return (
        <div className={`flex items-center gap-2.5 p-2 rounded-[8px] border min-w-[320px] ${isDark ? "bg-[#1C1C1E] border-white/10" : "bg-white border-black/10"}`}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white text-[10px] font-bold shrink-0">
                {author.charAt(0).toUpperCase()}
            </div>
            <input
                autoFocus
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isEmpty) onSubmit();
                    if (e.key === 'Escape') onCancel();
                }}
                placeholder="Add a comment..."
                className={`flex-1 bg-transparent border-none outline-none text-[14px] ${isDark ? "text-white placeholder:text-white/30" : "text-black placeholder:text-black/30"}`}
            />
            <button
                onClick={onSubmit}
                disabled={isEmpty}
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-all shrink-0 ${isEmpty ? 'bg-blue-600/30 text-white/50 cursor-not-allowed scale-95' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
            >
                <ArrowUp size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
}

function CommentItem({ isDark, comment, active, onActivate, onUpdate, onDelete, onHoverUI }: any) {
    const [inputValue, setInputValue] = useState(comment.text || "");

    return (
        <div
            className="absolute z-[50]"
            style={{ left: comment.x, top: comment.y, transform: 'translate(-50%, -50%)' } as any}
        >
            {!active ? (
                // Only show pin if there is text
                comment.text && (
                    <CommentPin
                        author={comment.author}
                        active={active}
                        onClick={(e: any) => { e.stopPropagation(); onActivate(); }}
                    />
                )
            ) : (
                <div
                    className="absolute top-0 left-0"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => onHoverUI(true)}
                    onMouseLeave={() => onHoverUI(false)}
                >
                    <MinimalistCommentInput
                        isDark={isDark}
                        author={comment.author}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onSubmit={() => {
                            if (inputValue.trim()) {
                                onUpdate(comment.id, inputValue);
                                onActivate(null); // Auto-close after submission
                            } else {
                                onDelete(comment.id); // Delete if empty
                                onActivate(null);
                            }
                        }}
                        onCancel={() => {
                            if (!comment.text.trim() && !inputValue.trim()) onDelete(comment.id);
                            onActivate(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
}


function SidebarItem({ isDark, title, subtitle, active, icon, image, indent, visible = true, onToggle, onSelect, onContextMenu }: any) {
    const [hover, setHover] = useState(false);
    return (
        <div
            className={`group flex items-center h-[34px] rounded-[8px] cursor-pointer transition-colors ${active ? (isDark ? 'bg-[#2A2A2A]' : 'bg-black/5') : (isDark ? 'hover:bg-[#2A2A2A]/50' : 'hover:bg-black/5')} ${indent ? 'ml-6' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onContextMenu={(e) => {
                if (onContextMenu) {
                    e.preventDefault();
                    onContextMenu(e);
                }
            }}
        >
            <div
                onClick={onSelect}
                className={`flex items-center gap-2.5 px-2 overflow-hidden flex-1 h-[34px] ${isDark ? 'text-[#EDEDED]' : 'text-[#11181c]'}`}
            >
                {image ? <img src={image} className="w-[18px] h-[18px] rounded-sm object-cover" alt="" /> : icon ? <div className="w-[18px] flex items-center justify-center opacity-70">{icon}</div> : <div className="w-[18px] flex items-center justify-center opacity-70"><Layers size={14} /></div>}
                <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                    <span className="text-[13px] truncate">{title}</span>
                    {subtitle && <span className={`text-[12px] ${isDark ? 'text-[#687076]' : 'text-[#8E918F]'}`}>{subtitle}</span>}
                </div>
            </div>

            {(hover || !visible) && (
                <div className="flex items-center h-[34px]">
                    {hover && <div className={`w-[1px] h-4 ${isDark ? 'bg-[#141516]' : 'bg-[#FAFAFA]'}`} />}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
                        className={`flex items-center justify-center w-[34px] h-[34px] transition-colors ${isDark ? 'text-[#687076] hover:text-[#EDEDED]' : 'text-[#8E918F] hover:text-[#11181c]'}`}
                    >
                        {visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                </div>
            )}
        </div>
    );
}

function SavedViewItem({ isDark, title, onApply, onDelete, onRename, onUpdate }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            // Using a slightly longer delay to ensure the dropdown has fully closed 
            // and restored its focus before we steal it for the rename input.
            const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                    inputRef.current.setSelectionRange(0, inputRef.current.value.length);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim() && editValue !== title) {
            onRename(editValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(title);
        setIsEditing(false);
    };

    return (
        <div className={`group flex items-center justify-between px-2 h-[34px] rounded-[8px] cursor-pointer transition-colors ${isDark ? 'hover:bg-[#2A2A2A]/50' : 'hover:bg-black/5'} ${isEditing ? (isDark ? 'bg-[#2A2A2A]' : 'bg-black/5') : ''}`} onClick={() => !isEditing && onApply()}>
            <div className={`flex items-center gap-2.5 overflow-hidden flex-1 ${isDark ? 'text-[#EDEDED]' : 'text-[#11181c]'}`}>
                <div className="w-[18px] flex items-center justify-center opacity-70"><ImageIcon size={14} /></div>
                {isEditing ? (
                    <div className={`flex-1 flex items-center px-1 py-0.5 rounded-[8px] border border-blue-500/30 ${isDark ? 'bg-blue-500/5' : 'bg-blue-500/10'} transition-all`}>
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onFocus={(e) => {
                                e.target.select();
                                e.target.setSelectionRange(0, e.target.value.length);
                            }}
                            onBlur={handleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            className={`bg-transparent border-none outline-none text-[13px] w-full p-0 font-medium selection:bg-blue-500 selection:text-white ${isDark ? 'text-[#EDEDED]' : 'text-[#11181C]'}`}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                ) : (
                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <span className="text-[13px] truncate">{title}</span>
                            </TooltipTrigger>
                            <TooltipContent side="right" className={`${isDark ? "bg-[#1f2128] border border-white/10 text-[#ededed]" : "bg-white border border-black/5 text-[#11181c]"} rounded-lg px-2 py-1 z-[100]`}>
                                <p className="text-[12px]">{title}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`} onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={`w-[24px] h-[24px] flex justify-center items-center rounded-[8px] transition-colors outline-none ${isDark ? 'text-[#687076] hover:text-[#EDEDED] hover:bg-white/10' : 'text-[#8E918F] hover:text-[#11181c] hover:bg-black/5'}`}><MoreHorizontal size={14} /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={4} className={`w-40 rounded-[8px] p-1 border ${isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/10 text-[#11181c]"}`}>
                        <DropdownMenuItem
                            onSelect={() => setIsEditing(true)}
                            className="text-[13px] rounded-[8px] px-2 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10"
                        >
                            <Edit2 size={14} className="mr-2 opacity-70" />
                            <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onUpdate} className="text-[13px] rounded-[8px] px-2 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10"><RotateCw size={14} className="mr-2 opacity-70" /><span>Update View</span></DropdownMenuItem>
                        <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-black/5"} />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-[13px] rounded-[8px] px-2 py-1.5 cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10"
                        >
                            <Trash2 size={14} className="mr-2 text-red-500" /><span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

const AnimatedModel = ({ url, name, color, opacity, scale = [1, 1, 1], visible = true, onSelect, onContextMenu }: any) => {
    const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry;
    const meshRef = useRef<THREE.Mesh>(null);
    const [currentScale, setCurrentScale] = useState<[number, number, number]>(scale);

    useEffect(() => {
        setCurrentScale(scale);
    }, [scale]);

    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, currentScale[0], delta * 8);
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, currentScale[1], delta * 8);
            meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, currentScale[2], delta * 8);
        }
    });

    const isTransparent = opacity < 1;

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            name={name}
            scale={currentScale}
            visible={visible}
            onClick={(e: any) => {
                if (!visible) return;
                e.stopPropagation();
                onSelect();
            }}
            onContextMenu={(e: any) => {
                if (!visible) return;
                e.stopPropagation();
                onContextMenu(e);
            }}
        >
            <meshStandardMaterial
                color={color}
                transparent={isTransparent}
                depthWrite={!isTransparent}
                opacity={opacity}
                roughness={0.8}
                metalness={0}
                envMapIntensity={0.2}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

function CameraHandler({ targetView, onTransitionEnd, orbitControlsRef }: { targetView: CustomView | null, onTransitionEnd: () => void, orbitControlsRef: React.RefObject<any> }) {
    const transitionData = React.useRef<{
        startPos: THREE.Vector3;
        startTarget: THREE.Vector3;
        startTime: number;
    } | null>(null);

    // Initialize the fixed start coordinates whenever the targetView changes
    React.useEffect(() => {
        if (targetView && orbitControlsRef.current) {
            transitionData.current = {
                startPos: orbitControlsRef.current.object.position.clone(),
                startTarget: orbitControlsRef.current.target.clone(),
                startTime: performance.now()
            };
        } else {
            transitionData.current = null;
        }
    }, [targetView, orbitControlsRef]);

    useFrame((state) => {
        if (!targetView || !transitionData.current) return;

        const camera = state.camera;
        const controls = orbitControlsRef.current;
        if (!controls) return;

        const { startPos, startTarget, startTime } = transitionData.current;
        const targetPos = new THREE.Vector3(...targetView.cameraPosition);
        const targetLookAt = new THREE.Vector3(...targetView.cameraTarget);

        const duration = 1200; // 1.2 seconds optimal duration
        const elapsed = performance.now() - startTime;
        let t = Math.min(elapsed / duration, 1);

        if (t >= 1) {
            // Guarantee final snap
            camera.position.copy(targetPos);
            controls.target.copy(targetLookAt);
            controls.update();
            onTransitionEnd();
            return;
        }

        // smoothstep / easeInOutCubic for a very premium feel
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // 1. Interpolate target look-at linearly
        controls.target.lerpVectors(startTarget, targetLookAt, easeT);

        // 2. SLERP (Spherical Linear Interpolation) for the camera position
        const startOffset = startPos.clone().sub(startTarget);
        const targetOffset = targetPos.clone().sub(targetLookAt);

        const startRadius = startOffset.length();
        const targetRadius = targetOffset.length();
        const currentRadius = THREE.MathUtils.lerp(startRadius, targetRadius, easeT);

        const startDir = startOffset.clone().normalize();
        const targetDir = targetOffset.clone().normalize();

        // Robust quaternion slerp from absolute start to absolute finish
        const baseVec = new THREE.Vector3(0, 0, 1);
        const qStart = new THREE.Quaternion().setFromUnitVectors(baseVec, startDir);
        const qEnd = new THREE.Quaternion().setFromUnitVectors(baseVec, targetDir);

        const qCurrent = new THREE.Quaternion().slerpQuaternions(qStart, qEnd, easeT);
        const currentDir = baseVec.clone().applyQuaternion(qCurrent);

        // Apply new position
        camera.position.copy(controls.target).add(currentDir.multiplyScalar(currentRadius));
        controls.update();
    });

    return null;
}

function Model({ id, url, color, opacity = 1, isDark, visible = true, onSelect, onContextMenu, onSurfaceClick }: { id: string; url: string; color: string; opacity?: number; isDark: boolean; visible?: boolean; onSelect?: () => void; onContextMenu?: (e: any) => void; onSurfaceClick?: (point: THREE.Vector3, layerId: string) => void }) {
    const geometry = useLoader(STLLoader, url);
    const material = useMemo(
        () =>
            new THREE.MeshPhongMaterial({
                color: new THREE.Color(color),
                transparent: opacity < 1,
                opacity: opacity,
                specular: isDark ? "#222" : "#444",
                shininess: 40,
                side: THREE.DoubleSide
            }),
        [color, opacity, isDark]
    );

    return (
        <mesh
            name={id}
            geometry={geometry}
            material={material}
            visible={visible}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
                if (!visible) return;
                e.stopPropagation();
                if (onSurfaceClick) {
                    onSurfaceClick(e.point, id);
                } else {
                    onSelect?.();
                }
            }}
            onPointerDown={(e) => {
                if (!visible) return;
                if (e.button === 2) { // Right click
                    e.stopPropagation();
                    onSelect?.();
                    onContextMenu?.(e);
                }
            }}
        />
    );
}

function PivotCentering({ controlsRef, anatomyLayers, targetViewId }: { controlsRef: any; anatomyLayers: AnatomyLayer[]; targetViewId: string | null | undefined }) {
    const { scene } = useThree();

    useEffect(() => {
        if (!controlsRef.current) return;

        // Use a slight delay to allow the scene to update and meshes to be placed
        const timer = setTimeout(() => {
            const box = new THREE.Box3();
            let hasVisible = false;

            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh && obj.visible && obj.geometry) {
                    const layer = anatomyLayers.find(l => l.id === obj.name);
                    // Only calculate center for anatomy layers (excluding grid, ruler visuals etc)
                    if (layer && layer.visible) {
                        obj.updateMatrixWorld();
                        box.expandByObject(obj);
                        hasVisible = true;
                    }
                }
            });

            if (hasVisible) {
                const center = new THREE.Vector3();
                box.getCenter(center);

                // For "Initial Overview", we always want target [0,0,0]
                if (targetViewId === '1') {
                    center.set(0, 0, 0);
                }

                controlsRef.current.target.lerp(center, 0.1);
                controlsRef.current.update();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [anatomyLayers, scene, controlsRef, targetViewId]);

    return null;
}

export function CaseVisualizerView({
    caseData,
    onBack,
    isDark,
    setIsDark,
    pointerMode,
    setPointerMode,
    onInviteClick,
    comments,
    setComments
}: {
    caseData: any;
    onBack: () => void;
    isDark: boolean;
    setIsDark: (val: boolean) => void;
    pointerMode: 'select' | 'hand' | 'rotate' | 'comments';
    setPointerMode: (mode: 'select' | 'hand' | 'rotate' | 'comments') => void;
    onInviteClick?: () => void;
    comments: any[];
    setComments: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    // UI Interaction state
    const [isHoveringUI, setIsHoveringUI] = useState(false);
    // Toggles for anatomy layers
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [detailsCollapsed, setDetailsCollapsed] = useState(false);
    const [propertiesExpanded, setPropertiesExpanded] = useState(true);
    const [appearanceExpanded, setAppearanceExpanded] = useState(true);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const targetRotation = useRef(new THREE.Euler(0, 0, 0));
    const currentRotation = useRef(new THREE.Euler(0, 0, 0));
    const [previousLayersState, setPreviousLayersState] = useState<string[] | null>(null);
    const [activeSidebarTab, setActiveSidebarTab] = useState<'layers' | 'views' | 'measures'>('layers');
    const [selectedAnatomyId, setSelectedAnatomyId] = useState<string | null>(null);

    // Marks State
    const [marks, setMarks] = useState<Mark[]>([]);
    const [editingMarkId, setEditingMarkId] = useState<string | null>(null);

    const handleAddMark = (point: THREE.Vector3, layerId: string) => {
        const id = Date.now().toString();
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#FFFFFF'];
        const nextColor = colors[marks.length % colors.length];

        const newMark: Mark = {
            id,
            name: `Mark ${marks.length + 1}`,
            description: '',
            color: nextColor,
            position: [point.x, point.y, point.z],
            opacity: 1.0,
            visible: true,
            isDraft: true,
            layerId
        };

        // Filter out any existing draft marks to avoid "ghosts"
        setMarks(prev => [...prev.filter(m => !m.isDraft), newMark]);
        setEditingMarkId(id);
        setActiveSidebarTab('layers'); // Just a safe fallback
    };

    // Comments Visibility State
    const [showAllComments, setShowAllComments] = useState(true);

    // Notes Logbook State
    const [notes, setNotes] = useState<Note[]>([
        { id: '1', title: 'Initial Assessment', content: 'The tumor is located in the upper pole of the left kidney...', date: '12 Mar 2024, 10:30' }
    ]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0].id);
    const [noteDraft, setNoteDraft] = useState('');

    useEffect(() => {
        const activeNote = notes.find(n => n.id === activeNoteId);
        if (activeNote) setNoteDraft(activeNote.content);
    }, [activeNoteId]);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key.toLowerCase() === 'c') {
                setActiveTool('comments');
            } else if (e.key.toLowerCase() === 'n') {
                setActiveTool('notes');
            } else if (e.key.toLowerCase() === 'm') {
                setActiveTool('marks');
            } else if (e.key.toLowerCase() === 'r') {
                setActiveTool('measures');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [lastSelectedTumorId, setLastSelectedTumorId] = useState<string | null>(null);
    const [activeMode, setActiveMode] = useState<'canvas' | 'copilot'>('canvas');
    const [copilotText, setCopilotText] = useState("");
    const [hasInitialFit, setHasInitialFit] = useState(false);
    const copilotInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus Copilot input when mode changes
    useEffect(() => {
        if (activeMode === 'copilot') {
            setTimeout(() => copilotInputRef.current?.focus(), 100);
        }
    }, [activeMode]);

    // Stabilize camera after initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasInitialFit(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const performIsolation = (targetId: string) => {
        // Capture current state for undo
        setPreviousLayersState(anatomyLayers.filter(l => l.visible).map(l => l.id));

        const targetLayer = anatomyLayers.find(l => l.id === targetId);
        if (!targetLayer) return [];

        const name = targetLayer.name.toLowerCase();
        const id = targetLayer.id.toLowerCase();
        const category = targetLayer.category;

        // Group-based isolation logic
        const isTumor = category === 'tumor' || name.includes('tumor') || id.includes('tumor') || id.startsWith('t_');
        const isKidney = id === 'rinones' || id.includes('rinon') || name.includes('kidney') || name.includes('riñon') || name.includes('riñón');
        const isLiver = id === 'higado' || id.includes('higado') || name.includes('liver') || name.includes('higado') || name.includes('hígado');
        const isVascular = category === 'vasculature' || name.includes('vascula') || name.includes('arter') || name.includes('vena') || name.includes('vessel');
        const isParenchyma = name.includes('parenquima') || name.includes('parenchyma') || id.includes('parenquima');

        const nextVisibleIds: string[] = [];
        const nextLayers = anatomyLayers.map(l => {
            let shouldBeVisible = false;
            const lName = l.name.toLowerCase();
            const lId = l.id.toLowerCase();
            const lCat = l.category;

            if (isTumor) shouldBeVisible = lCat === 'tumor' || lName.includes('tumor') || lId.includes('tumor') || lId.startsWith('t_');
            else if (isKidney) shouldBeVisible = lId === 'rinones' || lId.includes('rinon') || lName.includes('kidney') || lName.includes('riñon') || lName.includes('riñón');
            else if (isLiver) shouldBeVisible = lId === 'higado' || lId.includes('higado') || lName.includes('liver') || lName.includes('higado') || lName.includes('hígado');
            else if (isVascular) shouldBeVisible = lCat === 'vasculature' || lName.includes('vascula') || lName.includes('arter') || lName.includes('vena') || lName.includes('vessel');
            else if (isParenchyma) shouldBeVisible = lName.includes('parenchyma') || lName.includes('parenquima') || lId.includes('parenquima');
            else shouldBeVisible = l.id === targetId;

            if (shouldBeVisible) nextVisibleIds.push(l.id);
            return { ...l, visible: shouldBeVisible };
        });

        setAnatomyLayers(nextLayers);
        setSelectedAnatomyId(targetId);

        return nextVisibleIds;
    };

    const handleCopilotCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && copilotText.trim()) {
            const cmd = copilotText.toLowerCase();
            let madeChanges = false;
            let targetVisibleIds: string[] | undefined = undefined;
            let smartName = "";

            // Keyword detection
            const isTumor = cmd.includes('tumor');
            const isKidney = cmd.includes('kidney') || cmd.includes('riñon') || cmd.includes('riñón') || cmd.includes('riñones');
            // Show all command
            const isShowAll = cmd.includes('muestra todo') || cmd.includes('enseña todo') || cmd.includes('show all') || cmd.includes('mostrar todo');

            if (isShowAll) {
                // Reset to initial overview layers instead of 'true' for all
                const initialLayers = savedViews.find(v => v.id === '1')?.visibleLayers || [];
                setAnatomyLayers(prev => prev.map(l => ({ ...l, visible: initialLayers.includes(l.id) })));
                setPreviousLayersState(null);
                setCopilotText("");
                return;
            }

            // Action detection
            const isIsolate = cmd.includes('aisla') || cmd.includes('isolate') || cmd.includes('solo');
            const isVascular = cmd.includes('vasos') || cmd.includes('vascular') || cmd.includes('arteria') || cmd.includes('vena') || cmd.includes('vessels');
            const isLiver = cmd.includes('higado') || cmd.includes('hígado') || cmd.includes('liver');
            const isParenchyma = cmd.includes('parenquima') || cmd.includes('parenchyma');

            // Map keyword to a representative layer ID for performIsolation
            let repId = "";
            if (isTumor) repId = 'tumor';
            else if (isKidney) repId = 'rinones';
            else if (isLiver) repId = 'higado';
            else if (isVascular) repId = 'arterial';
            else if (isParenchyma) repId = 'parenquima';

            if (repId) {
                targetVisibleIds = performIsolation(repId);

                if (isTumor) smartName = "Isolated tumor";
                else if (isKidney) smartName = "Riñones aislados";
                else if (isVascular) smartName = "Vasos aislados";
                else if (isLiver) smartName = "Hígado aislado";
                else if (isParenchyma) smartName = "Parenquima aislado";

                madeChanges = true;
            }

            if (cmd.includes('save') || cmd.includes('guarda')) {
                saveCurrentView(smartName || copilotText, targetVisibleIds);
                madeChanges = true;
            }

            if (madeChanges) {
                setCopilotText("");
                setActiveSidebarTab('views');
                setSidebarCollapsed(false);
            }
        }
    };
    const [activeTool, setActiveTool] = useState<'rotate' | 'measures' | 'marks' | 'notes' | 'comments' | null>(null);
    const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    const [measureLayerId, setMeasureLayerId] = useState<string | null>(null);

    const handleAddMeasurePoint = (point: THREE.Vector3, layerId?: string) => {
        if (isMeasureLineHovered) return;
        if (measurePoints.length === 0 && layerId) {
            setMeasureLayerId(layerId);
        }
        setMeasurePoints(prev => [...prev, point]);
    };

    const handleSaveMeasurement = () => {
        if (measurePoints.length < 2) return;

        let total = 0;
        for (let i = 0; i < measurePoints.length - 1; i++) {
            total += measurePoints[i].distanceTo(measurePoints[i + 1]);
        }

        const newMeasure: Measurement = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Measurement ${measurements.length + 1}`,
            points: [...measurePoints],
            totalDistance: total,
            visible: true,
            layerId: measureLayerId || undefined
        };

        setMeasurements([...measurements, newMeasure]);
        setMeasurePoints([]);
        setMeasureLayerId(null);
        setActiveSidebarTab('measures');
    };

    const resetModel = () => {
        // Clear all annotations
        setMarks([]);
        setMeasurements([]);
        setComments([]);
        setNotes([
            { id: '1', title: 'Case Introduction', content: 'Patient 45-year-old male with a 4cm renal mass. Laparoscopic partial nephrectomy planned.', date: new Date().toLocaleString() }
        ]);

        // Reset interaction states
        setMeasurePoints([]);
        setActiveCommentId(null);
        setEditingMarkId(null);
        setHoveredMarkId(null);
        setHoveredMeasureId(null);
        setActiveNoteId('1');
        setNoteDraft('');

        // Reset to initial overview
        const initialView = savedViews.find(v => v.id === '1');
        if (initialView) {
            applySavedView(initialView);
        }

        // Finalize
        setIsRestoring(false);
    };

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetId?: string } | null>(null);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [showGrid, setShowGrid] = useState(true);
    const [showResolvedComments, setShowResolvedComments] = useState(false);
    const [targetView, setTargetView] = useState<CustomView | null>(null);
    const [deferredLoading, setDeferredLoading] = useState(false);
    const [hoveredMarkId, setHoveredMarkId] = useState<string | null>(null);
    const [hoveredMeasureId, setHoveredMeasureId] = useState<string | null>(null);
    const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState<number | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const [isMeasureLineHovered, setIsMeasureLineHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDeferredLoading(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const [savedViews, setSavedViews] = useState<CustomView[]>([
        {
            id: '1',
            name: 'Initial Overview',
            cameraPosition: [0, 0, 120],
            cameraTarget: [0, 0, 0],
            visibleLayers: ['higado', 'rinones', 'parenquima', 'venosa', 'arterial', 'portal', 'tumor', 'tumor_endo', 'tumor_exo', 'psoas', 'ureteres'],
            zoom: 30
        }
    ]);

    // Open sidebar automatically when selecting specific tools
    useEffect(() => {
        if (activeTool === 'comments' || activeTool === 'notes' || activeTool === 'marks') {
            setDetailsCollapsed(false);
        }

        // Cleanup unconfirmed marks when switching tools
        if (activeTool !== 'marks' && editingMarkId) {
            const mark = marks.find(m => m.id === editingMarkId);
            if (mark?.isDraft) {
                setMarks(prev => prev.filter(m => m.id !== editingMarkId));
            }
            setEditingMarkId(null);
        }
    }, [activeTool, editingMarkId, marks]);

    useEffect(() => {
        if (activeTool !== 'measures') {
            setMeasurePoints([]);
        }
    }, [activeTool]);

    // Keyboard global listener for Esc
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (editingMarkId) {
                    const mark = marks.find(m => m.id === editingMarkId);
                    if (mark?.isDraft) {
                        setMarks(prev => prev.filter(m => m.id !== editingMarkId));
                    }
                    setEditingMarkId(null);
                } else {
                    if (measurePoints.length > 0) {
                        setMeasurePoints([]);
                    } else {
                        setActiveTool(null);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [activeTool, editingMarkId, marks]);

    const orbitControlsRef = React.useRef<any>(null);

    const [anatomyLayers, setAnatomyLayers] = useState<AnatomyLayer[]>([
        { id: 'higado', name: 'Liver', url: '/models/higado.stl', color: '#8d6d53', visible: true, opacity: 0.6, category: 'organ', volume: 1540.2, transverse: 210, craniocaudal: 155, anteroposterior: 120 },
        { id: 'rinones', name: 'Kidneys', url: '/models/rinones.stl', color: '#9d4edd', visible: true, category: 'organ', volume: 312.5, transverse: 110, craniocaudal: 58, anteroposterior: 45 },
        { id: 'parenquima', name: 'Functional Parenchyma', url: '/models/parenquima_funcional.stl', color: '#c77dff', visible: true, opacity: 0.5, category: 'organ', volume: 2850.1, transverse: 195, craniocaudal: 140, anteroposterior: 110 },
        { id: 'venosa', name: 'Venous Vasculature', url: '/models/vasculatura_venosa.stl', color: '#0077b6', visible: true, category: 'vasculature', volume: 85.4 },
        { id: 'arterial', name: 'Arterial Vasculature', url: '/models/vasculatura_arterial.stl', color: '#e63946', visible: true, category: 'vasculature', volume: 42.1 },
        { id: 'portal', name: 'Portal Vasculature', url: '/models/vasculatura_portal.stl', color: '#fb8500', visible: true, category: 'vasculature', volume: 68.9 },
        { id: 'tumor', name: 'Tumor', url: '/models/tumor_arterial.stl', color: '#ffbd00', visible: true, category: 'tumor', volume: 45.8, transverse: 42, craniocaudal: 38, anteroposterior: 35 },
        { id: 'tumor_endo', name: 'Endophytic Component', url: '/models/tumor_arterial_componente_endofitico.stl', color: '#ffbd00', visible: true, category: 'tumor', volume: 12.4, transverse: 22, craniocaudal: 18, anteroposterior: 15 },
        { id: 'tumor_exo', name: 'Exophytic Component', url: '/models/tumor_arterial_componente_exofitico.stl', color: '#ffbd00', visible: true, category: 'tumor', volume: 33.4, transverse: 35, craniocaudal: 32, anteroposterior: 28 },
        { id: 'costillas', name: 'Ribs', url: '/models/costillas.stl', color: '#e5e5e5', visible: false, opacity: 0.1, category: 'skeletal' },
        { id: 'psoas', name: 'Psoas', url: '/models/psoas.stl', color: '#b5838d', visible: true, opacity: 0.2, category: 'organ', volume: 185.2 },
        { id: 'ureteres', name: 'Ureters', url: '/models/ureteres.stl', color: '#ffea00', visible: true, category: 'vasculature' },
        { id: 'diafragma', name: 'Diaphragmatic Crura', url: '/models/pilares_diafragmaticos.stl', color: '#a5a5a5', visible: false, opacity: 0.3, category: 'organ' },
        { id: 'v_venosa_10', name: 'Venous Segment 10', url: '/models/19_vasculatura_venosa-10.stl', color: '#0077b6', visible: false, category: 'vasculature' },
        { id: 'v_venosa_4', name: 'Venous Segment 4', url: '/models/19_vasculatura_venosa-4.stl', color: '#0077b6', visible: false, category: 'vasculature' },
        { id: 'v_venosa_6', name: 'Venous Segment 6', url: '/models/19_vasculatura_venosa-6.stl', color: '#0077b6', visible: false, category: 'vasculature' },
        { id: 'v_venosa_9', name: 'Venous Segment 9', url: '/models/19_vasculatura_venosa-9.stl', color: '#0077b6', visible: false, category: 'vasculature' },
        { id: 'v_arterial_2', name: 'Arterial Seg. 2', url: '/models/24_vasculatura_arterial-2.stl', color: '#e63946', visible: false, category: 'vasculature' },
        { id: 'v_arterial_3', name: 'Arterial Seg. 3', url: '/models/24_vasculatura_arterial-3.stl', color: '#e63946', visible: false, category: 'vasculature' },
        { id: 'v_arterial_4', name: 'Arterial Seg. 4', url: '/models/24_vasculatura_arterial-4.stl', color: '#e63946', visible: false, category: 'vasculature' },
        { id: 'v_arterial_33_4', name: 'Arterial V. 33-4', url: '/models/33_vasculatura_arterial-4.stl', color: '#d90429', visible: false, category: 'vasculature' },
        { id: 'v_arterial_33_5', name: 'Arterial V. 33-5', url: '/models/33_vasculatura_arterial-5.stl', color: '#d90429', visible: false, category: 'vasculature' },
        { id: 'v_arterial_33_6', name: 'Arterial V. 33-6', url: '/models/33_vasculatura_arterial-6.stl', color: '#d90429', visible: false, category: 'vasculature' },
        { id: 't_margen_1', name: 'Tumor Margin 1mm', url: '/models/tumor_arterial_margen_1mm.stl', color: '#ffbd00', visible: false, opacity: 0.2, category: 'tumor', volume: 5.1 },
        { id: 't_margen_3', name: 'Tumor Margin 3mm', url: '/models/tumor_arterial_margen_3mm.stl', color: '#ffbd00', visible: false, opacity: 0.15, category: 'tumor', volume: 15.3 },
        { id: 't_margen_5', name: 'Tumor Margin 5mm', url: '/models/tumor_arterial_margen_5mm.stl', color: '#ffbd00', visible: false, opacity: 0.1, category: 'tumor', volume: 28.5 },
        { id: 'paren_sinus', name: 'Parenchyma & Sinus', url: '/models/RenalParenchymaAndSinus.stl', color: '#9d4edd', visible: false, opacity: 0.4, category: 'organ' },
        { id: 'seno_renal', name: 'Renal Sinus', url: '/models/seno_renal.stl', color: '#7b2cbf', visible: false, category: 'organ' },
        { id: 'v_no_id', name: 'Unidentified Vasc.', url: '/models/vasculatura_no_identificada.stl', color: '#6c757d', visible: false, category: 'vasculature' },
        { id: 't_lecho', name: 'Surgical Bed', url: '/models/tumor_arterial_lecho_quirurgico.stl', color: '#8ecae6', visible: false, category: 'tumor' },
    ]);

    const toggleLayer = (id: string) => {
        setAnatomyLayers(prev => {
            const layerToToggle = prev.find(l => l.id === id);
            if (!layerToToggle) return prev;

            const newState = !layerToToggle.visible;

            // If we're toggling a tumor-related layer, toggle all tumor related parts
            if (layerToToggle.category === 'tumor' || id === 'tumor') {
                return prev.map(layer =>
                    (layer.category === 'tumor' || layer.id.includes('tumor') || layer.id.startsWith('t_'))
                        ? { ...layer, visible: newState }
                        : layer
                );
            }

            return prev.map(layer =>
                layer.id === id ? { ...layer, visible: newState } : layer
            );
        });
    };

    const getSmartViewName = () => {
        if (!orbitControlsRef.current) return "New View";

        const controls = orbitControlsRef.current;
        const target = controls.target;
        const cameraPos = controls.object.position;
        // Get view direction relative to target
        const dir = cameraPos.clone().sub(target).normalize();

        // Refined Orientation
        let orientation = "";
        if (dir.y > 0.7) orientation = "Superior";
        else if (dir.y < -0.7) orientation = "Inferior";
        else if (Math.abs(dir.z) > Math.abs(dir.x)) {
            orientation = dir.z > 0 ? "Frontal" : "Posterior";
            if (Math.abs(dir.x) > 0.4) {
                orientation += dir.x > 0 ? " Der." : " Izq.";
            }
        } else {
            orientation = dir.x > 0 ? "Lateral Der." : "Lateral Izq.";
            if (Math.abs(dir.z) > 0.4) {
                orientation += dir.z > 0 ? " Ant." : " Post.";
            }
        }

        // Determine main layers
        const active = anatomyLayers.filter(l => l.visible);

        let primarySubject = "";

        // Prioritize specific high-level concepts
        const hasTumor = active.some(l => l.category === 'tumor');
        const hasVascular = active.some(l => l.category === 'vasculature');
        const activeOrgans = active.filter(l => l.category === 'organ');

        if (hasTumor && hasVascular) {
            primarySubject = "Tumor-Vascular Relationship";
        } else if (hasTumor && activeOrgans.length > 0) {
            primarySubject = `Tumor in ${activeOrgans[0].name}`;
        } else if (hasTumor) {
            primarySubject = "Tumor";
        } else if (activeOrgans.length === 1 && hasVascular) {
            primarySubject = `${activeOrgans[0].name} (Vascular)`;
        } else if (activeOrgans.length === 1) {
            primarySubject = activeOrgans[0].name;
        } else if (hasVascular) {
            primarySubject = "Sistema Vascular";
        } else if (activeOrgans.length > 1) {
            primarySubject = "Anatomía General";
        } else {
            primarySubject = "Vista 3D";
        }

        const baseName = hasTumor && active.length === 1 ? "Isolated tumor" :
            hasVascular && active.length === 1 ? "Vasos aislados" :
                `${primarySubject} - ${orientation}`;

        // Ensure uniqueness
        let finalName = baseName;
        let counter = 1;
        while (savedViews.some(v => v.name === finalName)) {
            counter++;
            finalName = `${baseName} (${counter})`;
        }

        return finalName;
    };

    const saveCurrentView = (customName?: string, customVisibleLayers?: string[]) => {
        if (!orbitControlsRef.current) return;

        const controls = orbitControlsRef.current;
        const position = controls.object.position.toArray() as [number, number, number];
        const target = controls.target.toArray() as [number, number, number];
        const visibleLayers = customVisibleLayers || anatomyLayers.filter(l => l.visible).map(l => l.id);

        const newView: CustomView = {
            id: Date.now().toString(),
            name: customName || getSmartViewName(),
            cameraPosition: position,
            cameraTarget: target,
            visibleLayers,
            zoom: zoomLevel
        };

        setSavedViews([...savedViews, newView]);
        setActiveSidebarTab('views');
        setSidebarCollapsed(false);
    };

    const applySavedView = (view: CustomView) => {
        if (!orbitControlsRef.current) return;

        // Update layers immediately
        setAnatomyLayers(prev => prev.map(layer => ({
            ...layer,
            visible: view.visibleLayers.includes(layer.id)
        })));

        // Update zoom immediately
        setZoomLevel(view.zoom);

        // Trigger smooth camera transition
        setTargetView(view);
    };

    const updateSavedView = (id: string) => {
        if (!orbitControlsRef.current) return;

        const controls = orbitControlsRef.current;
        const position = controls.object.position.toArray() as [number, number, number];
        const target = controls.target.toArray() as [number, number, number];
        const visibleLayers = anatomyLayers.filter(l => l.visible).map(l => l.id);

        setSavedViews(prev => prev.map(v => v.id === id ? {
            ...v,
            cameraPosition: position,
            cameraTarget: target,
            visibleLayers,
            zoom: zoomLevel
        } : v));
    };

    const renameSavedView = (id: string, newName: string) => {
        setSavedViews(prev => prev.map(v => v.id === id ? { ...v, name: newName } : v));
    };

    const deleteSavedView = (id: string) => {
        setSavedViews(savedViews.filter(v => v.id !== id));
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (activeTool !== 'comments') return;

        // If clicking away from an active empty comment, remove it
        if (activeCommentId) {
            const activeComment = comments.find(c => c.id === activeCommentId);
            if (activeComment && !activeComment.text.trim()) {
                setComments(comments.filter(c => c.id !== activeCommentId));
            }
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newComment: Comment = {
            id: Date.now().toString(),
            x,
            y,
            author: 'alex',
            timestamp: 'Just now',
            text: '',
            replies: [],
            resolved: false
        };

        setComments([...comments, newComment]);
        setActiveCommentId(newComment.id);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        // Native DOM event hits the background div. 
        // We set the position but RESET targetId for a fresh click.
        // Mesh handlers will overwrite targetId if they hit something.
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            targetId: undefined
        });
    };

    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    // Track cursor globally for custom comment cursor
    React.useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (activeTool === 'comments') {
                document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
                document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
            }
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [activeTool]);

    return (
        <div className={`relative w-full h-full flex flex-col font-sans transition-colors duration-300 ${pointerMode === 'hand' ? 'cursor-grab active:cursor-grabbing' : (activeTool === 'comments' && !isHoveringUI) ? 'cursor-none' : 'cursor-default'} ${isDark ? "bg-[#0f1115] text-[#ededed]" : "bg-[#f9f9f9] text-[#11181c]"}`}>

            {/* CUSTOM COMMENT CURSOR - Only if NOT hovering UI */}
            {activeTool === 'comments' && !isHoveringUI && (
                <div
                    className="fixed pointer-events-none z-[9999] transition-transform duration-75"
                    style={{
                        left: 'var(--cursor-x, 0px)',
                        top: 'var(--cursor-y, 0px)',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="relative">
                        {/* Outer White Glow/Border */}
                        <MessageSquare
                            size={16}
                            stroke="#FFF"
                            strokeWidth={4}
                            fill="none"
                            className="absolute inset-0 translate-x-[0px] translate-y-[0px]"
                        />
                        {/* Inner Black Stroke & White Fill */}
                        <MessageSquare
                            size={16}
                            stroke="#000"
                            fill="#FFF"
                            strokeWidth={2}
                            className="relative"
                        />
                    </div>
                </div>
            )}

            {/* DOT GRID BACKGROUND */}
            <div
                className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 ${showGrid ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)'
                        : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
                    backgroundSize: '12px 12px'
                }}
            />

            {/* 3D CANVAS */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    cursor: activeTool === 'comments' && !isHoveringUI
                        ? 'none'
                        : pointerMode === 'hand' ? 'grab' : 'auto'
                }}
                onClick={handleCanvasClick}
                onContextMenu={handleContextMenu}
            >
                <div className="absolute inset-0 flex items-center justify-center p-20">
                    <Canvas
                        camera={{ position: [0, 0, 120], fov: 45 }}
                        onPointerMissed={() => {
                            if (editingMarkId) {
                                const mark = marks.find(m => m.id === editingMarkId);
                                if (mark?.isDraft) {
                                    setMarks(prev => prev.filter(m => m.id !== editingMarkId));
                                }
                                setEditingMarkId(null);
                            }
                        }}
                    >
                        <Suspense fallback={null}>
                            <PivotCentering
                                controlsRef={orbitControlsRef}
                                anatomyLayers={anatomyLayers}
                                targetViewId={targetView?.id}
                            />
                            <group
                                scale={zoomLevel / 100}
                                position={[0, 0, 0]}
                            >
                                <primitive object={new THREE.Group()} ref={(ref: THREE.Group) => {
                                    if (ref) {
                                        targetRotation.current.set(flipV ? Math.PI : 0, flipH ? Math.PI : 0, 0);
                                    }
                                }} />
                                <Stage environment="city" intensity={0.5} shadows={false} adjustCamera={!hasInitialFit}>
                                    <Center ref={(ref: any) => {
                                        if (ref) {
                                            // Handle rotation animation here
                                        }
                                    }}>
                                        {anatomyLayers.map(layer => {
                                            // Always render models so they are in the scene for raycasting/transitions, 
                                            // but control visibility via the prop.
                                            return (
                                                <Suspense key={layer.id} fallback={null}>
                                                    <Model
                                                        id={layer.id}
                                                        url={layer.url}
                                                        color={layer.color}
                                                        opacity={layer.opacity}
                                                        isDark={isDark}
                                                        visible={layer.visible}
                                                        onSelect={() => {
                                                            if (pointerMode === 'hand') return; // Hand tool blocks interaction
                                                            setSelectedAnatomyId(layer.id);
                                                            setDetailsCollapsed(false);
                                                            if (layer.category === 'tumor') setLastSelectedTumorId(layer.id);
                                                        }}
                                                        onSurfaceClick={activeTool === 'marks' ? (p) => handleAddMark(p, layer.id) : (activeTool === 'measures' ? (p, lid) => handleAddMeasurePoint(p, lid) : undefined)}
                                                        onContextMenu={(e: any) => {
                                                            if (pointerMode === 'hand') return;
                                                            if (!layer.visible) return;
                                                            e.preventDefault();
                                                            e.stopPropagation();

                                                            // Robust targeting: If we hit multiple things (like Liver and Tumor), 
                                                            // try to pick the most 'specific' target from intersections.
                                                            let finalTargetId = layer.id;
                                                            if (e.intersections && e.intersections.length > 1) {
                                                                const priorityOrder = ['tumor', 'rinones', 'higado', 'organ', 'vasculature'];
                                                                for (const cat of priorityOrder) {
                                                                    const hit = e.intersections.find((h: any) => {
                                                                        const obj = h.object;
                                                                        const hitLayer = anatomyLayers.find(al => al.id === obj.name);
                                                                        return (hitLayer?.category === cat || hitLayer?.id === cat) && hitLayer?.visible;
                                                                    });
                                                                    if (hit) {
                                                                        finalTargetId = hit.object.name;
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            setSelectedAnatomyId(finalTargetId);
                                                            if (finalTargetId.includes('tumor')) setLastSelectedTumorId(finalTargetId);
                                                            setContextMenu({ x: e.clientX, y: e.clientY, targetId: finalTargetId });
                                                        }}
                                                    />
                                                </Suspense>
                                            );
                                        })}
                                    </Center>
                                </Stage>

                                {/* Marks Visuals - Outside of Stage/Center to avoid camera fitting resets */}
                                {marks.map((mark) => {
                                    const parentLayer = anatomyLayers.find(l => l.id === mark.layerId);
                                    if (parentLayer && !parentLayer.visible) return null;
                                    const isEditing = editingMarkId === mark.id;
                                    if (!mark.visible) return null;
                                    return (
                                        <group key={mark.id} position={mark.position}>
                                            <Html center style={{
                                                opacity: mark.opacity,
                                                transition: 'opacity 0.2s',
                                                pointerEvents: isEditing ? 'auto' : 'none',
                                                transform: 'scale(1.2)'
                                            }}>
                                                {isEditing ? (
                                                    <div className={`flex items-center gap-2 p-1.5 rounded-[8px] border ${isDark ? 'bg-[#1C1C1E] border-white/10' : 'bg-white border-black/10'}`} style={{ minWidth: '180px' }} onPointerDown={(e) => e.stopPropagation()}>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <div
                                                                    className="w-4 h-4 rounded-full cursor-pointer shrink-0 border border-white/20 ml-1 hover:scale-110 transition-transform"
                                                                    style={{ backgroundColor: mark.color }}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent side="top" className={`w-36 p-2 rounded-[8px] border z-[100] ${isDark ? 'bg-[#1f2128] border-white/10' : 'bg-white border-black/10'}`}>
                                                                <div className="grid grid-cols-4 gap-1.5">
                                                                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#FFFFFF'].map(c => (
                                                                        <div
                                                                            key={c}
                                                                            onClick={() => {
                                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, color: c } : m));
                                                                            }}
                                                                            className={`w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border ${mark.color === c ? 'border-white scale-110' : 'border-black/10'}`}
                                                                            style={{ backgroundColor: c }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <input
                                                            autoFocus
                                                            value={mark.name}
                                                            onChange={(e) => {
                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, name: e.target.value } : m));
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, isDraft: false } : m));
                                                                    setEditingMarkId(null);
                                                                }
                                                            }}
                                                            className={`flex-1 bg-transparent border-none outline-none text-[11px] font-medium px-1 ${isDark ? 'text-white' : 'text-black'}`}
                                                            placeholder="Name..."
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, isDraft: false } : m));
                                                                setEditingMarkId(null);
                                                            }}
                                                            className="w-5 h-5 rounded-[8px] bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shrink-0"
                                                        >
                                                            <ArrowUp size={12} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex items-center justify-center pointer-events-auto group/pin cursor-pointer"
                                                        onPointerEnter={() => setHoveredMarkId(mark.id)}
                                                        onPointerLeave={() => setHoveredMarkId(null)}
                                                    >
                                                        <div
                                                            className={`w-3 h-3 rounded-full border-2 border-white relative flex items-center justify-center transition-all duration-200 ${hoveredMarkId === mark.id ? 'scale-150 brightness-110' : 'group-hover/pin:scale-125'}`}
                                                            style={{ backgroundColor: mark.color }}
                                                        >
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-white opacity-0 group-hover/pin:opacity-100 transition-opacity" />
                                                            <Target size={6} className="text-white opacity-0 group-hover/pin:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div className={`absolute bottom-full mb-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover/pin:opacity-100 transition-all whitespace-nowrap translate-y-2 group-hover/pin:translate-y-0 pointer-events-none`}>
                                                            {mark.name}
                                                        </div>
                                                    </div>
                                                )}
                                            </Html>
                                        </group>
                                    );
                                })}

                                {/* Ruler / Measurements Visuals */}
                                {measurePoints.map((p, i) => (
                                    <mesh key={`mp-${i}`} position={p}>
                                        <sphereGeometry args={[0.7, 16, 16]} />
                                        <meshBasicMaterial color="#3B82F6" toneMapped={false} />
                                    </mesh>
                                ))}
                                {measurePoints.length >= 2 && (
                                    <group>
                                        <Line
                                            points={measurePoints}
                                            color="#3B82F6"
                                            lineWidth={2}
                                            transparent
                                            opacity={0.8}
                                            depthTest={false}
                                        />
                                        <Html position={measurePoints[measurePoints.length - 1]}>
                                            <div className="flex flex-col items-center translate-y-[-40px]">
                                                <div className={`px-2 py-1 rounded-[8px] text-[10px] font-bold border backdrop-blur-md mb-2 ${isDark ? "bg-[#1C1C1E]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-black"}`}>
                                                    {measurePoints.reduce((acc, p, i) => i === 0 ? 0 : acc + p.distanceTo(measurePoints[i - 1]), 0).toFixed(1)} mm
                                                </div>
                                                <div className={`p-1.5 rounded-[8px] border flex items-center gap-1.5 pointer-events-auto backdrop-blur-md ${isDark ? 'bg-[#1C1C1E]/90 border-white/10' : 'bg-white/90 border-black/10'}`}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSaveMeasurement(); }}
                                                        className="w-7 h-7 rounded-[8px] bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors pointer-events-auto"
                                                        title="Save measurement"
                                                    >
                                                        <Check size={16} strokeWidth={3} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setMeasurePoints([]); }}
                                                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center transition-colors pointer-events-auto ${isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-black/5 text-black/60 hover:text-black'}`}
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Html>
                                    </group>
                                )}

                                {/* Saved Measurements */}
                                {measurements.filter(m => m.visible).map(m => {
                                    const parentLayer = m.layerId ? anatomyLayers.find(al => al.id === m.layerId) : null;
                                    // Hide if parent layer is hidden
                                    if (parentLayer && !parentLayer.visible) return null;

                                    const isHovered = hoveredMeasureId === m.id;
                                    return (
                                        <group key={m.id}>
                                            {/* We break the line into individual segments to highlight specifically when hovered in popover */}
                                            {m.points.map((p, i) => {
                                                if (i === m.points.length - 1) return null;
                                                const segmentIndex = i;
                                                const isSegmentHovered = isHovered && hoveredSegmentIndex === segmentIndex;

                                                return (
                                                    <Line
                                                        key={`${m.id}-seg-${segmentIndex}`}
                                                        points={[m.points[i], m.points[i + 1]]}
                                                        color={isHovered ? "#60A5FA" : "#3B82F6"}
                                                        lineWidth={isSegmentHovered ? 4 : (isHovered ? 3 : 1.5)}
                                                        transparent
                                                        opacity={isHovered ? 1 : 0.6}
                                                        depthTest={false}
                                                        onPointerEnter={(e) => { e.stopPropagation(); setHoveredMeasureId(m.id); setIsMeasureLineHovered(true); }}
                                                        onPointerLeave={(e) => { e.stopPropagation(); setHoveredMeasureId(null); setIsMeasureLineHovered(false); }}
                                                    />
                                                );
                                            })}
                                            {m.points.map((p, i) => {
                                                const isPointRelatedToHoveredSegment = isHovered && (hoveredSegmentIndex === i || hoveredSegmentIndex === i - 1);
                                                return (
                                                    <mesh key={`${m.id}-p-${i}`} position={p}>
                                                        <sphereGeometry args={[isPointRelatedToHoveredSegment ? 0.7 : (isHovered ? 0.6 : 0.45), 16, 16]} />
                                                        <meshBasicMaterial
                                                            color={isHovered ? (isPointRelatedToHoveredSegment ? "#60A5FA" : "#FFFFFF") : "#3B82F6"}
                                                            toneMapped={false}
                                                            opacity={isHovered ? 1 : 0.6}
                                                            transparent
                                                            depthTest={false}
                                                        />
                                                    </mesh>
                                                );
                                            })}
                                        </group>
                                    );
                                })}

                                <RotationLerper targetH={flipH} targetV={flipV} />
                            </group>
                            <CameraHandler
                                targetView={targetView}
                                orbitControlsRef={orbitControlsRef}
                                onTransitionEnd={() => setTargetView(null)}
                            />
                        </Suspense>
                        <OrbitControls
                            ref={orbitControlsRef}
                            makeDefault
                            enableDamping
                            dampingFactor={0.05}
                            enabled={!targetView}
                        />
                    </Canvas>
                </div>

                <div className="absolute inset-0 pointer-events-none">
                    {comments.filter(c => showAllComments || activeCommentId === c.id).map((comment) => (
                        <div key={comment.id} className="pointer-events-auto contents">
                            <CommentItem
                                isDark={isDark}
                                comment={comment}
                                active={activeCommentId === comment.id}
                                onActivate={(id: string | null = comment.id) => { if (pointerMode === 'hand') return; setActiveCommentId(id); }}
                                onHoverUI={setIsHoveringUI}
                                onUpdate={(id: string, text: string) => {
                                    setComments(comments.map(c => c.id === id ? { ...c, text } : c));
                                }}
                                onDelete={(id: string) => {
                                    setComments(comments.filter(c => c.id !== id));
                                    if (activeCommentId === id) setActiveCommentId(null);
                                }}
                                onResolve={(id: string) => {
                                    setComments(comments.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
                                    setActiveCommentId(null);
                                }}
                                onReply={(commentId: string, text: string) => {
                                    const newReply: Reply = {
                                        id: Date.now().toString(),
                                        author: 'alex',
                                        text,
                                        timestamp: 'Just now'
                                    };
                                    setComments(comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c));
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* TOP BAR */}
            <div
                className={`absolute top-2 left-4 right-4 z-[100] flex items-center justify-between h-[52px]`}
                onMouseEnter={() => setIsHoveringUI(true)}
                onMouseLeave={() => setIsHoveringUI(false)}
            >
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-1 cursor-pointer group px-2 py-1.5 rounded-[8px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <div className={`w-[18px] h-[18px] flex items-center justify-center transition-colors ${isDark ? "text-[#ededed] group-hover:text-white" : "text-[#11181c]"}`}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4C2.5 3.17157 3.17157 2.5 4 2.5C4.82843 2.5 5.5 3.17157 5.5 4V12C5.5 12.8284 4.82843 13.5 4 13.5C3.17157 13.5 2.5 12.8284 2.5 12V4Z" fill="currentColor" />
                                        <path d="M7 4C7 3.17157 7.67157 2.5 8.5 2.5C9.32843 2.5 10 3.17157 10 4V12C10 12.8284 9.32843 13.5 8.5 13.5C7.67157 13.5 7 12.8284 7 12V4Z" fill="currentColor" />
                                        <path d="M11.5 6C11.5 5.17157 12.1716 4.5 13 4.5C13.8284 4.5 14.5 5.17157 14.5 6V10C14.5 10.8284 13.8284 11.5 13 11.5C12.1716 11.5 11.5 10.8284 11.5 10V6Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <ChevronDown size={14} className={isDark ? "text-[#a3a3a3] group-hover:text-[#ededed]" : "text-[#687076] group-hover:text-[#11181c]"} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={8} className={`w-64 rounded-[8px] p-2 border ${isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/5 text-[#11181c]"}`}>
                            <DropdownMenuItem onClick={onBack} className="text-[13px] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 font-medium">Back to dashboard</DropdownMenuItem>
                            <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-black/5"} />
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="w-[32px] h-[32px] rounded-full bg-[#00a8cc] flex items-center justify-center text-white font-bold text-[14px]">N</div>
                                <div className="flex flex-col overflow-hidden min-w-0">
                                    <span className="text-[14px] font-medium truncate">Alex Salmerón</span>
                                    <span className={`text-[12px] truncate ${isDark ? "text-[#a3a3a3]" : "text-[#687076]"}`}>pixel@mefaltaunpixel.es</span>
                                </div>
                            </div>
                            <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-black/5"} />
                            <div className="flex flex-col gap-1 py-1">
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="text-[13px] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            {isDark ? <Moon size={14} className="opacity-70" /> : <Sun size={14} className="opacity-70" />}
                                            <span>Theme</span>
                                        </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent sideOffset={8} className={`rounded-[8px] p-2 border ${isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/5 text-[#11181c]"}`}>
                                            <DropdownMenuItem onClick={() => setIsDark(false)} className={`text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 ${!isDark ? 'text-blue-500 font-medium' : ''}`}>
                                                <Sun size={14} /> <span>Light</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsDark(true)} className={`text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 ${isDark ? 'text-blue-500 font-medium' : ''}`}>
                                                <Moon size={14} /> <span>Dark</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsDark(false)} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2">
                                                <Monitor size={14} /> <span>System</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="text-[13px] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"><span>Language</span></DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent sideOffset={8} className={`rounded-[8px] p-2 border ${isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/5 text-[#11181c]"}`}>
                                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">English</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">Español</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">Português</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"><span>Settings</span></DropdownMenuItem>
                                <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"><span>Logout</span></DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>



                    <div className="flex items-center gap-1.5 ml-2 cursor-pointer group">
                        <Home
                            size={14}
                            className={`transition-colors cursor-pointer ${isDark ? "text-[#a3a3a3] hover:text-[#ededed]" : "text-[#687076] hover:text-[#11181c]"}`}
                            onClick={() => window.location.href = '/'}
                        />
                        <span className={`text-[12px] opacity-30 ${isDark ? "text-[#a3a3a3]" : "text-[#687076]"}`}>/</span>
                        <span onClick={onBack} className={`text-[14px] font-medium transition-colors ${isDark ? "text-[#a3a3a3] hover:text-[#ededed]" : "text-[#687076] hover:text-[#11181c]"}`}>Cases</span>
                        <span className={`text-[12px] opacity-30 ${isDark ? "text-[#a3a3a3]" : "text-[#687076]"}`}>/</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer group/case outline-none">
                                    <span className={`text-[14px] font-medium transition-colors ${isDark ? "text-[#ededed]" : "text-[#11181c]"}`}>MNT AN1309531622</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 group-data-[state=open]/case:rotate-180 ${isDark ? "text-[#a3a3a3]" : "text-[#687076]"}`} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" sideOffset={12} className={`w-[360px] rounded-[8px] p-0 border overflow-hidden ${isDark ? "bg-[#18191B] border-white/10 text-[#ededed]" : "bg-white border-black/10 text-[#11181c]"}`}>
                                <div className={`px-4 py-3 flex items-center gap-2.5 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-[8px] flex-1 transition-all ${isDark ? "bg-white/5 focus-within:bg-white/10" : "bg-black/5 focus-within:bg-black/10"}`}>
                                        <Search size={13} className="opacity-30" />
                                        <input
                                            type="text"
                                            placeholder="Search case..."
                                            className="w-full bg-transparent border-none outline-none text-[12px] font-medium placeholder:font-normal placeholder:text-inherit/30"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`h-[32px] w-[32px] rounded-[8px] flex items-center justify-center transition-all ${isDark ? "bg-white/5 hover:bg-white/10 text-white/60" : "bg-black/5 hover:bg-black/10 text-black/60"}`}>
                                                <SlidersHorizontal size={13} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/5"}>
                                            <DropdownMenuItem className="text-[12px] cursor-pointer">Most Recent</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[12px] cursor-pointer">A-Z</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[12px] cursor-pointer">Z-A</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
                                    {[
                                        { id: '1', name: "JER AN1309531635", date: "2 hours ago", active: false },
                                        { id: '2', name: "PTR AN1309531640", date: "Yesterday", active: false },
                                        { id: '3', name: "MNT AN1309531622", date: "12 Mar 2024", active: true },
                                        { id: '4', name: "ALV AN1309531641", date: "10 Mar 2024", active: false },
                                    ].map(item => (
                                        <DropdownMenuItem key={item.id} className={`flex flex-col items-start gap-0.5 rounded-[8px] px-3 py-1.5 cursor-pointer transition-colors duration-200 outline-none mb-0.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] focus:bg-black/[0.02] dark:focus:bg-white/[0.02]`}>
                                            <div className="flex items-center justify-between w-full">
                                                <span className={`text-[12.5px] font-semibold ${item.active ? 'text-blue-500' : (isDark ? 'text-white/90' : 'text-black/90')}`}>{item.name}</span>
                                                {item.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-30">
                                                <Clock size={8} />
                                                <span className="text-[9.5px] font-bold tracking-[0.02em] uppercase">{item.date}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex items-center absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                    <div className={`p-1 rounded-[8px] flex items-center h-[36px] border ${isDark ? "bg-[#1C1C1E] border-white/5" : "bg-white border-black/5"}`}>
                        <button onClick={() => setActiveMode('canvas')} className={`h-[28px] px-4 rounded-[8px] text-[13px] font-medium flex items-center justify-center min-w-[80px] transition-all duration-200 ${activeMode === 'canvas' ? (isDark ? "bg-[#333333] text-white" : "bg-black text-white") : (isDark ? "text-[#a3a3a3] hover:text-[#ededed]" : "text-[#687076] hover:text-[#11181c]")}`}>Canvas</button>
                        <button onClick={() => setActiveMode('copilot')} className={`h-[28px] px-4 rounded-[8px] text-[13px] font-medium flex items-center justify-center min-w-[80px] transition-all duration-200 ${activeMode === 'copilot' ? (isDark ? "bg-[#333333] text-white" : "bg-black text-white") : (isDark ? "text-[#a3a3a3] hover:text-[#ededed]" : "text-[#687076] hover:text-[#11181c]")}`}>Copilot</button>
                    </div>
                </div>

                <div className="flex items-center gap-2 pr-2">
                    <div className="flex -space-x-2 opacity-90 hover:opacity-100 transition-opacity relative z-10">
                        <div onClick={onInviteClick} className={`w-[32px] h-[32px] rounded-full border-2 flex items-center justify-center relative z-20 cursor-pointer transition-colors ${isDark ? "border-[#0f1115] bg-[#2a2b2c] hover:bg-[#323335] text-[#ededed]" : "border-[#f9f9f9] bg-black/5 hover:bg-black/10 text-[#11181c]"}`}><Plus size={16} strokeWidth={2.5} /></div>
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="group relative z-10 cursor-pointer">
                                        <div className={`w-[32px] h-[32px] rounded-full border-2 flex items-center justify-center transition-all duration-200 group-hover:ring-2 group-hover:ring-[#FF007A] group-hover:ring-offset-1 ${isDark ? "border-[#0f1115] bg-[#323335] text-white ring-offset-[#0f1115]" : "border-[#f9f9f9] bg-black/10 text-black ring-offset-white"}`}><span className="font-medium text-[14px]">A</span></div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={10} className={`p-3 rounded-[12px] border min-w-[120px] ${isDark ? "bg-[#18191B] border-white/10 text-white" : "bg-white border-black/10 text-black"}`}><div className="flex flex-col items-start gap-0.5"><span className="text-[14px] font-semibold">Alex Salmerón</span><span className={`text-[12px] ${isDark ? "text-white/40" : "text-black/40"}`}>You</span></div></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* SIDEBAR LEFT */}
            <div
                className={`absolute top-20 left-4 z-10 flex-col flex rounded-[8px] border ${isDark ? "bg-[#141516] border-[#2A2A2A]" : "bg-[#FAFAFA] border-black/10"} overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarCollapsed ? 'w-fit h-[44px]' : (activeSidebarTab === 'layers' ? 'w-[260px] h-[calc(100vh-120px)]' : 'w-[260px] h-fit max-h-[calc(100vh-120px)]')}`}
                onMouseEnter={() => setIsHoveringUI(true)}
                onMouseLeave={() => setIsHoveringUI(false)}
            >
                <div onClick={() => { setSidebarCollapsed(!sidebarCollapsed); }} className={`flex items-center gap-4 px-4 h-[44px] shrink-0 cursor-pointer group/header ${!sidebarCollapsed ? 'border-b transition-colors' : ''} ${isDark ? "border-[#2A2A2A]" : "border-black/5"}`}>
                    <span onClick={(e) => { e.stopPropagation(); setActiveSidebarTab('layers'); setSidebarCollapsed(false); }} className={`text-[12px] font-medium cursor-pointer whitespace-nowrap transition-colors ${(!sidebarCollapsed && activeSidebarTab === 'layers') ? (isDark ? 'text-[#EDEDED]' : 'text-[#11181c]') : (isDark ? 'text-[#687076] hover:text-[#EDEDED]' : 'text-[#8E918F] hover:text-[#11181c]')}`}>Layers</span>
                    <span onClick={(e) => { e.stopPropagation(); setActiveSidebarTab('views'); setSidebarCollapsed(false); }} className={`text-[12px] font-medium cursor-pointer whitespace-nowrap transition-colors ${(!sidebarCollapsed && activeSidebarTab === 'views') ? (isDark ? 'text-[#EDEDED]' : 'text-[#11181c]') : (isDark ? 'text-[#687076] hover:text-[#EDEDED]' : 'text-[#8E918F] hover:text-[#11181c]')}`}>Saved Views</span>
                    {!sidebarCollapsed && <div className="flex-1" />}
                    <div className={`p-1 rounded-[8px] transition-all duration-500 flex items-center justify-center ${isDark ? "text-[#687076] group-hover/header:text-[#EDEDED]" : "text-[#8E918F] group-hover/header:text-[#11181c]"}`}>
                        <PanelLeft size={16} />
                    </div>
                </div>
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col min-h-0 ${sidebarCollapsed ? 'hidden opacity-0 p-0 m-0' : 'opacity-100 flex-1'}`}>
                    <div className={`px-4 py-2 border-b flex items-center gap-2 shrink-0 ${isDark ? "border-[#2A2A2A]" : "border-black/5"}`}>
                        <Search size={14} className={isDark ? "text-[#687076]" : "text-[#8E918F]"} />
                        <input type="text" placeholder={activeSidebarTab === 'layers' ? "Search layers..." : "Search views..."} className={`w-full bg-transparent outline-none text-[12px] font-medium placeholder:font-normal ${isDark ? "text-[#EDEDED] placeholder-[#687076]" : "text-[#11181c] placeholder-[#8E918F]"}`} />
                    </div>
                    <div className={`overflow-y-auto px-2 py-2 flex-1 flex flex-col ${activeSidebarTab === 'layers' ? 'gap-0.5' : 'gap-0.5'} custom-scrollbar`}>
                        {activeSidebarTab === 'layers' ? (
                            <>
                                {anatomyLayers.map(layer => (
                                    <SidebarItem
                                        key={layer.id}
                                        isDark={isDark}
                                        title={layer.name}
                                        visible={layer.visible}
                                        onToggle={() => { toggleLayer(layer.id); }}
                                        active={selectedAnatomyId === layer.id}
                                        onSelect={() => {
                                            setSelectedAnatomyId(layer.id);
                                            setDetailsCollapsed(false);
                                        }}
                                        onContextMenu={(e: React.MouseEvent) => {
                                            setSelectedAnatomyId(layer.id);
                                            if (layer.category === 'tumor') setLastSelectedTumorId(layer.id);
                                            setContextMenu({ x: e.clientX, y: e.clientY, targetId: layer.id });
                                        }}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { saveCurrentView(); }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 mb-2 rounded-[8px] border border-dashed transition-colors ${isDark ? 'border-white/10 hover:bg-white/5 text-[#EDEDED]' : 'border-black/10 hover:bg-black/5 text-[#11181c]'}`}
                                >
                                    <Plus size={14} className="opacity-70" />
                                    <span className="text-[13px] font-medium">New View</span>
                                </button>
                                <div className="flex flex-col gap-0.5">
                                    {savedViews.map(view => (
                                        <SavedViewItem
                                            key={view.id}
                                            isDark={isDark}
                                            title={view.name}
                                            onApply={() => { applySavedView(view); }}
                                            onDelete={() => { deleteSavedView(view.id); }}
                                            onRename={(name: string) => { renameSavedView(view.id, name); }}
                                            onUpdate={() => { updateSavedView(view.id); }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* DETAILS SIDEBAR */}
            {/* DETAILS SIDEBAR */}
            {(selectedAnatomyId || activeTool === 'comments' || activeTool === 'notes' || activeTool === 'marks' || activeTool === 'measures') && (
                <div
                    className={`absolute top-20 right-4 z-10 flex-col flex rounded-[8px] border ${isDark ? "bg-[#141516] border-[#2A2A2A]" : "bg-[#FAFAFA] border-black/10"} overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${detailsCollapsed ? 'w-fit h-[44px]' : (activeTool === 'notes' ? 'w-[320px] h-[calc(100vh-120px)]' : 'w-[260px] h-fit max-h-[calc(100vh-120px)]')}`}
                    onMouseEnter={() => setIsHoveringUI(true)}
                    onMouseLeave={() => setIsHoveringUI(false)}
                >
                    <div onClick={() => { setDetailsCollapsed(!detailsCollapsed); }} className={`flex items-center gap-4 px-4 h-[44px] shrink-0 cursor-pointer group/header ${!detailsCollapsed ? 'border-b transition-colors' : ''} ${isDark ? "border-[#2A2A2A]" : "border-black/5"}`}>
                        <div className={`p-0.5 rounded-[8px] transition-all duration-500 flex items-center justify-center ${isDark ? "text-[#687076] group-hover/header:text-[#EDEDED]" : "text-[#8E918F] group-hover/header:text-[#11181c]"}`}>
                            <PanelRight size={16} />
                        </div>
                        <span className={`text-[12px] font-bold tracking-tight transition-all duration-500 whitespace-nowrap ${(!detailsCollapsed) ? (isDark ? "text-white" : "text-[#11181C]") : (isDark ? "text-[#687076]" : "text-[#8E918F]")}`}>
                            {activeTool === 'comments' ? 'Comments' : (activeTool === 'notes' ? 'Notes' : (activeTool === 'marks' ? 'Marks' : (activeTool === 'measures' ? 'Ruler' : 'Details')))}
                        </span>
                        {!detailsCollapsed && activeTool === 'marks' && marks.filter(m => !m.isDraft).length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const anyVisible = marks.some(m => m.visible);
                                    setMarks(prev => prev.map(m => ({ ...m, visible: !anyVisible })));
                                }}
                                className={`ml-auto px-2 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                            >
                                {marks.some(m => m.visible) ? "Hide marks" : "Show marks"}
                            </button>
                        )}
                        {!detailsCollapsed && activeTool === 'measures' && measurements.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const anyVisible = measurements.some(m => m.visible);
                                    setMeasurements(prev => prev.map(m => ({ ...m, visible: !anyVisible })));
                                }}
                                className={`ml-auto px-2 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                            >
                                {measurements.some(m => m.visible) ? "Hide measures" : "Show measures"}
                            </button>
                        )}
                        {!detailsCollapsed && activeTool === 'comments' && comments.filter(c => c.text.trim()).length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllComments(!showAllComments);
                                }}
                                className={`ml-auto px-2 py-1 rounded-[8px] text-[10px] font-bold uppercase tracking-wider transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                            >
                                {showAllComments ? "Hide comments" : "Show comments"}
                            </button>
                        )}
                        {!detailsCollapsed && activeTool !== 'comments' && <div className="flex-1" />}
                    </div>

                    <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col min-h-0 ${detailsCollapsed ? 'hidden opacity-0 p-0 m-0' : 'opacity-100 flex-1'}`}>
                        <div className="flex-1 overflow-y-auto px-2 py-1 custom-scrollbar flex flex-col min-h-0">
                            {activeTool === 'marks' ? (
                                <div className="flex flex-col gap-1 py-1 h-full overflow-y-auto custom-scrollbar">
                                    {marks.filter(m => !m.isDraft).length === 0 ? (
                                        <div className="py-8 flex flex-col items-center justify-center opacity-30 text-center px-4">
                                            <Target size={32} className="mb-2" />
                                            <p className="text-[12px]">No marks yet.<br />Click on the model to add one.</p>
                                        </div>
                                    ) : (
                                        marks.filter(m => !m.isDraft).map((mark) => {
                                            const parentLayer = anatomyLayers.find(l => l.id === mark.layerId);
                                            const isLayerVisible = parentLayer?.visible ?? true;
                                            const effectiveVisible = mark.visible && isLayerVisible;

                                            return (
                                                <div
                                                    key={mark.id}
                                                    onMouseEnter={() => setHoveredMarkId(mark.id)}
                                                    onMouseLeave={() => setHoveredMarkId(null)}
                                                    className={`group flex items-center gap-2 py-1 pl-2 pr-1 rounded-[8px] transition-colors ${hoveredMarkId === mark.id ? (isDark ? 'bg-white/5' : 'bg-black/5') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]')}`}
                                                >
                                                    {/* Main pill container */}
                                                    <div className={`flex flex-1 items-center h-[28px] rounded-[8px] transition-all overflow-hidden ${!effectiveVisible ? 'opacity-40' : ''} ${isDark ? 'bg-white/[0.03] group-hover:bg-white/[0.05]' : 'bg-black/[0.03] group-hover:bg-black/[0.05]'}`}>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <div
                                                                    className="w-[16px] h-[16px] rounded-full cursor-pointer ml-1 shrink-0 border border-black/10"
                                                                    style={{ backgroundColor: mark.color }}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent side="left" align="start" className={`w-36 p-2 rounded-[8px] border ${isDark ? 'bg-[#1f2128] border-white/10' : 'bg-white border-black/10'}`}>
                                                                <div className="grid grid-cols-4 gap-1.5">
                                                                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#FFFFFF'].map(c => (
                                                                        <div
                                                                            key={c}
                                                                            onClick={() => {
                                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, color: c } : m));
                                                                            }}
                                                                            className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-black/10"
                                                                            style={{ backgroundColor: c }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>

                                                        <input
                                                            value={mark.name}
                                                            onChange={(e) => {
                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, name: e.target.value } : m));
                                                            }}
                                                            className={`flex-1 bg-transparent border-none outline-none text-[12px] font-medium px-2 truncate selection:bg-blue-500/30 ${isDark ? 'text-white/90' : 'text-black/90'}`}
                                                            placeholder="Name"
                                                        />

                                                        {/* Opacity section */}
                                                        <div className={`flex items-center h-full border-l ${isDark ? 'border-white/10' : 'border-black/10'} px-2 gap-1`}>
                                                            <input
                                                                value={Math.round(mark.opacity * 100)}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value);
                                                                    if (!isNaN(val)) {
                                                                        const clamped = Math.max(0, Math.min(100, val)) / 100;
                                                                        setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, opacity: clamped } : m));
                                                                    }
                                                                }}
                                                                className={`w-[24px] bg-transparent border-none outline-none text-[11px] font-medium text-right p-0 ${isDark ? 'text-white/80' : 'text-black/80'}`}
                                                            />
                                                            <span className="text-[10px] opacity-40 font-bold">%</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button
                                                            onClick={() => {
                                                                setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, visible: !m.visible } : m));
                                                            }}
                                                            className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
                                                        >
                                                            {effectiveVisible ? <Eye size={14} /> : <EyeOff size={14} className="opacity-40" />}
                                                        </button>

                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <button className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}>
                                                                    <Info size={14} className="text-white" />
                                                                </button>
                                                            </PopoverTrigger>
                                                            <PopoverContent side="left" align="start" className={`w-48 p-3 rounded-[8px] border ${isDark ? 'bg-[#1f2128] border-white/10 text-[#ededed]' : 'bg-white border-black/10 text-[#11181c]'}`}>
                                                                <div className="flex flex-col gap-2">
                                                                    <span className="text-[11px] font-bold opacity-40 uppercase tracking-widest">Description</span>
                                                                    <textarea
                                                                        value={mark.description}
                                                                        onChange={(e) => {
                                                                            setMarks(prev => prev.map(m => m.id === mark.id ? { ...m, description: e.target.value } : m));
                                                                        }}
                                                                        className={`bg-transparent border-none outline-none text-[12px] w-full min-h-[60px] resize-none ${isDark ? 'text-white/80' : 'text-black/80'}`}
                                                                        placeholder="Add clinical context..."
                                                                    />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>

                                                        <button
                                                            onClick={() => {
                                                                setMarks(prev => prev.filter(m => m.id !== mark.id));
                                                            }}
                                                            className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            ) : activeTool === 'measures' ? (
                                <div className="flex flex-col gap-1 py-1 h-full overflow-y-auto custom-scrollbar">
                                    {measurements.length === 0 ? (
                                        <div className="py-8 flex flex-col items-center justify-center opacity-30 text-center px-4">
                                            <Ruler size={32} className="mb-2" />
                                            <p className="text-[12px]">No measurements yet.<br />Use the Ruler tool to measure distances.</p>
                                        </div>
                                    ) : (
                                        measurements.map((m) => (
                                            <div
                                                key={m.id}
                                                onMouseEnter={() => setHoveredMeasureId(m.id)}
                                                onMouseLeave={() => setHoveredMeasureId(null)}
                                                className={`group flex items-center gap-2 py-1 pl-2 pr-1 rounded-[8px] transition-colors ${hoveredMeasureId === m.id ? (isDark ? 'bg-white/5' : 'bg-black/5') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]')}`}
                                            >
                                                <div className={`flex flex-1 items-center h-[28px] rounded-[8px] transition-all overflow-hidden ${!m.visible ? 'opacity-40' : ''} ${isDark ? 'bg-white/[0.03] group-hover:bg-white/[0.05]' : 'bg-black/[0.03] group-hover:bg-black/[0.05]'}`}>
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 scale-75 ml-1 shrink-0" />
                                                    <input
                                                        value={m.name}
                                                        onChange={(e) => {
                                                            setMeasurements(prev => prev.map(mm => mm.id === m.id ? { ...mm, name: e.target.value } : mm));
                                                        }}
                                                        className={`flex-1 bg-transparent border-none outline-none text-[12px] font-medium px-2 truncate selection:bg-blue-500/30 ${isDark ? 'text-white/90' : 'text-black/90'}`}
                                                        placeholder="Name"
                                                    />
                                                    <div className={`flex items-center h-full border-l ${isDark ? 'border-white/10' : 'border-black/10'} px-2`}>
                                                        <span className={`text-[11px] font-bold ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                                                            {m.totalDistance.toFixed(1)}
                                                        </span>
                                                        <span className="text-[10px] opacity-40 font-bold ml-1">mm</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setMeasurements(prev => prev.map(mm => mm.id === m.id ? { ...mm, visible: !mm.visible } : mm));
                                                        }}
                                                        className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-black'}`}
                                                    >
                                                        {m.visible ? <Eye size={14} /> : <EyeOff size={14} className="opacity-40" />}
                                                    </button>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}>
                                                                <Info size={14} className={isDark ? 'text-white' : 'text-black'} />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent side="left" align="start" className={`w-56 p-3 rounded-[8px] border ${isDark ? 'bg-[#1f2128] border-white/10 text-[#ededed]' : 'bg-white border-black/10 text-[#11181c]'}`}>
                                                            <div className="flex flex-col gap-2.5">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Total Distance</span>
                                                                    <span className="text-[14px] font-bold">{m.totalDistance.toFixed(2)} mm</span>
                                                                </div>
                                                                <div className="h-[1px] w-full bg-white/5" />
                                                                <div className="flex flex-col gap-1.5">
                                                                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Segments ({m.points.length - 1})</span>
                                                                    <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                                                        {m.points.map((p, i) => {
                                                                            if (i === 0) return null;
                                                                            const segmentIndex = i - 1;
                                                                            const dist = p.distanceTo(m.points[i - 1]);
                                                                            return (
                                                                                <div
                                                                                    key={i}
                                                                                    onMouseEnter={() => setHoveredSegmentIndex(segmentIndex)}
                                                                                    onMouseLeave={() => setHoveredSegmentIndex(null)}
                                                                                    className={`flex justify-between items-center text-[11px] py-0.5 px-1.5 rounded-[8px] transition-colors ${hoveredSegmentIndex === segmentIndex ? (isDark ? 'bg-white/10' : 'bg-black/5') : ''}`}
                                                                                >
                                                                                    <span className="opacity-40">Segment {i}</span>
                                                                                    <span className="font-medium whitespace-nowrap">{dist.toFixed(2)} mm</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <button
                                                        onClick={() => {
                                                            setMeasurements(prev => prev.filter(mm => mm.id !== m.id));
                                                        }}
                                                        className={`p-1 rounded-[8px] transition-colors ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : activeTool === 'comments' ? (
                                <div className="flex flex-col gap-1.5 py-1">
                                    {comments.filter(c => c.text.trim()).length === 0 ? (
                                        <div className="py-8 flex flex-col items-center justify-center opacity-30 text-center px-4">
                                            <MessageSquare size={32} className="mb-2" />
                                            <p className="text-[12px]">No comments yet.<br />Click on the model to add one.</p>
                                        </div>
                                    ) : (
                                        comments.filter(c => c.text.trim()).map((comment) => (
                                            <div
                                                key={comment.id}
                                                onClick={() => {
                                                    setActiveCommentId(comment.id);
                                                    setSelectedAnatomyId(null);
                                                }}
                                                className={`py-1 px-1.5 rounded-[8px] transition-all cursor-pointer ${activeCommentId === comment.id ? (isDark ? 'bg-white/[0.04]' : 'bg-black/[0.04]') : (isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]')}`}
                                            >
                                                <div className="flex gap-2">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${comment.color || 'bg-blue-500'} text-[9px] text-white font-bold uppercase shrink-0 mt-0.5`}>
                                                        {comment.initials || (comment.user || comment.author || '?').charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{comment.user || comment.author}</span>
                                                            <span className="text-[9px] opacity-30">{comment.time || comment.timestamp}</span>
                                                        </div>
                                                        <p className={`text-[11px] leading-snug break-words line-clamp-2 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                                                            {comment.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : activeTool === 'notes' ? (
                                <div className="flex flex-col h-full min-h-0">
                                    <div className="flex items-center justify-between py-3 mb-2 shrink-0">
                                        <button
                                            onClick={() => {
                                                const newNote = {
                                                    id: Date.now().toString(),
                                                    title: 'Untitled Note',
                                                    content: '',
                                                    date: new Date().toLocaleString()
                                                };
                                                setNotes([newNote, ...notes]);
                                                setActiveNoteId(newNote.id);
                                            }}
                                            className={`flex items-center gap-1.5 text-[11px] font-bold transition-opacity hover:opacity-100 ${isDark ? 'text-blue-400 opacity-80' : 'text-blue-600 opacity-80'}`}
                                        >
                                            <Plus size={14} /> New Entry
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                title="Save Changes"
                                                onClick={() => {
                                                    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content: noteDraft, date: new Date().toLocaleString() } : n));
                                                }}
                                                className={`p-1.5 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                title="Download as TXT"
                                                onClick={() => {
                                                    const content = notes.map(n => `--- ${n.title} --- (${n.date})\n\n${n.content}\n\n`).join('\n');
                                                    const blob = new Blob([content], { type: 'text/plain' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `Case_Notes_${new Date().toISOString().slice(0, 10)}.txt`;
                                                    a.click();
                                                }}
                                                className={`p-1.5 rounded-[8px] transition-colors ${isDark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                                            >
                                                <FileDown size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 min-h-0 gap-3">
                                        <input
                                            type="text"
                                            value={notes.find(n => n.id === activeNoteId)?.title ?? ''}
                                            onChange={(e) => {
                                                setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, title: e.target.value } : n));
                                            }}
                                            className={`bg-transparent border-none outline-none text-[15px] font-bold p-0 ${isDark ? 'text-white placeholder:text-white/20' : 'text-black placeholder:text-black/20'}`}
                                            placeholder="Note Title"
                                        />
                                        <textarea
                                            value={noteDraft}
                                            onChange={(e) => setNoteDraft(e.target.value)}
                                            placeholder="Start writing..."
                                            className={`flex-1 bg-transparent border-none outline-none text-[13px] leading-relaxed resize-none custom-scrollbar ${isDark ? 'text-white/70 placeholder:text-white/20' : 'text-black/70 placeholder:text-black/20'}`}
                                        />
                                    </div>
                                    <div className={`mt-4 py-3 border-t flex flex-col gap-1 overflow-y-auto max-h-[160px] custom-scrollbar ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                        <span className="text-[10px] font-bold uppercase opacity-30 tracking-widest mb-1">Previous Entries</span>
                                        {notes.map(note => (
                                            <div
                                                key={note.id}
                                                onClick={() => setActiveNoteId(note.id)}
                                                className={`py-2 px-2 rounded-[8px] cursor-pointer transition-all ${activeNoteId === note.id ? (isDark ? 'bg-white/5' : 'bg-black/5') : (isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.03]')}`}
                                            >
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-white/90' : 'text-black/90'}`}>{note.title}</span>
                                                    <span className="text-[9px] opacity-30 shrink-0">{note.date.split(',')[0]}</span>
                                                </div>
                                                <p className="text-[10px] opacity-40 line-clamp-1 truncate">{note.content.substring(0, 40) || 'No content'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-0.5 py-1">
                                        <h4 className={`text-[12px] font-bold ${isDark ? "text-white" : "text-[#11181C]"}`}>{anatomyLayers.find(l => l.id === selectedAnatomyId)?.name || "No selection"}</h4>
                                    </div>
                                    {(() => {
                                        const selectedLayer = anatomyLayers.find(l => l.id === selectedAnatomyId);
                                        return (
                                            <div className="flex flex-col gap-0 -mt-1">
                                                <button
                                                    onClick={() => { if (pointerMode === 'hand') return; setPropertiesExpanded(!propertiesExpanded); }}
                                                    className={`flex items-center justify-between py-1 px-2 -mx-2 rounded-[8px] transition-all group ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                                                >
                                                    <span className={`text-[12px] font-semibold ${isDark ? "text-[#EDEDED]" : "text-[#11181C]"}`}>Properties</span>
                                                    {propertiesExpanded ? <ChevronUp size={14} className="opacity-30 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-30 group-hover:opacity-100" />}
                                                </button>
                                                <div className={`flex flex-col gap-0 py-0.5 px-1 overflow-hidden transition-all duration-300 ${propertiesExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="flex justify-between items-center h-[18px]">
                                                        <span className={`text-[11px] opacity-40 font-medium ${isDark ? "text-white" : "text-black"}`}>Volume</span>
                                                        <span className={`text-[11px] font-medium ${isDark ? "text-white/80" : "text-[#11181C]"}`}>{selectedLayer?.volume ? `${selectedLayer.volume} cm³` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center h-[18px]">
                                                        <span className={`text-[11px] opacity-40 font-medium ${isDark ? "text-white" : "text-black"}`}>Transverse</span>
                                                        <span className={`text-[11px] font-medium ${isDark ? "text-white/80" : "text-[#11181C]"}`}>{selectedLayer?.transverse ? `${selectedLayer.transverse} mm` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center h-[18px]">
                                                        <span className={`text-[11px] opacity-40 font-medium ${isDark ? "text-white" : "text-black"}`}>Craniocaudal</span>
                                                        <span className={`text-[11px] font-medium ${isDark ? "text-white/80" : "text-[#11181C]"}`}>{selectedLayer?.craniocaudal ? `${selectedLayer.craniocaudal} mm` : '--'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center h-[18px]">
                                                        <span className={`text-[11px] opacity-40 font-medium ${isDark ? "text-white" : "text-black"}`}>Anteroposterior</span>
                                                        <span className={`text-[11px] font-medium ${isDark ? "text-white/80" : "text-[#11181C]"}`}>{selectedLayer?.anteroposterior ? `${selectedLayer.anteroposterior} mm` : '--'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <div className={`h-[1px] w-full mt-0.5 mb-0.5 ${isDark ? "bg-white/5" : "bg-black/5"}`} />
                                    <div className="flex flex-col gap-0">
                                        <button
                                            onClick={() => { if (pointerMode === 'hand') return; setAppearanceExpanded(!appearanceExpanded); }}
                                            className={`flex items-center justify-between py-1 px-2 -mx-2 rounded-[8px] transition-all group ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}
                                        >
                                            <span className={`text-[12px] font-semibold ${isDark ? "text-[#EDEDED]" : "text-[#11181C]"}`}>Appearance</span>
                                            {appearanceExpanded ? <ChevronUp size={14} className="opacity-30 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-30 group-hover:opacity-100" />}
                                        </button>
                                        <div className={`flex flex-col gap-2 py-0.5 px-1 overflow-hidden transition-all duration-300 ${appearanceExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="flex justify-between items-center h-[24px]">
                                                <span className={`text-[12px] opacity-40 font-medium ${isDark ? "text-white" : "text-black"}`}>Opacity</span>
                                                <div className={`group relative w-[60px] h-[22px] rounded-[8px] border flex items-center transition-all px-1.5 gap-2 ${isDark ? "bg-black/20 border-white/10 hover:border-white/20 focus-within:border-blue-500/50" : "bg-white border-black/10 hover:border-black/20 focus-within:border-blue-500/50"}`}>
                                                    <div className="flex items-center justify-center shrink-0">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                                                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                                                            <circle cx="6" cy="6" r="2" fill="currentColor" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={Math.round((anatomyLayers.find(l => l.id === selectedAnatomyId)?.opacity ?? 1) * 100)}
                                                        onFocus={(e: any) => e.target.select()}
                                                        onChange={(e) => {
                                                            if (pointerMode === 'hand') return;
                                                            const val = parseInt(e.target.value.replace('%', ''));
                                                            if (!isNaN(val) && selectedAnatomyId) {
                                                                const internalVal = Math.max(0, Math.min(100, val)) / 100;
                                                                setAnatomyLayers(prev => prev.map(l => l.id === selectedAnatomyId ? { ...l, opacity: internalVal } : l));
                                                            }
                                                        }}
                                                        className="w-full bg-transparent border-none outline-none text-[11px] font-medium p-0 text-left selection:bg-blue-500 selection:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* BOTTOM CENTER UI */}
            <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col-reverse items-center gap-4 w-fit transition-all duration-300`}
                onMouseEnter={() => setIsHoveringUI(true)}
                onMouseLeave={() => setIsHoveringUI(false)}
            >
                <div className={`flex items-center p-1 gap-1 rounded-[8px] border bg-[#1C1C1E] border-white/5`}>
                    <SplitToolButton
                        isDark={isDark}
                        icon={pointerMode === 'hand' ? <Hand size={16} strokeWidth={1.5} /> : <MousePointer2 size={16} strokeWidth={1.5} />}
                        label={pointerMode === 'hand' ? 'Hand' : 'Selection'}
                        active={!activeTool}
                        onClick={() => {
                            if (activeTool) {
                                setActiveTool(null);
                                setMeasurePoints([]);
                            }
                            else setPointerMode(pointerMode === 'hand' ? 'select' : 'hand');
                        }}
                        dropdownItems={
                            <>
                                <DropdownMenuItem onClick={() => { setPointerMode('select'); setActiveTool(null); }} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-white/10 focus:bg-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><MousePointer2 size={14} className="opacity-70" /><span>Selection</span></div>
                                    <span className="opacity-40 text-[11px]">M</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setPointerMode('hand'); setActiveTool(null); }} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-white/10 focus:bg-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Hand size={14} className="opacity-70" /><span>Hand</span></div>
                                    <span className="opacity-40 text-[11px]">H</span>
                                </DropdownMenuItem>
                            </>
                        }
                    />

                    <ToolButton isDark={isDark} icon={<RotateCw size={16} strokeWidth={1.5} />} label="Rotate" active={activeTool === 'rotate'} onClick={() => { setActiveTool('rotate'); setMeasurePoints([]); }} />
                    <ToolButton isDark={isDark} icon={<Ruler size={16} strokeWidth={1.5} />} label="Ruler" active={activeTool === 'measures'} onClick={() => { setActiveTool('measures'); setMeasurePoints([]); }} />



                    <ToolButton isDark={isDark} icon={<Edit2 size={16} strokeWidth={1.5} />} label="Marks" active={activeTool === 'marks'} onClick={() => { setActiveTool('marks'); setMeasurePoints([]); }} />
                    <ToolButton isDark={isDark} icon={<Clipboard size={16} strokeWidth={1.5} />} label="Notes" active={activeTool === 'notes'} onClick={() => { setActiveTool('notes'); setMeasurePoints([]); }} />
                    <ToolButton isDark={isDark} icon={<MessageSquare size={16} strokeWidth={1.5} />} label="Add Comments" active={activeTool === 'comments'} onClick={() => { setActiveTool('comments'); setMeasurePoints([]); }} />

                    <div className={`w-[1px] h-4 mx-0.5 bg-white/10`} />
                    <ToolButton isDark={isDark} icon={<Circle size={16} strokeWidth={2.5} className="text-red-500 fill-red-500" />} label="Record View" onClick={() => saveCurrentView()} />
                    <ToolButton isDark={isDark} icon={<RotateCcw size={16} strokeWidth={1.5} />} label="Restore" onClick={() => {
                        const hasChanges = marks.length > 0 || measurements.length > 0 || comments.length > 0 || notes.length > 0;
                        if (hasChanges) {
                            setIsRestoring(true);
                        } else {
                            resetModel();
                        }
                    }} />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                title=""
                                className={`w-[32px] h-[32px] flex items-center justify-center rounded-[8px] cursor-pointer transition-all duration-200 outline-none text-[#a3a3a3] hover:bg-white/10 hover:text-white focus:outline-none`}
                            >
                                <MoreHorizontal size={16} strokeWidth={1.5} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" sideOffset={10} className={`rounded-[8px] p-1.5 border min-w-[160px] bg-[#1f2128] border-white/10 text-[#ededed]`}>
                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-white/10 focus:bg-white/10 flex items-center gap-2" onClick={() => { }}><Maximize size={14} className="opacity-70" /><span>Full Screen</span></DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-white/10 focus:bg-white/10 flex items-center gap-2" onClick={() => { }}><Camera size={14} className="opacity-70" /><span>Screenshot</span></DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-white/10 focus:bg-white/10 flex items-center gap-2" onClick={() => { }}><HelpCircle size={14} className="opacity-70" /><span>Guided Tour</span></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {activeMode === 'copilot' && (
                    <div className="w-[600px] absolute -top-14 left-1/2 -translate-x-1/2 mb-2">
                        <div className={`flex items-center gap-3 px-4 h-[52px] rounded-[8px] backdrop-blur-2xl border ${isDark ? "bg-[#16181A]/90 border-white/10" : "bg-white/95 border-black/10"}`}>
                            <input
                                ref={copilotInputRef}
                                type="text"
                                value={copilotText}
                                onChange={(e) => setCopilotText(e.target.value)}
                                onKeyDown={handleCopilotCommand}
                                placeholder="Ask Copilot..."
                                className={`flex-1 bg-transparent border-none outline-none text-[15px] font-medium h-full focus:ring-0 ${isDark ? "text-[#ededed] placeholder:text-[#687076]" : "text-[#11181c] placeholder:text-[#8e918f]"}`}
                            />
                            <div className="flex items-center gap-1 shrink-0 pb-0.5">
                                {copilotText.trim() ? (
                                    <button
                                        onClick={() => { handleCopilotCommand({ key: 'Enter' } as any); }}
                                        className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 outline-none border-none"
                                    >
                                        <ArrowUp size={18} strokeWidth={2.5} />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-all duration-300 ${isDark ? "text-blue-400 hover:bg-white/10" : "text-blue-600 hover:bg-black/5"}`}>
                                                        <Mic size={18} strokeWidth={2} className="opacity-80" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-[#1C1C1E] text-white border-white/10 py-1.5 px-3 text-[12px] rounded-lg">
                                                    Dictate
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-all duration-300 ${isDark ? "text-blue-400 hover:bg-white/10" : "text-blue-600 hover:bg-black/5"}`}>
                                                        <AudioLines size={18} strokeWidth={2} className="opacity-80" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-[#1C1C1E] text-white border-white/10 py-1.5 px-3 text-[12px] rounded-lg">
                                                    Use Voice
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isRestoring} onOpenChange={setIsRestoring}>
                <DialogContent className={`${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-black/10 text-black'} rounded-[8px] max-w-[340px] p-6 !z-[1001]`}>
                    <DialogHeader className="gap-2">
                        <DialogTitle className="text-[18px] font-bold">Restaurar Modelo</DialogTitle>
                        <DialogDescription className={`text-[14px] leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                            ¿Estás seguro de que deseas restaurar el modelo? Se perderán todas las marcas, medidas y anotaciones realizadas hasta ahora.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-3 flex sm:flex-row flex-col">
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setIsRestoring(false); }}
                            className={`flex-1 ${isDark ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) => { e.stopPropagation(); resetModel(); }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none font-bold"
                        >
                            Restaurar Todo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="absolute bottom-6 right-6 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                            className="flex items-center"
                            onMouseEnter={() => setIsHoveringUI(true)}
                            onMouseLeave={() => setIsHoveringUI(false)}
                        >
                            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] backdrop-blur-md border text-[13px] font-medium transition-colors outline-none focus:outline-none h-[34px] ${isDark ? "bg-[#1f2128]/80 border-white/10 text-[#ededed] hover:bg-[#1f2128]" : "bg-white/80 border-black/5 text-[#11181c] hover:bg-white"}`}>
                                {zoomLevel}% <ChevronUp size={14} className="opacity-50" />
                            </button>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className={`w-48 rounded-[8px] p-1 border ${isDark ? "bg-[#1f2128] border-white/10 text-[#ededed]" : "bg-white border-black/5 text-[#11181c]"}`}
                        onMouseEnter={() => setIsHoveringUI(true)}
                        onMouseLeave={() => setIsHoveringUI(false)}
                    >
                        <div className="flex flex-col gap-1 py-1">
                            <DropdownMenuItem onClick={() => setZoomLevel(prev => Math.min(500, prev + 25))} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 flex justify-between items-center">
                                <span>Zoom In</span>
                                <span className="opacity-40 text-[11px]">⌘+</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setZoomLevel(prev => Math.max(10, prev - 25))} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 flex justify-between items-center">
                                <span>Zoom Out</span>
                                <span className="opacity-40 text-[11px]">⌘-</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setZoomLevel(100)} className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 flex justify-between items-center">
                                <span>Zoom to Fit</span>
                                <span className="opacity-40 text-[11px]">⌘0</span>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-black/5"} />
                        <div className="flex flex-col gap-1 py-1">
                            {[25, 50, 75, 100, 150, 200, 400].map(v => (
                                <DropdownMenuItem
                                    key={v}
                                    onClick={() => setZoomLevel(v)}
                                    className={`text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 flex justify-between items-center ${zoomLevel === v ? 'text-blue-500 font-medium' : ''}`}
                                >
                                    {v}%
                                    {zoomLevel === v && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator className={isDark ? "bg-white/10" : "bg-black/5"} />
                        <div className="flex flex-col gap-1 py-1">
                            <DropdownMenuItem
                                onClick={() => setShowGrid(!showGrid)}
                                className="text-[13px] rounded-[8px] px-3 py-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10"
                            >
                                {showGrid ? 'Hide Grid' : 'Show Grid'}
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* CONTEXT MENU UI */}
            {
                contextMenu && (
                    <div
                        className={`fixed z-[1000] min-w-[170px] rounded-[8px] p-1 border ${isDark ? "bg-[#1C1C1E] border-white/10 text-[#EDEDED]" : "bg-white border-black/10 text-[#11181C]"}`}
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setIsHoveringUI(true)}
                        onMouseLeave={() => setIsHoveringUI(false)}
                    >
                        <div className="flex flex-col gap-0.5">                            {/* Smart Isolate / Undo Action */}
                            <ContextMenuItem
                                isDark={isDark}
                                icon={previousLayersState ? <RotateCcw size={14} /> : <Eye size={14} />}
                                label={previousLayersState ? `Undo isolate ${contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.name : selectedAnatomyId ? anatomyLayers.find(l => l.id === selectedAnatomyId)?.name : 'element'}` : `Isolate ${contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.name : selectedAnatomyId ? anatomyLayers.find(l => l.id === selectedAnatomyId)?.name : 'element'}`}
                                onClick={() => {
                                    if (previousLayersState) {
                                        // Undo isolation
                                        const initialLayers = savedViews.find(v => v.id === '1')?.visibleLayers || [];
                                        setAnatomyLayers(prev => prev.map(l => ({ ...l, visible: previousLayersState.includes(l.id) })));
                                        setPreviousLayersState(null);
                                    } else {
                                        // Start isolation
                                        const targetId = contextMenu.targetId || selectedAnatomyId;
                                        if (targetId) {
                                            performIsolation(targetId);
                                        }
                                    }
                                    setContextMenu(null);
                                }}
                            />

                            {/* Hide/Show current target */}
                            <ContextMenuItem
                                isDark={isDark}
                                icon={(contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.visible : selectedAnatomyId ? anatomyLayers.find(l => l.id === selectedAnatomyId)?.visible : false) ? <EyeOff size={14} /> : <Eye size={14} />}
                                label={(contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.visible : selectedAnatomyId ? anatomyLayers.find(l => l.id === selectedAnatomyId)?.visible : false) ? `Hide ${contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.name : ''}` : `Show ${contextMenu.targetId ? anatomyLayers.find(l => l.id === contextMenu.targetId)?.name : ''}`}
                                onClick={() => {
                                    const targetId = contextMenu.targetId || selectedAnatomyId;
                                    if (targetId) {
                                        toggleLayer(targetId);
                                    }
                                    setContextMenu(null);
                                }}
                            />



                            {/* Divider as requested */}
                            <div className={`h-px my-1 ${isDark ? "bg-white/10" : "bg-black/5"}`} />


                            <ContextMenuItem isDark={isDark} icon={<Edit2 size={14} />} label="Add Mark" onClick={() => { setActiveTool('marks'); setContextMenu(null); }} />
                            <ContextMenuItem
                                isDark={isDark}
                                icon={<MessageSquare size={14} />}
                                label="Add comment"
                                onClick={() => {
                                    const rect = document.getElementById('canvas-container')?.getBoundingClientRect();
                                    if (rect) {
                                        const x = contextMenu.x - rect.left;
                                        const y = contextMenu.y - rect.top;
                                        const newId = Date.now().toString();
                                        setComments(prev => [...prev, {
                                            id: newId,
                                            x, y,
                                            author: 'alex',
                                            timestamp: 'Just now',
                                            text: '',
                                            replies: [],
                                            resolved: false
                                        }]);
                                        setActiveCommentId(newId);
                                        setActiveTool('comments');
                                    }
                                    setContextMenu(null);
                                }}
                            />
                            <div className={`h-[1px] my-1 ${isDark ? "bg-white/5" : "bg-black/5"}`} />
                            <ContextMenuItem isDark={isDark} icon={<FlipVertical size={14} />} label="Flip vertical" onClick={() => { setFlipV(!flipV); setContextMenu(null); }} />
                            <ContextMenuItem isDark={isDark} icon={<FlipHorizontal size={14} />} label="Flip horizontal" onClick={() => { setFlipH(!flipH); setContextMenu(null); }} />
                            <div className={`h-[1px] my-1 ${isDark ? "bg-white/5" : "bg-black/5"}`} />
                            <ContextMenuItem isDark={isDark} icon={<Camera size={14} />} label="Screenshot" onClick={() => setContextMenu(null)} />
                            <ContextMenuItem isDark={isDark} icon={<Circle size={14} className="text-red-500 fill-red-500" />} label="Save View" onClick={() => { saveCurrentView(); setContextMenu(null); }} />
                        </div>
                    </div>
                )
            }
        </div>
    );
}

function RotationLerper({ targetH, targetV }: { targetH: boolean, targetV: boolean }) {
    useFrame((state, delta) => {
        const group = state.scene.children.find(c => c.type === 'Group' && c.scale.x > 0); // Find main group
        if (group) {
            const tX = targetV ? Math.PI : 0;
            const tY = targetH ? Math.PI : 0;
            group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, tX, delta * 6);
            group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, tY, delta * 6);
        }
    });
    return null;
}



