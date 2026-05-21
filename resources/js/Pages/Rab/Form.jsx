import AppLayout from "@/Layouts/AppLayout";
import AuditInfo from "@/Components/AuditInfo";
import { Link, router, useForm } from "@inertiajs/react";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

const rupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
const dateValue = (value) => value?.slice?.(0, 10) ?? "";

export default function Form({ item, pekerjaans = [], pekerjaan_id }) {
    const isEdit = Boolean(item?.id);
    const [editingItem, setEditingItem] = useState(null);
    const form = useForm({
        pekerjaan_id: item?.pekerjaan_id ?? pekerjaan_id ?? "",
        tanggal_rab: dateValue(item?.tanggal_rab),
        status_rab: item?.status_rab ?? "Belum diajukan",
        catatan: item?.catatan ?? "",
    });
    const itemForm = useForm({
        nama_item: "",
        spesifikasi: "",
        volume: 1,
        satuan: "unit",
        harga_satuan: 0,
        keterangan: "",
    });
    const submit = (e) => {
        e.preventDefault();
        isEdit ? form.put(`/rab/${item.id}`) : form.post("/rab");
    };
    const resetItem = () => {
        setEditingItem(null);
        itemForm.setData({
            nama_item: "",
            spesifikasi: "",
            volume: 1,
            satuan: "unit",
            harga_satuan: 0,
            keterangan: "",
        });
    };
    const saveItem = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: resetItem };
        editingItem
            ? itemForm.put(`/rab-items/${editingItem.id}`, options)
            : itemForm.post(`/rab/${item.id}/items`, options);
    };
    const editItem = (detail) => {
        setEditingItem(detail);
        itemForm.setData({
            nama_item: detail.nama_item ?? "",
            spesifikasi: detail.spesifikasi ?? "",
            volume: detail.volume ?? 1,
            satuan: detail.satuan ?? "unit",
            harga_satuan: detail.harga_satuan ?? 0,
            keterangan: detail.keterangan ?? "",
        });
    };

    return (
        <AppLayout title={isEdit ? "Detail RAB" : "Tambah RAB"}>
            <form
                onSubmit={submit}
                className="page-card grid gap-4 md:grid-cols-2"
            >
                <label>
                    Pekerjaan tanpa RAB
                    <select
                        className="input mt-1"
                        disabled={isEdit}
                        value={form.data.pekerjaan_id}
                        onChange={(e) =>
                            form.setData("pekerjaan_id", e.target.value)
                        }
                        required
                    >
                        <option value="">Pilih pekerjaan berlabel Tanpa RAB</option>
                        {pekerjaans.map((x) => (
                            <option value={x.id} key={x.id}>
                                {x.kode_pekerjaan} - {x.nama_pekerjaan} · Tanpa RAB
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Tanggal RAB
                    <input
                        className="input mt-1"
                        type="date"
                        value={form.data.tanggal_rab}
                        onChange={(e) =>
                            form.setData("tanggal_rab", e.target.value)
                        }
                    />
                </label>
                <label>
                    Status
                    <select
                        className="input mt-1"
                        value={form.data.status_rab}
                        onChange={(e) =>
                            form.setData("status_rab", e.target.value)
                        }
                    >
                        <option>Belum diajukan</option>
                        <option>Diajukan</option>
                        <option>Disetujui</option>
                        <option>Ditolak</option>
                        <option>Direvisi</option>
                    </select>
                </label>
                <label>
                    Catatan
                    <input
                        className="input mt-1"
                        value={form.data.catatan}
                        onChange={(e) =>
                            form.setData("catatan", e.target.value)
                        }
                    />
                </label>
                {isEdit && (
                    <div className="md:col-span-2">
                        <AuditInfo item={item} />
                    </div>
                )}
                <div className="md:col-span-2 flex justify-end gap-2">
                    <Link href="/pekerjaan" className="btn-light">
                        Kembali
                    </Link>
                    <button className="btn-primary" disabled={form.processing}>
                        Simpan RAB
                    </button>
                </div>
            </form>
            {isEdit && (
                <div className="mt-6 page-card">
                    <h2 className="mb-4 font-bold">Item RAB</h2>
                    <form
                        onSubmit={saveItem}
                        className="mb-4 grid gap-3 md:grid-cols-6"
                    >
                        <input
                            className="input md:col-span-2"
                            placeholder="Nama item"
                            value={itemForm.data.nama_item}
                            onChange={(e) =>
                                itemForm.setData("nama_item", e.target.value)
                            }
                            required
                        />
                        <input
                            className="input"
                            placeholder="Volume"
                            type="number"
                            step="0.01"
                            value={itemForm.data.volume}
                            onChange={(e) =>
                                itemForm.setData("volume", e.target.value)
                            }
                            required
                        />
                        <input
                            className="input"
                            placeholder="Satuan"
                            value={itemForm.data.satuan}
                            onChange={(e) =>
                                itemForm.setData("satuan", e.target.value)
                            }
                        />
                        <input
                            className="input"
                            placeholder="Harga satuan"
                            type="number"
                            step="0.01"
                            value={itemForm.data.harga_satuan}
                            onChange={(e) =>
                                itemForm.setData("harga_satuan", e.target.value)
                            }
                            required
                        />
                        <button className="btn-primary justify-center">
                            {editingItem ? "Update" : "Tambah"}
                        </button>
                        <input
                            className="input md:col-span-3"
                            placeholder="Spesifikasi"
                            value={itemForm.data.spesifikasi}
                            onChange={(e) =>
                                itemForm.setData("spesifikasi", e.target.value)
                            }
                        />
                        <input
                            className="input md:col-span-3"
                            placeholder="Keterangan"
                            value={itemForm.data.keterangan}
                            onChange={(e) =>
                                itemForm.setData("keterangan", e.target.value)
                            }
                        />
                        {editingItem && (
                            <button
                                type="button"
                                className="btn-light md:col-span-6 justify-center"
                                onClick={resetItem}
                            >
                                Batal edit item
                            </button>
                        )}
                    </form>
                    <div className="table-shell">
                        <table className="data-table min-w-[900px]">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th className="w-28 text-right">Volume</th>
                                    <th className="w-36 text-right">Harga</th>
                                    <th className="w-36 text-right">
                                        Subtotal
                                    </th>
                                    <th className="w-24 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.details?.map((d) => (
                                    <tr key={d.id}>
                                        <td>
                                            <b>{d.nama_item}</b>
                                            <p className="text-xs text-slate-500">
                                                {d.spesifikasi ?? "-"}
                                            </p>
                                        </td>
                                        <td className="text-right">
                                            {d.volume} {d.satuan}
                                        </td>
                                        <td className="text-right">
                                            {rupiah(d.harga_satuan)}
                                        </td>
                                        <td className="text-right font-semibold">
                                            {rupiah(d.subtotal)}
                                        </td>
                                        <td className="text-right">
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className="icon-btn"
                                                    onClick={() => editItem(d)}
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="icon-btn-danger"
                                                    onClick={() =>
                                                        confirm(
                                                            "Hapus item ini?",
                                                        ) &&
                                                        router.delete(
                                                            `/rab-items/${d.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 rounded-2xl border border-[#29314b] bg-[#141b2d] px-4 py-3 text-left">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total RAB</p>
                        <b className="table-currency block text-lg text-[#4cceac] sm:text-xl">{rupiah(item.total_rab)}</b>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
