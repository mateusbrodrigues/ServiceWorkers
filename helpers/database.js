export default async function getZipCodeDatabase() {
  const { default: Dexie } = await import(
    'https://cdn.jsdelivr.net/npm/dexie@4.0.8/+esm'
  );
  const db = new Dexie('zipCodeDatabase');
  db.version(2).stores({
    zipCode: '&zipCode,location',
  });
  return db;
}
