export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (val) => {
  return new Intl.NumberFormat('es-MX').format(val);
};

export const formatPercentage = (val) => {
  return `${Number(val).toFixed(1)}%`;
};

export const formatDateTime = (dateString) => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateString;
  }
};

export const formatRelativeTime = (dateString) => {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return `Hace ${diffSec}s`;
    if (diffSec < 3600) return `Hace ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `Hace ${Math.floor(diffSec / 3600)} h`;
    return `Hace ${Math.floor(diffSec / 86400)} d`;
  } catch (e) {
    return dateString;
  }
};
