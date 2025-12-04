import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

// Validation schema for product updates
const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200, "Name too long"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category too long"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  price: z.number().positive("Price must be greater than 0"),
  low_stock_threshold: z.number().int().min(0, "Threshold must be 0 or greater"),
});

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export function EditProductDialog({ open, onOpenChange, product, onSuccess }: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity,
    price: Number(product.price),
    low_stock_threshold: product.low_stock_threshold,
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  // Update form when product changes
  useEffect(() => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: Number(product.price),
      low_stock_threshold: product.low_stock_threshold,
    });
  }, [product]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = productSchema.parse({
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
      });

      setLoading(true);

      // Update product in database
      const { error } = await supabase
        .from("products")
        .update({
          name: validatedData.name,
          category: validatedData.category,
          quantity: validatedData.quantity,
          price: validatedData.price,
          low_stock_threshold: validatedData.low_stock_threshold,
        })
        .eq("id", product.id);

      if (error) {
        // Check for duplicate product error
        if (error.code === "23505") {
          toast({
            title: t.duplicateProduct,
            description: t.duplicateProductDesc,
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: t.productUpdated,
        description: t.productUpdatedDesc,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t.validationError,
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.error,
          description: t.failedToUpdate,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.editProduct}</DialogTitle>
          <DialogDescription>
            {t.updateProductDetails}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t.productName} *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.productNamePlaceholder}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">{t.category} *</Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t.categoryPlaceholder}
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">{t.quantity} *</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">{t.price} ($) *</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-threshold">{t.lowStockThreshold} *</Label>
            <Input
              id="edit-threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t.alertWhenBelow}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.updating : t.updateProductBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}