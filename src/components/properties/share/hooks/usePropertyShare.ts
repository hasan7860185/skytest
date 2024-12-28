import { useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateAndUploadPDF } from '../utils/pdfUtils';
import { generateHTML } from '../utils/htmlGenerator';

interface UsePropertyShareProps {
  property: any;
  selectedFields: string[];
  isRTL: boolean;
}

export const usePropertyShare = ({ property, selectedFields, isRTL }: UsePropertyShareProps) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);

  const handleWhatsAppShare = async () => {
    const toastId = toast.loading(isRTL ? 'جاري التحضير...' : 'Preparing...');
    setIsLoading(true);
    try {
      const pdfUrl = await generateAndUploadPDF({ property, selectedFields, isRTL });
      const message = isRTL 
        ? `عقار: ${property.title}\n${pdfUrl}`
        : `Property: ${property.title}\n${pdfUrl}`;
      
      const whatsappUrl = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      toast.dismiss(toastId);
      toast.success(isRTL ? 'تم فتح واتساب' : 'WhatsApp opened');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء المشاركة' : 'Error sharing');
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  const handleFacebookShare = async () => {
    const toastId = toast.loading(isRTL ? 'جاري التحضير...' : 'Preparing...');
    setIsLoading(true);
    try {
      const pdfUrl = await generateAndUploadPDF({ property, selectedFields, isRTL });
      const message = isRTL 
        ? `عقار: ${property.title}\n${pdfUrl}`
        : `Property: ${property.title}\n${pdfUrl}`;
      
      window.focus();
      
      if (isMobile) {
        window.location.href = `fb-messenger://share/?link=${encodeURIComponent(pdfUrl)}`;
      } else {
        window.open(`https://www.messenger.com/new`, '_blank');
        try {
          await navigator.clipboard.writeText(message);
          toast.success(
            isRTL 
              ? 'تم نسخ الرابط، يمكنك لصقه في المحادثة' 
              : 'Link copied, you can paste it in the conversation'
          );
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          toast.info(
            isRTL 
              ? 'يرجى نسخ الرابط يدويًا: ' + pdfUrl
              : 'Please copy the link manually: ' + pdfUrl
          );
        }
      }
      toast.dismiss(toastId);
      toast.success(isRTL ? 'تم فتح ماسنجر' : 'Messenger opened');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء المشاركة' : 'Error sharing');
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    try {
      const html = generateHTML({ property, selectedFields, isRTL });
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${property.title || 'property'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isRTL ? 'تم تحميل الملف بنجاح' : 'File downloaded successfully');
    } catch (error) {
      console.error('Error generating HTML:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحميل الملف' : 'Error downloading file');
    }
  };

  const handleDownloadPDF = async () => {
    const toastId = toast.loading(isRTL ? 'جاري التحضير...' : 'Preparing...');
    setIsLoading(true);
    try {
      await generateAndUploadPDF({ property, selectedFields, isRTL });
      toast.success(isRTL ? 'تم تحميل الملف بنجاح' : 'File downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء تحميل الملف' : 'Error downloading file');
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleWhatsAppShare,
    handleFacebookShare,
    handleDownloadHTML,
    handleDownloadPDF
  };
};