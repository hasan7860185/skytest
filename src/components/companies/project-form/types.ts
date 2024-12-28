export interface ProjectFormData {
  name: string;
  engineering_consultant: string;
  operating_company: string;
  project_sections?: string;
  location?: string;
  price_per_meter?: string;
  available_units?: string;
  unit_price?: string;
  min_area?: string;
  rental_system?: string;
  description?: string;
}

export interface ProjectData extends ProjectFormData {
  id?: string;
  images?: string[];
  company_id?: string;
}

export interface ProjectFormProps {
  companyId: string;
  project?: ProjectData;
  onSuccess?: () => void;
  onCancel: () => void;
}