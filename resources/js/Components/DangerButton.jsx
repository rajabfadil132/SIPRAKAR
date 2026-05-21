export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#db4f4a] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#af3f3b] focus:bg-[#af3f3b] focus:outline-none focus:ring-2 focus:ring-[#e2726e] focus:ring-offset-2 focus:ring-offset-[#141b2d] active:bg-[#832f2c] ${
                    disabled && 'opacity-60'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
