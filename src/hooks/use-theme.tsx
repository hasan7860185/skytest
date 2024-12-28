import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // تجنب الأخطاء في حالة SSR
    if (typeof window === 'undefined') return 'light';
    
    try {
      // محاولة استرجاع السمة المحفوظة
      const savedTheme = localStorage.getItem("theme");
      
      // التحقق من صحة السمة المحفوظة
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as Theme;
      }
      
      // إذا لم تكن هناك سمة محفوظة، استخدم تفضيلات النظام
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    
    return "light";
  });

  // تطبيق السمة عند تغييرها
  useEffect(() => {
    try {
      const root = document.documentElement;
      
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", systemTheme);
        localStorage.setItem("theme", "system");
      } else {
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  // الاستماع لتغييرات سمة النظام
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = document.documentElement;
        root.classList.toggle("dark", mediaQuery.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return { theme, setTheme };
}