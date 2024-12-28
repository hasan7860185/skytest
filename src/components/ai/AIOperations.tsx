import { useState } from 'react'
import { useGeminiAI } from '@/hooks/useGeminiAI'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'

export function useAIOperations() {
  const [isTyping, setIsTyping] = useState(false)
  const { generateText, isLoading: isLoadingText, error: textError } = useGeminiAI()

  const handleGenerateText = async (prompt: string, isRTL: boolean) => {
    if (!prompt.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال نص للسؤال' : 'Please enter a question')
      return null
    }

    try {
      const response = await generateText(prompt)
      if (response) {
        setIsTyping(true)
        let displayedText = ''
        const textArray = response.split('')
        
        for (let i = 0; i < textArray.length; i++) {
          displayedText += textArray[i]
          await new Promise(resolve => setTimeout(resolve, 20))
        }
        
        setIsTyping(false)
        
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.id) {
          try {
            const { error: saveError } = await supabase
              .from('ai_conversations')
              .insert({
                prompt,
                response,
                user_id: session.user.id
              })
            
            if (saveError) {
              console.error('Error saving conversation:', saveError)
              toast.error(isRTL ? 'تم توليد النص ولكن فشل حفظ المحادثة' : 'Text generated but failed to save conversation')
              return response
            }
            
            toast.success(isRTL ? 'تم توليد النص وحفظ المحادثة بنجاح' : 'Text generated and conversation saved successfully')
          } catch (err) {
            console.error('Error saving conversation:', err)
            toast.error(isRTL ? 'تم توليد النص ولكن فشل حفظ المحادثة' : 'Text generated but failed to save conversation')
          }
        } else {
          toast.success(isRTL ? 'تم توليد النص بنجاح' : 'Text generated successfully')
        }
        return response
      }
    } catch (err) {
      console.error('Error generating text:', err)
      if (err.message?.includes('timeout')) {
        toast.error(isRTL ? 'انتهت مهلة الطلب - يرجى المحاولة مرة أخرى' : 'Request timeout - please try again')
      } else {
        toast.error(isRTL ? 'حدث خطأ أثناء توليد النص' : 'Error generating text')
      }
      return null
    }
  }

  return {
    handleGenerateText,
    isTyping,
    isLoadingText,
    textError
  }
}