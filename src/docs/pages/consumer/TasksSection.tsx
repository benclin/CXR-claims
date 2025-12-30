import { WexCard } from "@/components/wex/wex-card";
import { WexButton } from "@/components/wex/wex-button";
import { WexBadge } from "@/components/wex/wex-badge";
import { ChevronRight } from "lucide-react";
import { tasksData } from "./mockData";

/**
 * Tasks Section Component
 * 
 * Displays pending tasks with:
 * - Section header with task count badge
 * - View All Tasks button
 * - Task items as clickable buttons
 */
export function TasksSection() {
  const pendingCount = tasksData.filter(task => task.isPending).length;

  return (
    <WexCard>
      <WexCard.Content className="p-6">
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-display font-semibold text-foreground">
                Tasks
              </h2>
              {pendingCount > 0 && (
                <WexBadge 
                  intent="destructive"
                  className="rounded-full h-6 w-6 flex items-center justify-center p-0"
                >
                  {pendingCount}
                </WexBadge>
              )}
            </div>
            <WexButton intent="link" size="md">
              View All Tasks
              <ChevronRight className="h-4 w-4" />
            </WexButton>
          </div>

          {/* Task Items */}
          <div className="space-y-2">
            {tasksData.map((task) => (
              <WexButton
                key={task.id}
                intent="outline"
                size="md"
                className="w-full justify-between h-auto py-3 px-4 text-left"
              >
                <span className="text-base">{task.title}</span>
                <ChevronRight className="h-5 w-5 flex-shrink-0 ml-2" />
              </WexButton>
            ))}
          </div>
        </div>
      </WexCard.Content>
    </WexCard>
  );
}

