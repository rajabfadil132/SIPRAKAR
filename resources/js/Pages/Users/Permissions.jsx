import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useState } from "react";

function Toggle({ checked, disabled, onChange }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-[#6870fa]" : "bg-[#29314b]"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            aria-pressed={checked}
        >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`} />
        </button>
    );
}

export default function Permissions({ roles = [], groups = {} }) {
    const [selectedId, setSelectedId] = useState(roles[0]?.id ?? null);
    const selected = roles.find((role) => role.id === Number(selectedId)) ?? roles[0];
    const [maps, setMaps] = useState(() => Object.fromEntries(roles.map((role) => [role.id, role.permissions ?? {}])));

    const setPermission = (roleId, key) => {
        setMaps((current) => ({
            ...current,
            [roleId]: {
                ...(current[roleId] ?? {}),
                [key]: !(current[roleId]?.[key] ?? false),
            },
        }));
    };

    const save = () => {
        if (!selected) return;
        router.put(`/role-permissions/${selected.id}`, { permissions: maps[selected.id] ?? {} }, { preserveScroll: true });
    };

    return (
        <AppLayout title="Hak Akses Role">
            <p className="mb-6 text-sm text-slate-500">Atur menu yang ditampilkan dan aksi yang dapat dilakukan setiap role. Halaman ini hanya bisa diubah oleh Admin dan Superadmin.</p>
            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
                <div className="page-card h-fit space-y-2">
                    {roles.map((role) => (
                        <button key={role.id} type="button" onClick={() => setSelectedId(role.id)} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${selected?.id === role.id ? "bg-[#6870fa] text-white" : "bg-[#141b2d] text-[#e0e0e0] hover:bg-white/10"}`}>
                            {role.nama_role}
                            {role.locked && <span className="ml-2 text-xs font-semibold text-[#4cceac]">selalu aktif</span>}
                        </button>
                    ))}
                </div>
                <div className="page-card">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div><h2 className="text-xl font-black">{selected?.nama_role}</h2><p className="text-sm text-slate-500">Toggle aktif berarti menu/aksi tersedia untuk role ini.</p></div>
                        <button type="button" className="btn-primary" onClick={save} disabled={!selected || selected.locked}><Save size={16} className="mr-2" />Simpan Hak Akses</button>
                    </div>
                    <div className="space-y-5">
                        {Object.entries(groups).map(([groupKey, group]) => (
                            <div key={groupKey} className="rounded-2xl border border-[#29314b] bg-[#141b2d] p-4">
                                <h3 className="mb-3 font-bold">{group.label}</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {Object.entries(group.permissions).map(([key, label]) => (
                                        <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-[#29314b] bg-[#1F2A40] px-4 py-3">
                                            <div><b className="text-sm">{label}</b><p className="text-xs text-slate-500">{key}</p></div>
                                            <Toggle checked={Boolean(maps[selected?.id]?.[key])} disabled={!selected || selected.locked} onChange={() => setPermission(selected.id, key)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
