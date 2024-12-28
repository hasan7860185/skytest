import { useTranslation } from "react-i18next";
import { Table } from "@/components/ui/table";
import { ClientsListTable } from "./ClientsListTable";
import { ClientsListHeader } from "./ClientsListHeader";
import { ClientsPagination } from "./ClientsPagination";
import { AssignClientsDialog } from "../AssignClientsDialog";
import { ClientsFilters } from "./ClientsFilters";
import type { RowsPerPage } from "../ClientsRowsPerPage";
import type { Client } from "@/data/clientsData";
import { cn } from "@/lib/utils";

interface ClientsListContentProps {
  clients: Client[];
  filteredClients: Client[];
  displayedClients: Client[];
  selectedClients: string[];
  currentPage: number;
  totalPages: number;
  rowsPerPage: RowsPerPage;
  isAllSelected: boolean;
  isAssignDialogOpen: boolean;
  favorites: string[];
  searchQuery: string;
  selectedUser: string | null;
  showFavorites: boolean;
  userRole: string | null;
  isRTL: boolean;
  onSearchChange: (query: string) => void;
  onUserChange: (userId: string | null) => void;
  onFavoritesChange: (show: boolean) => void;
  onRowsPerPageChange: (value: RowsPerPage) => void;
  onSelectAll: () => void;
  onSelectClient: (id: string) => void;
  onPageChange: (page: number) => void;
  onAssignDialogOpenChange: (open: boolean) => void;
  onExportAll: () => void;
  onExportSelected: () => void;
  onUnassign: () => Promise<void>;
  onAssign: () => void;
  onDelete: () => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
}

export function ClientsListContent({
  clients,
  filteredClients,
  displayedClients,
  selectedClients,
  currentPage,
  totalPages,
  rowsPerPage,
  isAllSelected,
  isAssignDialogOpen,
  favorites,
  searchQuery,
  selectedUser,
  showFavorites,
  userRole,
  isRTL,
  onSearchChange,
  onUserChange,
  onFavoritesChange,
  onRowsPerPageChange,
  onSelectAll,
  onSelectClient,
  onPageChange,
  onAssignDialogOpenChange,
  onExportAll,
  onExportSelected,
  onUnassign,
  onAssign,
  onDelete,
  onToggleFavorite,
}: ClientsListContentProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("space-y-4", isRTL && "font-cairo")} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-4">
        <ClientsFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedUser={selectedUser}
          onUserChange={onUserChange}
          showFavorites={showFavorites}
          onFavoritesChange={onFavoritesChange}
        />

        <ClientsListHeader
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          selectedClients={selectedClients}
          onExportAll={onExportAll}
          onExportSelected={onExportSelected}
          onUnassign={onUnassign}
          onAssign={onAssign}
          onDelete={onDelete}
          userRole={userRole}
        />
      </div>

      <ClientsListTable
        clients={displayedClients}
        selectedClients={selectedClients}
        onSelectAll={onSelectAll}
        onSelectClient={onSelectClient}
        isAllSelected={isAllSelected}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />

      {totalPages > 1 && (
        <ClientsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      <AssignClientsDialog 
        open={isAssignDialogOpen}
        onOpenChange={onAssignDialogOpenChange}
        clientIds={selectedClients}
        onSuccess={async () => {
          onSelectClient("");
          onAssignDialogOpenChange(false);
        }}
      />
    </div>
  );
}