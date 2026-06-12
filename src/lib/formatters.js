export function formatUzbekPhone(value) {
  let numbers = String(value || "").replace(/\D/g, "");

  if (!numbers) {
    return "";
  }

  if (numbers && !numbers.startsWith("998")) {
    numbers = `998${numbers}`;
  }

  numbers = numbers.slice(0, 12);

  let formatted = "+998";

  if (numbers.length > 3) {
    formatted += ` ${numbers.slice(3, 5)}`;
  }

  if (numbers.length >= 6) {
    formatted += ` ${numbers.slice(5, 8)}`;
  }

  if (numbers.length >= 9) {
    formatted += ` ${numbers.slice(8, 10)}`;
  }

  if (numbers.length >= 11) {
    formatted += ` ${numbers.slice(10, 12)}`;
  }

  return formatted.trim();
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("uz-UZ").format(Number(value) || 0);
}

export function formatSom(value) {
  return `${formatNumber(value)} so'm`;
}

export function formatThousandSom(value) {
  const number = Number(value) || 0;
  return number > 0 ? `${formatNumber(number)} ming` : "-";
}

export function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
