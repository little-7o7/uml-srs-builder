/**
 * AddProductDialog.tsx - Диалог добавления нового товара
 * 
 * Модальное окно с формой для создания нового товара в системе.
 * Включает валидацию данных с помощью Zod и обработку ошибок.
 * 
 * @component
 * @example
 * <AddProductDialog 
 *   open={isOpen} 
 *   onOpenChange={setIsOpen} 
 *   onSuccess={handleSuccess} 
 * />
 * 
 * @author University Project
 * @version 1.0.0
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

/**
 * Схема валидации данных товара с использованием Zod
 * 
 * Правила валидации:
 * - name: обязательное, 1-200 символов
 * - category: обязательное, 1-100 символов
 * - quantity: целое число >= 0
 * - price: положительное число
 * - low_stock_threshold: целое число >= 0
 */
const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200, "Name too long"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category too long"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  price: z.number().positive("Price must be greater than 0"),
  low_stock_threshold: z.number().int().min(0, "Threshold must be 0 or greater"),
});

/**
 * Props для компонента AddProductDialog
 */
interface AddProductDialogProps {
  /** Флаг открытия диалога */
  open: boolean;
  /** Callback для изменения состояния открытия */
  onOpenChange: (open: boolean) => void;
  /** Callback, вызываемый после успешного добавления */
  onSuccess: () => void;
}

/**
 * Компонент диалога добавления товара
 * 
 * Функциональность:
 * - Форма с полями: название, категория, количество, цена, порог низкого запаса
 * - Валидация всех полей перед отправкой
 * - Обработка ошибок (дубликаты, ошибки валидации)
 * - Локализация всех текстов
 */
export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  // Состояние загрузки (для блокировки кнопки при отправке)
  const [loading, setLoading] = useState(false);
  
  // Состояние формы с начальными значениями
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    low_stock_threshold: 10, // Значение по умолчанию
  });
  
  const { toast } = useToast();
  const { t } = useLanguage();

  /**
   * Обработчик отправки формы
   * 
   * Алгоритм:
   * 1. Валидация данных через Zod
   * 2. Отправка данных в Supabase
   * 3. Обработка ошибок (дубликаты, валидация)
   * 4. Очистка формы при успехе
   * 
   * @param e - Событие отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Шаг 1: Валидация данных
      const validatedData = productSchema.parse({
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
      });

      setLoading(true);

      // Шаг 2: Вставка товара в базу данных
      const { error } = await supabase
        .from("products")
        .insert([{
          name: validatedData.name,
          category: validatedData.category,
          quantity: validatedData.quantity,
          price: validatedData.price,
          low_stock_threshold: validatedData.low_stock_threshold,
        }]);

      // Шаг 3: Обработка ошибок
      if (error) {
        // Проверка на дубликат (код PostgreSQL 23505)
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

      // Шаг 4: Успешное добавление
      toast({
        title: t.productAdded,
        description: t.productAddedDesc,
      });

      // Сброс формы к начальным значениям
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        price: 0,
        low_stock_threshold: 10,
      });
      
      onOpenChange(false); // Закрываем диалог
      onSuccess(); // Вызываем callback для обновления списка
      
    } catch (error) {
      // Обработка ошибок валидации Zod
      if (error instanceof z.ZodError) {
        toast({
          title: t.validationError,
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        // Общая ошибка
        toast({
          title: t.error,
          description: t.failedToAdd,
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
        {/* Заголовок диалога */}
        <DialogHeader>
          <DialogTitle>{t.addNewProduct}</DialogTitle>
          <DialogDescription>
            {t.enterProductDetails}
          </DialogDescription>
        </DialogHeader>
        
        {/* Форма добавления товара */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле: Название товара */}
          <div className="space-y-2">
            <Label htmlFor="name">{t.productName} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.productNamePlaceholder}
              required
              maxLength={200}
            />
          </div>

          {/* Поле: Категория */}
          <div className="space-y-2">
            <Label htmlFor="category">{t.category} *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t.categoryPlaceholder}
              required
              maxLength={100}
            />
          </div>

          {/* Поля в две колонки: Количество и Цена */}
          <div className="grid grid-cols-2 gap-4">
            {/* Поле: Количество */}
            <div className="space-y-2">
              <Label htmlFor="quantity">{t.quantity} *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Поле: Цена */}
            <div className="space-y-2">
              <Label htmlFor="price">{t.price} ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {/* Поле: Порог низкого запаса */}
          <div className="space-y-2">
            <Label htmlFor="threshold">{t.lowStockThreshold} *</Label>
            <Input
              id="threshold"
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

          {/* Кнопки действий */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.adding : t.addProductBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
