"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const MostRefundedProducts = () => {
  const [src, setSrc] = useState("");
  const { data: session } = useSession();
  const user = session?.user as { id: string; userType?: string } | undefined;
  const partnerId = user?.userType === "partner" ? user.id : null;

  useEffect(() => {
    // Only generate chart URL if we have a valid partner ID
    if (!partnerId) {
      setSrc("");
      return;
    }

    const baseUrl = "https://charts.mongodb.com/charts-project-0-ionjeod";
    const chartId = "12c7415b-b5ea-4023-849a-f048b6466947";

    const filter = {
      partnerId: { $oid: partnerId },
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));

    const chartUrl = `${baseUrl}/embed/charts?id=${chartId}&theme=light&autoRefresh=true&filter=${encodedFilter}`;

    setSrc(chartUrl);
  }, [partnerId]);

  // Show loading state while session is loading
  if (!session) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-gray-100 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-500">Loading chart...</span>
        </div>
      </div>
    );
  }

  // Show message if user is not a partner
  if (!partnerId) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-gray-100 shadow-md">
        <div className="text-center text-gray-500">
          <p className="font-medium">Access Restricted</p>
          <p className="text-sm">
            This chart is only available for partner accounts
          </p>
        </div>
      </div>
    );
  }

  // Show loading state while chart URL is being generated
  if (!src) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-gray-100 shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-500">Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 aspect-[4/3] w-full">
      <iframe
        className="h-full w-full"
        style={{
          background: "#FFFFFF",
          border: "none",
          borderRadius: "2px",
          boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
        }}
        src={src}
        allowFullScreen
      />
    </div>
  );
};

export default MostRefundedProducts;
