import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AIHeader } from './ai/AIHeader'
import { AITabs } from './ai/AITabs'
import { useAIOperations } from './ai/AIOperations'
import { toast } from 'sonner'

export function AIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  const { 
    handleGenerateText, 
    isTyping, 
    isLoadingText, 
    textError 
  } = useAIOperations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await handleGenerateText(prompt, isRTL)
    if (response) {
      setResult(response)
    }
  }

  const handleClear = () => {
    setPrompt('')
    setResult('')
    toast.success(isRTL ? 'تم مسح المحادثة' : 'Conversation cleared')
  }

  const loadConversation = (prompt: string, response: string) => {
    setPrompt(prompt)
    setResult(response)
  }

  return (
    <div className="mt-14 pt-120 space-y-4 p-4 max-w-[150%] mx-auto bg-white/10 dark:bg-gray-900/30 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30" dir={isRTL ? "rtl" : "ltr"}>
      <AIHeader
        onClear={handleClear}
        loadConversation={loadConversation}
      />
      
      <AITabs
        prompt={prompt}
        result={result}
        isTyping={isTyping}
        isLoading={isLoadingText}
        error={textError}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
      />
    </div>
  )
}