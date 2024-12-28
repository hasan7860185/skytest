import { useState } from 'react';
import type { RowsPerPage } from '@/components/clients/ClientsRowsPerPage';

export const useClientListState = (
  externalSearchQuery = "", 
  externalShowFavorites = false,
  externalSelectedUser = null
) => {
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedUser, setSelectedUser] = useState<string | null>(externalSelectedUser);
  const [showFavorites, setShowFavorites] = useState(externalShowFavorites);

  return {
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    selectedClients,
    setSelectedClients,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    searchQuery,
    setSearchQuery,
    selectedUser,
    setSelectedUser,
    showFavorites,
    setShowFavorites,
  };
};