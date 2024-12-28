import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useClientData } from "@/hooks/useClientData";
import { ClientsListContent } from "./clients/list/ClientsListContent";
import { useFilteredClients } from "@/hooks/useFilteredClients";
import { useClientPagination } from "@/hooks/useClientPagination";
import { useClientListState } from "@/hooks/useClientListState";
import { useClientFavorites } from "@/hooks/useClientFavorites";
import { useClientExport } from "@/hooks/useClientExport";
import { useClientAssignment } from "@/hooks/useClientAssignment";
import { useClientListDeletion } from "@/hooks/useClientListDeletion";
import { useUserRole } from "@/hooks/useUserRole";

interface ClientsListProps {
  status: string;
  searchQuery?: string;
  showFavorites?: boolean;
  selectedUser?: string | null;
  onClientSelect?: (clientId: string) => void;
}

export function ClientsList({ 
  status, 
  searchQuery: externalSearchQuery = "", 
  showFavorites: externalShowFavorites = false,
  selectedUser: externalSelectedUser = null,
  onClientSelect
}: ClientsListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const userRole = useUserRole();
  const { exportAll, exportSelected } = useClientExport();
  const { isAssignDialogOpen, setIsAssignDialogOpen, handleUnassign } = useClientAssignment();
  
  const state = useClientListState(externalSearchQuery, externalShowFavorites, externalSelectedUser);
  const { favorites, toggleFavorite } = useClientFavorites();
  const { handleDelete } = useClientListDeletion(
    state.selectedClients, 
    () => state.setSelectedClients([])
  );

  // Update internal state when external props change
  useEffect(() => {
    state.setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  useEffect(() => {
    state.setShowFavorites(externalShowFavorites);
  }, [externalShowFavorites]);

  useEffect(() => {
    state.setSelectedUser(externalSelectedUser);
  }, [externalSelectedUser]);

  const { clients, error } = useClientData(status, userRole);
  
  const filteredClients = useFilteredClients(
    clients,
    state.searchQuery,
    state.selectedUser,
    state.showFavorites,
    favorites
  );

  const { displayedClients, totalPages } = useClientPagination(
    filteredClients,
    state.currentPage,
    state.rowsPerPage
  );

  const handleSelectAll = () => {
    state.setSelectedClients(prev => 
      prev.length === displayedClients.length ? [] : displayedClients.map(client => client.id)
    );
  };

  const handleSelectClient = (clientId: string) => {
    state.setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
    if (onClientSelect) {
      onClientSelect(clientId);
    }
  };

  const handlePageChange = (page: number) => {
    state.setCurrentPage(page);
    state.setSelectedClients([]);
  };

  // Create a wrapper function for handleUnassign that includes selectedClients
  const handleUnassignWrapper = async () => {
    await handleUnassign(state.selectedClients);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {t("errors.loadingClients")}
      </div>
    );
  }

  return (
    <ClientsListContent
      clients={clients}
      filteredClients={filteredClients}
      displayedClients={displayedClients}
      selectedClients={state.selectedClients}
      currentPage={state.currentPage}
      totalPages={totalPages}
      rowsPerPage={state.rowsPerPage}
      isAllSelected={displayedClients.length > 0 && state.selectedClients.length === displayedClients.length}
      isAssignDialogOpen={isAssignDialogOpen}
      favorites={favorites}
      searchQuery={state.searchQuery}
      selectedUser={state.selectedUser}
      showFavorites={state.showFavorites}
      userRole={userRole}
      isRTL={isRTL}
      onSearchChange={state.setSearchQuery}
      onUserChange={state.setSelectedUser}
      onFavoritesChange={state.setShowFavorites}
      onRowsPerPageChange={state.setRowsPerPage}
      onSelectAll={handleSelectAll}
      onSelectClient={handleSelectClient}
      onPageChange={handlePageChange}
      onAssignDialogOpenChange={setIsAssignDialogOpen}
      onExportAll={() => exportAll(clients)}
      onExportSelected={() => exportSelected(clients, state.selectedClients)}
      onUnassign={handleUnassignWrapper}
      onAssign={() => setIsAssignDialogOpen(true)}
      onDelete={handleDelete}
      onToggleFavorite={toggleFavorite}
    />
  );
}