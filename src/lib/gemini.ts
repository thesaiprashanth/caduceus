const API_BASE_URL = "http://127.0.0.1:8000";

type ChatMessage = {
  role: string;
  content: string;
};

const fetchChatbotReply = async (payload: {
  message: string;
  mode?: string | null;
  history?: ChatMessage[];
}) => {
  const response = await fetch(`${API_BASE_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Chatbot API request failed.");
  }

  const data: { reply?: string } = await response.json();
  return data.reply || "";
};

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
    return await fetchChatbotReply({
      message: prompt,
      mode: "think",
      history: [],
    });
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

  const mappedHistory: ChatMessage[] = [
    { role: "user", content: context },
    ...history.map((h) => ({
      role: h.role === "model" ? "model" : "user",
      content: h.parts,
    })),
  ];

  try {
    return await fetchChatbotReply({
      message,
      mode: null,
      history: mappedHistory,
    });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
};
