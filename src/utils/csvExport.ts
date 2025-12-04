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

/**
 * Converts an array of products to CSV format
 * @param products - Array of product objects
 * @returns CSV string
 */
export function productsToCSV(products: Product[]): string {
  // CSV header row
  const headers = ['Product Name', 'Category', 'Quantity', 'Price (USD)', 'Low Stock Threshold', 'Status', 'Value (USD)'];
  
  // Convert each product to a CSV row
  const rows = products.map(product => {
    const status = product.quantity === 0 
      ? 'Out of Stock' 
      : product.quantity <= product.low_stock_threshold 
        ? 'Low Stock' 
        : 'In Stock';
    const value = (product.quantity * Number(product.price)).toFixed(2);
    
    return [
      `"${product.name.replace(/"/g, '""')}"`, // Escape quotes in name
      `"${product.category.replace(/"/g, '""')}"`,
      product.quantity,
      Number(product.price).toFixed(2),
      product.low_stock_threshold,
      status,
      value
    ].join(',');
  });
  
  // Combine header and rows
  return [headers.join(','), ...rows].join('\n');
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
 */
export function exportProductsToCSV(
  products: Product[], 
  reportType: 'full' | 'low-stock' = 'full'
): void {
  const csvContent = productsToCSV(products);
  const date = new Date().toISOString().split('T')[0];
  const filename = `inventory-${reportType}-report-${date}.csv`;
  downloadCSV(csvContent, filename);
}
