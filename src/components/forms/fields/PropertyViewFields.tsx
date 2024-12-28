import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Property } from "@/components/forms/propertySchema";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  if (!value) return null;
  
  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm dark:text-gray-200">{label}</h3>
      <p className="text-sm text-muted-foreground dark:text-gray-400">{value}</p>
    </div>
  );
}

interface PropertyViewFieldsProps {
  property: Property;
  isRTL?: boolean;
}

export function PropertyViewFields({ property, isRTL = true }: PropertyViewFieldsProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <ScrollArea className={cn(
      "rounded-md",
      isMobile ? "h-[75vh]" : "h-[80vh]"
    )}>
      <div className={cn(
        "space-y-4",
        isMobile ? "p-3" : "p-4"
      )}>
        {/* Images Carousel */}
        {property.images && property.images.length > 0 && (
          <div className="w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={img}
                        alt={`${property.title || ''} - ${isRTL ? 'صورة' : 'Image'} ${index + 1}`}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <p className="text-xs text-muted-foreground mt-2 text-center dark:text-gray-400">
              {isRTL ? `${property.images.length} صور` : `${property.images.length} images`}
            </p>
          </div>
        )}

        {/* Property Details */}
        <div className={cn(
          "grid gap-3 bg-white/5 dark:bg-gray-800/30 rounded-lg",
          isMobile ? "p-3" : "p-4",
          isRTL ? "text-right" : ""
        )}>
          <DetailItem 
            label={isRTL ? "عنوان العقار" : "Property Title"}
            value={property.title}
          />
          <DetailItem 
            label={isRTL ? "نوع العقار" : "Property Type"}
            value={property.type}
          />
          <DetailItem 
            label={isRTL ? "الموقع" : "Location"} 
            value={property.location} 
          />
          <DetailItem 
            label={isRTL ? "السعر" : "Price"} 
            value={property.price} 
          />
          <DetailItem 
            label={isRTL ? "المساحة" : "Area"} 
            value={property.area} 
          />
          <DetailItem 
            label={isRTL ? "شركة الإدارة والتشغيل" : "Operating Company"} 
            value={property.operating_company} 
          />
          <DetailItem 
            label={isRTL ? "رقم هاتف المالك" : "Owner Phone"} 
            value={property.owner_phone} 
          />
          
          {/* Description */}
          {property.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm dark:text-gray-200">
                {isRTL ? "التفاصيل" : "Description"}
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap dark:text-gray-400">
                {property.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}