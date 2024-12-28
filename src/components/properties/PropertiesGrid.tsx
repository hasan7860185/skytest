import { Property } from "@/components/forms/propertySchema";
import { PropertyCard } from "./PropertyCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PropertiesGridProps {
  isLoading: boolean;
  properties: Property[];
  onEdit: (data: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertiesGrid({ isLoading, properties, onEdit, onDelete }: PropertiesGridProps) {
  return (
    <div className="w-full lg:w-[180%] bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200/20 dark:border-gray-700/30 p-4 backdrop-blur-sm shadow-sm">
      <ScrollArea className="h-[calc(100vh-16rem)]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[...Array(16)].map((_, index) => (
              <div 
                key={index} 
                className="h-[140px] rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" 
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}