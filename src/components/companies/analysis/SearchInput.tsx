import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  isRTL: boolean;
}

export function SearchInput({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  isRTL
}: SearchInputProps) {
  return (
    <div className="space-y-2">
      <h3 className={cn(
        "text-lg font-semibold",
        isRTL && "font-cairo text-right"
      )}>
        {isRTL ? "البحث الذكي" : "Smart Search"}
      </h3>
      <div className="flex gap-2">
        <Textarea
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={isRTL 
            ? "اكتب سؤالك هنا... مثال: ابحث عن الشركات التي لديها مشاريع في الرياض" 
            : "Type your question here... Example: Find companies with projects in Riyadh"}
          className={cn(
            "min-h-[80px] resize-none",
            isRTL && "font-cairo text-right"
          )}
        />
        <Button
          variant="secondary"
          onClick={onSearch}
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
  );
}