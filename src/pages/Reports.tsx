import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, TrendingDown, AlertCircle, DollarSign, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { exportProductsToCSV } from "@/utils/csvExport";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
  created_at: string;
}

export default function Reports() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleExportCSV = (type: 'full' | 'low-stock') => {
    const dataToExport = type === 'low-stock' 
      ? products.filter(p => p.quantity <= p.low_stock_threshold)
      : products;
    
    if (dataToExport.length === 0) {
      toast({
        title: language === 'ru' ? "Ошибка" : "Error",
        description: language === 'ru' ? "Нет данных для экспорта." : "No data to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportProductsToCSV(dataToExport, type, language);
    toast({
      title: language === 'ru' ? "Успешно" : "Success",
      description: language === 'ru' 
        ? `${dataToExport.length} товаров экспортировано.`
        : `${dataToExport.length} products exported.`,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.low_stock_threshold && p.quantity > 0);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * Number(p.price)), 0);
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStockBadge = (product: Product) => {
    if (product.quantity === 0) {
      return <Badge variant="destructive">{t.outOfStock}</Badge>;
    } else if (product.quantity <= product.low_stock_threshold) {
      return <Badge className="bg-warning text-warning-foreground">{t.lowStock}</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">{t.inStock}</Badge>;
    }
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
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t.inventoryReports}</h1>
                <p className="text-sm text-muted-foreground">{t.reportsDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              {userRole && (
                <Badge className={
                  userRole === 'admin' 
                    ? "bg-gradient-to-r from-primary to-secondary" 
                    : userRole === 'viewer'
                      ? "bg-muted text-muted-foreground"
                      : "bg-secondary"
                }>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              )}
              <Button variant="ghost" onClick={signOut}>
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalProducts}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{totalUnits} {t.units}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.totalValue}</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t.currentInventoryValue}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.lowStock}</CardTitle>
              <TrendingDown className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{lowStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">{t.itemsNeedRestocking}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.outOfStock}</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockProducts.length}</div>
              <p className="text-xs text-muted-foreground">{t.itemsUnavailable}</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.reports}</CardTitle>
            <CardDescription>{t.reportsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => handleExportCSV('full')} 
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t.exportFull}
              </Button>
              <Button 
                onClick={() => handleExportCSV('low-stock')} 
                variant="outline"
                className="gap-2 border-warning/50 hover:bg-warning/10"
              >
                <Download className="h-4 w-4" />
                {t.exportLowStock}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.categoryBreakdown}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <Badge variant="secondary">{count} {t.items}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Report */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-warning">{t.lowStockItems}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.name}</TableHead>
                      <TableHead>{t.category}</TableHead>
                      <TableHead className="text-right">{t.quantity}</TableHead>
                      <TableHead className="text-right">{t.threshold}</TableHead>
                      <TableHead className="text-right">{t.price}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right text-warning font-bold">{product.quantity}</TableCell>
                        <TableCell className="text-right">{product.low_stock_threshold}</TableCell>
                        <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Inventory Report */}
        <Card>
          <CardHeader>
            <CardTitle>{t.allInventory}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">{t.loading}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">{t.noProducts}</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.name}</TableHead>
                      <TableHead>{t.category}</TableHead>
                      <TableHead className="text-right">{t.quantity}</TableHead>
                      <TableHead className="text-right">{t.price}</TableHead>
                      <TableHead className="text-right">{t.value}</TableHead>
                      <TableHead>{t.status}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${(product.quantity * Number(product.price)).toFixed(2)}
                        </TableCell>
                        <TableCell>{getStockBadge(product)}</TableCell>
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
