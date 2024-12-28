import jsPDF from 'jspdf';
import { Property } from '@/components/forms/propertySchema';

interface GeneratePDFOptions {
  property: Property;
  selectedFields: string[];
  isRTL: boolean;
  labels: {
    getArabicLabel: (field: string) => string;
    getEnglishLabel: (field: string) => string;
  };
}

const convertValueToString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

export const generatePropertyPDF = async ({
  property,
  selectedFields,
  isRTL,
  labels
}: GeneratePDFOptions): Promise<string> => {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    // Configure document for RTL and Arabic support
    if (isRTL) {
      doc.addFont("/fonts/NotoNaskhArabic-Regular.ttf", "NotoNaskhArabic", "normal");
      doc.setFont("NotoNaskhArabic");
      doc.setR2L(true);
      // Set font size slightly larger for Arabic text
      doc.setFontSize(14);
    } else {
      doc.setFontSize(12);
    }

    const margin = 20;
    const lineHeight = 10;
    let yPosition = 20;

    // Add title
    doc.setFontSize(isRTL ? 20 : 18);
    const title = property.title || '';
    doc.text(title, isRTL ? doc.internal.pageSize.width - margin : margin, yPosition, {
      align: isRTL ? "right" : "left"
    });
    yPosition += lineHeight * 2;

    // Reset font size for content
    doc.setFontSize(isRTL ? 14 : 12);

    // Add fields
    selectedFields.forEach((field) => {
      const value = property[field as keyof Property];
      if (value && field !== 'images') {
        const label = isRTL ? labels.getArabicLabel(field) : labels.getEnglishLabel(field);
        const stringValue = convertValueToString(value);
        
        // Format the text with proper spacing
        const text = isRTL ? 
          `${label}: ${stringValue}` :
          `${label}: ${stringValue}`;

        // Add text with proper alignment
        doc.text(text, isRTL ? doc.internal.pageSize.width - margin : margin, yPosition, {
          align: isRTL ? "right" : "left"
        });
        yPosition += lineHeight;
      }
    });

    // Add images if selected
    if (selectedFields.includes('images') && property.images?.length) {
      yPosition += lineHeight;
      const imagesLabel = isRTL ? 'الصور:' : 'Images:';
      doc.text(imagesLabel, isRTL ? doc.internal.pageSize.width - margin : margin, yPosition, {
        align: isRTL ? "right" : "left"
      });
      yPosition += lineHeight;

      for (const imageUrl of property.images) {
        try {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          
          // Wait for image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });

          const pageWidth = doc.internal.pageSize.getWidth();
          const maxWidth = pageWidth - (margin * 2);
          const imgWidth = Math.min(maxWidth, 100);
          const imgHeight = (img.height * imgWidth) / img.width;

          // Add new page if needed
          if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }

          // Add image
          const xPosition = isRTL ? doc.internal.pageSize.width - margin - imgWidth : margin;
          doc.addImage(img, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + lineHeight;

        } catch (error) {
          console.error('Error adding image to PDF:', error);
          // Continue with next image if one fails
        }
      }
    }

    // Generate PDF as data URL
    const pdfOutput = doc.output('dataurlstring');
    return pdfOutput;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};