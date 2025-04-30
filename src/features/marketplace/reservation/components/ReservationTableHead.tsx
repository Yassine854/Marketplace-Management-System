const ReservationTableHead = () => {
  return (
    <thead className="border-b border-gray-100 bg-primary">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          ID
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Excl. Taxe
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount TTC
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Before Promo
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount After Promo
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Refunded
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Canceled
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Ordered
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Amount Shipped
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
          Shipping Method
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          State
        </th>
        <th className="w-[150px] min-w-[150px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Loyalty Points Value
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          From Mobile
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Weight
        </th>
        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Customer
        </th>
        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Agent
        </th>
        <th className="px-8 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Partner
        </th>
        <th className="px-8 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
          Payment Method
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Created At
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Updated At
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white">
          Reservation Items
        </th>
        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default ReservationTableHead;
