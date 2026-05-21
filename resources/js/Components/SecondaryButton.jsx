export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-[#29314b] bg-[#1F2A40] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#e0e0e0] shadow-sm transition duration-150 ease-in-out hover:border-[#6870fa] hover:text-[#868dfb] focus:outline-none focus:ring-2 focus:ring-[#868dfb] focus:ring-offset-2 focus:ring-offset-[#141b2d] disabled:opacity-60 ${
                    disabled && 'opacity-60'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
