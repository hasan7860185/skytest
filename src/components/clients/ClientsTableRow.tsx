import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/types/client";
import { useTranslation } from "react-i18next";
import { ClientNameCell } from "./details/ClientNameCell";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ContactButtons } from "./contact/ContactButtons";
import { ClientTableActions } from "./table/ClientTableActions";
import { ClientStatusHandler } from "./table/ClientStatusHandler";
import { ExternalLink, Facebook, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EditClientDialog } from "./table/EditClientDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClientRatingButton } from "./rating/ClientRatingButton";

interface ClientsTableRowProps {
  client: Client;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => Promise<void>;
}

export function ClientsTableRow({ 
  client, 
  isSelected, 
  onSelect,
  isFavorite = false,
  onToggleFavorite
}: ClientsTableRowProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isEditOpen, setIsEditOpen] = useState(false);
  const isMobile = useIsMobile();

  const handlePostUrlClick = (url: string) => {
    if (!url) return;
    
    try {
      // Extract the post ID from the URL
      const postIdMatch = url.match(/\d+_\d+/);
      const postId = postIdMatch ? postIdMatch[0] : null;
      
      if (isMobile && postId) {
        // For mobile devices, use the fb:// scheme to open in the Facebook app
        window.location.href = `fb://post/${postId}`;
      } else {
        // For desktop or if no post ID found, open in browser
        const finalUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const renderPostUrl = () => {
    if (!client.post_url) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }

    const trimmedUrl = client.post_url.trim();
    if (!trimmedUrl) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }

    return (
      <div className={cn("flex items-center justify-center", isRTL ? "flex-row-reverse" : "flex-row")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="p-0 h-8 hover:bg-transparent"
              onClick={() => handlePostUrlClick(trimmedUrl)}
            >
              <ExternalLink className="h-4 w-4 text-blue-600 hover:text-blue-800" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-[300px] break-all">{trimmedUrl}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const renderComment = () => {
    if (!client.comment) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }

    const trimmedComment = client.comment.trim();
    if (!trimmedComment) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "max-w-[200px] truncate cursor-pointer text-sm",
            isRTL ? "text-right" : "text-left"
          )}>
            {trimmedComment}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[300px] whitespace-pre-wrap">{trimmedComment}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <ClientTableActions
            isSelected={isSelected}
            onSelect={onSelect}
            clientId={client.id}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ClientRatingButton
            clientId={client.id}
            clientName={client.name}
            currentRating={client.rating}
          />
        </div>
      </TableCell>
      <ClientNameCell client={client} />
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer group relative inline-flex items-center gap-2">
              {client.phone}
              <ContactButtons phone={client.phone} facebookId={client.facebook} showInNormalView={false} />
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto p-2">
            <ContactButtons phone={client.phone} facebookId={client.facebook} showInNormalView={true} />
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.country || t('clients.common.unknown')}</TableCell>
      <TableCell>{client.city}</TableCell>
      <TableCell>{client.project}</TableCell>
      <TableCell>
        <ClientStatusHandler
          clientId={client.id}
          status={client.status}
          userId={client.userId}
          assignedTo={client.assignedTo}
          clientName={client.name}
        />
      </TableCell>
      <TableCell>
        {renderPostUrl()}
      </TableCell>
      <TableCell>
        {renderComment()}
      </TableCell>
      <EditClientDialog 
        client={client}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </TableRow>
  );
}