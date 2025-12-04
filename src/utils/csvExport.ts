/**
 * CSV Export Utility
 * Converts product data to CSV format and triggers download
 */

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

// Use semicolon for better Excel compatibility (especially Russian/European locales)
const DELIMITER = ';';

/**
 * Escapes a value for CSV format
 */
function escapeCSV(value: string | number): string {
  const str = String(value);
  // If contains delimiter, quotes, or newlines - wrap in quotes and escape existing quotes
  if (str.includes(DELIMITER) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an array of products to CSV format
 * @param products - Array of product objects
 * @param language - Language for headers ('en' | 'ru')
 * @returns CSV string
 */
export function productsToCSV(products: Product[], language: 'en' | 'ru' = 'en'): string {
  // Headers based on language
  const headers = language === 'ru' 
    ? ['Название', 'Категория', 'Количество', 'Цена (USD)', 'Порог низкого запаса', 'Статус', 'Стоимость (USD)']
    : ['Product Name', 'Category', 'Quantity', 'Price (USD)', 'Low Stock Threshold', 'Status', 'Value (USD)'];
  
  const statusLabels = language === 'ru'
    ? { outOfStock: 'Нет в наличии', lowStock: 'Мало на складе', inStock: 'В наличии' }
    : { outOfStock: 'Out of Stock', lowStock: 'Low Stock', inStock: 'In Stock' };

  // Convert each product to a CSV row
  const rows = products.map(product => {
    const status = product.quantity === 0 
      ? statusLabels.outOfStock
      : product.quantity <= product.low_stock_threshold 
        ? statusLabels.lowStock
        : statusLabels.inStock;
    const value = (product.quantity * Number(product.price)).toFixed(2);
    
    return [
      escapeCSV(product.name),
      escapeCSV(product.category),
      product.quantity,
      Number(product.price).toFixed(2),
      product.low_stock_threshold,
      status,
      value
    ].join(DELIMITER);
  });
  
  // Combine header and rows
  return [headers.join(DELIMITER), ...rows].join('\n');
}

/**
 * Triggers a download of the CSV file
 * @param csvContent - CSV string content
 * @param filename - Name of the downloaded file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create blob with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export products to CSV and trigger download
 * @param products - Array of products to export
 * @param reportType - Type of report for filename
 * @param language - Language for content
 */
export function exportProductsToCSV(
  products: Product[], 
  reportType: 'full' | 'low-stock' = 'full',
  language: 'en' | 'ru' = 'en'
): void {
  const csvContent = productsToCSV(products, language);
  const date = new Date().toISOString().split('T')[0];
  const filenamePrefix = language === 'ru' ? 'инвентарь' : 'inventory';
  const reportLabel = language === 'ru' 
    ? (reportType === 'full' ? 'полный' : 'низкий-запас')
    : reportType;
  const filename = `${filenamePrefix}-${reportLabel}-${date}.csv`;
  downloadCSV(csvContent, filename);
}
