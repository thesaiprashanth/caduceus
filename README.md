# 🩺 Caduceus
> A full-stack AI-powered CRM platform that analyzes business profiles and generates intelligent sales insights using machine learning and large language models.

![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20React-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

📌 Problem Statement  
AI-Powered Business Intelligence & Social CRM Platform

---

🚀 Features  

Feature | Description
--- | ---
🤖 AI Profile Analysis | Analyze business profiles using large language models to generate CRM insights
🧠 Similarity Engine | Machine learning model discovers similar businesses and potential leads
💬 AI Chat Assistant | Ask contextual questions about business strategy and growth opportunities
📊 CRM Dashboard | Real-time visualization of engagement metrics, lead insights, and pipeline analytics
🧩 Business Intelligence | Generate audience insights, conversion strategies, and revenue signals
⚙️ RESTful API | FastAPI backend providing structured endpoints for profile analysis and AI interaction

---

🏗️ Tech Stack  

**Frontend**

⚛️ React.js — Component-based UI  
🎨 TailwindCSS — Utility-first styling  
🔗 Axios — API communication  
📊 Recharts — Data visualization  
🎬 Framer Motion — UI animations  

**Backend**

🐍 FastAPI (Python) — REST API framework  
🤖 Google Gemini — Large language model for business analysis  
🧠 Machine Learning Pipeline — Embedding similarity and neural network models  
🔐 Firebase Authentication — Google Sign-in integration  

---

📂 Project Structure

```
caduceus/
├── backend/
│   ├── api/
│   │   ├── chatbot.py                 # AI chat endpoint
│   │   └── extract.py                 # Profile analysis endpoint
│   ├── ml_pipeline/
│   │   ├── siamese_model.py           # Business similarity neural network
│   │   ├── embedding_generator.py     # Profile embedding generation
│   │   └── similarity_search.py       # Similar business discovery
│   └── main.py                        # FastAPI entry point and routes
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # Profile search interface
│   │   │   ├── CRMDashboardPage.tsx   # CRM analytics dashboard
│   │   │   ├── ChatbotPage.tsx        # AI assistant interface
│   │   │   ├── HelpCenter.tsx         # Help and documentation page
│   │   ├── components/
│   │   │   ├── dashboard/             # Dashboard widgets
│   │   │   ├── layout/                # Sidebar and header components
│   │   │   └── chat/                  # Chat UI components
│   │   ├── lib/
│   │   │   ├── gemini.ts              # AI integration logic
│   │   │   ├── firebase.ts            # Authentication configuration
│   │   │   └── utils.ts               # Helper utilities
│   │   ├── App.tsx                    # Root component and routing
│   │   └── index.css                  # Global styles
│   └── package.json
│
└── README.md
```

---

⚙️ Installation & Setup  

**Prerequisites**

Python 3.9+  
Node.js 16+

---

**1. Clone the Repository**

```bash
git clone https://github.com/xxxx/caduceus.git
cd caduceus
```

---

**2. Backend Setup**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`  

API docs available at `http://127.0.0.1:8000/docs`

---

**3. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

🧠 How It Works  

**Profile Analysis Flow**

1. User provides a business profile identifier through the UI  
2. Frontend sends the request to the backend API  
3. Backend processes profile metadata and contextual data  
4. AI model analyzes the business using large language models  
5. CRM insights are generated including audience analysis and growth strategies  
6. Results are visualized on the dashboard  

---

**AI Chat Assistant Flow**

1. User submits a question through the chat interface  
2. Request is sent to the `/chatbot` API endpoint  
3. Backend combines profile context with conversation history  
4. Gemini AI generates contextual recommendations  
5. Response is displayed in the chat interface  

---

**Similarity Discovery Flow**

1. Profile information is converted into embeddings  
2. Machine learning pipeline processes embeddings using a Siamese neural network  
3. Similarity scores are computed between profiles  
4. Similar businesses and potential leads are identified  
5. Results are returned to the dashboard  

---

📈 Scalability  

Backend can be containerized with Docker and deployed behind a load balancer to handle concurrent requests  

ML similarity search can be optimized using vector databases such as FAISS or Pinecone  

CRM data storage can be migrated to PostgreSQL or MongoDB for large-scale deployments  

Frontend can be deployed through CDN-backed hosting for global performance  

---

💡 Feasibility  

Caduceus leverages production-grade technologies including FastAPI, React, and modern AI models. The modular architecture enables scalable AI analysis and seamless integration with CRM workflows while keeping the system lightweight and deployable.

---

🌟 Novelty  

Traditional CRM platforms rely heavily on manual data entry and structured databases. Caduceus introduces an AI-driven approach where business profiles can be automatically analyzed to extract strategic insights.

By combining large language models with machine learning similarity detection, the platform can identify competitors, discover potential leads, and generate business growth strategies automatically.

---

🔧 Feature Depth  

AI-generated CRM insights based on contextual business understanding  

Machine learning similarity engine for competitor and lead discovery  

Interactive AI chat assistant for business strategy recommendations  

Visual analytics dashboard for sales intelligence  

Modular backend architecture enabling AI and ML integration  

API-first design enabling integration with external tools and services  

---

⚠️ Ethical Use & Disclaimer  

Caduceus is intended for educational, research, and legitimate business intelligence use cases.

Users must ensure compliance with platform policies and applicable laws when analyzing publicly available business information.

Use responsibly and ethically.

---

📜 License  

Licensed under the Apache 2.0 License.

---

🤝 Contributing  

Contributions are welcome.

Fork the repository  

Create a feature branch: `git checkout -b feature-name`  

Commit your changes: `git commit -m "Add feature-name"`  

Push and open a Pull Request  

---

🧩 Author  

Sai Prashanth M 
A D Suriya 
Sree Anirudhan A
Pratyush r

🔗 GitHub
