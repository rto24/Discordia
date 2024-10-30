export type storeItem = {
  id: number,
  name: string,
  description: string,
  price: number,
  tier: "Common" | "Rare" | "Epic" | "Legendary",
  type: string,
}