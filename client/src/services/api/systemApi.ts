import type { HealthResponse } from "../../types/item";
import { apiClient } from "../http/apiClient";

export const getHealth = async () => {
  const { data } = await apiClient.get<HealthResponse>("/health");
  return data;
};
