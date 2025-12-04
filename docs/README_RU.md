# SIMS - Simple Inventory Management System
## Простая Система Управления Запасами

### 📋 Описание проекта

SIMS - это веб-приложение для управления товарными запасами, разработанное как университетский проект. Система предоставляет полный функционал для учёта товаров, отслеживания низкого запаса и формирования отчётов.

---

## 🏗️ Архитектура системы

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  Pages:           │  Components:        │  Contexts:        │
│  - Index          │  - Dashboard        │  - AuthContext    │
│  - Auth           │  - ProductTable     │  - LanguageContext│
│  - Reports        │  - StatsCard        │                   │
│  - AuditLog       │  - InventoryCharts  │                   │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND (Supabase/PostgreSQL)            │
├─────────────────────────────────────────────────────────────┤
│  Tables:          │  Security:          │  Functions:       │
│  - products       │  - RLS Policies     │  - has_role()     │
│  - profiles       │  - Role-based       │  - audit_trigger  │
│  - user_roles     │    access control   │                   │
│  - audit_log      │                     │                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Технологический стек

### Frontend
| Технология | Назначение |
|------------|------------|
| **React 18** | UI библиотека |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стилизация |
| **Shadcn/ui** | UI компоненты |
| **React Router** | Маршрутизация |
| **Recharts** | Графики и диаграммы |
| **Lucide React** | Иконки |

### Backend
| Технология | Назначение |
|------------|------------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | База данных |
| **Row Level Security** | Безопасность данных |

---

## 📁 Структура проекта

```
src/
├── components/           # UI компоненты
│   ├── ui/              # Базовые UI элементы (shadcn)
│   ├── Dashboard.tsx    # Главная панель управления
│   ├── ProductTable.tsx # Таблица товаров
│   ├── StatsCard.tsx    # Карточка статистики
│   ├── InventoryCharts.tsx # Графики инвентаря
│   ├── AddProductDialog.tsx # Диалог добавления
│   ├── EditProductDialog.tsx # Диалог редактирования
│   └── DeleteProductDialog.tsx # Диалог удаления
│
├── contexts/            # React контексты
│   ├── AuthContext.tsx  # Аутентификация и роли
│   └── LanguageContext.tsx # Локализация
│
├── pages/               # Страницы приложения
│   ├── Index.tsx        # Главная страница
│   ├── Auth.tsx         # Страница входа/регистрации
│   ├── Reports.tsx      # Страница отчётов
│   └── AuditLog.tsx     # История изменений
│
├── hooks/               # Кастомные хуки
├── utils/               # Утилиты
│   ├── csvExport.ts     # Экспорт в CSV
│   └── exportUtils.ts   # Экспорт в Excel
│
└── integrations/        # Интеграции
    └── supabase/        # Supabase клиент и типы
```

---

## 🔐 Система ролей (RBAC)

| Роль | Просмотр | Добавление | Редактирование | Удаление | Экспорт | Аудит лог |
|------|----------|------------|----------------|----------|---------|-----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **User** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 📊 Схема базы данных

### Таблица `products`
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,           -- Название товара
    category TEXT NOT NULL,       -- Категория
    quantity INTEGER DEFAULT 0,   -- Количество на складе
    price DECIMAL NOT NULL,       -- Цена за единицу
    low_stock_threshold INTEGER DEFAULT 10, -- Порог низкого запаса
    created_by UUID,              -- ID создателя
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### Таблица `user_roles`
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,        -- ID пользователя
    role app_role NOT NULL        -- Роль: admin, user, viewer
);
```

### Таблица `audit_log`
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,     -- Имя таблицы
    record_id TEXT,               -- ID записи
    action TEXT NOT NULL,         -- Действие: INSERT, UPDATE, DELETE
    old_data JSONB,               -- Старые данные
    new_data JSONB,               -- Новые данные
    user_id UUID,                 -- ID пользователя
    user_email TEXT,              -- Email пользователя
    created_at TIMESTAMP DEFAULT now()
);
```

---

## 🔒 Безопасность (RLS Policies)

Все таблицы защищены политиками Row Level Security:

```sql
-- Пример: только аутентифицированные пользователи могут читать товары
CREATE POLICY "products_select_policy" ON products
    FOR SELECT TO authenticated USING (true);

-- Пример: только админы могут изменять товары
CREATE POLICY "products_update_policy" ON products
    FOR UPDATE TO authenticated
    USING (public.has_role('admin', auth.uid()));
```

---

## 🌐 Локализация

Система поддерживает два языка:
- 🇬🇧 English (английский)
- 🇷🇺 Русский

Переключение языка происходит через `LanguageContext` без перезагрузки страницы.

---

## 📈 Функциональность

### 1. Управление товарами
- Добавление новых товаров
- Редактирование существующих
- Удаление товаров
- Поиск и фильтрация

### 2. Мониторинг запасов
- Отслеживание количества
- Оповещения о низком запасе
- Статистика по категориям

### 3. Отчёты и аналитика
- Визуализация данных (графики)
- Экспорт в CSV/Excel
- История изменений (аудит лог)

### 4. Безопасность
- Аутентификация пользователей
- Ролевая модель доступа
- Защита данных на уровне БД

---

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

---

## 👨‍💻 Автор

Университетский проект по разработке веб-приложений.

---

## 📄 Лицензия

MIT License
