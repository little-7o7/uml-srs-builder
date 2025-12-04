import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

// Validation schema for product data
const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200, "Name too long"),
  category: z.string().trim().min(1, "Category is required").max(100, "Category too long"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  price: z.number().positive("Price must be greater than 0"),
  low_stock_threshold: z.number().int().min(0, "Threshold must be 0 or greater"),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    low_stock_threshold: 10,
  });
  const { toast } = useToast();
  const { t } = useLanguage();

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

      // Insert product into database
      const { error } = await supabase
        .from("products")
        .insert([{
          name: validatedData.name,
          category: validatedData.category,
          quantity: validatedData.quantity,
          price: validatedData.price,
          low_stock_threshold: validatedData.low_stock_threshold,
        }]);

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
        title: t.productAdded,
        description: t.productAddedDesc,
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        price: 0,
        low_stock_threshold: 10,
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
          description: t.failedToAdd,
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
          <DialogTitle>{t.addNewProduct}</DialogTitle>
          <DialogDescription>
            {t.enterProductDetails}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.productName} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.productNamePlaceholder}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t.category} *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t.categoryPlaceholder}
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{t.quantity} *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t.price} ($) *</Label>
              <Input
                id="price"
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
            <Label htmlFor="threshold">{t.lowStockThreshold} *</Label>
            <Input
              id="threshold"
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
              {loading ? t.adding : t.addProductBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}