// Edge function for parsing resumes with OpenAI GPT
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    if (!resumeText) throw new Error("No resume text provided");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    console.log("Processing resume with OpenAI...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
              You are a resume parsing assistant. Extract structured information from resume text and return it in JSON format.
              Always return valid JSON with the following structure:
              {
                "name": "Full Name",
                "email": "email@example.com",
                "phone": "+1234567890",
                "skills": ["skill1", "skill2"],
                "experience": [
                  {
                    "title": "Job Title",
                    "company": "Company Name",
                    "duration": "Jan 2020 - Present",
                    "description": "Brief description"
                  }
                ],
                "education": [
                  {
                    "degree": "Degree Name",
                    "institution": "University Name",
                    "year": "2020"
                  }
                ]
              }
              If any field is missing, use empty string or empty array. Be thorough.
            `,
          },
          {
            role: "user",
            content: `Parse this resume text:\n\n${resumeText}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned by OpenAI");

    // Remove possible code blocks
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```json")) jsonContent = jsonContent.slice(7);
    if (jsonContent.startsWith("```")) jsonContent = jsonContent.slice(3);
    if (jsonContent.endsWith("```")) jsonContent = jsonContent.slice(0, -3);

    const parsedData: ResumeData = JSON.parse(jsonContent.trim());
    console.log("Resume parsed successfully:", parsedData.name);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in parse-resume function:", error);
    return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Failed to parse resume"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});