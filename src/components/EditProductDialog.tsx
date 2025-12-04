/**
 * EditProductDialog.tsx - Диалог редактирования товара
 * 
 * Модальное окно для изменения данных существующего товара.
 * Включает валидацию данных и обработку ошибок.
 * 
 * @component
 * @example
 * <EditProductDialog 
 *   open={isOpen} 
 *   onOpenChange={setIsOpen} 
 *   product={selectedProduct}
 *   onSuccess={handleSuccess} 
 * />
 * 
 * @author University Project
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

/**
 * Схема валидации данных товара
 * Идентична схеме в AddProductDialog для консистентности
 */
const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200, "Name too long"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category too long"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  price: z.number().positive("Price must be greater than 0"),
  low_stock_threshold: z.number().int().min(0, "Threshold must be 0 or greater"),
});

/**
 * Интерфейс товара
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
 * Props для компонента EditProductDialog
 */
interface EditProductDialogProps {
  /** Флаг открытия диалога */
  open: boolean;
  /** Callback для изменения состояния открытия */
  onOpenChange: (open: boolean) => void;
  /** Редактируемый товар */
  product: Product;
  /** Callback, вызываемый после успешного обновления */
  onSuccess: () => void;
}

/**
 * Компонент диалога редактирования товара
 * 
 * Отличия от AddProductDialog:
 * - Предзаполнение формы данными товара
 * - Использование UPDATE вместо INSERT
 * - Синхронизация формы при смене товара
 */
export function EditProductDialog({ open, onOpenChange, product, onSuccess }: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);
  
  // Инициализация формы данными товара
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    price: Number(product.price),
    low_stock_threshold: product.low_stock_threshold,
  });
  
  const { toast } = useToast();
  const { t } = useLanguage();

  /**
   * Синхронизация формы при изменении редактируемого товара
   * Необходимо для корректного отображения данных при переключении между товарами
   */
  useEffect(() => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: Number(product.price),
      low_stock_threshold: product.low_stock_threshold,
    });
  }, [product]);

  /**
   * Обработчик отправки формы
   * 
   * Алгоритм:
   * 1. Валидация данных через Zod
   * 2. Обновление товара в Supabase по ID
   * 3. Обработка ошибок
   * 4. Закрытие диалога при успехе
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Валидация данных
      const validatedData = productSchema.parse({
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
      });

      setLoading(true);

      // Обновление товара в базе данных
      const { error } = await supabase
        .from("products")
        .update({
          name: validatedData.name,
          category: validatedData.category,
          quantity: validatedData.quantity,
          price: validatedData.price,
          low_stock_threshold: validatedData.low_stock_threshold,
        })
        .eq("id", product.id); // Фильтр по ID товара

      if (error) {
        // Проверка на дубликат
        if (error.code === "23505") {
          toast({
            title: t.duplicateProduct,
            description: t.duplicateProductDesc,
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Успешное обновление
      toast({
        title: t.productUpdated,
        description: t.productUpdatedDesc,
      });

      onOpenChange(false);
      onSuccess();
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t.validationError,
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.error,
          description: t.failedToUpdate,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.editProduct}</DialogTitle>
          <DialogDescription>
            {t.updateProductDetails}
          </DialogDescription>
        </DialogHeader>
        
        {/* Форма редактирования - структура идентична AddProductDialog */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название товара */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t.productName} *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.productNamePlaceholder}
              required
              maxLength={200}
            />
          </div>

          {/* Категория */}
          <div className="space-y-2">
            <Label htmlFor="edit-category">{t.category} *</Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t.categoryPlaceholder}
              required
              maxLength={100}
            />
          </div>

          {/* Количество и Цена */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">{t.quantity} *</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">{t.price} ($) *</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {/* Порог низкого запаса */}
          <div className="space-y-2">
            <Label htmlFor="edit-threshold">{t.lowStockThreshold} *</Label>
            <Input
              id="edit-threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t.alertWhenBelow}
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.updating : t.updateProductBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
