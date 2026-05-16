"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { 
  Plus, Users, CheckCircle, Clock, Phone, User, Search, X, 
  Copy, Check, Sparkles, ChevronDown, Send, MessageSquare, Link2, Edit2,
  Shield, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import GuestCreatedSuccess from '@/components/admin/GuestCreatedSuccess';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'sonner';

// Types
interface IInvite {
  _id: string;
  fullName: string;
  phoneNumber?: string;
  slug: string;
  isAdmin: boolean;
  status: 'pending' | 'attended';
  rsvpLink?: string;
  createdAt: string;
}

interface FormData {
  fullName: string;
  phoneNumber: string;
  isAdmin: boolean;        // ← Added
}

const ITEMS_PER_PAGE = 10;

// Micro-interaction variants
const tapAnimation = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { 
    opacity: 0, 
    x: -100, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const successVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 }
  }
};

// Skeleton Loader Components
function StatCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-32 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
      <Skeleton className="h-3 w-12 mb-2 bg-slate-700" />
      <Skeleton className="h-8 w-16 bg-slate-700" />
    </div>
  );
}

function GuestCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-xl bg-slate-700" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2 bg-slate-700" />
          <Skeleton className="h-4 w-24 bg-slate-700/50" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg bg-slate-700" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-700/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl bg-slate-700" />
          <Skeleton className="h-5 w-32 bg-slate-700" />
        </div>
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <Skeleton className="h-4 w-28 bg-slate-700" />
      </td>
      <td className="px-6 py-4 text-center">
        <Skeleton className="h-7 w-20 rounded-lg bg-slate-700 mx-auto" />
      </td>
      <td className="px-6 py-4 text-right">
        <Skeleton className="h-10 w-24 rounded-xl bg-slate-700 ml-auto" />
      </td>
    </tr>
  );
}

// Share Drawer Component
function ShareDrawer({ 
  isOpen, 
  onClose, 
  invite 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  invite: IInvite | null;
}) {
  const handleCopyLink = async () => {
    if (!invite) return;
    const url = `${window.location.origin}/invitation/${invite.slug}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    onClose();
  };

  const handleShareTelegram = () => {
    if (!invite) return;
    const url = `${window.location.origin}/invitation/${invite.slug}`;
    const message = `You're invited to our wedding! ${url}`;
    window.open(`tg://msg?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  const handleShareSMS = () => {
    if (!invite) return;
    const url = `${window.location.origin}/invitation/${invite.slug}`;
    const message = `You're invited to our wedding! ${url}`;
    window.open(`sms:?&body=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-slate-900 border-slate-700/50">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-white">Share Invitation</DrawerTitle>
          <DrawerDescription className="text-slate-400">
            Share {invite?.fullName}&apos;s invitation
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 pt-2 space-y-3">
          <motion.button
            whileTap={tapAnimation}
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
          >
            <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Link2 className="size-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Copy Link</p>
              <p className="text-sm text-slate-400">Copy invitation URL to clipboard</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={tapAnimation}
            onClick={handleShareTelegram}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
          >
            <div className="size-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Send className="size-5 text-sky-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Share via Telegram</p>
              <p className="text-sm text-slate-400">Send invitation through Telegram</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={tapAnimation}
            onClick={handleShareSMS}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
          >
            <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="size-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Share via SMS</p>
              <p className="text-sm text-slate-400">Send invitation through text message</p>
            </div>
          </motion.button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Swipeable Guest Card Component
function SwipeableGuestCard({ 
  invite, 
  onShareClick,
  onEditClick,
  onStatusToggle
}: { 
  invite: IInvite; 
  onShareClick: (invite: IInvite) => void;
  onEditClick: (invite: IInvite) => void;
  onStatusToggle: (invite: IInvite) => void;
}) {
  const x = useMotionValue(0);
  const background = useTransform(x, [-100, 0], ["#6366f1", "transparent"]);
  const copyIconOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -80) {
      onShareClick(invite);
    }
  };

  return (
    <motion.div
      // variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Swipe Background */}
      <motion.div 
        style={{ background }}
        className="absolute inset-0 rounded-2xl flex items-center justify-end pr-6"
      >
        <motion.div style={{ opacity: copyIconOpacity }}>
          <Copy className="size-6 text-white" />
        </motion.div>
      </motion.div>

      {/* Card Content */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="relative p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className={cn(
            "size-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg",
            invite.status === 'attended' 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25' 
              : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/25'
          )}>
            {invite.fullName.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{invite.fullName}</p>
            {invite.phoneNumber ? (
              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                <Phone className="size-3" />
                {invite.phoneNumber}
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic">No contact added</p>
            )}
          </div>

          {/* Status Badge - Clickable */}
          <motion.button
            whileTap={tapAnimation}
            onClick={() => onStatusToggle(invite)}
            className="flex items-center gap-2"
          >
            {invite.status === 'attended' ? (
              <span className="relative px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-emerald-400 rounded-full animate-pulse" />
                <CheckCircle className="size-3.5" /> 
                <span className="hidden xs:inline">Attended</span>
              </span>
            ) : (
              <span className="relative px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full" />
                <Clock className="size-3.5" /> 
                <span className="hidden xs:inline">Pending</span>
              </span>
            )}
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-2">
          <motion.button
            whileTap={tapAnimation}
            onClick={() => onEditClick(invite)}
            className="flex-1 py-2.5 rounded-xl bg-slate-700/50 text-slate-300 text-sm font-medium flex items-center justify-center gap-2 border border-slate-600/30 hover:bg-slate-700 transition-colors"
          >
            <Edit2 className="size-4" />
            Edit
          </motion.button>
          <motion.button
            whileTap={tapAnimation}
            onClick={() => onShareClick(invite)}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 text-sm font-medium flex items-center justify-center gap-2 border border-indigo-500/20 hover:bg-indigo-600/30 transition-colors"
          >
            <Send className="size-4" />
            Share Invitation
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Desktop Table Row Component
function TableRow({ 
  invite, 
  onShareClick,
  onEditClick,
  onStatusToggle
}: { 
  invite: IInvite; 
  onShareClick: (invite: IInvite) => void;
  onEditClick: (invite: IInvite) => void;
  onStatusToggle: (invite: IInvite) => void;
}) {
  return (
    <motion.tr
      // variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group"
    >
      {/* Guest Profile */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg",
            invite.status === 'attended' 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20' 
              : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20'
          )}>
            {invite.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="font-semibold text-white">{invite.fullName}</div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        {invite.phoneNumber ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <Phone className="size-3.5 text-slate-500" />
            {invite.phoneNumber}
          </div>
        ) : (
          <span className="text-sm text-slate-600 italic">No contact added</span>
        )}
      </td>

      {/* Status Badge - Clickable */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <motion.button
          whileTap={tapAnimation}
          onClick={() => onStatusToggle(invite)}
          className="inline-flex"
        >
          {invite.status === 'attended' ? (
            <span className="relative inline-flex px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold uppercase items-center gap-1.5 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer">
              <span className="absolute -top-0.5 -right-0.5 size-2 bg-emerald-400 rounded-full animate-pulse" />
              <CheckCircle className="size-3.5" /> Attended
            </span>
          ) : (
            <span className="relative inline-flex px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold uppercase items-center gap-1.5 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer">
              <span className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full" />
              <Clock className="size-3.5" /> Pending
            </span>
          )}
        </motion.button>
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.button 
            whileTap={tapAnimation}
            onClick={() => onEditClick(invite)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
            title="Edit Guest"
          >
            <Edit2 className="size-5" />
          </motion.button>
          <motion.button 
            whileTap={tapAnimation}
            onClick={() => onShareClick(invite)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
            title="Share Invitation"
          >
            <Send className="size-5" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const router = useRouter();
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [formData, setFormData] = useState<FormData>({ fullName: '', phoneNumber: '',isAdmin: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<IInvite | null>(null);
  const [editFormData, setEditFormData] = useState<FormData>({ fullName: '', phoneNumber: '',isAdmin: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdInvite, setCreatedInvite] = useState<IInvite | null>(null);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [shareInvite, setShareInvite] = useState<IInvite | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchInvites = useCallback(async () => {
    try {
      const res = await fetch('/api/invites');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setInvites(data);
    } catch (err) {
      console.error('Failed to fetch invites', err);
      toast.error('Failed to fetch guests');
    } finally {
      setIsFetching(false);
    }
  }, [router]);

  useEffect(() => { 
    fetchInvites(); 
  }, [fetchInvites]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const closeSuccessSheet = () => {
    setShowSuccess(false);
    setCreatedInvite(null);
    setIsSheetOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber || undefined,
          isAdmin: formData.isAdmin,
        }),
      });
      if (res.ok) {
        const created: IInvite = await res.json();
        setFormData({ fullName: '', phoneNumber: '', isAdmin: false });
        setCreatedInvite(created);
        setShowSuccess(true);
        toast.success('Guest added successfully!');
        fetchInvites();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add guest');
      }
    } catch {
      toast.error('Error adding guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvite) return;
    setIsLoading(true);
    try {
const res = await fetch('/api/invites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingInvite._id,
          fullName: editFormData.fullName,
          phoneNumber: editFormData.phoneNumber || undefined,
          isAdmin: editFormData.isAdmin
        }),
      });
      if (res.ok) {
        toast.success('Guest updated successfully!');
        setIsEditSheetOpen(false);
        setEditingInvite(null);
        fetchInvites();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update guest');
      }
    } catch {
      toast.error('Error updating guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (invite: IInvite) => {
    const newStatus = invite.status === 'attended' ? 'pending' : 'attended';
    try {
      const res = await fetch('/api/invites', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invite._id,
          status: newStatus
        }),
      });
      if (res.ok) {
        toast.success(`Status changed to ${newStatus}`);
        fetchInvites();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update status');
      }
    } catch {
      toast.error('Error updating status');
    }
  };

  const handleShareClick = (invite: IInvite) => {
    setShareInvite(invite);
    setShareDrawerOpen(true);
  };

  const handleEditClick = (invite: IInvite) => {
    setEditingInvite(invite);
    setEditFormData({
      fullName: invite.fullName,
      phoneNumber: invite.phoneNumber || '',
      isAdmin: invite.isAdmin
    });
    setIsEditSheetOpen(true);
  };

  const filteredInvites = invites.filter(invite => 
    invite.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invite.phoneNumber?.includes(searchQuery)
  );

  const visibleInvites = filteredInvites.slice(0, visibleCount);
  const hasMore = visibleCount < filteredInvites.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const attendedCount = invites.filter(i => i.status === 'attended').length;
  const pendingCount = invites.filter(i => i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#fff',
          },
        }}
      />
      
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Header with Search */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Guest Management
              </h1>
              <p className="text-slate-500 text-sm">Wedding Registry</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-white"
            >
              <LogOut className="size-4" />
              Log out
            </Button>
            {/* Desktop Add Button */}
            <motion.button
              whileTap={tapAnimation}
              onClick={() => setIsSheetOpen(true)}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <Plus className="size-4" />
              Add Guest
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stat Cards - Horizontal Scroll */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {isFetching ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <motion.div 
                  whileTap={tapAnimation}
                  className="flex-shrink-0 w-32 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">Total</p>
                  <p className="text-2xl font-bold">{invites.length}</p>
                </motion.div>
                <motion.div 
                  whileTap={tapAnimation}
                  className="flex-shrink-0 w-32 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-semibold mb-1">Attended</p>
                  <p className="text-2xl font-bold text-emerald-400">{attendedCount}</p>
                </motion.div>
                <motion.div 
                  whileTap={tapAnimation}
                  className="flex-shrink-0 w-32 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm"
                >
                  <p className="text-[10px] uppercase tracking-widest text-amber-400/80 font-semibold mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto p-4 pb-32 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-300">
            <Users className="size-5 text-indigo-400" />
            Guest Registry
          </h2>
          {!isFetching && filteredInvites.length > 0 && (
            <span className="text-xs font-medium bg-slate-800/80 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700/50">
              {filteredInvites.length} {filteredInvites.length === 1 ? 'Guest' : 'Guests'}
            </span>
          )}
        </div>

        {/* Loading State */}
        {isFetching ? (
          <>
            {/* Mobile Skeletons */}
            <div className="lg:hidden space-y-3">
              {[...Array(4)].map((_, i) => (
                <GuestCardSkeleton key={i} />
              ))}
            </div>
            {/* Desktop Skeletons */}
            <div className="hidden lg:block rounded-2xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : filteredInvites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm p-12 text-center"
          >
            <div className="size-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <User className="size-8 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-slate-400 mb-1">
              {searchQuery ? 'No guests found' : 'No guests registered yet'}
            </p>
            <p className="text-sm text-slate-600">
              {searchQuery ? 'Try a different search term' : 'Add your first guest to get started'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Mobile: Card View */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {visibleInvites.map((invite) => (
                  <SwipeableGuestCard 
                    key={invite._id} 
                    invite={invite} 
                    onShareClick={handleShareClick}
                    onEditClick={handleEditClick}
                    onStatusToggle={handleStatusToggle}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Desktop: Table View */}
            <div className="hidden lg:block rounded-2xl bg-slate-800/40 border border-slate-700/30 backdrop-blur-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {visibleInvites.map((invite) => (
                      <TableRow 
                        key={invite._id} 
                        invite={invite} 
                        onShareClick={handleShareClick}
                        onEditClick={handleEditClick}
                        onStatusToggle={handleStatusToggle}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  Load More ({filteredInvites.length - visibleCount} remaining)
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button - Mobile Only */}
      <motion.button
        whileTap={tapAnimation}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsSheetOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 size-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center"
      >
        <Plus className="size-6" />
      </motion.button>

      {/* Share Drawer */}
      <ShareDrawer 
        isOpen={shareDrawerOpen} 
        onClose={() => setShareDrawerOpen(false)} 
        invite={shareInvite} 
      />

      {/* Add Guest Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="bg-slate-900 border-slate-700/50 rounded-t-3xl max-h-[85vh] lg:max-h-none lg:rounded-none lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[400px] lg:rounded-l-3xl"
        >
          <AnimatePresence mode="wait">
            {showSuccess && createdInvite ? (
              <GuestCreatedSuccess key="success" guest={createdInvite} onDone={closeSuccessSheet} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SheetHeader className="pb-4 border-b border-slate-700/50">
                  <SheetTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="size-5 text-indigo-400" />
                    Add New Guest
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    Generate a personalized wedding invitation
                  </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-6 px-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                      Guest Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      className="w-full bg-slate-800/50 border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                      placeholder="Amharic or English name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                      Phone Number <span className="text-slate-600">(Optional)</span>
                    </label>
                    <Input
                      type="tel"
                      className="w-full bg-slate-800/50 border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                      placeholder="+251..."
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Shield className="size-5 text-indigo-400" />
                </div>
                <div>
                  <Label htmlFor="admin-switch" className="font-medium text-white cursor-pointer">
                    Mark as Admin
                  </Label>
                  <p className="text-xs text-slate-400">This guest will have admin privileges</p>
                </div>
              </div>
              <Switch
                id="admin-switch"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAdmin: checked }))}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

                  <motion.button
                    whileTap={tapAnimation}
                    disabled={isLoading || !formData.fullName.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white py-4 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="size-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Generate Invitation
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <ChevronDown className="size-4" />
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>

      {/* Edit Guest Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="bg-slate-900 border-slate-700/50 rounded-t-3xl max-h-[85vh] lg:max-h-none lg:rounded-none lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[400px] lg:rounded-l-3xl"
        >
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SheetHeader className="pb-4 border-b border-slate-700/50">
              <SheetTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Edit2 className="size-5 text-indigo-400" />
                Edit Guest
              </SheetTitle>
              <SheetDescription className="text-slate-400">
                Update guest information
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleEditSubmit} className="space-y-5 pt-6 px-1">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Guest Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  required
                  className="w-full bg-slate-800/50 border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                  placeholder="Amharic or English name"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Phone Number <span className="text-slate-600">(Optional)</span>
                </label>
                <Input
                  type="tel"
                  className="w-full bg-slate-800/50 border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
                  placeholder="+251..."
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                />
              </div>
               <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
               <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Shield className="size-5 text-indigo-400" />
                </div>
                <div>
                  <Label htmlFor="admin-switch" className="font-medium text-white cursor-pointer">
                    Mark as Admin
                  </Label>
                  <p className="text-xs text-slate-400">This guest will have admin privileges</p>
                </div>
              </div>
                <Switch
                  id="edit-admin-switch"
                  checked={editFormData.isAdmin}
                  onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isAdmin: checked }))}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <motion.button
                whileTap={tapAnimation}
                disabled={isLoading || !editFormData.fullName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white py-4 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="size-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    Update Guest
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => setIsEditSheetOpen(false)}
                className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <ChevronDown className="size-4" />
                Cancel
              </button>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
