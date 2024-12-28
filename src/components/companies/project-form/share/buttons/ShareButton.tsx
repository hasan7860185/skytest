import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  className?: string;
  disabled?: boolean;
}

export function ShareButton({
  onClick,
  icon: Icon,
  title,
  iconColor,
  className,
  disabled
}: ShareButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      variant="outline"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap",
        "max-w-full min-w-0",
        isMobile ? "w-full" : "w-[120px]",
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
      <span className="hidden sm:inline overflow-hidden text-ellipsis">{title}</span>
    </Button>
  );
}