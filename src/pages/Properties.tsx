import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/components/forms/propertySchema";
import { supabase } from "@/integrations/supabase/client";
import { DashboardContent } from "@/components/layouts/DashboardContent";
import { PropertiesHeader } from "@/components/properties/PropertiesHeader";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";

const Properties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel('properties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProperties(properties);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = properties.filter(property => {
      return (
        property.title?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.area?.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.price?.toLowerCase().includes(query) ||
        property.type?.toLowerCase().includes(query) ||
        property.owner_phone?.toLowerCase().includes(query) ||
        property.operating_company?.toLowerCase().includes(query) ||
        property.project_sections?.toLowerCase().includes(query)
      );
    });

    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Fetched properties:', propertiesData);
      setProperties(propertiesData || []);
      setFilteredProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error loading properties",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProperty = async (data: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: data.title,
          description: data.description,
          type: data.type,
          area: data.area,
          location: data.location,
          price: data.price,
          owner_phone: data.owner_phone,
          operating_company: data.operating_company,
          project_sections: data.project_sections,
          images: data.images,
        })
        .eq('id', data.id);

      if (error) throw error;

      await fetchProperties();
      toast({
        title: "Property updated successfully",
      });
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error updating property",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      await fetchProperties();
      toast({
        title: "Property deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error deleting property",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardContent>
      <div className="max-w-[1280px] mx-auto space-y-4 p-6 pt-20">
        <PropertiesHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <PropertiesGrid
          isLoading={isLoading}
          properties={filteredProperties}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      </div>
    </DashboardContent>
  );
};

export default Properties;
