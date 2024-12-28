import { ProjectData } from "../types";

interface GenerateHTMLParams {
  project: ProjectData;
  selectedFields: string[];
  isRTL: boolean;
}

export const getFieldLabel = (field: string, isRTL: boolean): string => {
  const labels: Record<string, { ar: string; en: string }> = {
    name: { ar: "اسم المشروع", en: "Project Name" },
    description: { ar: "الوصف", en: "Description" },
    engineering_consultant: { ar: "الاستشاري الهندسي", en: "Engineering Consultant" },
    operating_company: { ar: "شركة الإدارة", en: "Operating Company" },
    location: { ar: "الموقع", en: "Location" },
    price_per_meter: { ar: "السعر لكل متر", en: "Price per Meter" },
    available_units: { ar: "الوحدات المتاحة", en: "Available Units" },
    delivery_date: { ar: "تاريخ التسليم", en: "Delivery Date" },
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

export const generateHTML = ({ project, selectedFields, isRTL }: GenerateHTMLParams): string => {
  let html = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${project.name || 'Project Details'}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          direction: ${isRTL ? 'rtl' : 'ltr'};
          background-color: #f5f5f5;
        }
        .project-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .project-title {
          font-size: 24px;
          color: #2563eb;
          margin-bottom: 16px;
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .project-detail {
          margin: 8px 0;
          padding: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .detail-label {
          font-weight: bold;
          color: #4b5563;
        }
        .detail-value {
          color: #1f2937;
        }
        .project-images {
          margin-top: 20px;
        }
        .images-title {
          font-size: 20px;
          color: #2563eb;
          margin-bottom: 16px;
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .image-container {
          break-inside: avoid;
          page-break-inside: avoid;
          page-break-before: always;
          margin: 0 auto;
          padding: 10px 0;
        }
        .project-image {
          width: 100%;
          max-width: 600px;
          height: 800px;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .image-caption {
          text-align: center;
          margin-top: 16px;
          color: #6b7280;
          font-size: 14px;
        }
        @media print {
          body {
            background: white;
          }
          .project-card {
            box-shadow: none;
          }
          .image-container {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-before: always;
          }
          .project-image {
            max-width: 100%;
            height: auto;
            max-height: 800px;
          }
        }
      </style>
    </head>
    <body>
      <div class="project-card">
        <h1 class="project-title">${project.name || ''}</h1>
  `;

  selectedFields.forEach(field => {
    const value = project[field as keyof ProjectData];
    if (value && field !== 'images') {
      const stringValue = convertValueToString(value);
      html += `
        <div class="project-detail">
          <span class="detail-label">${getFieldLabel(field, isRTL)}:</span>
          <span class="detail-value">${stringValue}</span>
        </div>`;
    }
  });

  if (selectedFields.includes('images') && project.images?.length) {
    html += `
      <div class="project-images">
        <h2 class="images-title">${isRTL ? 'صور المشروع' : 'Project Images'}</h2>`;
    
    project.images.forEach((imgUrl: string, index: number) => {
      html += `
        <div class="image-container">
          <img 
            src="${imgUrl}" 
            alt="${project.name || 'Project'} - ${isRTL ? 'صورة' : 'Image'} ${index + 1}" 
            class="project-image"
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