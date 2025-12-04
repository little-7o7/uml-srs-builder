/**
 * Export Utilities
 * Converts product data to CSV and Excel formats
 */
import * as XLSX from 'xlsx';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

type Language = 'en' | 'ru';

const getHeaders = (language: Language) => ({
  name: language === 'ru' ? 'Название' : 'Product Name',
  category: language === 'ru' ? 'Категория' : 'Category',
  quantity: language === 'ru' ? 'Количество' : 'Quantity',
  price: language === 'ru' ? 'Цена (USD)' : 'Price (USD)',
  threshold: language === 'ru' ? 'Порог низкого запаса' : 'Low Stock Threshold',
  status: language === 'ru' ? 'Статус' : 'Status',
  value: language === 'ru' ? 'Стоимость (USD)' : 'Value (USD)',
});

const getStatusLabels = (language: Language) => ({
  outOfStock: language === 'ru' ? 'Нет в наличии' : 'Out of Stock',
  lowStock: language === 'ru' ? 'Мало на складе' : 'Low Stock',
  inStock: language === 'ru' ? 'В наличии' : 'In Stock',
});

const getStatus = (product: Product, labels: ReturnType<typeof getStatusLabels>) => {
  if (product.quantity === 0) return labels.outOfStock;
  if (product.quantity <= product.low_stock_threshold) return labels.lowStock;
  return labels.inStock;
};

const generateFilename = (reportType: 'full' | 'low-stock', language: Language, extension: string) => {
  const date = new Date().toISOString().split('T')[0];
  const prefix = language === 'ru' ? 'инвентарь' : 'inventory';
  const label = language === 'ru'
    ? (reportType === 'full' ? 'полный' : 'низкий-запас')
    : reportType;
  return `${prefix}-${label}-${date}.${extension}`;
};

/**
 * Export products to Excel (.xlsx) format
 */
export function exportToExcel(
  products: Product[],
  reportType: 'full' | 'low-stock' = 'full',
  language: Language = 'en'
): void {
  const headers = getHeaders(language);
  const statusLabels = getStatusLabels(language);

  // Prepare data for Excel
  const data = products.map(product => ({
    [headers.name]: product.name,
    [headers.category]: product.category,
    [headers.quantity]: product.quantity,
    [headers.price]: Number(product.price).toFixed(2),
    [headers.threshold]: product.low_stock_threshold,
    [headers.status]: getStatus(product, statusLabels),
    [headers.value]: (product.quantity * Number(product.price)).toFixed(2),
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths for better readability
  worksheet['!cols'] = [
    { wch: 30 }, // Name
    { wch: 20 }, // Category
    { wch: 12 }, // Quantity
    { wch: 15 }, // Price
    { wch: 20 }, // Threshold
    { wch: 15 }, // Status
    { wch: 15 }, // Value
  ];

  const sheetName = language === 'ru' ? 'Инвентарь' : 'Inventory';
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate filename and download
  const filename = generateFilename(reportType, language, 'xlsx');
  XLSX.writeFile(workbook, filename);
}

/**
 * Export products to CSV format
 */
export function exportToCSV(
  products: Product[],
  reportType: 'full' | 'low-stock' = 'full',
  language: Language = 'en'
): void {
  const headers = getHeaders(language);
  const statusLabels = getStatusLabels(language);
  const DELIMITER = ';';

  // CSV header row
  const headerRow = [
    headers.name,
    headers.category,
    headers.quantity,
    headers.price,
    headers.threshold,
    headers.status,
    headers.value,
  ].join(DELIMITER);

  // Convert each product to CSV row
  const rows = products.map(product => {
    const value = (product.quantity * Number(product.price)).toFixed(2);
    return [
      `"${product.name.replace(/"/g, '""')}"`,
      `"${product.category.replace(/"/g, '""')}"`,
      product.quantity,
      Number(product.price).toFixed(2),
      product.low_stock_threshold,
      getStatus(product, statusLabels),
      value,
    ].join(DELIMITER);
  });

  const csvContent = [headerRow, ...rows].join('\n');

  // Create blob with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Download file
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', generateFilename(reportType, language, 'csv'));
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
