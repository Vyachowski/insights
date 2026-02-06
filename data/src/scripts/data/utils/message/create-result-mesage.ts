export function createResultMessage(
  entityName: string,
  quantity: number | string,
  outputPath: string,
): string {
  return `✓ ${entityName} CSV successfully created \n\nPath: ${outputPath}\nTotal rows created: ${quantity}`;
}
