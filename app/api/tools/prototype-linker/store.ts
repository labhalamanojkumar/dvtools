// Simple in-memory store for the prototype-linker API
// NOTE: Development/demo only. Not persisted.
export const PROTOTYPES: any[] = []

export function findPrototype(id: string) {
  return PROTOTYPES.find(p => p.id === id)
}
