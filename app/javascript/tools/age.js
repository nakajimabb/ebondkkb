export function age(birthday) {
  if(birthday) {
    const day = new Date(birthday);

    const y2 = day.getFullYear().toString().padStart(4, '0');
    const m2 = (day.getMonth() + 1).toString().padStart(2, '0');
    const d2 = day.getDate().toString().padStart(2, '0');

    const today = new Date();
    const y1 = today.getFullYear().toString().padStart(4, '0');
    const m1 = (today.getMonth() + 1).toString().padStart(2, '0');
    const d1 = today.getDate().toString().padStart(2, '0');

    return Math.floor((Number(y1 + m1 + d1) - Number(y2 + m2 + d2)) / 10000);
  }
}
