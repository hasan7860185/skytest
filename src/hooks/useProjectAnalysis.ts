import { useState } from 'react';
import { useGeminiAI } from './useGeminiAI';
import { toast } from 'sonner';
import { ProjectData } from '@/components/companies/project-form/types';

interface ProjectAnalysis {
  strengths: string[];
  weaknesses: string[];
  customerApproach: string[];
  talkingPoints: string[];
}

export function useProjectAnalysis() {
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const { generateText, isLoading } = useGeminiAI();

  const parseAnalysisResponse = (text: string): ProjectAnalysis | null => {
    try {
      // Extract sections using regex
      const extractSection = (sectionName: string): string[] => {
        const regex = new RegExp(`${sectionName}:[\\s\\n]+((?:- [^\\n]+[\\n]?)+)`, 'im');
        const match = text.match(regex);
        if (!match || !match[1]) return [];
        
        return match[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim());
      };

      const analysis = {
        strengths: extractSection('نقاط القوة'),
        weaknesses: extractSection('نقاط الضعف'),
        customerApproach: extractSection('كيفية مقاربة العملاء'),
        talkingPoints: extractSection('نقاط الحديث')
      };

      // Validate that at least one section has content
      if (Object.values(analysis).every(arr => arr.length === 0)) {
        console.error('No sections were parsed successfully');
        return null;
      }

      return analysis;
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return null;
    }
  };

  const analyzeProject = async (project: ProjectData) => {
    try {
      console.log('Analyzing project:', project.name);
      
      const prompt = `
        تحليل تفاصيل المشروع التالي وتقديم نصائح للتسويق:

        اسم المشروع: ${project.name}
        الوصف: ${project.description || 'غير متوفر'}
        الموقع: ${project.location || 'غير متوفر'}
        السعر للمتر: ${project.price_per_meter || 'غير متوفر'}
        الوحدات المتاحة: ${project.available_units || 'غير متوفر'}
        المساحة الدنيا: ${project.min_area || 'غير متوفر'}
        نظام الإيجار: ${project.rental_system || 'غير متوفر'}
        الشركة المشغلة: ${project.operating_company || 'غير متوفر'}
        الاستشاري الهندسي: ${project.engineering_consultant || 'غير متوفر'}

        المطلوب:
        1. نقاط القوة الرئيسية في المشروع (3-4 نقاط)
        2. نقاط الضعف أو التحديات المحتملة (2-3 نقاط)
        3. كيفية مقاربة العملاء وإقناعهم (3-4 نقاط)
        4. نقاط مهمة للحديث عنها مع العملاء (4-5 نقاط)

        قم بتنسيق الإجابة بالشكل التالي فقط:
        نقاط القوة:
        - نقطة 1
        - نقطة 2
        - نقطة 3

        نقاط الضعف:
        - نقطة 1
        - نقطة 2

        كيفية مقاربة العملاء:
        - نقطة 1
        - نقطة 2
        - نقطة 3

        نقاط الحديث:
        - نقطة 1
        - نقطة 2
        - نقطة 3
        - نقطة 4
      `;

      const response = await generateText(prompt);
      if (!response) throw new Error('فشل في تحليل المشروع');

      console.log('Generated response:', response);

      const parsedAnalysis = parseAnalysisResponse(response);
      if (!parsedAnalysis) {
        throw new Error('فشل في معالجة نتائج التحليل');
      }

      console.log('Parsed analysis:', parsedAnalysis);
      setAnalysis(parsedAnalysis);
      toast.success('تم تحليل المشروع بنجاح');
    } catch (err) {
      console.error('Error analyzing project:', err);
      toast.error('حدث خطأ أثناء تحليل المشروع');
      setAnalysis(null);
    }
  };

  return {
    analysis,
    analyzeProject,
    isLoading
  };
}