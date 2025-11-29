// utils/format.ts
export const onlyDigits = (v: string) => v.replace(/\D/g, '');

export const formatCelular = (digits: string) => {
  if (!digits) return ''; // ← evita mostrar "(" quando vazio

  const d = digits.slice(0, 11);
  const part1 = d.slice(0, 2);
  const part2 = d.slice(2, 7);
  const part3 = d.slice(7);

  if (d.length <= 2) return `(${part1}`;
  if (d.length <= 7) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
};

export const formatCEP = (digits: string) => {
  const d = digits.slice(0, 8);  // 8 dígitos
  if (d.length <= 5) return d;
  return `${d.slice(0,5)}-${d.slice(5)}`;
};
