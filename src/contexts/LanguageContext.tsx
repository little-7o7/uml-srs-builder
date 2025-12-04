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
