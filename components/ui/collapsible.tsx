"use client";

import React, { createContext, useContext, useState } from "react";

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export const Collapsible: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div>{children}</div>
    </CollapsibleContext.Provider>
  );
};

export const CollapsibleTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>> = ({ children }) => {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) return <>{children}</>;
  const toggle = () => ctx.setOpen(!ctx.open);
  // If children is a single element, clone and attach onClick; otherwise render a button
  const child = React.Children.only(children) as React.ReactElement<any> | string;
  if (React.isValidElement(child)) {
    const childEl = child as React.ReactElement<any>;
    // Compose a safe onClick handler that toggles the collapsible.
    // Avoid directly invoking or depending on server-provided functions — only call
    // the child's original onClick if it's a function at runtime.
    const originalOnClick = (childEl.props as any).onClick;
    const safeOnClick = (e: any) => {
      try {
        // Call the original handler only if it's a real function in the browser
        if (typeof originalOnClick === "function") {
          originalOnClick(e);
        }
      } catch (err) {
        // swallow any errors from user handlers to avoid breaking toggle
        // eslint-disable-next-line no-console
        console.error("Error in child onClick:", err);
      }
      toggle();
    };

    return React.cloneElement(childEl, { onClick: safeOnClick });
  }
  return (
    <button onClick={toggle} type="button" className="underline">
      {children}
    </button>
  );
};

export const CollapsibleContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) return <>{children}</>;
  return ctx.open ? <div className={className}>{children}</div> : null;
};

export default Collapsible;
