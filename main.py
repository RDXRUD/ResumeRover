from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from gtts import gTTS
import uvicorn
import io
from PyPDF2 import PdfReader
import json
import requests
import uuid
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()
origins = [
    "http://localhost:4200",
    "http://localhost:57089"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextToSpeechRequest(BaseModel):
    text: str
    lang: str = 'en'
    slow: bool = False

pdf_store = {"content": None, "filename": None}
ques={}
audioQues={}
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    # Read the PDF content
    content = await file.read()
    # Store the content and filename in the in-memory store
    pdf_store["content"] = content
    pdf_store["filename"] = file.filename
    return {"filename": file.filename, "content_type": file.content_type, "size": len(content)}

@app.get("/get-pdf-data/")
async def get_pdf_data():
    # Retrieve the content from the in-memory store
    content = pdf_store.get("content")
    filename = pdf_store.get("filename")
    
    if not content:
        raise HTTPException(status_code=404, detail="No PDF uploaded")
    
    # Read the PDF content and extract text
    pdf_reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() if page.extract_text() else ""
    
    return {"filename": filename, "content": text}

@app.get("/questions/")
async def get_questions():
    content = pdf_store.get("content")
    if not content:
        raise HTTPException(status_code=404, detail="No PDF uploaded")
    
    # Convert PDF content to text
    pdf_reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() if page.extract_text() else ""
    
    # Prepare the payload for the API request
    url = "https://api.edenai.run/v2/text/chat"
    prevhist="" #"1. Can you provide a brief overview of your background and expertise in Computer Science and Engineering, particularly in the field of Internet of Things?\n\n2. Could you elaborate on your experience at Prudentia-Group, where you developed a Team-Tracker application using Angular, .NET Core, and PostgreSQL? How did you integrate RESTful APIs with JWT authentication for role-based access?\n\n3. Tell me more about your project at Assailing Falcons, where you developed a Data Acquisition System for monitoring real-time flight data. How did you achieve a 92.6% accuracy rate in autonomous landing zone detection using CNN and Raspberry Pi?\n\n4. In your project on Autonomous Landing Zone Detection and Navigation System, how did you integrate CNN for precise landing zone detection and GPS-coordinates integration into the flight controller for autonomous navigation?\n\n5. How did you approach the development of the Thrust Measuring Device (TMD) and the Website Automation project? What were the key challenges you faced and how did you overcome them?\n\n6. Can you discuss your participation in SAE Aero Design East 2023, APOGEE 2023, ACMEE 2023, and Indian Automation Games 2022? How did these experiences contribute to your skill set and professional growth?\n\n7. In your education at VIT and Aryaman Vikram Birla Institute Of Learning, how did you leverage your coursework and projects to enhance your understanding of Computer Science and Engineering, particularly in the Internet of Things specialization?\n\n8. How do you stay updated with the latest trends and technologies in the field of IoT and how do you plan to further develop your skills in the future?\n\n9. Given a scenario where you need to design a real-time monitoring system for a fleet of drones using IoT devices, how would you approach this project considering your past experiences and expertise in the field?"

    payload = {
        "response_as_dict": True,
        "attributes_as_list": False,
        "show_original_response": False,
        "temperature": 0,
        "max_tokens": 500,
        "providers": ["openai/gpt-3.5-turbo"],#/gpt-3.5-turbo
        "text": text,
        "chatbot_global_action": "You are an Interviewer,ask question in shor length from every aspect of the resume,from self introduction to work experience, projects, extracurricular, also asked an case based sceneio at end. Do not ask these {}".format(prevhist),#You are an Interviewer,question should be short and general,ask 1 introduction and 2 technical question based on the project and experience
        "previous_history": []
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTNhYzM5ODctY2ViYi00MTJmLWIxZTMtODQzODUyNDA2OTk4IiwidHlwZSI6ImFwaV90b2tlbiJ9.jiT8XdMFbMu9WIO2QpidiXiyLIJkv1qO46K6eoSse50"
    }

    response = requests.post(url, json=payload, headers=headers)
    reply=response.json()["openai/gpt-3.5-turbo"]["generated_text"]
    questions = reply.strip().split('\n\n')
    
# Strip leading numbers and whitespace from each question
    questions = [question.lstrip('0123456789. ') for question in questions]
    c=0
    for i in questions:
        c=c+1
        ques.setdefault(c,i)
    return (questions)#["openai"]["generated_text"]
    # data = ques[0]
    
    # # if 'text' not in data:
    # #     return {"error": "No text provided"}, 400
    
    # text = data
    # lang = 'en'
    # slow = False
    
    # # Generate a unique filename
    # filename = f"{uuid.uuid4()}.mp3"
    
    # # Create the gTTS object
    # try:
    #     # Create the gTTS object
    #     tts = gTTS(text=text, lang=lang, slow=slow)
        
    #     # Save the audio file
    #     tts.save(filename)
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

    # # Send the audio file as a response
    # return FileResponse(filename, media_type='audio/mpeg', filename=filename)

@app.get("/voice")
async def sppech():
    print(ques)
    print("adfdsajgk")
    responses=[]
    c=0
    for i in ques:
        c=c+1
        data = ques.get(c)
        
        
        # if 'text' not in data:
        #     return {"error": "No text provided"}, 400
        
        text = data
        lang = 'en'
        slow = False
        
        # Generate a unique filename
        filename = f"{uuid.uuid4()}.mp3"
        
        # Create the gTTS object
        # try:
            # Create the gTTS object
        tts = gTTS(text=text, lang=lang, slow=slow)
        
        # Save the audio file
        tts.save(filename)
        audioQues[c]=filename
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

    # Send the audio file as a response
        responses.append({"question": text, "audiofile": filename})
    return responses
@app.on_event("shutdown")
def shutdown_event():
    # Clean up generated audio files on server shutdown
    for filename in audioQues.values():
        if os.path.exists(filename):
            os.remove(filename)
# This part ensures that the app runs only if the script is executed directly
if __name__ == "__main__":
    # uvicorn.run(app, host="127.0.0.1", port=8080, reload=True)
    uvicorn.run(app,host='localhost',port=8002)
