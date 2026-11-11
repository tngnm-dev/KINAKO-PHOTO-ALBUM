export async function loadPhotos(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`写真データを取得できませんでした`);
  }

  const photos = await res.json();
  if (!Array.isArray(photos)) {
    throw new Error(`jsonファイルの中身が配列データではありません`);
  }
  return photos;
}

export function makeYearGroups(photos) {
  const yearGroups = new Map();

  for (const photo of photos) {
    const photoDate = photo.date;
    let photoYear;
    if (photo.date !== null) {
      photoYear = photoDate.slice(0, 4);
    } else {
      photoYear = "不明";
    }

    if (!yearGroups.has(photoYear)) {
      yearGroups.set(photoYear, []);
    }
    yearGroups.get(photoYear).push(photo);
  }
  return yearGroups;
}