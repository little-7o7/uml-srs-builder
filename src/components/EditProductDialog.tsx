import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
            title: "Duplicate Product",
            description: "A product with this name and category already exists",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Product Updated",
        description: "Product information has been successfully updated",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
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
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details and stock levels
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Laptop, Phone, Monitor"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Electronics, Office Supplies"
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
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
              <Label htmlFor="edit-price">Price ($) *</Label>
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
            <Label htmlFor="edit-threshold">Low Stock Threshold *</Label>
            <Input
              id="edit-threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Alert will show when quantity falls below this number
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
