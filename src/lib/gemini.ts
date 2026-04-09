import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeProfile = async (profileData: any) => {
  const prompt = `
    You are a world-class CRM Specialist and Business Intelligence Analyst. 
    Analyze the following Instagram Business Profile data from a CRM and Lead Management perspective.
    
    Data to analyze:
    - Username: ${profileData.username}
    - Followers: ${profileData.followers}
    - Engagement Rate: ${profileData.engagementRate}%
    - Bio: ${profileData.bio}
    - Recent Posts Performance: ${JSON.stringify(profileData.recentPosts)}

    Please provide your analysis in the following structure:
    1. **Lead Quality Assessment**: Based on the bio and content, what kind of customers/leads is this profile attracting?
    2. **Conversion Potential**: How well is the profile optimized for converting followers into customers? (Bio links, CTAs, etc.)
    3. **Relationship Strategy**: Recommendations for improving community management and building long-term relationships with the audience.
    4. **CRM Action Plan**: 3-5 specific CRM-focused tasks (e.g., outreach to top commenters, segmenting audience by interest).
    5. **Revenue Opportunity**: Identify potential untapped revenue streams based on their current audience engagement.

    Keep the tone professional, strategic, and growth-oriented. Use markdown for formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate AI analysis. Please try again.";
  }
};

export const chatWithProfile = async (profileData: any, message: string, history: { role: string, parts: string }[]) => {
  const context = `
    You are Caduceus AI, the CRM assistant for this Instagram profile:
    - Username: ${profileData.username}
    - Followers: ${profileData.followers}
    - Engagement: ${profileData.engagementRate}%
    - Bio: ${profileData.bio}
    
    Use this data to answer the user's questions about their CRM strategy, audience, and growth.
    Be concise, professional, and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: context }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
        { role: "user", parts: [{ text: message }] }
      ],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
};
