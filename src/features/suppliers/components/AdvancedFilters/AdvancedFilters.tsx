import { useState } from "react";

const AdvancedFilters = ({ onApply }: { onApply: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    deliveryDateStart: "",
    deliveryDateEnd: "",
  });

  return (
    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4">
      {/* Statut */}
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="rounded border p-2"
      >
        <option value="">Tous les statuts</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="READY">Ready</option>
        <option value="DELIVERED">Delivred</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Méthode de paiement */}
      <select
        value={filters.paymentMethod}
        onChange={(e) =>
          setFilters({ ...filters, paymentMethod: e.target.value })
        }
        className="rounded border p-2"
      >
        <option value="">Tous les paiements</option>
        <option value="CHEQUE">Cheque</option>
        <option value="TRAITE">Traite</option>
        <option value="ESPECES">Espèces</option>
      </select>

      {/* Plage de dates */}
      <input
        type="date"
        placeholder="Date de début"
        onChange={(e) =>
          setFilters({ ...filters, deliveryDateStart: e.target.value })
        }
      />
      <input
        type="date"
        placeholder="Date de fin"
        onChange={(e) =>
          setFilters({ ...filters, deliveryDateEnd: e.target.value })
        }
      />

      <button
        onClick={() => onApply(filters)}
        className="col-span-2 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Appliquer les filtres
      </button>
    </div>
  );
};
export default AdvancedFilters;
