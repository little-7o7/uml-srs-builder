/**
 * Presentation.tsx
 * 
 * Bilingual presentation page for SIMS university project.
 * Supports both Russian and English languages.
 * Contains comprehensive information about architecture, technologies, and features.
 * 
 * @author University Project
 * @version 2.0.0
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
  Printer,
  Languages,
  LogIn,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Download,
  PieChart,
  AlertTriangle,
  Settings,
  Eye,
  ShieldCheck,
  Table,
  History,
  Zap,
  Monitor,
  Server,
  HardDrive
} from "lucide-react";

// Import generated images
import dashboardMockup from "@/assets/dashboard-mockup.png";
import databaseSchema from "@/assets/database-schema.png";
import architectureDiagram from "@/assets/architecture-diagram.png";

type Language = "ru" | "en";

interface Translations {
  ru: { [key: string]: string };
  en: { [key: string]: string };
}

const translations: Translations = {
  ru: {
    home: "На главную",
    slide: "Слайд",
    of: "из",
    print: "Печать / PDF",
    prev: "Назад",
    next: "Далее",
    lang: "RU",
  },
  en: {
    home: "Home",
    slide: "Slide",
    of: "of",
    print: "Print / PDF",
    prev: "Previous",
    next: "Next",
    lang: "EN",
  },
};

interface Slide {
  id: number;
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  content: (lang: Language) => React.ReactNode;
}

export default function Presentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState<Language>("ru");

  const t = translations[lang];

  const handlePrint = () => window.print();

  const toggleLang = () => setLang(lang === "ru" ? "en" : "ru");

  const slides: Slide[] = [
    // 1. Title slide
    {
      id: 1,
      title: { ru: "SIMS", en: "SIMS" },
      subtitle: { 
        ru: "Simple Inventory Management System", 
        en: "Simple Inventory Management System" 
      },
      content: (lang) => (
        <div className="text-center space-y-6">
          <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Package className="h-14 w-14 text-primary-foreground" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {lang === "ru" 
              ? "Веб-приложение для управления товарными запасами с поддержкой аутентификации, ролевой модели доступа и многоязычного интерфейса"
              : "Web application for inventory management with authentication, role-based access control, and multilingual interface support"}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-4 py-2">{tech}</Badge>
            ))}
          </div>
        </div>
      ),
    },
    // 2. Project Overview
    {
      id: 2,
      title: { ru: "Обзор проекта", en: "Project Overview" },
      subtitle: { ru: "Цели и задачи", en: "Goals and Objectives" },
      content: (lang) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {lang === "ru" ? "Цель проекта" : "Project Goal"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {lang === "ru" 
                ? "Разработка полнофункциональной системы управления складскими запасами для малого и среднего бизнеса с современным пользовательским интерфейсом."
                : "Development of a fully functional inventory management system for small and medium businesses with a modern user interface."}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {lang === "ru" ? "Задачи" : "Tasks"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(lang === "ru" ? [
                  "Реализация аутентификации пользователей",
                  "Создание системы ролей (RBAC)",
                  "CRUD операции для товаров",
                  "Визуализация данных",
                  "Экспорт отчётов",
                  "Аудит изменений",
                ] : [
                  "User authentication implementation",
                  "Role-based access control (RBAC)",
                  "CRUD operations for products",
                  "Data visualization",
                  "Report export functionality",
                  "Change audit logging",
                ]).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 3. Architecture
    {
      id: 3,
      title: { ru: "Архитектура системы", en: "System Architecture" },
      subtitle: { ru: "Трёхуровневая архитектура", en: "Three-tier Architecture" },
      content: (lang) => (
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <img src={architectureDiagram} alt="Architecture" className="rounded-lg shadow-lg max-h-48 object-contain" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Presentation Layer</CardTitle>
                <CardDescription>{lang === "ru" ? "Уровень представления" : "User Interface"}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p>• React 18 + TypeScript</p>
                <p>• Shadcn/UI Components</p>
                <p>• Tailwind CSS</p>
                <p>• Recharts</p>
              </CardContent>
            </Card>
            <Card className="border-secondary/30 bg-secondary/5">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
                  <Server className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-base">Business Layer</CardTitle>
                <CardDescription>{lang === "ru" ? "Бизнес-логика" : "Business Logic"}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p>• React Contexts</p>
                <p>• Custom Hooks</p>
                <p>• Zod Validation</p>
                <p>• Export Utils</p>
              </CardContent>
            </Card>
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                  <HardDrive className="h-5 w-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-base">Data Layer</CardTitle>
                <CardDescription>{lang === "ru" ? "Уровень данных" : "Data Storage"}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p>• PostgreSQL</p>
                <p>• Supabase SDK</p>
                <p>• RLS Policies</p>
                <p>• Triggers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    // 4. Technology Stack
    {
      id: 4,
      title: { ru: "Технологический стек", en: "Technology Stack" },
      subtitle: { ru: "Используемые технологии", en: "Technologies Used" },
      content: () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "React 18", desc: "UI Library", color: "bg-blue-500/10 text-blue-600" },
            { name: "TypeScript", desc: "Type Safety", color: "bg-blue-600/10 text-blue-700" },
            { name: "Tailwind CSS", desc: "Styling", color: "bg-cyan-500/10 text-cyan-600" },
            { name: "PostgreSQL", desc: "Database", color: "bg-indigo-500/10 text-indigo-600" },
            { name: "Supabase", desc: "Backend", color: "bg-green-500/10 text-green-600" },
            { name: "Shadcn/UI", desc: "Components", color: "bg-zinc-500/10 text-zinc-600" },
            { name: "React Router", desc: "Routing", color: "bg-red-500/10 text-red-600" },
            { name: "Recharts", desc: "Charts", color: "bg-orange-500/10 text-orange-600" },
            { name: "Zod", desc: "Validation", color: "bg-purple-500/10 text-purple-600" },
            { name: "TanStack Query", desc: "Data Fetching", color: "bg-rose-500/10 text-rose-600" },
            { name: "Lucide", desc: "Icons", color: "bg-amber-500/10 text-amber-600" },
            { name: "xlsx", desc: "Excel Export", color: "bg-emerald-500/10 text-emerald-600" },
          ].map((tech) => (
            <Card key={tech.name} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-3">
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-1 ${tech.color}`}>
                  {tech.name}
                </div>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    // 5. Authentication
    {
      id: 5,
      title: { ru: "Аутентификация", en: "Authentication" },
      subtitle: { ru: "Система входа и регистрации", en: "Login and Registration System" },
      content: (lang) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LogIn className="h-5 w-5 text-primary" />
                  {lang === "ru" ? "Вход в систему" : "Login"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{lang === "ru" ? "• Аутентификация по имени пользователя и паролю" : "• Username and password authentication"}</p>
                <p>{lang === "ru" ? "• Безопасное хранение паролей (bcrypt)" : "• Secure password storage (bcrypt)"}</p>
                <p>{lang === "ru" ? "• JWT токены для сессий" : "• JWT tokens for sessions"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="h-5 w-5 text-green-500" />
                  {lang === "ru" ? "Регистрация" : "Registration"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{lang === "ru" ? "• Автоматическое подтверждение email" : "• Auto-confirm email"}</p>
                <p>{lang === "ru" ? "• Валидация данных на клиенте" : "• Client-side validation"}</p>
                <p>{lang === "ru" ? "• Создание профиля пользователя" : "• User profile creation"}</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-card border rounded-lg p-6 shadow-lg max-w-xs w-full">
              <div className="text-center mb-4">
                <div className="h-12 w-12 mx-auto rounded-xl bg-primary flex items-center justify-center mb-2">
                  <Package className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-primary">SIMS</h3>
                <p className="text-xs text-muted-foreground">Simple Inventory Management</p>
              </div>
              <div className="space-y-3">
                <div className="h-9 bg-muted rounded border text-xs flex items-center px-3 text-muted-foreground">Username</div>
                <div className="h-9 bg-muted rounded border text-xs flex items-center px-3 text-muted-foreground">••••••••</div>
                <div className="h-9 bg-primary rounded text-xs flex items-center justify-center text-primary-foreground font-medium">Log In</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // 6. Role-Based Access Control
    {
      id: 6,
      title: { ru: "Ролевая модель (RBAC)", en: "Role-Based Access Control" },
      subtitle: { ru: "Три уровня доступа", en: "Three Access Levels" },
      content: (lang) => (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { 
                role: "Admin", 
                color: "bg-primary", 
                icon: ShieldCheck,
                perms: lang === "ru" 
                  ? ["Полный доступ", "Экспорт отчётов", "Просмотр аудита", "Управление товарами"]
                  : ["Full access", "Export reports", "View audit log", "Manage products"]
              },
              { 
                role: "User", 
                color: "bg-secondary", 
                icon: Users,
                perms: lang === "ru"
                  ? ["CRUD товаров", "Просмотр отчётов", "Без экспорта", "Без аудита"]
                  : ["CRUD products", "View reports", "No export", "No audit"]
              },
              { 
                role: "Viewer", 
                color: "bg-muted", 
                icon: Eye,
                perms: lang === "ru"
                  ? ["Только просмотр", "Отчёты", "Нет изменений", "Нет удаления"]
                  : ["Read-only", "Reports view", "No modifications", "No deletions"]
              },
            ].map((item) => (
              <Card key={item.role} className="text-center">
                <CardHeader className="pb-2">
                  <div className={`h-12 w-12 mx-auto rounded-full ${item.color} flex items-center justify-center mb-2`}>
                    <item.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge className={item.color}>{item.role}</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.perms.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{lang === "ru" ? "Функция" : "Feature"}</th>
                      <th className="text-center py-2">Admin</th>
                      <th className="text-center py-2">User</th>
                      <th className="text-center py-2">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: lang === "ru" ? "Просмотр товаров" : "View products", admin: true, user: true, viewer: true },
                      { feature: lang === "ru" ? "Добавление товаров" : "Add products", admin: true, user: true, viewer: false },
                      { feature: lang === "ru" ? "Редактирование" : "Edit products", admin: true, user: true, viewer: false },
                      { feature: lang === "ru" ? "Удаление" : "Delete products", admin: true, user: true, viewer: false },
                      { feature: lang === "ru" ? "Экспорт отчётов" : "Export reports", admin: true, user: false, viewer: false },
                      { feature: lang === "ru" ? "Аудит лог" : "Audit log", admin: true, user: false, viewer: false },
                    ].map((row) => (
                      <tr key={row.feature} className="border-b">
                        <td className="py-2">{row.feature}</td>
                        <td className="text-center">{row.admin ? "✅" : "❌"}</td>
                        <td className="text-center">{row.user ? "✅" : "❌"}</td>
                        <td className="text-center">{row.viewer ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 7. Dashboard & UI
    {
      id: 7,
      title: { ru: "Дашборд", en: "Dashboard" },
      subtitle: { ru: "Главный экран приложения", en: "Main Application Screen" },
      content: (lang) => (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={dashboardMockup} alt="Dashboard" className="rounded-lg shadow-lg max-h-56 object-contain border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Package, label: lang === "ru" ? "Всего товаров" : "Total Products", color: "text-primary" },
              { icon: BarChart3, label: lang === "ru" ? "Общая стоимость" : "Total Value", color: "text-green-500" },
              { icon: AlertTriangle, label: lang === "ru" ? "Низкий запас" : "Low Stock", color: "text-yellow-500" },
              { icon: Zap, label: lang === "ru" ? "Нет в наличии" : "Out of Stock", color: "text-red-500" },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-4">
                  <stat.icon className={`h-6 w-6 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    // 8. Product Management
    {
      id: 8,
      title: { ru: "Управление товарами", en: "Product Management" },
      subtitle: { ru: "CRUD операции", en: "CRUD Operations" },
      content: (lang) => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              icon: Package, 
              title: lang === "ru" ? "Создание" : "Create",
              desc: lang === "ru" ? "Добавление новых товаров с валидацией полей" : "Add new products with field validation",
              color: "text-green-500"
            },
            { 
              icon: Eye, 
              title: lang === "ru" ? "Чтение" : "Read",
              desc: lang === "ru" ? "Просмотр списка и поиск товаров" : "View list and search products",
              color: "text-blue-500"
            },
            { 
              icon: Edit, 
              title: lang === "ru" ? "Обновление" : "Update",
              desc: lang === "ru" ? "Редактирование данных товара" : "Edit product information",
              color: "text-yellow-500"
            },
            { 
              icon: Trash2, 
              title: lang === "ru" ? "Удаление" : "Delete",
              desc: lang === "ru" ? "Удаление с подтверждением" : "Delete with confirmation",
              color: "text-red-500"
            },
          ].map((op) => (
            <Card key={op.title}>
              <CardHeader className="pb-2">
                <op.icon className={`h-8 w-8 ${op.color}`} />
                <CardTitle className="text-base">{op.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{op.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    // 9. Data Visualization
    {
      id: 9,
      title: { ru: "Визуализация данных", en: "Data Visualization" },
      subtitle: { ru: "Графики и диаграммы", en: "Charts and Diagrams" },
      content: (lang) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: PieChart, 
              title: lang === "ru" ? "Статус запасов" : "Stock Status",
              desc: lang === "ru" ? "Круговая диаграмма: в наличии, низкий запас, нет в наличии" : "Pie chart: in stock, low stock, out of stock",
            },
            { 
              icon: PieChart, 
              title: lang === "ru" ? "По категориям" : "By Category",
              desc: lang === "ru" ? "Распределение количества товаров по категориям" : "Product quantity distribution by category",
            },
            { 
              icon: BarChart3, 
              title: lang === "ru" ? "Стоимость" : "Value",
              desc: lang === "ru" ? "Горизонтальный бар-чарт стоимости по категориям" : "Horizontal bar chart of value by category",
            },
          ].map((chart) => (
            <Card key={chart.title}>
              <CardHeader>
                <chart.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-base">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{chart.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    // 10. Reports & Export
    {
      id: 10,
      title: { ru: "Отчёты и экспорт", en: "Reports & Export" },
      subtitle: { ru: "Экспорт данных в различные форматы", en: "Export data to various formats" },
      content: (lang) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                CSV Export
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{lang === "ru" ? "• Локализованные заголовки (EN/RU)" : "• Localized headers (EN/RU)"}</p>
              <p>{lang === "ru" ? "• Разделитель «;» для русского" : "• Semicolon delimiter for Russian"}</p>
              <p>{lang === "ru" ? "• UTF-8 кодировка" : "• UTF-8 encoding"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5 text-blue-600" />
                Excel Export (.xlsx)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{lang === "ru" ? "• Библиотека xlsx" : "• xlsx library"}</p>
              <p>{lang === "ru" ? "• Форматированные столбцы" : "• Formatted columns"}</p>
              <p>{lang === "ru" ? "• Совместимость с Excel/LibreOffice" : "• Excel/LibreOffice compatible"}</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 11. Audit Log
    {
      id: 11,
      title: { ru: "Аудит лог", en: "Audit Log" },
      subtitle: { ru: "История изменений", en: "Change History" },
      content: (lang) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                {lang === "ru" ? "Отслеживаемые действия" : "Tracked Actions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { action: "INSERT", label: lang === "ru" ? "Создание" : "Create", color: "text-green-500" },
                  { action: "UPDATE", label: lang === "ru" ? "Обновление" : "Update", color: "text-yellow-500" },
                  { action: "DELETE", label: lang === "ru" ? "Удаление" : "Delete", color: "text-red-500" },
                ].map((a) => (
                  <div key={a.action} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className={`font-mono font-bold ${a.color}`}>{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{lang === "ru" ? "Сохраняемые данные" : "Stored Data"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="grid grid-cols-2 gap-2">
                {(lang === "ru" ? [
                  "Email пользователя",
                  "Тип действия",
                  "Дата и время",
                  "Старые данные (JSON)",
                  "Новые данные (JSON)",
                  "ID записи",
                ] : [
                  "User email",
                  "Action type",
                  "Timestamp",
                  "Old data (JSON)",
                  "New data (JSON)",
                  "Record ID",
                ]).map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 12. Database Schema
    {
      id: 12,
      title: { ru: "Схема базы данных", en: "Database Schema" },
      subtitle: { ru: "ERD диаграмма", en: "ERD Diagram" },
      content: (lang) => (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={databaseSchema} alt="Database Schema" className="rounded-lg shadow-lg max-h-40 object-contain" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "products", fields: ["id", "name", "category", "quantity", "price", "low_stock_threshold"] },
              { name: "user_roles", fields: ["id", "user_id", "role"] },
              { name: "audit_log", fields: ["id", "action", "old_data", "new_data", "user_email"] },
              { name: "profiles", fields: ["id", "email", "full_name"] },
            ].map((table) => (
              <Card key={table.name} className="text-xs">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {table.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-mono text-muted-foreground">
                  {table.fields.slice(0, 4).map((f) => <p key={f}>{f}</p>)}
                  {table.fields.length > 4 && <p>...</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    // 13. Security (RLS)
    {
      id: 13,
      title: { ru: "Безопасность", en: "Security" },
      subtitle: { ru: "Row Level Security", en: "Row Level Security" },
      content: (lang) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Row Level Security (RLS)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{lang === "ru" 
                ? "Все таблицы защищены политиками безопасности на уровне строк PostgreSQL. Доступ контролируется на уровне базы данных."
                : "All tables are protected by PostgreSQL row-level security policies. Access is controlled at the database level."}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-500/5 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">{lang === "ru" ? "Защищено" : "Protected"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• products (SELECT, INSERT, UPDATE, DELETE)</p>
                <p>• user_roles (SELECT)</p>
                <p>• audit_log (SELECT, INSERT)</p>
                <p>• profiles (SELECT, INSERT, UPDATE)</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">{lang === "ru" ? "Функции" : "Functions"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• has_role() - {lang === "ru" ? "проверка роли" : "role check"}</p>
                <p>• auth.uid() - {lang === "ru" ? "текущий пользователь" : "current user"}</p>
                <p>• Triggers - {lang === "ru" ? "аудит изменений" : "change audit"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    // 14. Localization
    {
      id: 14,
      title: { ru: "Локализация", en: "Localization" },
      subtitle: { ru: "Многоязычный интерфейс", en: "Multilingual Interface" },
      content: (lang) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl">🇬🇧</div>
                <div>
                  <CardTitle>English</CardTitle>
                  <CardDescription>Default language</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• All UI labels and messages</p>
              <p>• Export headers (comma-separated)</p>
              <p>• Date formats (MM/DD/YYYY)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-xl">🇷🇺</div>
                <div>
                  <CardTitle>Русский</CardTitle>
                  <CardDescription>Дополнительный язык</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>• Все элементы интерфейса</p>
              <p>• Экспорт с «;» разделителем</p>
              <p>• Формат дат (ДД.ММ.ГГГГ)</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 15. Theme Support
    {
      id: 15,
      title: { ru: "Темы оформления", en: "Theme Support" },
      subtitle: { ru: "Светлая и тёмная темы", en: "Light and Dark Modes" },
      content: (lang) => (
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-white border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">☀️</div>
                <CardTitle>{lang === "ru" ? "Светлая тема" : "Light Mode"}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-blue-500 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-2 border-zinc-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">🌙</div>
                <CardTitle className="text-white">{lang === "ru" ? "Тёмная тема" : "Dark Mode"}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-zinc-700 rounded w-full"></div>
                <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-3 bg-blue-500 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    // 16. Project Structure
    {
      id: 16,
      title: { ru: "Структура проекта", en: "Project Structure" },
      subtitle: { ru: "Организация кода", en: "Code Organization" },
      content: (lang) => (
        <Card>
          <CardContent className="pt-4">
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-auto">
{`src/
├── components/          # UI ${lang === "ru" ? "компоненты" : "components"}
│   ├── ui/              # Shadcn ${lang === "ru" ? "компоненты" : "components"}
│   ├── Dashboard.tsx    # ${lang === "ru" ? "Главная панель" : "Main dashboard"}
│   ├── ProductTable.tsx # ${lang === "ru" ? "Таблица товаров" : "Product table"}
│   ├── StatsCard.tsx    # ${lang === "ru" ? "Карточка статистики" : "Stats card"}
│   └── ...
├── contexts/            # React ${lang === "ru" ? "контексты" : "contexts"}
│   ├── AuthContext.tsx  # ${lang === "ru" ? "Аутентификация" : "Authentication"}
│   └── LanguageContext.tsx
├── pages/               # ${lang === "ru" ? "Страницы" : "Pages"}
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── Reports.tsx
│   └── AuditLog.tsx
├── hooks/               # ${lang === "ru" ? "Кастомные хуки" : "Custom hooks"}
├── utils/               # ${lang === "ru" ? "Утилиты" : "Utilities"}
└── integrations/        # ${lang === "ru" ? "Интеграции" : "Integrations"}`}
            </pre>
          </CardContent>
        </Card>
      ),
    },
    // 17. Summary
    {
      id: 17,
      title: { ru: "Итоги", en: "Summary" },
      subtitle: { ru: "Реализованные функции", en: "Implemented Features" },
      content: (lang) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(lang === "ru" ? [
              "Аутентификация пользователей",
              "Ролевая модель (RBAC)",
              "CRUD для товаров",
              "Поиск и фильтрация",
              "Низкий запас оповещения",
              "Визуализация (графики)",
              "Экспорт CSV/Excel",
              "Аудит лог",
              "Локализация EN/RU",
              "Светлая/тёмная темы",
              "Row Level Security",
              "Адаптивный дизайн",
            ] : [
              "User authentication",
              "Role-based access (RBAC)",
              "Product CRUD",
              "Search & filtering",
              "Low stock alerts",
              "Data visualization",
              "CSV/Excel export",
              "Audit logging",
              "EN/RU localization",
              "Light/dark themes",
              "Row Level Security",
              "Responsive design",
            ]).map((item) => (
              <div key={item} className="flex items-center gap-2 p-2 rounded bg-green-500/5 border border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center pt-4">
            <Button onClick={() => navigate("/")} size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              {lang === "ru" ? "Перейти в приложение" : "Go to Application"}
            </Button>
          </div>
        </div>
      ),
    },
    // 18. Thank You
    {
      id: 18,
      title: { ru: "Спасибо за внимание!", en: "Thank You!" },
      subtitle: { ru: "Вопросы?", en: "Questions?" },
      content: (lang) => (
        <div className="text-center space-y-6">
          <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Package className="h-14 w-14 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">SIMS</h2>
            <p className="text-muted-foreground">Simple Inventory Management System</p>
          </div>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-sm px-4 py-2">React</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">TypeScript</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">PostgreSQL</Badge>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1);
  const prevSlide = () => currentSlide > 0 && setCurrentSlide(currentSlide - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm p-4 print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-4 w-4" />
            {t.home}
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {t.slide} {currentSlide + 1} {t.of} {slides.length}
            </span>
            <Button variant="outline" size="sm" onClick={toggleLang} className="gap-2">
              <Languages className="h-4 w-4" />
              {t.lang}
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              {t.print}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full bg-background p-8 rounded-lg print:shadow-none">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-1">{slides[currentSlide].title[lang]}</h1>
            <p className="text-lg text-muted-foreground">{slides[currentSlide].subtitle[lang]}</p>
          </div>
          <div className="min-h-[380px]">
            {slides[currentSlide].content(lang)}
          </div>
        </div>
      </main>

      <footer className="border-t bg-card/80 backdrop-blur-sm p-4 print:hidden">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.prev}
          </Button>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? "bg-primary w-4" : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
          <Button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="gap-2">
            {t.next}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
