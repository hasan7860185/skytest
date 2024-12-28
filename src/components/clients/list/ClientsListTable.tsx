import { Table, TableBody } from "@/components/ui/table";
import { ClientsTableHeader } from "../ClientsTableHeader";
import { ClientsTableRow } from "../ClientsTableRow";
import { Client } from "@/data/clientsData";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

export interface ClientsListTableProps {
  clients: Client[];
  selectedClients: string[];
  onSelectAll: () => void;
  onSelectClient: (id: string) => void;
  isAllSelected: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => Promise<void>;
}

export function ClientsListTable({
  clients,
  selectedClients,
  onSelectAll,
  onSelectClient,
  isAllSelected,
  favorites,
  onToggleFavorite,
}: ClientsListTableProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
          className="mr-2"
        />
        <span className="text-sm text-gray-500">
          {t("table.selectAll")}
        </span>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <ClientsTableHeader />
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <ClientsTableRow
                  key={client.id}
                  client={client}
                  isSelected={selectedClients.includes(client.id)}
                  onSelect={onSelectClient}
                  isFavorite={favorites.includes(client.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  {t("clients.noClientsFound")}
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}