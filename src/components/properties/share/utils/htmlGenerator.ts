import { Property } from "@/components/forms/propertySchema";

interface GenerateHTMLParams {
  property: Property;
  selectedFields: string[];
  isRTL: boolean;
}

export const getFieldLabel = (field: string, isRTL: boolean): string => {
  const labels: Record<string, { ar: string; en: string }> = {
    title: { ar: "العنوان", en: "Title" },
    description: { ar: "الوصف", en: "Description" },
    location: { ar: "الموقع", en: "Location" },
    price: { ar: "السعر", en: "Price" },
    area: { ar: "المساحة", en: "Area" },
    type: { ar: "النوع", en: "Type" },
    owner_phone: { ar: "رقم الهاتف", en: "Phone Number" },
    operating_company: { ar: "شركة الإدارة والتشغيل", en: "Operating Company" },
    images: { ar: "الصور", en: "Images" }
  };

  return labels[field] ? (isRTL ? labels[field].ar : labels[field].en) : field;
};

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

export const generateHTML = ({ property, selectedFields, isRTL }: GenerateHTMLParams): string => {
  let html = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${property.title || 'Property Details'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        
        body {
          font-family: ${isRTL ? 'Cairo' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'}, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          direction: ${isRTL ? 'rtl' : 'ltr'};
          background-color: #ffffff;
          color: #1A1F2C;
        }
        .property-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          border: 1px solid #E5E7EB;
        }
        .property-title {
          font-size: 28px;
          color: #9b87f5;
          margin-bottom: 20px;
          text-align: ${isRTL ? 'right' : 'left'};
          font-weight: 700;
          border-bottom: 2px solid #D6BCFA;
          padding-bottom: 12px;
        }
        .property-detail {
          margin: 12px 0;
          padding: 12px;
          border-bottom: 1px solid #F1F0FB;
          display: flex;
          justify-content: ${isRTL ? 'flex-end' : 'flex-start'};
          align-items: center;
          gap: 12px;
          background: white;
        }
        .detail-label {
          font-weight: 600;
          color: #7E69AB;
          min-width: 120px;
          text-align: ${isRTL ? 'left' : 'right'};
        }
        .detail-value {
          color: #1A1F2C;
          flex: 1;
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .property-images {
          margin-top: 32px;
          background: white;
        }
        .images-title {
          font-size: 24px;
          color: #9b87f5;
          margin-bottom: 20px;
          text-align: ${isRTL ? 'right' : 'left'};
          font-weight: 600;
        }
        .image-container {
          break-inside: avoid;
          page-break-inside: avoid;
          page-break-before: always;
          margin: 0 auto;
          padding: 16px 0;
          background: white;
        }
        .property-image {
          width: 100%;
          max-width: 600px;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .image-caption {
          text-align: center;
          margin-top: 12px;
          color: #6B7280;
          font-size: 14px;
        }
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 15mm;
          }
          .property-card {
            box-shadow: none;
            border: 1px solid #E5E7EB;
            padding: 20px;
            margin: 0;
          }
          .image-container {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-before: always;
            background: white;
          }
          .property-image {
            max-width: 100%;
            height: auto;
            max-height: 800px;
          }
        }
      </style>
    </head>
    <body>
      <div class="property-card">
        <h1 class="property-title">${property.title || ''}</h1>
  `;

  selectedFields.forEach(field => {
    const value = property[field as keyof Property];
    if (value && field !== 'images') {
      const stringValue = convertValueToString(value);
      html += `
        <div class="property-detail">
          <span class="detail-label">${getFieldLabel(field, isRTL)}:</span>
          <span class="detail-value">${stringValue}</span>
        </div>`;
    }
  });

  if (selectedFields.includes('images') && property.images?.length) {
    html += `
      <div class="property-images">
        <h2 class="images-title">${isRTL ? 'صور العقار' : 'Property Images'}</h2>`;
    
    property.images.forEach((imgUrl, index) => {
      html += `
        <div class="image-container">
          <img 
            src="${imgUrl}" 
            alt="${property.title || 'Property'} - ${isRTL ? 'صورة' : 'Image'} ${index + 1}" 
            class="property-image"
            loading="lazy"
          >
          <p class="image-caption">${isRTL ? 'صورة' : 'Image'} ${index + 1}</p>
        </div>`;
    });
    html += '</div>';
  }

  html += `
        </div>
      </body>
      </html>
    `;

  return html;
};