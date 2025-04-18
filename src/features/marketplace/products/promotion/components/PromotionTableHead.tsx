const PromoTableHead = () => {
  return (
    <thead className="border-b border-gray-100 bg-gray-50">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          ID
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Promo Price
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Start Date
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          End Date
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default PromoTableHead;
