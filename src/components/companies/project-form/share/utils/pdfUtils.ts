import { supabase } from "@/integrations/supabase/client";
import { generateHTML } from "./htmlGenerator";
import html2pdf from 'html2pdf.js';

interface GeneratePDFParams {
  project: any;
  selectedFields: string[];
  isRTL: boolean;
}

export const generateAndUploadPDF = async ({ project, selectedFields, isRTL }: GeneratePDFParams) => {
  const html = generateHTML({ project, selectedFields, isRTL });
  const element = document.createElement('div');
  element.innerHTML = html;
  document.body.appendChild(element);

  const opt = {
    margin: [10, 10],
    filename: `${project.name || 'project'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
  document.body.removeChild(element);

  const fileName = `${project.id}-${Date.now()}.pdf`;
  const { data, error: uploadError } = await supabase.storage
    .from('project-pdfs')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('project-pdfs')
    .getPublicUrl(fileName);

  return publicUrl;
};