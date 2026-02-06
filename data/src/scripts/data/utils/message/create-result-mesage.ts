export function createResultMessage(
  entityName: string,
  quantity: number | string,
): string {
  return `${entityName} were successfully created. Total rows created: ${quantity}`;
}
