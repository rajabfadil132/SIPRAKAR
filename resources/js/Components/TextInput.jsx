import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-[#29314b] bg-[#141b2d] text-[#e0e0e0] shadow-sm placeholder:text-[#858585] focus:border-[#6870fa] focus:ring-[#6870fa] ' +
                className
            }
            ref={localRef}
        />
    );
});
