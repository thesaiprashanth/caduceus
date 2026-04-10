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

export async function compareProfiles(profile1: any, profile2: any) {
  const prompt = `
You are an expert Instagram CRM analyst.

Compare these two Instagram business profiles and give:

1. Which profile has stronger brand presence
2. Which has better engagement
3. Which is better for partnerships or outreach
4. Their differences in target audience and content strategy
5. A final verdict on which account performs better and why

Profile 1:
Username: @${profile1.username}
Bio: ${profile1.bio}
Followers: ${profile1.followers}
Engagement Rate: ${profile1.engagementRate}%
Average Likes: ${profile1.avgLikes}
Average Comments: ${profile1.avgComments}

Recent captions:
${profile1.recentPosts.map((p: any) => `- ${p.caption}`).join("\n")}

Profile 2:
Username: @${profile2.username}
Bio: ${profile2.bio}
Followers: ${profile2.followers}
Engagement Rate: ${profile2.engagementRate}%
Average Likes: ${profile2.avgLikes}
Average Comments: ${profile2.avgComments}

Recent captions:
${profile2.recentPosts.map((p: any) => `- ${p.caption}`).join("\n")}

Respond in markdown with headings and bullet points.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Could not generate comparison."
  );
}

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
