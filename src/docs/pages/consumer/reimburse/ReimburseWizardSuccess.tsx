import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsumerNavigation } from "../ConsumerNavigation";
import { EntryWrapper, ModeSelector } from "./components";
import { useReimbursement } from "./ReimbursementContext";
import { WexButton, WexCard } from "@/components/wex";

export default function ReimburseWizardSuccess({
  skipEntryWrapper = false,
  onModalClose,
}: {
  skipEntryWrapper?: boolean;
  onModalClose?: () => void;
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState } = useReimbursement();

  const entryMode = searchParams.get("entryMode");
  const mode = entryMode && ["fullpage", "modal", "drawer"].includes(entryMode) ? entryMode : state.layoutModes.entryMode;

  const handleSubmitAnother = () => {
    updateState({
      account: "",
      category: "",
      serviceDate: "",
      amount: "",
      uploadedFiles: [],
    });
    navigate("/reimburse/wizard");
  };

  const handleDone = () => {
    if (onModalClose) {
      onModalClose();
    } else {
      navigate("/");
    }
  };

  const content = (
    <div className="min-h-screen bg-background">
      <ConsumerNavigation />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
        <WexCard>
          <WexCard.Content className="space-y-4 pt-8">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">You’re all set</h2>
              <p className="text-sm text-muted-foreground">
                We’ve received your reimbursement request.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• We’ll review your receipt within 1–2 business days.</li>
              <li>• We’ll notify you if anything is missing.</li>
              <li>• Approved reimbursements post to your account automatically.</li>
            </ul>
            <div className="flex items-center gap-2">
              <WexButton variant="outline" onClick={handleSubmitAnother}>
                Submit another
              </WexButton>
              <WexButton onClick={handleDone}>Done</WexButton>
            </div>
          </WexCard.Content>
        </WexCard>
      </div>
      <ModeSelector />
    </div>
  );

  if (skipEntryWrapper) {
    return content;
  }

  return <EntryWrapper mode={mode as "fullpage" | "modal" | "drawer"}>{content}</EntryWrapper>;
}

