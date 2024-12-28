import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Property } from "@/components/forms/propertySchema";

export function usePropertyMutations() {
  const queryClient = useQueryClient();

  const deleteProperty = useMutation({
    mutationFn: async (id?: string) => {
      if (!id) throw new Error("Property ID is required");
      
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    deleteProperty,
  };
}