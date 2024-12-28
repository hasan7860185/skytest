import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

interface CompaniesAIAnalysisProps {
  companies: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
  isRTL: boolean;
}

export function CompaniesAIAnalysis({ companies, isRTL }: CompaniesAIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { analyzeEntity } = useAIAnalysis();
  const { t } = useTranslation();

  const handleAnalyzeCompanies = async () => {
    setIsAnalyzing(true);
    try {
      const results = await Promise.all(
        companies.map(company => 
          analyzeEntity({
            id: company.id,
            type: 'company',
            name: company.name,
            description: company.description
          })
        )
      );

      const analysisData = {
        companies: results.filter(Boolean),
        timestamp: new Date().toISOString()
      };

      setAnalysis(analysisData);
      toast.success(isRTL ? 'تم تحليل الشركات بنجاح' : 'Companies analyzed successfully');
    } catch (error) {
      console.error('Error analyzing companies:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحليل الشركات' : 'Error analyzing companies');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال نص للبحث' : 'Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await analyzeEntity({
        type: 'search',
        query: searchQuery
      });

      if (response) {
        setSearchResults(response);
        toast.success(isRTL ? 'تم العثور على النتائج' : 'Search results found');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء البحث' : 'Error searching');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="mt-8 bg-background dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-foreground dark:text-gray-100",
          isRTL ? "font-cairo" : ""
        )}>
          {isRTL ? "تحليل الذكاء الاصطناعي" : "AI Analysis"}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeCompanies}
          disabled={isAnalyzing || companies.length === 0}
          className={cn(
            "border-gray-200 dark:border-gray-700",
            "bg-background dark:bg-gray-800",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "text-foreground dark:text-gray-100",
            isRTL ? "flex-row-reverse font-cairo" : ""
          )}
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span className="mx-2">
            {isRTL ? "تحليل الشركات" : "Analyze Companies"}
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchInput
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            isSearching={isSearching}
            isRTL={isRTL}
          />

          <SearchResults 
            results={searchResults}
            isRTL={isRTL}
          />

          {/* Analysis Results */}
          {analysis ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analysis.companies.map((companyAnalysis: any, index: number) => (
                  <Card key={index} className="p-4">
                    <h3 className={`font-semibold mb-2 ${isRTL ? "font-cairo" : ""}`}>
                      {companyAnalysis.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className={isRTL ? "text-right font-cairo" : ""}>
                        {companyAnalysis.summary}
                      </p>
                      {companyAnalysis.projects && (
                        <div className="mt-2">
                          <h4 className={`font-medium mb-1 ${isRTL ? "font-cairo" : ""}`}>
                            {isRTL ? "المشاريع" : "Projects"}
                          </h4>
                          <ul className="list-disc list-inside">
                            {companyAnalysis.projects.map((project: any, idx: number) => (
                              <li key={idx} className={isRTL ? "text-right font-cairo" : ""}>
                                {project.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? "آخر تحليل" : "Last analyzed"}: {new Date(analysis.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className={`text-sm text-muted-foreground ${isRTL ? "text-right font-cairo" : ""}`}>
              {isRTL 
                ? "اضغط على زر التحليل للحصول على تحليل ذكي للشركات ومشاريعها"
                : "Click analyze to get AI insights about companies and their projects"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}