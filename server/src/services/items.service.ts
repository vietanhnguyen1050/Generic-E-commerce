import type { CreateItemInput, Item, UpdateItemInput } from "../types/item.js";
import { HttpError } from "../utils/http-error.js";

class ItemsService {
  private items: Item[] = [];
  private sequence = 1;

  list(): Item[] {
    return this.items;
  }

  getById(id: string): Item {
    const item = this.items.find((entry) => entry.id === id);
    if (!item) {
      throw new HttpError(404, "Item not found.");
    }
    return item;
  }

  create(input: CreateItemInput): Item {
    const now = new Date().toISOString();
    const item: Item = {
      id: String(this.sequence++),
      name: input.name,
      description: input.description,
      createdAt: now,
      updatedAt: now
    };
    this.items.push(item);
    return item;
  }

  update(id: string, input: UpdateItemInput): Item {
    const item = this.getById(id);

    if (input.name !== undefined) {
      item.name = input.name;
    }
    if (input.description !== undefined) {
      item.description = input.description;
    }
    item.updatedAt = new Date().toISOString();

    return item;
  }

  remove(id: string): void {
    const beforeCount = this.items.length;
    this.items = this.items.filter((entry) => entry.id !== id);
    if (beforeCount === this.items.length) {
      throw new HttpError(404, "Item not found.");
    }
  }
}

export const itemsService = new ItemsService();
