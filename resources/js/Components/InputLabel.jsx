export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold text-[#e0e0e0] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
