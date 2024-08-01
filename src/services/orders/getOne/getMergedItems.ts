export const getMergedItems = ({
  magentoOrderProducts,
  typesenseOrderItems,
}: any): any[] => {
  if (typesenseOrderItems?.length > 0 && magentoOrderProducts?.length > 0) {
    const mergedItems: any[] = [];

    typesenseOrderItems?.foreach((item: any) => {
      const product = magentoOrderProducts?.find((p: any) => p.sku == item.sku);
      if (product) {
        console.log("🚀 ~ typesenseOrderItems?.foreach ~ product:", product);
        mergedItems.push({ ...item, ...product });
      }
    });
    console.log("🚀 ~ mergedItems:", mergedItems);

    return mergedItems;
  }
  return [];
};
