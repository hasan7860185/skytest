import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import { useImportLogic, ImportResult } from "./ImportLogic";
import { useToast } from "@/components/ui/use-toast";

interface FieldMappingProps {
  file: File;
  onDataMapped: (result: ImportResult) => Promise<void>;
}

export function FieldMapping({ file, onDataMapped }: FieldMappingProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<XLSX.WorkSheet | null>(null);

  const { processClients } = useImportLogic({
    onComplete: async (results) => {
      setIsLoading(false);
      await onDataMapped(results);
    },
    onError: (error) => {
      console.error('Error in import:', error);
      setIsLoading(false);
      toast({
        title: t('errors.importFailed'),
        description: error,
        variant: "destructive"
      });
    }
  });

  const fields = useMemo(() => ({
    name: t('clients.form.name'),
    phone: t('clients.form.phone'),
    email: t('clients.form.email'),
    facebook: t('clients.form.facebook'),
    city: t('clients.form.city'),
    project: t('clients.form.project'),
    budget: t('clients.form.budget'),
    campaign: t('clients.form.campaign'),
    post_url: t('clients.form.postUrl'),
    comment: t('clients.form.comment')
  }), [t]);

  useEffect(() => {
    const readFile = async () => {
      if (!file) return;

      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, {
          type: 'array',
          cellDates: false,
          cellNF: false,
          cellText: false,
          cellStyles: false,
          cellFormula: false,
          raw: true
        });

        const ws = workbook.Sheets[workbook.SheetNames[0]];
        if (!ws['!ref']) {
          throw new Error(t('clients.importClients.errors.emptySheet'));
        }

        const range = XLSX.utils.decode_range(ws['!ref']);
        const fileHeaders: string[] = [];

        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
          if (cell && cell.v) {
            const header = String(cell.v).trim();
            if (header) {
              fileHeaders.push(header);
            }
          }
        }

        if (fileHeaders.length === 0) {
          throw new Error(t('clients.importClients.errors.noHeaders'));
        }

        setWorksheet(ws);
        setHeaders(fileHeaders);

        const autoMappings: Record<string, string> = {};
        fileHeaders.forEach(header => {
          const headerLower = header.toLowerCase().trim();
          
          if (headerLower.match(/اسم|name|full.?name/i)) {
            autoMappings.name = header;
          }
          else if (headerLower.match(/هاتف|تليفون|موبايل|phone|mobile|contact/i)) {
            autoMappings.phone = header;
          }
          else if (headerLower.match(/ايميل|بريد|email|mail/i)) {
            autoMappings.email = header;
          }
          else if (headerLower.match(/فيس|face|fb|facebook/i)) {
            autoMappings.facebook = header;
          }
          else if (headerLower.match(/مدينة|city|location/i)) {
            autoMappings.city = header;
          }
          else if (headerLower.match(/مشروع|project/i)) {
            autoMappings.project = header;
          }
          else if (headerLower.match(/ميزانية|budget|price/i)) {
            autoMappings.budget = header;
          }
          else if (headerLower.match(/حملة|campaign/i)) {
            autoMappings.campaign = header;
          }
          else if (headerLower.match(/تعليق|ملاحظات|comment|note/i)) {
            autoMappings.comment = header;
          }
        });

        setMappings(autoMappings);

      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast({
          title: t('clients.importClients.errors.title'),
          description: error instanceof Error ? error.message : t('clients.importClients.errors.unknown'),
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    readFile();
  }, [file, t]);

  const processData = useCallback(() => {
    if (!worksheet) return [];
    
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const data = [];
    const fieldMap = new Map(Object.entries(mappings));
    const columnMap = new Map<string, number>();

    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
      if (cell && cell.v) {
        columnMap.set(String(cell.v).trim(), C);
      }
    }

    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      const row: any = {};
      let hasData = false;

      for (const [field, header] of fieldMap) {
        if (header === 'ignore') continue;
        
        const C = columnMap.get(header);
        if (C === undefined) continue;

        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell) continue;

        const value = cell.v;
        if (value !== undefined && value !== '') {
          row[field] = typeof value === 'string' ? value.trim() : value;
          hasData = true;
        }
      }

      if (hasData) {
        data.push(row);
      }
    }

    return data;
  }, [worksheet, mappings]);

  const handleImport = useCallback(async () => {
    if (!worksheet || isLoading) return;
    
    try {
      if (!mappings.phone) {
        toast({
          title: t('clients.importClients.errors.validation'),
          description: t('clients.importClients.errors.phoneRequired'),
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      const data = processData();
      if (data.length === 0) {
        toast({
          title: t('clients.importClients.errors.validation'),
          description: t('clients.importClients.errors.noData'),
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      setIsLoading(true);
      const result: ImportResult = {
        imported: 0,
        duplicates: 0,
        duplicateDetails: [],
        data: data
      };
      await onDataMapped(result);
    } catch (error) {
      console.error('Error processing data:', error);
      toast({
        title: t('clients.importClients.errors.title'),
        description: error instanceof Error ? error.message : t('clients.importClients.errors.unknown'),
        variant: "destructive",
        duration: 5000,
      });
      setIsLoading(false);
    }
  }, [worksheet, isLoading, mappings, processData, onDataMapped, t]);

  const handleMappingChange = useCallback((field: string, header: string) => {
    setMappings(prev => ({
      ...prev,
      [field]: header
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(fields).map(([field, label]) => (
          <div key={field} className="flex items-center gap-4">
            <Label className={cn(
              "min-w-[150px]",
              isRTL ? "text-right" : "text-left"
            )}>
              {label}
              {field === 'phone' && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={mappings[field] || 'ignore'}
              onValueChange={(value) => handleMappingChange(field, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ignore">
                  {t('clients.importClients.mapping.ignore')}
                </SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <Button 
        onClick={handleImport}
        disabled={isLoading || !worksheet}
        className={cn(
          "w-full",
          isRTL ? "font-cairo" : ""
        )}
      >
        {isLoading ? t('clients.importClients.notifications.processing') : t('clients.importClients.mapping.import')}
      </Button>
    </div>
  );
}
