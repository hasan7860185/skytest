import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { toast } from "sonner";
import { UnitCard } from './UnitCard';

interface CompanyUnitsProps {
  companyName: string;
  isRTL: boolean;
}

export function CompanyUnits({ companyName, isRTL }: CompanyUnitsProps) {
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { analyzeEntity } = useAIAnalysis();

  const { data: units, isLoading } = useQuery({
    queryKey: ['units', companyName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_units')
        .select('*')
        .eq('company_name', companyName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال نص للبحث' : 'Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await analyzeEntity({
        type: 'search',
        query: `${searchQuery} في وحدات المشاريع`
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

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <h2 className={cn(
          "text-xl font-semibold",
          "dark:text-gray-100",
          isRTL && "font-cairo text-right"
        )}>
          {isRTL ? "الوحدات" : "Units"}
        </h2>

        {/* Search Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL 
                ? "ابحث عن الوحدات... مثال: ابحث عن الوحدات في الرياض" 
                : "Search units... Example: Find units in Riyadh"}
              className={cn(
                "min-h-[80px] resize-none",
                isRTL && "font-cairo text-right"
              )}
            />
            <Button
              variant="secondary"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={cn(
                "shrink-0",
                isRTL && "font-cairo"
              )}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="mx-2">
                {isRTL ? "بحث" : "Search"}
              </span>
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-4 space-y-4">
            <h4 className={cn(
              "font-semibold",
              isRTL && "font-cairo text-right"
            )}>
              {isRTL ? "نتائج البحث" : "Search Results"}
            </h4>
            <div className="prose dark:prose-invert max-w-none">
              <div className={cn(
                "text-sm",
                isRTL && "font-cairo text-right"
              )}>
                {searchResults.summary}
              </div>
              {searchResults.matches && searchResults.matches.length > 0 && (
                <div className="mt-4 space-y-4">
                  {searchResults.matches.map((match: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h5 className={cn(
                        "font-semibold mb-2",
                        isRTL && "font-cairo text-right"
                      )}>
                        {match.project_name}
                      </h5>
                      {match.details && (
                        <p className={cn(
                          "text-sm text-muted-foreground",
                          isRTL && "font-cairo text-right"
                        )}>
                          {match.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Units List */}
        {(!searchResults || searchResults.matches?.length === 0) && units && units.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                companyName={companyName}
                isRTL={isRTL}
                onEdit={setSelectedUnit}
                isEditDialogOpen={isEditDialogOpen && selectedUnit?.id === unit.id}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isViewDialogOpen={isViewDialogOpen && selectedUnit?.id === unit.id}
                setIsViewDialogOpen={setIsViewDialogOpen}
              />
            ))}
          </div>
        )}

        {(!searchResults || searchResults.matches?.length === 0) && (!units || units.length === 0) && (
          <div className={cn(
            "text-center py-12 border rounded-lg",
            "dark:border-gray-700 dark:text-gray-400",
            isRTL && "font-cairo"
          )}>
            {isRTL ? "لا توجد وحدات حالياً" : "No units yet"}
          </div>
        )}
      </div>
    </div>
  );
}