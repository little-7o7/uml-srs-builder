import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  isAdmin: boolean;
}

export function ProductTable({ products, loading, onRefresh, isAdmin }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { t } = useLanguage();

  const getStockBadge = (product: Product) => {
    if (product.quantity === 0) {
      return <Badge variant="destructive">{t.outOfStock}</Badge>;
    } else if (product.quantity <= product.low_stock_threshold) {
      return <Badge className="bg-warning text-warning-foreground">{t.lowStock}</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">{t.inStock}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t.noProducts}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead className="text-right">{t.quantity}</TableHead>
              <TableHead className="text-right">{t.price}</TableHead>
              <TableHead>{t.status}</TableHead>
              {isAdmin && <TableHead className="text-right">{t.actions}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{getStockBadge(product)}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <EditProductDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
          onSuccess={() => {
            setEditingProduct(null);
            onRefresh();
          }}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
          product={deletingProduct}
          onSuccess={() => {
            setDeletingProduct(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}
