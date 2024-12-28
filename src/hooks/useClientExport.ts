import { utils, writeFile } from "xlsx";
import { Client } from "@/types/client";
import { useTranslation } from "react-i18next";

export const useClientExport = () => {
  const { t } = useTranslation();

  const exportClients = (clients: Client[], selectedOnly: boolean = false) => {
    const dataToExport = clients.map(client => ({
      Name: client.name,
      Phone: client.phone,
      Email: client.email,
      Facebook: client.facebook,
      Country: client.country,
      City: client.city,
      Project: client.project,
      Status: t(`clients.status.${client.status}`)
    }));

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, selectedOnly ? "Selected_Clients" : "Clients");
    writeFile(workbook, `${selectedOnly ? 'selected_' : ''}clients_export_${new Date().toISOString()}.xlsx`);
  };

  return {
    exportAll: (clients: Client[]) => exportClients(clients, false),
    exportSelected: (clients: Client[], selectedIds: string[]) => {
      const selectedClients = clients.filter(client => selectedIds.includes(client.id));
      exportClients(selectedClients, true);
    }
  };
};