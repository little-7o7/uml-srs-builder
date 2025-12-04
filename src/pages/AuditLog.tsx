import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, History, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";

interface AuditLogEntry {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  created_at: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect non-admin users
    if (userRole && userRole !== 'admin') {
      navigate('/');
      return;
    }

    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setLogs(data as AuditLogEntry[]);
      }
      setLoading(false);
    };

    if (userRole === 'admin') {
      fetchLogs();
    }
  }, [userRole, navigate]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-success text-success-foreground gap-1">
            <Plus className="h-3 w-3" />
            {language === "ru" ? "Создание" : "Create"}
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-warning text-warning-foreground gap-1">
            <Pencil className="h-3 w-3" />
            {language === "ru" ? "Изменение" : "Update"}
          </Badge>
        );
      case "delete":
        return (
          <Badge variant="destructive" className="gap-1">
            <Trash2 className="h-3 w-3" />
            {language === "ru" ? "Удаление" : "Delete"}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", {
      locale: language === "ru" ? ru : enUS,
    });
  };

  const getChangeSummary = (entry: AuditLogEntry) => {
    if (entry.action === "create" && entry.new_data) {
      return entry.new_data.name || "-";
    }
    if (entry.action === "delete" && entry.old_data) {
      return entry.old_data.name || "-";
    }
    if (entry.action === "update" && entry.old_data && entry.new_data) {
      const changes: string[] = [];
      const keys = ["name", "category", "quantity", "price", "low_stock_threshold"];
      keys.forEach((key) => {
        if (entry.old_data![key] !== entry.new_data![key]) {
          changes.push(`${key}: ${entry.old_data![key]} → ${entry.new_data![key]}`);
        }
      });
      return changes.length > 0 ? changes.join(", ") : "-";
    }
    return "-";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <History className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {language === "ru" ? "История изменений" : "Audit Log"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ru"
                    ? "Журнал всех изменений в системе"
                    : "Track all changes in the system"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              {userRole && (
                <Badge
                  className={
                    userRole === "admin"
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : userRole === "viewer"
                      ? "bg-muted text-muted-foreground"
                      : "bg-secondary"
                  }
                >
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              )}
              <Button variant="ghost" onClick={signOut}>
                {language === "ru" ? "Выйти" : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ru" ? "Всего записей" : "Total Entries"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success">
                {language === "ru" ? "Создано" : "Created"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {logs.filter((l) => l.action === "create").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">
                {language === "ru" ? "Изменено" : "Updated"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {logs.filter((l) => l.action === "update").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "ru" ? "Журнал изменений" : "Change Log"}</CardTitle>
            <CardDescription>
              {language === "ru"
                ? "Последние 100 изменений"
                : "Last 100 changes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === "ru" ? "Загрузка..." : "Loading..."}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === "ru" ? "Нет записей" : "No entries"}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "ru" ? "Дата" : "Date"}</TableHead>
                      <TableHead>{language === "ru" ? "Действие" : "Action"}</TableHead>
                      <TableHead>{language === "ru" ? "Пользователь" : "User"}</TableHead>
                      <TableHead>{language === "ru" ? "Изменения" : "Changes"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatDate(entry.created_at)}
                        </TableCell>
                        <TableCell>{getActionBadge(entry.action)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.user_email || "-"}
                        </TableCell>
                        <TableCell className="text-sm max-w-md truncate">
                          {getChangeSummary(entry)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
