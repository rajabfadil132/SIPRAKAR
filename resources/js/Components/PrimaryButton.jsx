export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#6870fa] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#6870fa]/20 transition duration-150 ease-in-out hover:bg-[#535ac8] focus:bg-[#535ac8] focus:outline-none focus:ring-2 focus:ring-[#868dfb] focus:ring-offset-2 focus:ring-offset-[#141b2d] active:bg-[#3e4396] ${
                    disabled && 'opacity-60'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
