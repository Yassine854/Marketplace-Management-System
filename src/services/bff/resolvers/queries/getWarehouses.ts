export const getWarehouses = async (): Promise<any> => {
  const url = String(process.env.MAGENTO_GET_WAREHOUSES_URL);
  const bearerToken = process.env.MAGENTO_TOKEN;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(url, options);

    const warehousesData = await res.json();
    const warehouses = warehousesData.map((warehouse: any) => {
      return { code: warehouse.code, name: warehouse.name };
    });

    return {
      success: true,
      message: "getting warehouses successfully",
      warehouses: warehouses,
    };
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    return {
      success: false,
      message: "getting warehouses Failed",
      warehouses: [],
    };
  }
};
