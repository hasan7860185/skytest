import { useTranslation } from "react-i18next";

export function Footer() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#191970] text-white py-6 w-full">
      <div className="container mx-auto text-center">
        <p className={`text-sm ${isRTL ? 'font-cairo' : ''}`}>
          {isRTL 
            ? `جميع الحقوق محفوظة © ${currentYear} Sky Aqaar` 
            : `Copyright © ${currentYear} Sky Aqaar. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}