import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "./types";
import { BasicFields } from "./fields/BasicFields";
import { ProjectDetailsFields } from "./fields/ProjectDetailsFields";
import { UnitFields } from "./fields/UnitFields";
import { AdditionalFields } from "./fields/AdditionalFields";

interface ProjectFormFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isRTL: boolean;
}

export function ProjectFormFields({ form, isRTL }: ProjectFormFieldsProps) {
  return (
    <>
      <BasicFields form={form} isRTL={isRTL} />
      <ProjectDetailsFields form={form} isRTL={isRTL} />
      <UnitFields form={form} isRTL={isRTL} />
      <AdditionalFields form={form} isRTL={isRTL} />
    </>
  );
}