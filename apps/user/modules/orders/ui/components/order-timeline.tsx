"use client";

import { OrderStatus } from "@workspace/types";
import {
  Clock,
  Package,
  ChefHat,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus;
}

const STEPS = [
  { id: "pending", label: "Pending", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: Package },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready", icon: Bell },
  { id: "completed", label: "Completed", icon: CheckCircle },
] as const;

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-500">
        <XCircle className="h-12 w-12 mb-2" />
        <p className="font-semibold text-lg">Order Cancelled</p>
        <p className="text-sm text-muted-foreground">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((step) => step.id === status);

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg scale-110"
                    : "bg-background border-muted text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-orange-100 dark:ring-orange-950/30" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-3 text-xs font-medium transition-colors duration-300 ${
                  isCompleted
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-muted-foreground"
                }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
