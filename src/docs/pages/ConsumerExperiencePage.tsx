import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConsumerNavigation } from "./consumer/ConsumerNavigation";
import { AIChatSection } from "./consumer/AIChatSection";
import { AccountsSection } from "./consumer/AccountsSection";
import { MessageCenterWidget } from "./consumer/MessageCenterWidget";
import { QuickLinksSection } from "./consumer/QuickLinksSection";
import { TransactionsAndLinks } from "./consumer/TransactionsAndLinks";
import { InfoCardsSection } from "./consumer/InfoCardsSection";
import { QuickViewSection } from "./consumer/QuickViewSection";
import { PromoBanner } from "./consumer/PromoBanner";
import { ConsumerFooter } from "./consumer/Footer";
import { ModeSelector } from "./consumer/reimburse/components";
import { ReimburseModal } from "./consumer/reimburse/components/ReimburseModal";
import { useReimbursement } from "./consumer/reimburse/ReimbursementContext";
import { getFlowById } from "./consumer/reimburse/flow/registry";

/**
 * Consumer Experience Page
 * 
 * Standalone page showcasing consumer-facing features:
 * - Custom navigation header (bypasses DocsLayout)
 * - AI-powered chat interface
 * - Account management (HSA/FSA)
 * - Message Center widget
 * - Tasks and transactions
 * - Quick links and info cards
 * - Data visualization charts
 * - Promotional banner
 * 
 * This page demonstrates a complete consumer experience
 * using WEX Design System components with mock data.
 */
export default function ConsumerExperiencePage({
  disableModal = false,
}: {
  disableModal?: boolean;
} = {}) {
  const { state } = useReimbursement();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  // Check if we should use modal mode
  const isModalMode = state.layoutModes.entryMode === "modal" && !disableModal;

  // Check if we're on a reimbursement route
  const isReimburseRoute = location.pathname.startsWith("/reimburse");

  // Keep modal open when navigating between reimbursement pages in modal mode
  useEffect(() => {
    if (isModalMode && isReimburseRoute) {
      setModalOpen(true);
    } else if (isModalMode && !isReimburseRoute) {
      setModalOpen(false);
    }
  }, [isModalMode, isReimburseRoute]);

  // Handler for Reimburse Myself buttons
  const handleReimburseClick = () => {
    const activeFlow = getFlowById(state.flowId);
    const firstPath = activeFlow.steps.find((step) => step.path)?.path ?? "/reimburse";
    if (isModalMode) {
      navigate(firstPath);
      setModalOpen(true);
    } else {
      navigate(firstPath);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      {/* Custom Navigation Header */}
      <ConsumerNavigation />

      {/* Main Content */}
      <main className="w-full max-w-[1440px] mx-auto px-8 py-7 space-y-6">
        {/* Welcome Header */}
        <div className="pt-2">
          <h1 className="text-3xl font-display font-semibold text-foreground leading-10">
            Welcome back, Crystal
          </h1>
        </div>

        {/* AI Chat Assistant */}
        <AIChatSection 
          onReimburseClick={handleReimburseClick}
        />

        {/* Accounts Overview */}
        <AccountsSection 
          onReimburseClick={handleReimburseClick}
        />

        {/* Message Center & Quick Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Center - Takes 2 columns */}
          <div className="lg:col-span-2">
            <MessageCenterWidget />
          </div>

        {/* Quick Links - Takes 1 column */}
        <QuickLinksSection 
          onReimburseClick={handleReimburseClick}
        />
        </div>

        {/* Recent Transactions */}
        <TransactionsAndLinks />

        {/* Info Cards Grid */}
        <InfoCardsSection />

        {/* Charts & Quick View */}
        <QuickViewSection />

        {/* Promotional Banner */}
        <PromoBanner />
      </main>

      <ConsumerFooter />

      {/* Layout Mode Selector - Temporary dev tool for prototype layout testing */}
      <ModeSelector />

      {/* Reimburse Modal - Only shown when entryMode is "modal" */}
      {isModalMode && (
        <ReimburseModal open={modalOpen} onOpenChange={setModalOpen} />
      )}
    </div>
  );
}
