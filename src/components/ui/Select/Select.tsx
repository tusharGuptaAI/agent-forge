import React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../utils";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const defaultTriggerRef = { current: null } as React.RefObject<HTMLButtonElement | null>;

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: defaultTriggerRef
});

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ children, value, defaultValue, onValueChange }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [open, setOpen] = React.useState(false);
  const controlledValue = value !== undefined ? value : internalValue;
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleChange = (newValue: string) => {
    if (value === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: controlledValue,
        onValueChange: handleChange,
        open,
        setOpen,
        triggerRef
      }}>
      <div data-slot="select" className="relative inline-block">
        {children}
      </div>
    </SelectContext.Provider>);

};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default";
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((r) => {
      if (typeof r === "function") r(node);
      else if (r && typeof r === "object" && "current" in r) {
        (r as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = React.useContext(SelectContext);

    return (
      <button
        ref={mergeRefs(triggerRef, ref)}
        type="button"
        data-slot="select-trigger"
        data-size={size}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          size === "default" ? "h-8" : "h-7 rounded-md",
          className
        )}
        {...props}>
        
        {children}
        <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
      </button>);

  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return (
    <span data-slot="select-value" data-placeholder={!value || undefined} className={cn(!value && "text-muted-foreground")}>
      {value || placeholder}
    </span>);

};

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef } = React.useContext(SelectContext);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 144 });

    const setRefs = (node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const updatePosition = React.useCallback(() => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 144)
      });
    }, [triggerRef]);

    React.useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      const onReposition = () => updatePosition();
      window.addEventListener("scroll", onReposition, true);
      window.addEventListener("resize", onReposition);
      return () => {
        window.removeEventListener("scroll", onReposition, true);
        window.removeEventListener("resize", onReposition);
      };
    }, [open, updatePosition]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node;
        if (triggerRef.current?.contains(t)) return;
        if (contentRef.current?.contains(t)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, setOpen, triggerRef]);

    if (!open) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        ref={setRefs}
        data-slot="select-content"
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          minWidth: coords.width,
          zIndex: 50
        }}
        className={cn(
          "overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10",
          className
        )}
        {...props}>
        {children}
      </div>,
      document.body
    );
  }
);
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        data-slot="select-item"
        role="option"
        aria-selected={isSelected}
        onClick={() => onValueChange?.(itemValue)}
        className={cn(
          "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}>
        
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
          {isSelected && <Check className="size-4" />}
        </span>
        <span>{children}</span>
      </div>);

  }
);
SelectItem.displayName = "SelectItem";

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, ...props }, ref) =>
  <div ref={ref} data-slot="select-group" className={cn("p-1", className)} {...props} />

);
SelectGroup.displayName = "SelectGroup";

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) =>
  <div ref={ref} data-slot="select-label" className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)} {...props} />

);
SelectLabel.displayName = "SelectLabel";

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) =>
  <div ref={ref} data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />

);
SelectSeparator.displayName = "SelectSeparator";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator, SelectValue };