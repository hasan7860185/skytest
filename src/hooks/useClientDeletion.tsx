import { useCallback, useState } from 'react';
import { useClientStore } from '@/data/clientsData';
import { supabase } from '@/integrations/supabase/client';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export function useClientDeletion() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const removeClients = useClientStore(state => state.removeClients);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteClients = useCallback(async (clientIds: string[]): Promise<boolean> => {
    if (!clientIds.length || isDeleting) {
      console.log('No clients selected for deletion or deletion in progress');
      return false;
    }

    try {
      setIsDeleting(true);
      
      // 1. رسالة تأكيد الحذف
      const confirmResult = await Swal.fire({
        title: isRTL ? 'تأكيد الحذف' : 'Confirm Deletion',
        text: isRTL ? 'هل أنت متأكد من حذف العميل؟' : 'Are you sure you want to delete this client?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: isRTL ? 'نعم، احذف' : 'Yes, delete',
        cancelButtonText: isRTL ? 'إلغاء' : 'Cancel',
        customClass: {
          popup: isRTL ? 'font-cairo' : ''
        }
      });

      if (!confirmResult.isConfirmed) {
        setIsDeleting(false);
        return false;
      }

      // 2. رسالة الانتظار
      Swal.fire({
        title: isRTL ? 'جاري الحذف...' : 'Deleting...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: isRTL ? 'font-cairo' : ''
        }
      });

      // حذف الإشعارات المرتبطة
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .in('client_id', clientIds);

      if (notificationsError) throw notificationsError;

      // حذف الإجراءات المرتبطة
      const { error: actionsError } = await supabase
        .from('client_actions')
        .delete()
        .in('client_id', clientIds);

      if (actionsError) throw actionsError;

      // حذف التحليلات المرتبطة
      const { error: insightsError } = await supabase
        .from('client_insights')
        .delete()
        .in('client_id', clientIds);

      if (insightsError) throw insightsError;

      // حذف المفضلة المرتبطة
      const { error: favoritesError } = await supabase
        .from('client_favorites')
        .delete()
        .in('client_id', clientIds);

      if (favoritesError) throw favoritesError;

      // حذف العملاء
      const { error: clientsError } = await supabase
        .from('clients')
        .delete()
        .in('id', clientIds);

      if (clientsError) throw clientsError;

      removeClients(clientIds);
      
      // رسالة النجاح
      await Swal.fire({
        icon: 'success',
        title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
        text: isRTL 
          ? clientIds.length === 1 
            ? 'تم حذف العميل بنجاح' 
            : `تم حذف ${clientIds.length} عملاء بنجاح`
          : clientIds.length === 1
            ? 'Client deleted successfully'
            : `${clientIds.length} clients deleted successfully`,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
          popup: isRTL ? 'font-cairo' : ''
        }
      });

      // إعادة تحميل الصفحة بعد إغلاق رسالة النجاح
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
      return true;
    } catch (err) {
      console.error('Error in deleteClients:', err);
      
      // رسالة الخطأ
      await Swal.fire({
        icon: 'error',
        title: isRTL ? 'خطأ!' : 'Error!',
        text: isRTL ? 'حدث خطأ أثناء عملية الحذف' : 'Error occurred while deleting',
        confirmButtonText: isRTL ? 'حسناً' : 'OK',
        customClass: {
          popup: isRTL ? 'font-cairo' : ''
        }
      });
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [isRTL, isDeleting, removeClients]);

  return { deleteClients, isDeleting };
}