export default function getSharedConfig() {
  const IMPORT_START_DATE = "2021-05-01";
  const IMPORT_END_DATE = "2026-02-15";

  return Object.freeze({
    IMPORT_START_DATE,
    IMPORT_END_DATE,
    FILE_PREFIX: `${IMPORT_START_DATE}_${IMPORT_END_DATE}_`
  })
}
