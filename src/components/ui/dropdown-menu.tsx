import * as React from "react"
import { cn } from "@/utils/cn"

/**
 * Simple dropdown menu implementation without external dependencies
 * This is a basic implementation for MVP - can be replaced with Radix UI later
 */

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  inset?: boolean;
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, asChild, className, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        ref,
        onClick: handleClick,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, align = 'end', className, ...props }, ref) => {
    const { isOpen } = React.useContext(DropdownMenuContext);

    if (!isOpen) return null;

    const alignmentClasses = {
      start: 'left-0',
      center: 'left-1/2 transform -translate-x-1/2',
      end: 'right-0',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          alignmentClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ children, onClick, className, inset, ...props }, ref) => {
    const { setIsOpen } = React.useContext(DropdownMenuContext);

    const handleClick = () => {
      onClick?.();
      setIsOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          inset && "pl-8",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

// Placeholder components for future expansion
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (props, ref) => <DropdownMenuItem ref={ref} {...props} />
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (props, ref) => <DropdownMenuContent ref={ref} {...props} />
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (props, ref) => <DropdownMenuItem ref={ref} {...props} />
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (props, ref) => <DropdownMenuItem ref={ref} {...props} />
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ children, className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
