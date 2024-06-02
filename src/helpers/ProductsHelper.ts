import { BasketProduct } from "../pages/main/components/ProductCard.page";

export function groupProducts(products: BasketProduct[]): BasketProduct[] {
  const groupedProducts: Map<number, BasketProduct> = new Map();

  // Iterate through the products
  for (const product of products) {
    // If the product ID is already in the map, increment its count
    if (groupedProducts.has(product.id)) {
      const existingProduct = groupedProducts.get(product.id)!;
      existingProduct.basketCount++;
    } else {
      // Otherwise, add the product to the map with count 1
      const newProduct: BasketProduct = { ...product, basketCount: 1 };
      groupedProducts.set(product.id, newProduct);
    }
  }

  const result: BasketProduct[] = Array.from(groupedProducts.values());
  return result;
}

export function getProductsCount(products: BasketProduct[]): number {
  return products.reduce((acc, item) => (acc += item.basketCount), 0);
}
