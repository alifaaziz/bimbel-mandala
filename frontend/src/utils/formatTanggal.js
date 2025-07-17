export function formatTanggal(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.slice(0, 10).split('-');
  const bulanIndo = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${Number(day)} ${bulanIndo[Number(month)]} ${year}`;
}

export function formatWaktu(isoString) {
  if (!isoString) return '';
  return isoString.slice(11, 16);
}