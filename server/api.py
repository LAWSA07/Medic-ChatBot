from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpoint, HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import traceback

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vector store
DB_FAISS_PATH = "vectorstore/db_faiss"
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.load_local(DB_FAISS_PATH, embedding_model, allow_dangerous_deserialization=True)

# Mistral-7B configuration
HUGGINGFACE_REPO_ID = "mistralai/Mistral-7B-Instruct-v0.3"
HF_TOKEN = os.getenv("HF_TOKEN")  # Ensure this is set in .env

# Initialize LLM with correct authentication
llm = HuggingFaceEndpoint(
    repo_id=HUGGINGFACE_REPO_ID,
    temperature=0.5,
    max_length=512,
    huggingfacehub_api_token=HF_TOKEN,  # Correct parameter name
    task="text-generation"
)

# Mistral-specific prompt template
CUSTOM_PROMPT_TEMPLATE = """[INST]
You are a medical AI assistant. Use the following context to answer the question.
If the answer isn't in the context, say you don't know. Be concise and factual.

Context: {context}

Question: {question} [/INST]
"""

prompt = PromptTemplate(
    template=CUSTOM_PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True,
    chain_type_kwargs={"prompt": prompt}
)

# Request model
class ChatRequest(BaseModel):
    query: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        result = qa_chain.invoke({"query": request.query})
        return {"response": result["result"]}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Error processing your request. Please try again."
        )