export const getMergedItems = (orderItems1: any, orderItems2: any): any[] => {
  if (orderItems1?.length > 0 && orderItems2?.length > 0) {
    const mergedItems: any[] = [];

    orderItems1?.map((item: any) => {
      const product = orderItems2?.find((p: any) => p.sku == item.sku);
      if (!product) {
        return;
      }
      mergedItems.push({ ...item, ...product });
    });

    return mergedItems;
  }
  return [];
};
