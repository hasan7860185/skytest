import { useTranslation } from "react-i18next";
import { AITextTab } from "./AITextTab";
import { cn } from "@/lib/utils";

interface AITabsProps {
  prompt: string;
  result: string;
  isTyping: boolean;
  isLoading: boolean;
  error?: string;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function AITabs({
  prompt,
  result,
  isTyping,
  isLoading,
  error,
  onPromptChange,
  onSubmit
}: AITabsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="w-full">
      <AITextTab
        prompt={prompt}
        result={result}
        isTyping={isTyping}
        isLoading={isLoading}
        error={error}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}