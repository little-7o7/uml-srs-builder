/**
 * ProductTable.tsx - Компонент таблицы товаров
 * 
 * Отображает список товаров в виде таблицы с возможностью:
 * - Просмотра информации о товаре (название, категория, количество, цена)
 * - Отображения статуса запаса (в наличии, низкий запас, нет в наличии)
 * - Редактирования и удаления товаров (только для админов)
 * 
 * @component
 * @example
 * <ProductTable 
 *   products={products} 
 *   loading={false} 
 *   onRefresh={fetchProducts} 
 *   isAdmin={true} 
 * />
 * 
 * @author University Project
 * @version 1.0.0
 */

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Интерфейс для описания структуры товара
 * Соответствует структуре таблицы products в базе данных
 */
interface Product {
  /** Уникальный идентификатор товара (UUID) */
  id: string;
  /** Название товара */
  name: string;
  /** Категория товара */
  category: string;
  /** Количество на складе */
  quantity: number;
  /** Цена за единицу товара в USD */
  price: number;
  /** Порог низкого запаса для оповещений */
  low_stock_threshold: number;
}

/**
 * Props для компонента ProductTable
 */
interface ProductTableProps {
  /** Массив товаров для отображения */
  products: Product[];
  /** Флаг загрузки данных */
  loading: boolean;
  /** Callback для обновления списка товаров */
  onRefresh: () => void;
  /** Флаг наличия прав администратора (для редактирования/удаления) */
  isAdmin: boolean;
}

/**
 * Компонент таблицы товаров
 * 
 * Функциональность:
 * - Отображение товаров в табличном виде
 * - Цветовая индикация статуса запаса
 * - Модальные окна для редактирования и удаления
 * - Локализация всех текстов
 */
export function ProductTable({ products, loading, onRefresh, isAdmin }: ProductTableProps) {
  // Состояние для отслеживания редактируемого товара
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // Состояние для отслеживания удаляемого товара
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  // Хук локализации для получения переводов
  const { t } = useLanguage();

  /**
   * Определяет статус запаса товара и возвращает соответствующий Badge
   * 
   * @param product - Товар для проверки
   * @returns JSX элемент Badge с соответствующим цветом и текстом
   * 
   * Логика определения статуса:
   * - quantity === 0 → "Нет в наличии" (красный)
   * - quantity <= threshold → "Низкий запас" (жёлтый)
   * - quantity > threshold → "В наличии" (зелёный)
   */
  const getStockBadge = (product: Product) => {
    if (product.quantity === 0) {
      // Товар закончился - критический статус
      return <Badge variant="destructive">{t.outOfStock}</Badge>;
    } else if (product.quantity <= product.low_stock_threshold) {
      // Товар заканчивается - предупреждение
      return <Badge className="bg-warning text-warning-foreground">{t.lowStock}</Badge>;
    } else {
      // Товар в достаточном количестве - нормальный статус
      return <Badge className="bg-success text-success-foreground">{t.inStock}</Badge>;
    }
  };

  // Состояние загрузки - показываем спиннер
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Пустой список - показываем сообщение
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t.noProducts}</p>
      </div>
    );
  }

  return (
    <>
      {/* Основная таблица товаров */}
      <div className="rounded-md border">
        <Table>
          {/* Заголовок таблицы */}
          <TableHeader>
            <TableRow>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead className="text-right">{t.quantity}</TableHead>
              <TableHead className="text-right">{t.price}</TableHead>
              <TableHead>{t.status}</TableHead>
              {/* Колонка действий видна только админам */}
              {isAdmin && <TableHead className="text-right">{t.actions}</TableHead>}
            </TableRow>
          </TableHeader>
          
          {/* Тело таблицы - список товаров */}
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* Название товара */}
                <TableCell className="font-medium">{product.name}</TableCell>
                {/* Категория */}
                <TableCell>{product.category}</TableCell>
                {/* Количество (выравнивание вправо для чисел) */}
                <TableCell className="text-right">{product.quantity}</TableCell>
                {/* Цена в формате USD */}
                <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                {/* Статус запаса (Badge) */}
                <TableCell>{getStockBadge(product)}</TableCell>
                
                {/* Кнопки действий для админов */}
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Кнопка редактирования */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* Кнопка удаления */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Модальное окно редактирования товара */}
      {editingProduct && (
        <EditProductDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
          onSuccess={() => {
            setEditingProduct(null);
            onRefresh(); // Обновляем список после редактирования
          }}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {deletingProduct && (
        <DeleteProductDialog
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
          product={deletingProduct}
          onSuccess={() => {
            setDeletingProduct(null);
            onRefresh(); // Обновляем список после удаления
          }}
        />
      )}
    </>
  );
}
