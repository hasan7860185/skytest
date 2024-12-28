import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function formatCompanyData(companies: any[]) {
  return companies.map(company => ({
    ...company,
    projects: company.projects?.map((project: any) => ({
      ...project,
      price_per_meter: Number(project.price_per_meter) || null,
      available_units: Number(project.available_units) || null,
      unit_price: Number(project.unit_price) || null,
      min_area: Number(project.min_area) || null,
      images: project.images || [], // Ensure images are included
    }))
  }));
}

function processSearchResults(text: string) {
  try {
    console.log('Processing raw text:', text);
    
    // Extract JSON from the text in case there's any extra content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response');
      throw new Error('No valid JSON found in AI response');
    }

    const jsonText = jsonMatch[0];
    console.log('Extracted JSON:', jsonText);
    
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    if (!data.summary || !data.matches) {
      console.error('Missing required fields in response:', data);
      throw new Error('Invalid response structure: missing required fields');
    }

    if (data.matches) {
      data.matches = data.matches.map((match: any) => {
        if (!match.name || !match.relevance) {
          console.error('Invalid match structure:', match);
          throw new Error('Invalid match data: missing required fields');
        }

        if (match.projects) {
          match.projects = match.projects.map((project: any) => {
            if (!project.name) {
              console.error('Invalid project structure:', project);
              throw new Error('Invalid project data: missing name');
            }

            return {
              ...project,
              price_per_meter: project.price_per_meter ? Number(project.price_per_meter) : null,
              available_units: project.available_units ? Number(project.available_units) : null,
              unit_price: project.unit_price ? Number(project.unit_price) : null,
              min_area: project.min_area ? Number(project.min_area) : null,
            };
          });
        }

        return match;
      });
    }

    if (!data.insights) {
      data.insights = 'لا توجد تحليلات إضافية';
    }

    console.log('Successfully processed data:', data);
    return data;
  } catch (error) {
    console.error('Error processing search results:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { entity } = await req.json()
    console.log('Received entity:', entity);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    if (entity.type === 'search') {
      console.log('Processing search query:', entity.query)
      
      const { data: companies, error: companiesError } = await supabaseClient
        .from('companies')
        .select(`
          id,
          name,
          description,
          projects (
            id,
            name,
            description,
            engineering_consultant,
            operating_company,
            project_sections,
            location,
            price_per_meter,
            available_units,
            unit_price,
            min_area,
            rental_system,
            delivery_date,
            images
          )
        `)
      
      if (companiesError) {
        console.error('Error fetching companies:', companiesError)
        throw companiesError
      }

      const formattedCompanies = formatCompanyData(companies);

      const prompt = `
        قم بتحليل الاستعلام التالي والبحث عن الشركات ومشاريعها ذات الصلة.
        الاستعلام: ${entity.query}
        
        البيانات المتوفرة:
        ${JSON.stringify(formattedCompanies, null, 2)}
        
        تعليمات مهمة:
        1. يجب أن يكون الملخص والتحليلات باللغة العربية فقط
        2. احتفظ بجميع الأرقام والتواريخ وروابط الصور بتنسيقها الأصلي
        3. قم بتنسيق الرد كـ JSON بهذا الهيكل فقط:
        {
          "summary": "ملخص موجز بالعربية عما تم العثور عليه",
          "matches": [
            {
              "id": "معرف الشركة",
              "name": "اسم الشركة",
              "relevance": "سبب المطابقة بالعربية",
              "projects": [
                {
                  "name": "اسم المشروع",
                  "description": "وصف المشروع",
                  "location": "الموقع",
                  "price_per_meter": رقم,
                  "available_units": رقم,
                  "unit_price": رقم,
                  "min_area": رقم,
                  "project_sections": "أقسام المشروع",
                  "operating_company": "الشركة المشغلة",
                  "engineering_consultant": "الاستشاري الهندسي",
                  "rental_system": "نظام الإيجار",
                  "delivery_date": "التاريخ أو null",
                  "images": ["رابط الصورة 1", "رابط الصورة 2"]
                }
              ]
            }
          ],
          "insights": "تحليلات إضافية باللغة العربية"
        }

        ملاحظات إضافية:
        - يجب أن تكون جميع النصوص باللغة العربية
        - لا تستخدم أي رموز خاصة أو علامات نصية
        - احتفظ بأسماء الشركات والمشاريع وروابط الصور كما هي بدون تغيير
        - يجب أن يكون الرد JSON صالح فقط، بدون أي نص إضافي قبله أو بعده
        - تأكد من تضمين مصفوفة الصور كما هي في البيانات الأصلية
      `

      console.log('Sending prompt to Gemini')
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      console.log('Received response from Gemini:', text)
      
      try {
        const processedResponse = processSearchResults(text);
        return new Response(
          JSON.stringify({ analysis: processedResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (processError) {
        console.error('Error processing results:', processError);
        return new Response(
          JSON.stringify({ error: processError.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    if (entity.type === 'company') {
      // Fetch company's projects
      const { data: projects } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('company_id', entity.id)

      const prompt = `
        Analyze the following company and its projects:
        
        Company Name: ${entity.name}
        Description: ${entity.description || 'No description provided'}
        
        Projects: ${JSON.stringify(projects || [], null, 2)}
        
        Please provide:
        1. A brief summary of the company
        2. Key strengths and focus areas
        3. Analysis of their projects
        4. Market positioning
        5. Recommendations
        
        Format the response as a JSON object with the following structure:
        {
          "name": "${entity.name}",
          "summary": "Brief company overview",
          "strengths": ["Strength 1", "Strength 2"],
          "focus_areas": ["Area 1", "Area 2"],
          "project_analysis": "Analysis of their projects",
          "market_position": "Market positioning analysis",
          "recommendations": ["Recommendation 1", "Recommendation 2"]
        }
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        const analysis = JSON.parse(text)
        
        // Store the analysis in the database
        await supabaseClient
          .from('ai_company_insights')
          .upsert({
            company_id: entity.id,
            analysis_data: analysis,
            analyzed_at: new Date().toISOString()
          })

        return new Response(
          JSON.stringify({ analysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (e) {
        // If JSON parsing fails, return the raw text in a structured format
        const fallbackAnalysis = {
          name: entity.name,
          summary: text,
          strengths: [],
          focus_areas: [],
          project_analysis: "",
          market_position: "",
          recommendations: []
        }

        await supabaseClient
          .from('ai_company_insights')
          .upsert({
            company_id: entity.id,
            analysis_data: fallbackAnalysis,
            analyzed_at: new Date().toISOString()
          })

        return new Response(
          JSON.stringify({ analysis: fallbackAnalysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})