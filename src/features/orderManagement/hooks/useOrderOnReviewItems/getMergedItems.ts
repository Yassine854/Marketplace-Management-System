export const getMergedItems = (orderItems1: any, orderItems2: any): any[] => {
  if (orderItems1 && orderItems2) {
    const mergedItems = orderItems1.map((item: any) => {
      const product = orderItems2?.find((p: any) => p.sku == item.sku);

      return { ...item, ...product };
    });

    return mergedItems;
  }
  return [];
};
