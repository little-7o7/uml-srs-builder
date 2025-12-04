import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ru";

interface Translations {
  // Header
  dashboard: string;
  simsDashboard: string;
  simsDescription: string;
  reports: string;
  logout: string;
  
  // Stats
  totalProducts: string;
  activeInventoryItems: string;
  totalValue: string;
  currentInventoryValue: string;
  lowStock: string;
  itemsNeedRestocking: string;
  outOfStock: string;
  itemsUnavailable: string;
  
  // Alerts
  lowStockAlert: string;
  productsRunningLow: string;
  units: string;
  
  // Table
  productInventory: string;
  manageStock: string;
  searchProducts: string;
  addProduct: string;
  name: string;
  category: string;
  quantity: string;
  price: string;
  threshold: string;
  status: string;
  actions: string;
  edit: string;
  delete: string;
  inStock: string;
  noProducts: string;
  noProductsFound: string;
  loading: string;
  
  // Dialogs
  addNewProduct: string;
  editProduct: string;
  deleteProduct: string;
  deleteConfirm: string;
  cancel: string;
  save: string;
  add: string;
  
  // Dialog form labels
  productName: string;
  enterProductDetails: string;
  updateProductDetails: string;
  lowStockThreshold: string;
  alertWhenBelow: string;
  addProductBtn: string;
  updateProductBtn: string;
  adding: string;
  updating: string;
  deleting: string;
  cannotBeUndone: string;
  
  // Toast messages
  productAdded: string;
  productAddedDesc: string;
  productUpdated: string;
  productUpdatedDesc: string;
  productDeleted: string;
  productDeletedDesc: string;
  duplicateProduct: string;
  duplicateProductDesc: string;
  validationError: string;
  error: string;
  failedToAdd: string;
  failedToUpdate: string;
  failedToDelete: string;
  
  // Placeholders
  productNamePlaceholder: string;
  categoryPlaceholder: string;
  
  // Reports
  inventoryReports: string;
  reportsDescription: string;
  backToDashboard: string;
  exportFull: string;
  exportLowStock: string;
  categoryBreakdown: string;
  items: string;
  value: string;
  lowStockItems: string;
  allInventory: string;
}

const translations: Record<Language, Translations> = {
  en: {
    dashboard: "Dashboard",
    simsDashboard: "SIMS Dashboard",
    simsDescription: "Simple Inventory Management System",
    reports: "Reports",
    logout: "Logout",
    
    totalProducts: "Total Products",
    activeInventoryItems: "Active inventory items",
    totalValue: "Total Value",
    currentInventoryValue: "Current inventory value",
    lowStock: "Low Stock",
    itemsNeedRestocking: "Items need restocking",
    outOfStock: "Out of Stock",
    itemsUnavailable: "Items unavailable",
    
    lowStockAlert: "Low Stock Alert",
    productsRunningLow: "product(s) are running low on stock",
    units: "units",
    
    productInventory: "Product Inventory",
    manageStock: "Manage your product stock and pricing",
    searchProducts: "Search products...",
    addProduct: "Add Product",
    name: "Name",
    category: "Category",
    quantity: "Quantity",
    price: "Price",
    threshold: "Threshold",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    inStock: "In Stock",
    noProducts: "No products in inventory",
    noProductsFound: "No products found matching",
    loading: "Loading...",
    
    addNewProduct: "Add New Product",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    deleteConfirm: "Are you sure you want to delete this product?",
    cancel: "Cancel",
    save: "Save",
    add: "Add",
    
    // Dialog form labels
    productName: "Product Name",
    enterProductDetails: "Enter product details to add to inventory",
    updateProductDetails: "Update product details and stock levels",
    lowStockThreshold: "Low Stock Threshold",
    alertWhenBelow: "Alert will show when quantity falls below this number",
    addProductBtn: "Add Product",
    updateProductBtn: "Update Product",
    adding: "Adding...",
    updating: "Updating...",
    deleting: "Deleting...",
    cannotBeUndone: "This action cannot be undone.",
    
    // Toast messages
    productAdded: "Product Added",
    productAddedDesc: "Product has been successfully added to inventory",
    productUpdated: "Product Updated",
    productUpdatedDesc: "Product information has been successfully updated",
    productDeleted: "Product Deleted",
    productDeletedDesc: "Product has been removed from inventory",
    duplicateProduct: "Duplicate Product",
    duplicateProductDesc: "A product with this name and category already exists",
    validationError: "Validation Error",
    error: "Error",
    failedToAdd: "Failed to add product. Please try again.",
    failedToUpdate: "Failed to update product. Please try again.",
    failedToDelete: "Failed to delete product. Please try again.",
    
    // Placeholders
    productNamePlaceholder: "e.g., Laptop, Phone, Monitor",
    categoryPlaceholder: "e.g., Electronics, Office Supplies",
    
    inventoryReports: "Inventory Reports",
    reportsDescription: "View and export inventory data",
    backToDashboard: "Back to Dashboard",
    exportFull: "Export Full Inventory",
    exportLowStock: "Export Low Stock",
    categoryBreakdown: "Category Breakdown",
    items: "items",
    value: "value",
    lowStockItems: "Low Stock Items",
    allInventory: "All Inventory",
  },
  ru: {
    dashboard: "Панель управления",
    simsDashboard: "SIMS Панель",
    simsDescription: "Система Управления Инвентарем",
    reports: "Отчеты",
    logout: "Выйти",
    
    totalProducts: "Всего товаров",
    activeInventoryItems: "Активные позиции",
    totalValue: "Общая стоимость",
    currentInventoryValue: "Текущая стоимость склада",
    lowStock: "Мало на складе",
    itemsNeedRestocking: "Требуется пополнение",
    outOfStock: "Нет в наличии",
    itemsUnavailable: "Товары отсутствуют",
    
    lowStockAlert: "Предупреждение о низком запасе",
    productsRunningLow: "товар(ов) заканчивается",
    units: "шт.",
    
    productInventory: "Инвентарь товаров",
    manageStock: "Управление запасами и ценами",
    searchProducts: "Поиск товаров...",
    addProduct: "Добавить товар",
    name: "Название",
    category: "Категория",
    quantity: "Количество",
    price: "Цена",
    threshold: "Порог",
    status: "Статус",
    actions: "Действия",
    edit: "Изменить",
    delete: "Удалить",
    inStock: "В наличии",
    noProducts: "Нет товаров на складе",
    noProductsFound: "Товары не найдены по запросу",
    loading: "Загрузка...",
    
    addNewProduct: "Добавить новый товар",
    editProduct: "Редактировать товар",
    deleteProduct: "Удалить товар",
    deleteConfirm: "Вы уверены, что хотите удалить этот товар?",
    cancel: "Отмена",
    save: "Сохранить",
    add: "Добавить",
    
    // Dialog form labels
    productName: "Название товара",
    enterProductDetails: "Введите данные товара для добавления в инвентарь",
    updateProductDetails: "Обновите данные товара и уровень запасов",
    lowStockThreshold: "Порог низкого запаса",
    alertWhenBelow: "Уведомление появится, когда количество упадет ниже этого числа",
    addProductBtn: "Добавить товар",
    updateProductBtn: "Обновить товар",
    adding: "Добавление...",
    updating: "Обновление...",
    deleting: "Удаление...",
    cannotBeUndone: "Это действие нельзя отменить.",
    
    // Toast messages
    productAdded: "Товар добавлен",
    productAddedDesc: "Товар успешно добавлен в инвентарь",
    productUpdated: "Товар обновлен",
    productUpdatedDesc: "Информация о товаре успешно обновлена",
    productDeleted: "Товар удален",
    productDeletedDesc: "Товар удален из инвентаря",
    duplicateProduct: "Дублирующийся товар",
    duplicateProductDesc: "Товар с таким названием и категорией уже существует",
    validationError: "Ошибка валидации",
    error: "Ошибка",
    failedToAdd: "Не удалось добавить товар. Попробуйте снова.",
    failedToUpdate: "Не удалось обновить товар. Попробуйте снова.",
    failedToDelete: "Не удалось удалить товар. Попробуйте снова.",
    
    // Placeholders
    productNamePlaceholder: "напр., Ноутбук, Телефон, Монитор",
    categoryPlaceholder: "напр., Электроника, Канцелярия",
    
    inventoryReports: "Отчеты по инвентарю",
    reportsDescription: "Просмотр и экспорт данных",
    backToDashboard: "Вернуться к панели",
    exportFull: "Экспорт полного отчета",
    exportLowStock: "Экспорт низкого запаса",
    categoryBreakdown: "По категориям",
    items: "позиций",
    value: "стоимость",
    lowStockItems: "Товары с низким запасом",
    allInventory: "Весь инвентарь",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("sims-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("sims-language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
