const PurchaseTableHead = () => {
  return (
    <thead
      className="border-b border-gray-100 bg-gray-50"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#fff",
        overflowX: "auto",
      }}
    >
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Order
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Supplier
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Warehouse
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Delivery
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Status
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Amount
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Payments
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default PurchaseTableHead;
