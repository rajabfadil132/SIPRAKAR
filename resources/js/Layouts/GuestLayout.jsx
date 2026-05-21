export default function GuestLayout({ children }) {
    return (
        <div className="siprakar-auth-theme min-h-screen bg-[#141b2d] px-4 py-8 text-[#e0e0e0] sm:flex sm:items-center sm:justify-center">
            <div className="w-full max-w-md rounded-2xl border border-[#29314b] bg-[#1F2A40] p-6 shadow-2xl shadow-black/20">
                <div className="mb-6 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#6870fa] text-xl font-black text-white shadow-lg shadow-[#6870fa]/20">SP</div>
                    <h1 className="mt-4 text-2xl font-black tracking-wide text-[#e0e0e0]">SIPRAKAR</h1>
                    <p className="text-sm font-semibold text-[#4cceac]">Sistem Management Program Kerja Sarana Prasarana</p>
                </div>
                {children}
            </div>
        </div>
    );
}
