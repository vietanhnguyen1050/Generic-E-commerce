import { useEffect, useState } from "react";
import { StatusCard } from "../components/common/StatusCard";
import { getItems, createItem } from "../features/items/services/itemsApi";
import { useHealth } from "../hooks/useHealth";
import { useAppContext } from "../context/AppContext";
import type { Item } from "../types/item";
import { formatIsoToLocal } from "../utils/date";

export const HomePage = () => {
  const { appName } = useAppContext();
  const { data: healthData, loading: healthLoading, error: healthError } = useHealth();
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItems();
        setItems(response);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Unable to load items.";
        setItemsError(message);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSeed = async () => {
    const generatedName = `Item ${items.length + 1}`;
    const created = await createItem({
      name: generatedName,
      description: "Seeded from starter home page"
    });
    setItems((prev) => [...prev, created]);
  };

  return (
    <main className="container">
      <h1>{appName}</h1>
      <p>Frontend and API are connected through a shared Axios client.</p>

      <button className="seed-button" onClick={handleSeed} type="button">
        Create Sample Item
      </button>

      <div className="grid">
        <StatusCard title="API Health">
          {healthLoading && <p>Checking...</p>}
          {healthError && <p className="error">{healthError}</p>}
          {healthData && (
            <>
              <p>Status: {healthData.status}</p>
              <p>Time: {formatIsoToLocal(healthData.timestamp)}</p>
            </>
          )}
        </StatusCard>

        <StatusCard title="Items">
          {itemsLoading && <p>Loading items...</p>}
          {itemsError && <p className="error">{itemsError}</p>}
          {!itemsLoading && !itemsError && items.length === 0 && <p>No items yet.</p>}
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                {item.description ? ` - ${item.description}` : ""}
              </li>
            ))}
          </ul>
        </StatusCard>
      </div>
    </main>
  );
};
