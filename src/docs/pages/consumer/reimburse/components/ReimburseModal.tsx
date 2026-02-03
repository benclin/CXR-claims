import { useLocation } from "react-router-dom";
import { WexDialog } from "@/components/wex";
import ReimburseMyself from "../ReimburseMyself";
import ReimburseWizard from "../ReimburseWizard";
import ReimburseWizardSuccess from "../ReimburseWizardSuccess";
import ReimburseDocs from "../ReimburseDocs";
import ReimburseAnalyze from "../ReimburseAnalyze";
import ReimburseReview from "../ReimburseReview";
import ReimburseConfirm from "../ReimburseConfirm";

/**
 * ReimburseModal Component
 * 
 * Renders the Reimburse Myself flow as a modal overlay on the homepage.
 * Handles all pages in the reimbursement flow.
 */
export function ReimburseModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const location = useLocation();
  const handleClose = () => {
    onOpenChange(false);
  };

  // Determine which page to render based on the route
  const renderModalContent = () => {
    const path = location.pathname;
    
    if (path === "/reimburse" || path === "/reimburse/") {
      return <ReimburseMyself skipEntryWrapper={true} onModalClose={handleClose} />;
    }

    if (path === "/reimburse/wizard") {
      return <ReimburseWizard skipEntryWrapper={true} onModalClose={handleClose} />;
    }

    if (path === "/reimburse/wizard/success") {
      return <ReimburseWizardSuccess skipEntryWrapper={true} onModalClose={handleClose} />;
    }
    
    if (path === "/reimburse/docs") {
      return <ReimburseDocs onModalClose={handleClose} />;
    }
    
    if (path === "/reimburse/analyze") {
      return <ReimburseAnalyze onModalClose={handleClose} />;
    }
    
    if (path === "/reimburse/review") {
      return <ReimburseReview onModalClose={handleClose} />;
    }
    
    if (path === "/reimburse/confirm") {
      return <ReimburseConfirm onModalClose={handleClose} />;
    }
    
    // Default to first page
    return <ReimburseMyself skipEntryWrapper={true} onModalClose={handleClose} />;
  };

  return (
    <WexDialog open={open} onOpenChange={onOpenChange}>
      <WexDialog.Content 
        className="max-w-[1376px] w-[calc(100%-4rem)] max-h-[90vh] overflow-y-auto p-0"
        size="xl"
      >
        {renderModalContent()}
      </WexDialog.Content>
    </WexDialog>
  );
}

