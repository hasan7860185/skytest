export interface ProjectData {
  id?: string;
  name: string;
  engineering_consultant: string;
  operating_company: string;
  project_sections?: string;
  location?: string;
  price_per_meter?: number;
  available_units?: number;
  unit_price?: number;
  min_area?: number;
  rental_system?: string;
  description?: string;
  images?: string[];
  company_id?: string;
}