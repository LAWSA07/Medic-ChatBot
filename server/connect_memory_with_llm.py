from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv

load_dotenv()

def load_llm(repo_id):
    HF_TOKEN = os.getenv("HF_TOKEN")
    return HuggingFaceEndpoint(
        repo_id=repo_id,
        temperature=0.5,
        model_kwargs={"token": HF_TOKEN, "max_length": 512}
    )

def set_custom_prompt():
    return PromptTemplate(
        template="""
        Use the context to answer the question. If you don't know, say you don't know.
        Context: {context}
        Question: {question}
        Start the answer directly.
        """,
        input_variables=["context", "question"]
    )

def create_qa_chain():
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/allMiniLM-L6-v2")
    vectorstore = FAISS.load_local("vectorstore/db_faiss", embedding_model)
    llm = load_llm("mistralai/Mistral-7B-Instruct-v0.3")
    prompt = set_custom_prompt()
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        chain_type_kwargs={"prompt": prompt}
    )