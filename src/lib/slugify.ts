export function slugifyVietnamese(str: string): string {
  if (!str) return '';
  let s = str.toLowerCase().trim();
  s = s.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  s = s.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  s = s.replace(/[ìíịỉĩ]/g, 'i');
  s = s.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  s = s.replace(/[ùúụủũưừứựửữ]/g, 'u');
  s = s.replace(/[ỳýỵỷỹ]/g, 'y');
  s = s.replace(/[đ]/g, 'd');
  s = s.replace(/[^a-z0-9\s-]/g, '');
  s = s.replace(/[\s-]+/g, '-');
  return s.replace(/^-+|-+$/g, '');
}
