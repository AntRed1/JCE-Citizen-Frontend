export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const formatCedula = (cedula: string): string => {
  // Remove any non-digit characters
  const digits = cedula.replace(/\D/g, "");

  // Apply Dominican cedula format XXX-XXXXXXX-X
  if (digits.length >= 3) {
    let formatted = digits.substring(0, 3);

    if (digits.length > 3) {
      formatted += "-" + digits.substring(3, 10);

      if (digits.length > 10) {
        formatted += "-" + digits.substring(10, 11);
      }
    }

    return formatted;
  }

  return digits;
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};
