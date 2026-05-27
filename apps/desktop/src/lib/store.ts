type StoreRecord = Record<string, string>;

const memoryStore: StoreRecord = {};

export async function setValue(key: string, value: string): Promise<void> {
  memoryStore[key] = value;
}

export async function getValue(key: string): Promise<string | null> {
  return memoryStore[key] ?? null;
}

export async function deleteValue(key: string): Promise<void> {
  delete memoryStore[key];
}
