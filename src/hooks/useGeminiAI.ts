import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { prompt }
      });

      if (error) {
        // Check if the error is from Kaspersky
        if (error.message?.includes('Failed to fetch') && 
            error.stack?.includes('kaspersky-labs.com')) {
          const kasperskyError = 'Kaspersky is blocking the request. Please temporarily disable Kaspersky protection or add jrxxemchkytvqqsvloso.supabase.co to your trusted sites, then refresh the page.';
          console.error('Kaspersky blocking detected:', kasperskyError);
          toast.error(kasperskyError, {
            duration: 10000, // Show for 10 seconds
          });
          setError(kasperskyError);
          return null;
        }
        
        console.error('Error generating response:', error);
        toast.error(error.message);
        setError(error.message);
        return null;
      }

      return data?.response;
    } catch (err: any) {
      console.error('Error in generateResponse:', err);
      toast.error(err.message);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Alias generateResponse as generateText for backward compatibility
  const generateText = generateResponse;

  return {
    generateResponse,
    generateText, // Add this for backward compatibility
    isLoading,
    error
  };
}