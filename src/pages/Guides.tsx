import { useTranslation } from "react-i18next";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Star, Users, Building, Bot, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGeminiAI } from "@/hooks/useGeminiAI";
import { toast } from "sonner";
import { AIResponseCard } from "@/components/guides/AIResponseCard";

const Guides = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const { generateText, isLoading } = useGeminiAI();

  const guides = [
    {
      title: isRTL ? "دليل المبيعات" : "Sales Guide",
      description: isRTL ? "تعرف على أفضل ممارسات المبيعات وكيفية إغلاق الصفقات" : "Learn about sales best practices and how to close deals",
      icon: Star,
      path: "/guides/sales",
      gradient: "bg-gradient-primary",
      prompt: isRTL ? 
        "قدم لي نصائح مفصلة حول أفضل ممارسات المبيعات العقارية وكيفية إغلاق الصفقات بنجاح. اشرح الخطوات الأساسية والتقنيات المستخدمة." :
        "Provide detailed tips about real estate sales best practices and how to successfully close deals. Explain the key steps and techniques used."
    },
    {
      title: isRTL ? "إدارة العملاء" : "Client Management",
      description: isRTL ? "كيفية إدارة العملاء وبناء علاقات طويلة الأمد" : "How to manage clients and build long-term relationships",
      icon: Users,
      path: "/guides/client-management",
      gradient: "bg-gradient-secondary",
      prompt: isRTL ?
        "اشرح استراتيجيات إدارة علاقات العملاء في مجال العقارات. كيف يمكن بناء وتعزيز العلاقات طويلة الأمد مع العملاء؟" :
        "Explain client relationship management strategies in real estate. How can one build and maintain long-term relationships with clients?"
    },
    {
      title: isRTL ? "إدارة المشاريع" : "Project Management",
      description: isRTL ? "دليل شامل لإدارة المشاريع العقارية" : "Comprehensive guide to real estate project management",
      icon: Building,
      path: "/guides/project-management",
      gradient: "bg-gradient-primary",
      prompt: isRTL ?
        "قدم دليلاً شاملاً حول إدارة المشاريع العقارية. ما هي أهم الجوانب التي يجب مراعاتها وكيف يمكن إدارة المشروع بفعالية؟" :
        "Provide a comprehensive guide on real estate project management. What are the key aspects to consider and how can one effectively manage a project?"
    },
  ];

  const getAIGuidance = async (guide: typeof guides[0]) => {
    setSelectedGuide(guide.title);
    setAiResponse("");
    
    try {
      const response = await generateText(guide.prompt);
      if (response) {
        setAiResponse(response);
        toast.success(isRTL ? "تم توليد الإرشادات بنجاح" : "Guidance generated successfully");
      }
    } catch (error) {
      console.error("Error generating guidance:", error);
      toast.error(isRTL ? "حدث خطأ أثناء توليد الإرشادات" : "Error generating guidance");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <DashboardContent>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className={cn(
              "text-3xl font-bold",
              isRTL && "font-cairo"
            )}>
              {isRTL ? "الأدلة الإرشادية" : "Guides"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <Card 
                key={guide.title}
                className={cn(
                  "relative overflow-hidden h-full",
                  "bg-white dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:shadow-lg transition-all duration-300"
                )}
              >
                <CardHeader className={cn(
                  "relative",
                  guide.gradient
                )}>
                  <div className="flex items-center gap-3 relative z-10">
                    <guide.icon className="h-6 w-6 text-white" />
                    <CardTitle className={cn(
                      "text-xl text-white",
                      isRTL && "font-cairo"
                    )}>
                      {guide.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <p className={cn(
                    "text-gray-600 dark:text-gray-300 leading-relaxed min-h-[60px]",
                    isRTL && "font-cairo text-right"
                  )}>
                    {guide.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80"
                    >
                      <Link to={guide.path}>
                        {isRTL ? "عرض الدليل" : "View Guide"}
                      </Link>
                    </Button>
                    
                    <Button
                      variant="default"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => getAIGuidance(guide)}
                      disabled={isLoading && selectedGuide === guide.title}
                    >
                      {isLoading && selectedGuide === guide.title ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      {isRTL ? "إرشادات ذكية" : "AI Guidance"}
                    </Button>
                  </div>

                  {selectedGuide === guide.title && aiResponse && (
                    <AIResponseCard 
                      response={aiResponse}
                      isRTL={isRTL}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardContent>
    </div>
  );
};

export default Guides;
