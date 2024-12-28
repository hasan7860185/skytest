import { useMemo } from 'react';
import { Client } from '@/data/clientsData';

export const useFilteredClients = (
  clients: Client[],
  searchQuery: string,
  selectedUser: string | null,
  showFavorites: boolean,
  favorites: string[]
) => {
  return useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = searchQuery
        ? Object.values(client).some(value => 
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesUser = selectedUser
        ? client.userId === selectedUser || client.assignedTo === selectedUser
        : true;

      const matchesFavorites = showFavorites
        ? favorites.includes(client.id)
        : true;

      return matchesSearch && matchesUser && matchesFavorites;
    });
  }, [clients, searchQuery, selectedUser, showFavorites, favorites]);
};