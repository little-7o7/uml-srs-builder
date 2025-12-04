/**
 * StatsCard.tsx - Карточка статистики
 * 
 * Компонент для отображения статистических данных на дашборде.
 * Поддерживает различные цветовые варианты для разных типов метрик.
 * 
 * @component
 * @example
 * <StatsCard
 *   title="Всего товаров"
 *   value={150}
 *   icon={Package}
 *   description="Активные позиции на складе"
 *   variant="default"
 * />
 * 
 * @author University Project
 * @version 1.0.0
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

/**
 * Props для компонента StatsCard
 */
interface StatsCardProps {
  /** Заголовок карточки (например, "Всего товаров") */
  title: string;
  /** Значение метрики (число или строка, например 150 или "$1,500.00") */
  value: string | number;
  /** Иконка из библиотеки Lucide */
  icon: LucideIcon;
  /** Описание метрики */
  description: string;
  /** 
   * Цветовой вариант карточки
   * - default: синий (основные метрики)
   * - success: зелёный (положительные показатели)
   * - warning: жёлтый (предупреждения)
   * - danger: красный (критические показатели)
   */
  variant?: "default" | "success" | "warning" | "danger";
}

/**
 * Компонент карточки статистики
 * 
 * Особенности:
 * - Анимация при наведении (подъём и тень)
 * - Цветовая индикация по типу метрики
 * - Градиентный текст для значения
 * - Иконка в цветном круге
 */
export function StatsCard({ title, value, icon: Icon, description, variant = "default" }: StatsCardProps) {
  /**
   * Цветовые схемы для разных вариантов
   * Используются CSS переменные из дизайн-системы
   */
  const variants = {
    default: "text-primary bg-primary/10",      // Основной цвет (синий)
    success: "text-success bg-success/10",      // Успех (зелёный)
    warning: "text-warning bg-warning/10",      // Предупреждение (жёлтый)
    danger: "text-destructive bg-destructive/10", // Опасность (красный)
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      {/* Заголовок с иконкой */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Текст заголовка */}
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {/* Иконка в цветном круге */}
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${variants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      
      {/* Контент карточки */}
      <CardContent>
        {/* Значение метрики с градиентом */}
        <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </div>
        {/* Описание */}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
