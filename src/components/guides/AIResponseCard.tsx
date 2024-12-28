import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, Eye, EyeOff } from "lucide-react";

interface AIResponseCardProps {
  response: string;
  isRTL: boolean;
}

export function AIResponseCard({ response, isRTL }: AIResponseCardProps) {
  const [fontSize, setFontSize] = useState<number>(16);
  const [isVisible, setIsVisible] = useState(true);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card className="mt-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-0 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex justify-end gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            className="h-8 w-8"
            title={isVisible ? 'إخفاء النص' : 'إظهار النص'}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseFontSize}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseFontSize}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        {isVisible && (
          <p 
            className={cn(
              "text-sm whitespace-pre-wrap transition-all duration-300",
              isRTL && "font-cairo text-right"
            )}
            style={{ fontSize: `${fontSize}px` }}
          >
            {response}
          </p>
        )}
      </CardContent>
    </Card>
  );
}