import { useMemo } from 'react';
import type { Client } from '@/data/clientsData';
import type { RowsPerPage } from '@/components/clients/ClientsRowsPerPage';

export const useClientPagination = (
  filteredClients: Client[],
  currentPage: number,
  rowsPerPage: RowsPerPage
) => {
  const displayedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredClients, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  return {
    displayedClients,
    totalPages
  };
};