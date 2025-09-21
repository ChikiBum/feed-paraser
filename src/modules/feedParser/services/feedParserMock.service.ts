export async function parseFeed(url: string) {
  return [
    { title: "Новость 1", link: `${url}/1`, date: new Date().toISOString() },
    { title: "Новость 2", link: `${url}/2`, date: new Date().toISOString() }
  ];
}