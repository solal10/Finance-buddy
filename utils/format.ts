export const formatCurrency = (amount: number, currency = 'USD'): string => {
  const symbol = currency === 'EUR' ? '€' : 
                currency === 'ILS' ? '₪' : '$';
  
  return `${symbol}${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string, language = 'en'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonthYear = (dateString: string, language = 'en'): string => {
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const getMonthName = (month: number, language = 'en'): string => {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' });
};