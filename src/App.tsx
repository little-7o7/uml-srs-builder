/**
 * App.tsx - Главный компонент приложения SIMS
 * 
 * Этот файл содержит:
 * - Настройку маршрутизации (React Router)
 * - Провайдеры контекстов (Auth, Language, Theme, Query)
 * - Глобальные компоненты (Toaster, Sonner)
 * 
 * @author University Project
 * @version 1.0.0
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Reports from "./pages/Reports";
import AuditLog from "./pages/AuditLog";
import Presentation from "./pages/Presentation";
import UmlDiagrams from "./pages/UmlDiagrams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/presentation" element={<Presentation />} />
              <Route path="/uml" element={<UmlDiagrams />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
