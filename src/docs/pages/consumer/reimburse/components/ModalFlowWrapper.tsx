import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReimburseModal } from "./ReimburseModal";
import { useReimbursement } from "../ReimbursementContext";
import ConsumerExperiencePage from "../../../ConsumerExperiencePage";

/**
 * ModalFlowWrapper Component
 * 
 * Wraps reimbursement flow pages to ensure the homepage stays visible
 * in the background when in modal mode.
 */
export function ModalFlowWrapper({ children }: { children: React.ReactNode }) {
  const { state } = useReimbursement();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const isModalMode = state.layoutModes.entryMode === "modal";
  const isReimburseRoute = location.pathname.startsWith("/reimburse");

  // Keep modal open when on reimbursement routes in modal mode
  useEffect(() => {
    if (isModalMode && isReimburseRoute) {
      setModalOpen(true);
    } else if (isModalMode && !isReimburseRoute) {
      setModalOpen(false);
    }
  }, [isModalMode, isReimburseRoute]);

  // Handle modal close - navigate back to homepage when modal closes
  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open && isReimburseRoute) {
      // When modal closes, navigate back to homepage
      navigate("/", { replace: true });
    }
  };

  // In modal mode, show homepage in background with modal overlay
  if (isModalMode && isReimburseRoute) {
    return (
      <>
        {/* Render homepage in background (disable its modal to avoid conflicts) */}
        {/* Only disable pointer events when modal is actually open */}
        <div style={{ pointerEvents: modalOpen ? "none" : "auto" }}>
          <ConsumerExperiencePage disableModal={true} />
        </div>
        {/* Modal overlay */}
        <ReimburseModal open={modalOpen} onOpenChange={handleModalClose} />
      </>
    );
  }

  // In fullpage mode, render children normally
  return <>{children}</>;
}

