export function normalizeCallImportData(
  callsImportData: { [k: string]: string | undefined }[],
): { [k: string]: string | number }[] {
  return callsImportData.map((call) => ({
    ...call,
    site_id: Number(call.site_id),
    call_number: Number(call.call_number),
    billsec: Number(call.billsec),
  }));
}
