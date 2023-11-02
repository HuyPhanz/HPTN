export default function addKeys(data: {id: number}[]): any[] {
  return data.map((dt) => ({
    ...dt,
    key: dt.id,
  }));
}
