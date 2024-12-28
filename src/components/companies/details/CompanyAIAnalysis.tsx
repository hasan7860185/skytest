import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Search } from "lucide-react"
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface CompanyAIAnalysisProps {
  companyId: string
  companyName: string
  companyDescription?: string | null
  isRTL: boolean
}

export function CompanyAIAnalysis({
  companyId,
  companyName,
  companyDescription,
  isRTL
}: CompanyAIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const { analyzeEntity, getEntityAnalysis } = useAIAnalysis()

  const handleAnalyzeCompany = async () => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeEntity({
        type: 'company',
        id: companyId,
        name: companyName,
        description: companyDescription
      })

      if (result) {
        setAnalysis(result)
        toast.success(isRTL ? 'تم تحليل بيانات الشركة بنجاح' : 'Company analysis completed successfully')
      }
    } catch (error) {
      console.error('Error analyzing company:', error)
      toast.error(isRTL ? 'حدث خطأ أثناء تحليل البيانات' : 'Error analyzing data')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال نص للبحث' : 'Please enter a search query')
      return
    }

    setIsSearching(true)
    try {
      const response = await analyzeEntity({
        type: 'search',
        query: `${searchQuery} في مشاريع شركة ${companyName}`
      })

      if (response) {
        setSearchResults(response)
        toast.success(isRTL ? 'تم العثور على النتائج' : 'Search results found')
      }
    } catch (error) {
      console.error('Error searching:', error)
      toast.error(isRTL ? 'حدث خطأ أثناء البحث' : 'Error searching')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={isRTL ? "font-cairo" : ""}>
          {isRTL ? 'تحليل الذكاء الاصطناعي' : 'AI Analysis'}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeCompany}
          disabled={isAnalyzing}
          className={isRTL ? "flex-row-reverse font-cairo" : ""}
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          <span className="mx-2">
            {isRTL ? 'تحليل' : 'Analyze'}
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Section */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL 
                  ? "اكتب سؤالك هنا... مثال: ابحث عن المشاريع التي تقع في الرياض" 
                  : "Type your question here... Example: Find projects located in Riyadh"}
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
                      <Card key={index} className="p-4">
                        <h5 className={cn(
                          "font-semibold mb-2",
                          isRTL && "font-cairo text-right"
                        )}>
                          {match.name}
                        </h5>
                        <p className={cn(
                          "text-sm text-muted-foreground mb-4",
                          isRTL && "font-cairo text-right"
                        )}>
                          {match.relevance}
                        </p>
                        
                        {match.projects && match.projects.length > 0 && (
                          <div className="space-y-4">
                            <h6 className={cn(
                              "font-semibold text-sm",
                              isRTL && "font-cairo text-right"
                            )}>
                              {isRTL ? "المشاريع" : "Projects"}
                            </h6>
                            <div className="grid gap-4">
                              {match.projects.map((project: any, projectIndex: number) => (
                                <div key={projectIndex} className="border rounded-lg p-3">
                                  <h6 className={cn(
                                    "font-semibold mb-2",
                                    isRTL && "font-cairo text-right"
                                  )}>
                                    {project.name}
                                  </h6>
                                  {project.description && (
                                    <p className={cn(
                                      "text-sm text-muted-foreground mb-2",
                                      isRTL && "font-cairo text-right"
                                    )}>
                                      {project.description}
                                    </p>
                                  )}
                                  <div className={cn(
                                    "text-sm grid gap-2",
                                    isRTL && "text-right"
                                  )}>
                                    {project.location && (
                                      <div className="flex justify-between">
                                        <span className={cn(
                                          "font-medium",
                                          isRTL && "font-cairo"
                                        )}>
                                          {isRTL ? "الموقع" : "Location"}:
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground",
                                          isRTL && "font-cairo"
                                        )}>
                                          {project.location}
                                        </span>
                                      </div>
                                    )}
                                    {project.price_per_meter && (
                                      <div className="flex justify-between">
                                        <span className={cn(
                                          "font-medium",
                                          isRTL && "font-cairo"
                                        )}>
                                          {isRTL ? "السعر لكل متر" : "Price per meter"}:
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground",
                                          isRTL && "font-cairo"
                                        )}>
                                          {project.price_per_meter.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                                        </span>
                                      </div>
                                    )}
                                    {project.available_units && (
                                      <div className="flex justify-between">
                                        <span className={cn(
                                          "font-medium",
                                          isRTL && "font-cairo"
                                        )}>
                                          {isRTL ? "الوحدات المتاحة" : "Available units"}:
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground",
                                          isRTL && "font-cairo"
                                        )}>
                                          {project.available_units.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                                        </span>
                                      </div>
                                    )}
                                    {project.unit_price && (
                                      <div className="flex justify-between">
                                        <span className={cn(
                                          "font-medium",
                                          isRTL && "font-cairo"
                                        )}>
                                          {isRTL ? "سعر الوحدة" : "Unit price"}:
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground",
                                          isRTL && "font-cairo"
                                        )}>
                                          {project.unit_price.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                                        </span>
                                      </div>
                                    )}
                                    {project.min_area && (
                                      <div className="flex justify-between">
                                        <span className={cn(
                                          "font-medium",
                                          isRTL && "font-cairo"
                                        )}>
                                          {isRTL ? "الحد الأدنى للمساحة" : "Minimum area"}:
                                        </span>
                                        <span className={cn(
                                          "text-muted-foreground",
                                          isRTL && "font-cairo"
                                        )}>
                                          {project.min_area.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}