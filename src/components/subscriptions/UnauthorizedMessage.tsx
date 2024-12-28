import { Card } from "@/components/ui/card";

interface UnauthorizedMessageProps {
  isRTL: boolean;
}

export function UnauthorizedMessage({ isRTL }: UnauthorizedMessageProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6 text-center text-gray-500">
        {isRTL 
          ? "غير مصرح لك بالوصول إلى هذه الصفحة" 
          : "You are not authorized to access this page"}
      </Card>
    </div>
  );
}