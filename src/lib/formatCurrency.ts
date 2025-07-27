export const formatCurrency = (number: number) => {
    const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
    });
    return CURRENCY_FORMATTER.format(number);
};
  
export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}
