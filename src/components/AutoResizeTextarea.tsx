import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxHeight?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  (
    {
      value,
      minRows = 3,
      maxHeight,
      className = '',
      onChange,
      onInput,
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const adjustHeight = () => {
      const el = internalRef.current;
      if (!el) return;
      // Reset height to auto to allow shrinking if content is removed
      el.style.height = 'auto';
      const newHeight = el.scrollHeight;

      if (maxHeight && newHeight > maxHeight) {
        el.style.height = `${maxHeight}px`;
        el.style.overflowY = 'auto';
      } else {
        el.style.height = `${Math.max(newHeight, minRows * 26)}px`;
        el.style.overflowY = 'hidden';
      }
    };

    useEffect(() => {
      adjustHeight();
      // Handle tab-switch or modal-mount rendering phase
      const raf = requestAnimationFrame(() => adjustHeight());
      const timeout = setTimeout(() => adjustHeight(), 60);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timeout);
      };
    }, [value]);

    return (
      <textarea
        ref={internalRef}
        value={value}
        rows={minRows}
        onInput={(e) => {
          adjustHeight();
          onInput?.(e);
        }}
        onChange={(e) => {
          adjustHeight();
          onChange?.(e);
        }}
        style={{
          boxSizing: 'border-box',
          ...style,
        }}
        className={`w-full transition-[height] duration-75 resize-y leading-relaxed ${className}`}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

