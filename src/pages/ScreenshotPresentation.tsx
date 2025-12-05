/**
 * SIMS - Screenshot Presentation
 * PPT-style presentation with real application screenshots
 * Functional and Non-functional requirements
 * 
 * @author SIMS Development Team
 * @version 1.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Languages,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  Database,
  Lock
} from "lucide-react";

// Import screenshots
import loginScreenshot from "@/assets/screenshots/login-page.png";
import dashboardScreenshot from "@/assets/screenshots/dashboard-screenshot.png";
import productTableScreenshot from "@/assets/screenshots/product-table.png";
import addProductScreenshot from "@/assets/screenshots/add-product-dialog.png";
import chartsScreenshot from "@/assets/screenshots/charts-screenshot.png";
import auditLogScreenshot from "@/assets/screenshots/audit-log.png";
import architectureDiagram from "@/assets/architecture-diagram.png";

type Language = "ru" | "en";

interface Slide {
  id: string;
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  type: "title" | "screenshot" | "requirements" | "architecture";
  screenshot?: string;
  content?: (lang: Language) => React.ReactNode;
}

const translations = {
  ru: {
    home: "На главную",
    slide: "Слайд",
    of: "из",
    download: "Скачать PDF",
    prev: "Назад",
    next: "Далее",
    lang: "RU",
    functional: "Функциональные требования",
    nonFunctional: "Нефункциональные требования",
  },
  en: {
    home: "Home",
    slide: "Slide",
    of: "of",
    download: "Download PDF",
    prev: "Previous",
    next: "Next",
    lang: "EN",
    functional: "Functional Requirements",
    nonFunctional: "Non-functional Requirements",
  },
};

const functionalRequirements = {
  ru: [
    { icon: Lock, text: "Аутентификация пользователей (вход/регистрация)" },
    { icon: Database, text: "Управление товарами (CRUD операции)" },
    { icon: CheckCircle2, text: "Отслеживание уровня запасов" },
    { icon: Zap, text: "Оповещения о низком уровне запасов" },
    { icon: Globe, text: "Многоязычный интерфейс (RU/EN)" },
    { icon: Shield, text: "Ролевая модель доступа (Admin/User/Viewer)" },
  ],
  en: [
    { icon: Lock, text: "User authentication (login/registration)" },
    { icon: Database, text: "Product management (CRUD operations)" },
    { icon: CheckCircle2, text: "Stock level tracking" },
    { icon: Zap, text: "Low stock alerts" },
    { icon: Globe, text: "Multilingual interface (RU/EN)" },
    { icon: Shield, text: "Role-based access control (Admin/User/Viewer)" },
  ],
};

const nonFunctionalRequirements = {
  ru: [
    { icon: Zap, title: "Производительность", text: "Время отклика < 2 секунд" },
    { icon: Shield, title: "Безопасность", text: "RLS политики, шифрование паролей" },
    { icon: Globe, title: "Доступность", text: "Адаптивный дизайн для всех устройств" },
    { icon: Database, title: "Надежность", text: "PostgreSQL с резервным копированием" },
    { icon: CheckCircle2, title: "Удобство", text: "Интуитивный интерфейс, темная тема" },
    { icon: Lock, title: "Масштабируемость", text: "Облачная инфраструктура Supabase" },
  ],
  en: [
    { icon: Zap, title: "Performance", text: "Response time < 2 seconds" },
    { icon: Shield, title: "Security", text: "RLS policies, password encryption" },
    { icon: Globe, title: "Accessibility", text: "Responsive design for all devices" },
    { icon: Database, title: "Reliability", text: "PostgreSQL with backup" },
    { icon: CheckCircle2, title: "Usability", text: "Intuitive interface, dark theme" },
    { icon: Lock, title: "Scalability", text: "Supabase cloud infrastructure" },
  ],
};

const slides: Slide[] = [
  {
    id: "title",
    title: { ru: "SIMS", en: "SIMS" },
    subtitle: { ru: "Simple Inventory Management System", en: "Simple Inventory Management System" },
    type: "title",
  },
  {
    id: "functional",
    title: { ru: "Функциональные требования", en: "Functional Requirements" },
    subtitle: { ru: "Основные возможности системы", en: "Core system capabilities" },
    type: "requirements",
    content: (lang) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {functionalRequirements[lang].map((req, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <req.icon className="h-6 w-6 text-primary flex-shrink-0" />
            <span className="text-sm md:text-base">{req.text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "login",
    title: { ru: "Экран входа", en: "Login Screen" },
    subtitle: { ru: "Аутентификация по логину и паролю", en: "Username and password authentication" },
    type: "screenshot",
    screenshot: loginScreenshot,
  },
  {
    id: "dashboard",
    title: { ru: "Главная панель", en: "Dashboard" },
    subtitle: { ru: "Обзор статистики и управление товарами", en: "Statistics overview and product management" },
    type: "screenshot",
    screenshot: dashboardScreenshot,
  },
  {
    id: "products",
    title: { ru: "Таблица товаров", en: "Product Table" },
    subtitle: { ru: "Полный список с фильтрацией и действиями", en: "Full list with filtering and actions" },
    type: "screenshot",
    screenshot: productTableScreenshot,
  },
  {
    id: "add-product",
    title: { ru: "Добавление товара", en: "Add Product" },
    subtitle: { ru: "Форма создания нового товара", en: "New product creation form" },
    type: "screenshot",
    screenshot: addProductScreenshot,
  },
  {
    id: "charts",
    title: { ru: "Аналитика и отчеты", en: "Analytics & Reports" },
    subtitle: { ru: "Визуализация данных инвентаря", en: "Inventory data visualization" },
    type: "screenshot",
    screenshot: chartsScreenshot,
  },
  {
    id: "audit",
    title: { ru: "Журнал изменений", en: "Audit Log" },
    subtitle: { ru: "История всех операций в системе", en: "History of all system operations" },
    type: "screenshot",
    screenshot: auditLogScreenshot,
  },
  {
    id: "nonfunctional",
    title: { ru: "Нефункциональные требования", en: "Non-functional Requirements" },
    subtitle: { ru: "Качественные характеристики системы", en: "System quality attributes" },
    type: "requirements",
    content: (lang) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {nonFunctionalRequirements[lang].map((req, i) => (
          <Card key={i} className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <req.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{req.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{req.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "architecture",
    title: { ru: "Архитектура системы", en: "System Architecture" },
    subtitle: { ru: "Технический стек и структура", en: "Technology stack and structure" },
    type: "architecture",
    screenshot: architectureDiagram,
    content: (lang) => (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"].map((tech) => (
          <Badge key={tech} variant="secondary" className="text-sm">
            {tech}
          </Badge>
        ))}
      </div>
    ),
  },
];

export default function ScreenshotPresentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState<Language>("ru");

  const t = translations[lang];
  const slide = slides[currentSlide];

  const toggleLang = () => setLang(lang === "ru" ? "en" : "ru");

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-4 w-4" />
            {t.home}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t.slide} {currentSlide + 1} {t.of} {slides.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleLang} className="gap-2">
              <Languages className="h-4 w-4" />
              {t.lang}
            </Button>
          </div>
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              {slide.title[lang]}
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg">
              {slide.subtitle[lang]}
            </p>
          </div>

          {/* Slide Body */}
          {slide.type === "title" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"].map((tech) => (
                  <Badge key={tech} variant="outline" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {slide.type === "screenshot" && slide.screenshot && (
            <Card className="overflow-hidden shadow-xl border-2">
              <img 
                src={slide.screenshot} 
                alt={slide.title[lang]}
                className="w-full h-auto object-contain max-h-[60vh]"
              />
            </Card>
          )}

          {slide.type === "requirements" && slide.content && (
            <div className="max-w-4xl mx-auto">
              {slide.content(lang)}
            </div>
          )}

          {slide.type === "architecture" && (
            <div className="flex flex-col items-center">
              {slide.screenshot && (
                <Card className="overflow-hidden shadow-xl border-2 mb-4">
                  <img 
                    src={slide.screenshot} 
                    alt={slide.title[lang]}
                    className="w-full h-auto object-contain max-h-[50vh]"
                  />
                </Card>
              )}
              {slide.content && slide.content(lang)}
            </div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.prev}
          </Button>

          {/* Slide dots */}
          <div className="flex gap-1.5 overflow-x-auto max-w-xs md:max-w-none">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide 
                    ? "bg-primary w-6" 
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === slides.length - 1}
            className="gap-2"
          >
            {t.next}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
