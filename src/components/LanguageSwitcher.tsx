import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ru" : "en")}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "RU" : "EN"}
    </Button>
  );
}
