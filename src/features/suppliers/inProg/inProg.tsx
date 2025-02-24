"use client";

export default function InProgressOrdersPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Commandes en Cours</h1>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                ID Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Date Livraison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Montant
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            <tr className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm">#1001</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                Jean Dupont
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                  En traitement
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                25 mars 2024
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">149,99 €</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm">#1002</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                Marie Curie
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  Expédié
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                28 mars 2024
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">299,95 €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
