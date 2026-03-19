from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="SpeakWell - Spoken English Training")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo API endpoints for content
@app.get("/api/instructor")
async def get_instructor():
    return {
        "name": "Rajesh Kumar",
        "title": "Senior English Communication Trainer",
        "experience": "12+ years",
        "bio": "Dedicated English trainer with expertise in spoken English, accent reduction, and professional communication. I have helped over 5000+ students master English language skills.",
        "qualifications": "Master's in English Literature, TEFL Certified",
        "image": "/images/instructor.jpg",
        "contact": {
            "email": "rajesh@speakwell.com",
            "phone": "+91 98765 43210",
            "location": "Delhi, India"
        }
    }

@app.get("/api/services")
async def get_services():
    return [
        {
            "id": 1,
            "name": "Beginner Spoken English",
            "duration": "8 weeks",
            "level": "A1-A2",
            "price": "₹4,999",
            "description": "Perfect for those just starting their English journey. Learn basic conversations, grammar, and pronunciation.",
            "image": "/images/service1.jpg",
            "includes": ["30 hours of classes", "Grammar workbook", "Pronunciation guide", "Certificate"]
        },
        {
            "id": 2,
            "name": "Intermediate English Communication",
            "duration": "10 weeks",
            "level": "B1-B2",
            "price": "₹7,499",
            "description": "Build confidence in everyday conversations and professional settings.",
            "image": "/images/service2.jpg",
            "includes": ["40 hours of classes", "Business English modules", "Real-world scenarios", "Speaking practice sessions", "Certificate"]
        },
        {
            "id": 3,
            "name": "Advanced Professional English",
            "duration": "12 weeks",
            "level": "C1-C2",
            "price": "₹9,999",
            "description": "Master advanced communication for career advancement and international opportunities.",
            "image": "/images/service3.jpg",
            "includes": ["50 hours of classes", "Industry-specific training", "Presentation skills", "IELTS preparation", "One-on-one mentoring", "Certificate"]
        },
        {
            "id": 4,
            "name": "Accent Reduction Program",
            "duration": "6 weeks",
            "level": "All levels",
            "price": "₹5,999",
            "description": "Specialized training to improve pronunciation and reduce accent.",
            "image": "/images/service4.jpg",
            "includes": ["24 hours of classes", "Phonetics training", "Individual feedback", "Audio exercises"]
        },
        {
            "id": 5,
            "name": "IELTS Speaking Preparation",
            "duration": "8 weeks",
            "level": "B2+",
            "price": "₹6,999",
            "description": "Intensive preparation for IELTS speaking band 7+.",
            "image": "/images/service5.jpg",
            "includes": ["32 hours of classes", "Mock tests", "Band descriptors training", "Fluency and coherence practice"]
        },
        {
            "id": 6,
            "name": "Corporate Training",
            "duration": "Customized",
            "level": "All levels",
            "price": "Custom Quote",
            "description": "Tailored English programs for companies and organizations.",
            "image": "/images/service6.jpg",
            "includes": ["Custom curriculum", "On-site/Online training", "Progress tracking", "Team building"]
        }
    ]

@app.get("/api/testimonials")
async def get_testimonials():
    return [
        {
            "id": 1,
            "name": "Priya Singh",
            "role": "Software Engineer",
            "rating": 5,
            "testimonial": "Rajesh's teaching methodology is outstanding! My confidence in speaking English has increased dramatically. Highly recommended!",
            "image": "/images/testimonial1.jpg"
        },
        {
            "id": 2,
            "name": "Amit Patel",
            "role": "Marketing Manager",
            "rating": 5,
            "testimonial": "The accent reduction program was exactly what I needed for my career growth. Professional and effective!",
            "image": "/images/testimonial2.jpg"
        },
        {
            "id": 3,
            "name": "Neha Kapoor",
            "role": "HR Executive",
            "rating": 5,
            "testimonial": "Best investment for my professional development. The one-on-one sessions are personalized and effective.",
            "image": "/images/testimonial3.jpg"
        },
        {
            "id": 4,
            "name": "Rahul Sharma",
            "role": "Student",
            "rating": 5,
            "testimonial": "I joined as a beginner and now I can confidently speak English in any situation. Absolutely amazing!",
            "image": "/images/testimonial4.jpg"
        },
        {
            "id": 5,
            "name": "Anjali Desai",
            "role": "Business Owner",
            "rating": 5,
            "testimonial": "Corporate training for my team was well-structured and delivered excellent results. Very professional!",
            "image": "/images/testimonial5.jpg"
        }
    ]

@app.get("/api/stats")
async def get_stats():
    return {
        "students": 5000,
        "experience": "12+ Years",
        "courses": 6,
        "rating": 4.9,
        "reviews": 1200
    }

# Serve static files
if not os.path.exists("frontend/build"):
    os.makedirs("frontend/build", exist_ok=True)

try:
    app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")
except:
    pass

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
