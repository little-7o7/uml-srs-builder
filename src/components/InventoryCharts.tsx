import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
}

interface InventoryChartsProps {
  products: Product[];
}

// Color palette for charts
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(142, 76%, 36%)", // green
  "hsl(38, 92%, 50%)", // orange
  "hsl(280, 87%, 55%)", // purple
  "hsl(190, 90%, 50%)", // cyan
  "hsl(340, 82%, 52%)", // pink
  "hsl(45, 93%, 47%)", // yellow
];

const STATUS_COLORS = {
  inStock: "hsl(142, 76%, 36%)",
  lowStock: "hsl(38, 92%, 50%)",
  outOfStock: "hsl(0, 84%, 60%)",
};

export function InventoryCharts({ products }: InventoryChartsProps) {
  const { language } = useLanguage();

  // Calculate category distribution
  const categoryData = Object.entries(
    products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories

  // Calculate stock status distribution
  const stockStatusData = [
    {
      name: language === "ru" ? "В наличии" : "In Stock",
      value: products.filter(
        (p) => p.quantity > p.low_stock_threshold
      ).length,
      color: STATUS_COLORS.inStock,
    },
    {
      name: language === "ru" ? "Мало" : "Low Stock",
      value: products.filter(
        (p) => p.quantity > 0 && p.quantity <= p.low_stock_threshold
      ).length,
      color: STATUS_COLORS.lowStock,
    },
    {
      name: language === "ru" ? "Нет" : "Out of Stock",
      value: products.filter((p) => p.quantity === 0).length,
      color: STATUS_COLORS.outOfStock,
    },
  ].filter((item) => item.value > 0);

  // Calculate value by category
  const valueByCategory = Object.entries(
    products.reduce((acc, product) => {
      const value = product.quantity * Number(product.price);
      acc[product.category] = (acc[product.category] || 0) + value;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, value]) => ({
      name: name.length > 12 ? name.substring(0, 12) + "..." : name,
      fullName: name,
      value: Math.round(value * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 categories by value

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">
            {payload[0].payload.fullName || label || payload[0].name}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeof payload[0].value === "number" && payload[0].value > 100
              ? `$${payload[0].value.toLocaleString()}`
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {/* Stock Status Pie Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === "ru" ? "Статус запасов" : "Stock Status"}
          </CardTitle>
          <CardDescription>
            {language === "ru"
              ? "Распределение по статусу"
              : "Distribution by status"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Pie Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === "ru" ? "По категориям" : "By Category"}
          </CardTitle>
          <CardDescription>
            {language === "ru"
              ? "Количество по категориям"
              : "Quantity by category"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">
                      {value.length > 10 ? value.substring(0, 10) + "..." : value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Value by Category Bar Chart */}
      <Card className="border-border/50 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === "ru" ? "Стоимость по категориям" : "Value by Category"}
          </CardTitle>
          <CardDescription>
            {language === "ru" ? "Топ категорий по стоимости" : "Top categories by value"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={valueByCategory}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
