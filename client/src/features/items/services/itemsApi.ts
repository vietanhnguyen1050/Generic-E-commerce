import type { Item } from "../../../types/item";
import { apiClient } from "../../../services/http/apiClient";

export const getItems = async () => {
  const { data } = await apiClient.get<Item[]>("/items");
  return data;
};

export const createItem = async (payload: { name: string; description?: string }) => {
  const { data } = await apiClient.post<Item>("/items", payload);
  return data;
};
