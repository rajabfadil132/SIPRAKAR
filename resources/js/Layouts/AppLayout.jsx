import { Link, router, usePage } from "@inertiajs/react";
import { formatDate } from "@/Utils/date";
import {
    Bell,
    CalendarCheck,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Database,
    Edit3,
    FileSpreadsheet,
    FileText,
    Gauge,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    ShieldCheck,
    Sun,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const baseMenu = [
    { label: "Dashboard", href: "/dashboard", icon: Gauge, permission: "dashboard.view" },
    { label: "Data", section: true },
    {
        label: "Perencanaan",
        icon: CalendarCheck,
        children: [
            { label: "Program Kerja", href: "/program-kerja", icon: CalendarCheck, permission: "program_kerja.view" },
            { label: "Data Pekerjaan", href: "/pekerjaan", icon: ClipboardList, permission: "pekerjaan.view" },
        ],
    },
    {
        label: "Monitoring",
        icon: Wrench,
        children: [
            { label: "RAB Pekerjaan", href: "/rab", icon: FileSpreadsheet, permission: "rab.view" },
            { label: "Laporan & Statistik", href: "/reports", icon: FileText, permission: "reports.view" },
        ],
    },
    { label: "Administrasi", section: true },
    {
        label: "Pengaturan Sistem",
        icon: Settings,
        children: [
            { label: "Master Data", href: "/master-data", icon: Database, permission: "master_data.view" },
            { label: "User Management", href: "/users-management", icon: Users, permission: "users.view" },
            { label: "Hak Akses Role", href: "/role-permissions", icon: ShieldCheck, adminOnly: true },
        ],
    },
];

const moduleSearchTarget = (current, permissions = {}) => {
    if (current.startsWith("/program-kerja") && permissions["program_kerja.view"]) return "/program-kerja";
    if (current.startsWith("/reports") && permissions["reports.view"]) return "/reports";
    if (current.startsWith("/users-management") && permissions["users.view"]) return "/users-management";
    if (current.startsWith("/rab") && permissions["rab.view"]) return "/rab";
    if (permissions["pekerjaan.view"]) return "/pekerjaan";
    if (permissions["program_kerja.view"]) return "/program-kerja";
    return "/dashboard";
};

function canSee(item, permissions = {}, isAdmin = false) {
    if (item.adminOnly && !isAdmin) return false;
    if (item.permission && !permissions[item.permission]) return false;
    if (item.children) return item.children.some((child) => canSee(child, permissions, isAdmin));
    return true;
}

function isActive(current, item) {
    if (item.href) return current === item.href || current.startsWith(`${item.href}/`);
    return item.children?.some((child) => current === child.href || current.startsWith(`${child.href}/`));
}

function MenuItem({ item, current, isAdmin, permissions, isCollapsed, closeMobile }) {
    const visibleChildren = item.children?.filter((child) => canSee(child, permissions, isAdmin)) ?? [];
    const [open, setOpen] = useState(() => isActive(current, item));

    if (!canSee(item, permissions, isAdmin)) return null;

    if (item.section) {
        const nextItems = baseMenu.slice(baseMenu.findIndex((candidate) => candidate.label === item.label) + 1);
        const hasAny = nextItems.some((candidate) => !candidate.section && canSee(candidate, permissions, isAdmin));
        if (!hasAny) return null;
        if (isCollapsed) return <div className="my-3 h-px bg-white/10" />;
        return <p className="mb-2 mt-5 px-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a3a3a3]">{item.label}</p>;
    }

    const Icon = item.icon;

    if (visibleChildren.length > 0) {
        const active = isActive(current, item);
        const firstChild = visibleChildren[0];

        if (isCollapsed && firstChild?.href) {
            return (
                <Link
                    href={firstChild.href}
                    onClick={closeMobile}
                    title={`${item.label}: ${firstChild.label}`}
                    className={`group flex items-center justify-center rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#6870fa]/20 text-[#868dfb]" : "text-[#e0e0e0] hover:bg-white/10 hover:text-[#868dfb]"}`}
                >
                    <Icon size={20} className="shrink-0" />
                </Link>
            );
        }

        return (
            <div>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#6870fa]/20 text-[#868dfb]" : "text-[#e0e0e0] hover:bg-white/10 hover:text-[#868dfb]"}`}
                    title={item.label}
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <Icon size={20} className="shrink-0" />
                        <span className="truncate font-semibold">{item.label}</span>
                    </span>
                    {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {open && (
                    <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {visibleChildren.map((child) => (
                            <MenuItem key={child.href} item={child} current={current} isAdmin={isAdmin} permissions={permissions} isCollapsed={false} closeMobile={closeMobile} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const active = isActive(current, item);
    return (
        <Link
            href={item.href}
            onClick={closeMobile}
            title={item.label}
            className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#6870fa]/20 text-[#868dfb]" : "text-[#e0e0e0] hover:bg-white/10 hover:text-[#868dfb]"}`}
        >
            <span className="flex min-w-0 items-center gap-3">
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate font-semibold">{item.label}</span>}
            </span>
        </Link>
    );
}

function SidebarContent({ current, isAdmin, permissions, isCollapsed, closeMobile, onToggleCollapse, onMobileClose }) {
    return (
        <div className="flex h-full flex-col bg-[#1F2A40] text-white shadow-2xl">
            <div className={`flex h-20 shrink-0 items-center gap-3 border-b border-[#29314b] ${isCollapsed ? "justify-center px-3" : "justify-between px-4"}`}>
                <Brand collapsed={isCollapsed} />
                {onToggleCollapse ? (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#29314b] bg-[#141b2d] text-[#e0e0e0] transition hover:border-[#6870fa] hover:text-[#4cceac]"
                        aria-label={isCollapsed ? "Buka sidebar" : "Ciutkan sidebar"}
                        aria-expanded={!isCollapsed}
                        title={isCollapsed ? "Buka sidebar" : "Ciutkan sidebar"}
                    >
                        <Menu size={20} />
                    </button>
                ) : (
                    <button type="button" onClick={onMobileClose} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#29314b] bg-white/10 text-white" aria-label="Tutup menu">
                        <X size={18} />
                    </button>
                )}
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4 pt-4">
                {baseMenu.map((item) => (
                    <MenuItem key={item.label} item={item} current={current} isAdmin={isAdmin} permissions={permissions} isCollapsed={isCollapsed} closeMobile={closeMobile} />
                ))}
            </nav>
        </div>
    );
}

function Brand({ collapsed = false }) {
    if (collapsed) return null;

    return (
        <Link href="/dashboard" className="flex min-w-0 shrink-0 items-center gap-3 rounded-2xl transition hover:opacity-90" title="SIPRAKAR Dashboard">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#6870fa] text-lg font-black text-white shadow-lg shadow-[#6870fa]/20">SP</div>
            <div className="min-w-0">
                <div className="truncate text-xl font-black tracking-wide text-[#e0e0e0]">SIPRAKAR</div>
                <div className="truncate text-[11px] font-semibold text-[#4cceac]">Sistem Program Kerja</div>
            </div>
        </Link>
    );
}

function ProfileMenu({ auth, initials, theme, setTheme }) {
    const [open, setOpen] = useState(false);
    const isLight = theme === "light";
    const roleLabel = auth?.user?.role?.nama_role ?? "User";

    const changeTheme = () => {
        const nextTheme = isLight ? "dark" : "light";
        setTheme(nextTheme);
        if (typeof window !== "undefined") window.localStorage.setItem("siprakar-theme", nextTheme);
    };

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-3 rounded-xl bg-[#1F2A40] px-3 py-2 text-left transition hover:ring-2 hover:ring-[#6870fa]/40" aria-haspopup="menu" aria-expanded={open}>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#6870fa] text-xs font-black text-white">{initials}</div>
                <div className="hidden min-w-0 leading-tight md:block">
                    <b className="block max-w-40 truncate text-sm text-[#e0e0e0]">{auth?.user?.name ?? "User"}</b>
                    <span className="block text-xs font-semibold text-[#4cceac]">{roleLabel}</span>
                </div>
                <ChevronDown size={16} className="hidden text-[#a3a3a3] sm:block" />
            </button>

            {open && (
                <>
                    <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Tutup menu profil" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-[#29314b] bg-[#1F2A40] text-[#e0e0e0] shadow-2xl" role="menu">
                        <div className="border-b border-[#29314b] px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#6870fa] text-sm font-black text-white">{initials}</div>
                                <div className="min-w-0">
                                    <b className="block truncate text-base">{auth?.user?.name ?? "User"}</b>
                                    <p className="truncate text-xs text-[#a3a3a3]">{auth?.user?.email ?? "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <Link href="/profile" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-[#141b2d] hover:text-[#4cceac]" onClick={() => setOpen(false)}>
                                <Edit3 size={17} />
                                Edit Profile
                            </Link>
                            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#141b2d] hover:text-[#4cceac]" onClick={changeTheme}>
                                {isLight ? <Moon size={17} /> : <Sun size={17} />}
                                {isLight ? "Gunakan Mode Dark" : "Gunakan Mode Light"}
                            </button>
                            <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10">
                                <LogOut size={17} />
                                Log Out
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Toast({ flash }) {
    const [visible, setVisible] = useState(Boolean(flash?.success || flash?.error || flash?.warning));
    const message = flash?.success || flash?.error || flash?.warning;
    const tone = flash?.error ? "border-red-500/40 bg-red-950/90 text-red-100" : flash?.warning ? "border-amber-500/40 bg-amber-950/90 text-amber-100" : "border-emerald-500/40 bg-emerald-950/90 text-emerald-100";

    useEffect(() => {
        setVisible(Boolean(message));
        if (!message) return undefined;
        const timer = setTimeout(() => setVisible(false), 4200);
        return () => clearTimeout(timer);
    }, [message]);

    if (!visible || !message) return null;

    return (
        <div className={`fixed right-5 top-24 z-[70] max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${tone}`}>
            <div className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-current" />
                <p className="flex-1">{message}</p>
                <button type="button" onClick={() => setVisible(false)} className="opacity-70 hover:opacity-100"><X size={16} /></button>
            </div>
        </div>
    );
}

const notificationStorageKey = "siprakar-read-notifications";

const notificationKey = (item) => [item.type, item.id, item.time ?? item.status ?? item.progress ?? ""].join("-");

const notificationTone = (type = "") => {
    const value = type.toLowerCase();
    if (value.includes("deadline")) return "bg-red-500/15 text-red-300";
    if (value.includes("selesai")) return "bg-emerald-500/15 text-emerald-300";
    if (value.includes("diperbarui")) return "bg-amber-500/15 text-amber-300";
    if (value.includes("diajukan")) return "bg-sky-500/15 text-sky-300";
    return "bg-indigo-500/15 text-indigo-300";
};

function NotificationMenu({ notifications }) {
    const [open, setOpen] = useState(false);
    const [readKeys, setReadKeys] = useState(() => {
        if (typeof window === "undefined") return [];

        try {
            const stored = window.localStorage.getItem(notificationStorageKey);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });
    const items = notifications?.items ?? [];
    const readSet = useMemo(() => new Set(readKeys), [readKeys]);
    const annotatedItems = useMemo(() => items.map((item) => ({ ...item, notificationKey: notificationKey(item), isRead: readSet.has(notificationKey(item)) })), [items, readSet]);
    const unreadCount = annotatedItems.filter((item) => !item.isRead).length;

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(notificationStorageKey, JSON.stringify(readKeys));
    }, [readKeys]);

    const markAsRead = (item) => {
        setReadKeys((current) => {
            if (current.includes(item.notificationKey)) return current;
            const next = [...current.slice(-60), item.notificationKey];
            if (typeof window !== "undefined") window.localStorage.setItem(notificationStorageKey, JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen((value) => !value)} className="relative rounded-xl bg-[#1F2A40] p-2 text-[#e0e0e0] transition hover:text-[#4cceac]" title="Notifikasi pekerjaan">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#db4f4a] px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            {open && (
                <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-[#29314b] bg-[#1F2A40] shadow-2xl">
                    <div className="border-b border-[#29314b] px-4 py-3">
                        <b>Notifikasi Pekerjaan</b>
                        <p className="text-xs text-[#a3a3a3]">Status terbaru, pengajuan, deadline, dan pekerjaan selesai.</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2">
                        {items.length === 0 && <p className="p-4 text-sm text-[#a3a3a3]">Tidak ada notifikasi aktif.</p>}
                        {annotatedItems.map((item) => (
                            <Link key={item.notificationKey} href={item.href ?? `/pekerjaan/${item.id}`} className="relative block rounded-xl p-3 pr-8 text-sm hover:bg-[#141b2d]" onClick={() => { markAsRead(item); setOpen(false); }}>
                                {!item.isRead && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#db4f4a] shadow-[0_0_0_3px_rgba(219,79,74,0.16)]" aria-label="Belum dibaca" />}
                                <div className="mb-1 flex items-start justify-between gap-3">
                                    <span className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${notificationTone(item.type)}`}>{item.type}</span>
                                    <span className="shrink-0 text-xs font-bold text-[#4cceac]">{item.progress}%</span>
                                </div>
                                <b className="line-clamp-2 text-[#e0e0e0]">{item.title}</b>
                                <p className="mt-1 text-xs text-[#a3a3a3]">{item.message}</p>
                                <p className="mt-1 text-xs text-[#a3a3a3]">Target: {formatDate(item.target_selesai)} · {item.cabang ?? "-"} · {item.status}</p>
                            </Link>
                        ))}
                    </div>
                    <Link href="/pekerjaan" className="block border-t border-[#29314b] px-4 py-3 text-center text-sm font-bold text-[#4cceac]" onClick={() => setOpen(false)}>
                        Lihat semua pekerjaan
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function AppLayout({ title = "Dashboard", children }) {
    const { auth, flash, notifications } = usePage().props;
    const permissions = auth?.permissions ?? {};
    const current = typeof window !== "undefined" ? window.location.pathname : "";
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const isAdmin = Boolean(auth?.isAdmin);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [keyword, setKeyword] = useState(params.get("search") ?? "");
    const [theme, setTheme] = useState(() => (typeof window === "undefined" ? "dark" : window.localStorage.getItem("siprakar-theme") || "dark"));

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.dataset.siprakarTheme = theme;
    }, [theme]);

    const initials = useMemo(() => (auth?.user?.name ?? "User").split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), [auth?.user?.name]);
    const sidebarWidth = isCollapsed ? "lg:w-20" : "lg:w-72";
    const mainPadding = isCollapsed ? "lg:pl-20" : "lg:pl-72";

    const submitSearch = (event) => {
        event.preventDefault();
        const target = moduleSearchTarget(current, permissions);
        router.get(target, { search: keyword }, { preserveScroll: true, preserveState: false });
    };

    return (
        <div className={`siprakar-admin-theme min-h-screen bg-[#141b2d] text-[#e0e0e0] ${theme === "light" ? "light-mode" : ""}`}>
            <Toast flash={flash} />
            <aside className={`fixed inset-y-0 left-0 z-30 hidden ${sidebarWidth} lg:block`}>
                <SidebarContent current={current} isAdmin={isAdmin} permissions={permissions} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed((value) => !value)} />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Tutup menu" />
                    <aside className="relative h-full w-72">
                        <SidebarContent current={current} isAdmin={isAdmin} permissions={permissions} isCollapsed={false} closeMobile={() => setMobileOpen(false)} onMobileClose={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            <main className={`min-h-screen transition-all ${mainPadding}`}>
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-[#29314b] bg-[#141b2d]/95 px-4 backdrop-blur md:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl border border-[#29314b] bg-[#1F2A40] p-2 text-[#e0e0e0] lg:hidden" aria-label="Buka sidebar">
                            <Menu size={20} />
                        </button>
                        <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 items-center rounded-xl border border-[#29314b] bg-[#1F2A40] px-3 py-2 text-[#e0e0e0] sm:flex">
                            <Search size={18} className="mr-2 shrink-0 text-[#a3a3a3]" />
                            <input className="w-full border-0 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#858585] focus:outline-none focus:ring-0" placeholder="Cari pekerjaan, program, RAB, laporan, atau user..." type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        </form>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 md:gap-3">
                        {permissions["notifications.view"] && <NotificationMenu notifications={notifications} />}
                        <ProfileMenu auth={auth} initials={initials} theme={theme} setTheme={setTheme} />
                    </div>
                </header>

                <section className="app-content px-4 py-6 md:px-6 xl:px-8">
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-wide text-[#e0e0e0]">{title}</h1>
                            <p className="mt-1 text-sm font-semibold text-[#4cceac]">Kelola data sarana prasarana secara terpusat dan terdokumentasi.</p>
                        </div>
                    </div>
                    {children}
                </section>
            </main>
        </div>
    );
}
