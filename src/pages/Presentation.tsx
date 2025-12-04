/**
 * Presentation.tsx
 * 
 * Страница презентации проекта SIMS для университета.
 * Отображает ключевую информацию об архитектуре, технологиях и функциях системы.
 * Поддерживает экспорт в PDF через функцию печати браузера.
 * 
 * @author University Project
 * @version 1.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Database, 
  Shield, 
  Users, 
  BarChart3, 
  Globe, 
  Moon, 
  FileText,
  ArrowRight,
  ArrowLeft,
  Home,
  Layers,
  Lock,
  Code,
  CheckCircle,
  Printer
} from "lucide-react";

/**
 * Интерфейс для слайда презентации
 */
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

/**
 * Компонент страницы презентации
 */
export default function Presentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * Экспорт в PDF через функцию печати браузера
   * Пользователь может выбрать "Сохранить как PDF" в диалоге печати
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Массив слайдов презентации
   */
  const slides: Slide[] = [
    // Слайд 1: Титульный
    {
      id: 1,
      title: "SIMS",
      subtitle: "Simple Inventory Management System",
      content: (
        <div className="text-center space-y-6">
          <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Package className="h-14 w-14 text-primary-foreground" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Веб-приложение для управления товарными запасами с поддержкой 
            аутентификации, ролевой модели доступа и многоязычного интерфейса
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm px-4 py-2">React</Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">TypeScript</Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">Tailwind CSS</Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">PostgreSQL</Badge>
          </div>
        </div>
      ),
    },
    // Слайд 2: Архитектура
    {
      id: 2,
      title: "Архитектура системы",
      subtitle: "Трёхуровневая архитектура",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Presentation Layer</CardTitle>
                <CardDescription>Уровень представления</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• React компоненты</p>
                <p>• Shadcn/UI</p>
                <p>• Tailwind CSS</p>
                <p>• Recharts</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/30 bg-secondary/5">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
                  <Code className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Business Layer</CardTitle>
                <CardDescription>Бизнес-логика</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• React Contexts</p>
                <p>• Custom Hooks</p>
                <p>• Утилиты экспорта</p>
                <p>• Валидация данных</p>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-accent/5">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                  <Database className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Data Layer</CardTitle>
                <CardDescription>Уровень данных</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>• PostgreSQL</p>
                <p>• Supabase SDK</p>
                <p>• RLS Policies</p>
                <p>• Триггеры аудита</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    // Слайд 3: Технологии
    {
      id: 3,
      title: "Технологический стек",
      subtitle: "Современные технологии веб-разработки",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "React 18", desc: "UI библиотека", color: "bg-blue-500/10 text-blue-500" },
            { name: "TypeScript", desc: "Типизация", color: "bg-blue-600/10 text-blue-600" },
            { name: "Tailwind", desc: "CSS фреймворк", color: "bg-cyan-500/10 text-cyan-500" },
            { name: "PostgreSQL", desc: "База данных", color: "bg-indigo-500/10 text-indigo-500" },
            { name: "Shadcn/UI", desc: "UI компоненты", color: "bg-zinc-500/10 text-zinc-500" },
            { name: "React Router", desc: "Маршрутизация", color: "bg-red-500/10 text-red-500" },
            { name: "Recharts", desc: "Графики", color: "bg-green-500/10 text-green-500" },
            { name: "Zod", desc: "Валидация", color: "bg-purple-500/10 text-purple-500" },
          ].map((tech) => (
            <Card key={tech.name} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${tech.color}`}>
                  {tech.name}
                </div>
                <p className="text-sm text-muted-foreground">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    // Слайд 4: Функции
    {
      id: 4,
      title: "Основные функции",
      subtitle: "Что умеет система",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Package, title: "Управление товарами", desc: "CRUD операции: создание, чтение, обновление, удаление товаров" },
            { icon: BarChart3, title: "Аналитика", desc: "Графики и диаграммы для визуализации данных о запасах" },
            { icon: FileText, title: "Отчёты", desc: "Экспорт данных в CSV и Excel форматы" },
            { icon: Shield, title: "Аудит", desc: "История всех изменений с детализацией" },
            { icon: Globe, title: "Локализация", desc: "Поддержка английского и русского языков" },
            { icon: Moon, title: "Темы", desc: "Светлая и тёмная темы оформления" },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    // Слайд 5: Безопасность
    {
      id: 5,
      title: "Безопасность",
      subtitle: "Защита данных и доступа",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ролевая модель (RBAC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <Badge className="mb-2 bg-primary">Admin</Badge>
                  <p className="text-xs text-muted-foreground">Полный доступ</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10">
                  <Badge variant="secondary" className="mb-2">User</Badge>
                  <p className="text-xs text-muted-foreground">CRUD товаров</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <Badge variant="outline" className="mb-2">Viewer</Badge>
                  <p className="text-xs text-muted-foreground">Только просмотр</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Row Level Security (RLS)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Все таблицы защищены политиками безопасности на уровне строк PostgreSQL.</p>
              <p className="mt-2">Доступ к данным контролируется на уровне базы данных, а не приложения.</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // Слайд 6: База данных
    {
      id: 6,
      title: "Структура базы данных",
      subtitle: "ERD диаграмма",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  products
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-mono space-y-1">
                <p><span className="text-primary">id</span> UUID PK</p>
                <p><span className="text-primary">name</span> TEXT</p>
                <p><span className="text-primary">category</span> TEXT</p>
                <p><span className="text-primary">quantity</span> INTEGER</p>
                <p><span className="text-primary">price</span> DECIMAL</p>
                <p><span className="text-primary">low_stock_threshold</span> INTEGER</p>
              </CardContent>
            </Card>

            <Card className="border-secondary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  user_roles
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-mono space-y-1">
                <p><span className="text-secondary">id</span> UUID PK</p>
                <p><span className="text-secondary">user_id</span> UUID FK</p>
                <p><span className="text-secondary">role</span> ENUM</p>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  audit_log
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-mono space-y-1">
                <p><span className="text-accent-foreground">id</span> UUID PK</p>
                <p><span className="text-accent-foreground">action</span> TEXT</p>
                <p><span className="text-accent-foreground">old_data</span> JSONB</p>
                <p><span className="text-accent-foreground">new_data</span> JSONB</p>
                <p><span className="text-accent-foreground">user_email</span> TEXT</p>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-mono space-y-1">
                <p><span className="text-muted-foreground">id</span> UUID PK</p>
                <p><span className="text-muted-foreground">user_id</span> UUID FK</p>
                <p><span className="text-muted-foreground">email</span> TEXT</p>
                <p><span className="text-muted-foreground">full_name</span> TEXT</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    // Слайд 7: Итоги
    {
      id: 7,
      title: "Итоги",
      subtitle: "Что реализовано в проекте",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Аутентификация пользователей",
              "Ролевая модель доступа (RBAC)",
              "CRUD операции для товаров",
              "Отслеживание низкого запаса",
              "Визуализация данных (графики)",
              "Экспорт в CSV и Excel",
              "Аудит лог изменений",
              "Многоязычный интерфейс",
              "Тёмная и светлая темы",
              "Row Level Security",
              "Адаптивный дизайн",
              "Современный UI/UX",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button onClick={() => navigate("/")} size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Перейти в приложение
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header - скрывается при печати */}
      <header className="border-b bg-card/80 backdrop-blur-sm p-4 print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-4 w-4" />
            На главную
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Слайд {currentSlide + 1} / {slides.length}
            </span>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Печать / PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Контент слайда */}
      <main className="flex-1 container mx-auto p-6 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full bg-background p-8 rounded-lg print:shadow-none">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
            <p className="text-xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
          </div>
          
          <div className="min-h-[400px]">
            {slides[currentSlide].content}
          </div>
        </div>
      </main>

      {/* Footer - скрывается при печати */}
      <footer className="border-t bg-card/80 backdrop-blur-sm p-4 print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? "bg-primary w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="gap-2"
          >
            Далее
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
