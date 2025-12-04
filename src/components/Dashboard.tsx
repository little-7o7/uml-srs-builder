/**
 * Dashboard.tsx - Главная панель управления SIMS
 * 
 * Компонент отображает:
 * - Статистику по товарам (общее количество, стоимость, низкий запас)
 * - Графики и диаграммы инвентаря
 * - Таблицу товаров с поиском и фильтрацией
 * - Оповещения о низком запасе
 * 
 * @component
 * @example
 * <Dashboard />
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, TrendingDown, AlertCircle, BarChart3, DollarSign, History, Presentation } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductTable } from "./ProductTable";
import { AddProductDialog } from "./AddProductDialog";
import { StatsCard } from "./StatsCard";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { InventoryCharts } from "./InventoryCharts";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userRole, canModify, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.low_stock_threshold);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * Number(p.price)), 0);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t.simsDashboard}
                </h1>
                <p className="text-sm text-muted-foreground">{t.simsDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button variant="outline" onClick={() => navigate("/reports")} className="hover:bg-primary/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t.reports}
              </Button>
              {userRole === 'admin' && (
                <Button variant="outline" onClick={() => navigate("/audit-log")} className="hover:bg-primary/10">
                  <History className="h-4 w-4 mr-2" />
                  {language === "ru" ? "История" : "History"}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/presentation")} className="hover:bg-primary/10">
                <Presentation className="h-4 w-4 mr-2" />
                {language === "ru" ? "О проекте" : "About"}
              </Button>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
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
              </div>
              <Button variant="ghost" onClick={signOut} className="hover:bg-destructive/10 hover:text-destructive">
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard
            title={t.totalProducts}
            value={totalProducts}
            icon={Package}
            description={t.activeInventoryItems}
            variant="default"
          />
          
          <StatsCard
            title={t.totalValue}
            value={`$${totalValue.toFixed(2)}`}
            icon={DollarSign}
            description={t.currentInventoryValue}
            variant="success"
          />
          
          <StatsCard
            title={t.lowStock}
            value={lowStockProducts.length}
            icon={TrendingDown}
            description={t.itemsNeedRestocking}
            variant="warning"
          />
          
          <StatsCard
            title={t.outOfStock}
            value={outOfStockProducts.length}
            icon={AlertCircle}
            description={t.itemsUnavailable}
            variant="danger"
          />
        </div>

        {/* Inventory Charts */}
        <InventoryCharts products={products} />

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-warning/50 bg-gradient-to-r from-warning/5 to-transparent animate-in slide-in-from-top-2 duration-500">
            <CardHeader>
              <CardTitle className="text-warning flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center animate-pulse">
                  <AlertCircle className="h-5 w-5" />
                </div>
                {t.lowStockAlert}
              </CardTitle>
              <CardDescription>
                {lowStockProducts.length} {t.productsRunningLow}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-warning/20 hover:border-warning/40 transition-all duration-200 hover:shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.quantity === 0 ? "destructive" : "secondary"} className="font-semibold">
                      {product.quantity} {product.quantity === 0 ? '⚠️' : t.units}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{t.productInventory}</CardTitle>
                <CardDescription>{t.manageStock}</CardDescription>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t.searchProducts}
                />
                {canModify && (
                  <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addProduct}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={filteredProducts}
              loading={loading}
              onRefresh={fetchProducts}
              isAdmin={canModify}
            />
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? `${t.noProductsFound} "${searchQuery}"` : t.noProducts}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
