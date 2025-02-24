const PurchaseTableHead = () => {
  return (
    <thead className="border-b border-gray-100 bg-gray-50">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Commande
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Fournisseur
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Entrepôt
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Livraison
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Statut
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Montant
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Paiements
        </th>
      </tr>
    </thead>
  );
};
export default PurchaseTableHead;
