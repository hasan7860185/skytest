import { useCallback } from 'react';
import { useClientDeletion } from './useClientDeletion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useClientListDeletion = (selectedClients: string[], clearSelection: () => void) => {
  const { deleteClients, isDeleting } = useClientDeletion();
  const { t } = useTranslation();

  const handleDelete = useCallback(async (): Promise<void> => {
    if (selectedClients.length === 0) {
      toast.error(t('errors.noClientsSelected'));
      return;
    }

    if (isDeleting) return;

    const success = await deleteClients(selectedClients);
    if (success) {
      clearSelection();
    }
  }, [deleteClients, selectedClients, clearSelection, t, isDeleting]);

  return { handleDelete, isDeleting };
};