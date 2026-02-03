import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { WexDialog, WexDrawer } from "@/components/wex";

/**
 * EntryWrapper Component
 * 
 * Handles different entry modes for the reimbursement flow:
 * - fullpage: Direct render (current behavior)
 * - modal: Wraps in WexDialog
 * - drawer: Wraps in WexDrawer
 */
export function EntryWrapper({
  mode,
  children,
}: {
  mode: "fullpage" | "modal" | "drawer";
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  // For modal/drawer modes, always open when component mounts
  useEffect(() => {
    if (mode !== "fullpage") {
      setOpen(true);
    }
  }, [mode]);

  if (mode === "fullpage") {
    return <>{children}</>;
  }

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(false);
      navigate("/");
    }
  };

  if (mode === "modal") {
    return (
      <WexDialog open={open} onOpenChange={handleClose}>
        <WexDialog.Content 
          className="max-w-[1376px] w-[calc(100%-4rem)] max-h-[90vh] overflow-y-auto p-6"
          size="xl"
        >
          {children}
        </WexDialog.Content>
      </WexDialog>
    );
  }

  // Drawer mode
  return (
    <WexDrawer open={open} onOpenChange={handleClose}>
      <WexDrawer.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <WexDrawer.Header>
          <WexDrawer.Title>Reimburse Myself</WexDrawer.Title>
        </WexDrawer.Header>
        <div className="p-4">
          {children}
        </div>
      </WexDrawer.Content>
    </WexDrawer>
  );
}

