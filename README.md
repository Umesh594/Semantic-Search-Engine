# Semantic Content Search
## 1. Project Overview
This project is a single page application that allows users to input a website URL and a search query. The app fetches the HTML content of the given URL, splits it into chunks, embeds them using a transformer model and stores them in Weaviate for semantic search. Users can retrieve the top 10 most relevant content chunks for their query.
## 2. Tech Stack
- Frontend:  
- React.js + TypeScript  
- Tailwind CSS   
- Backend:  
- Python  
- FastAPI  
- BeautifulSoup4 for HTML parsing  
- Sentence Transformers for embeddings
- Vector Database:  
- Weaviate  
- Stores chunks with embeddings for semantic search  
## 3. Prerequisites
- Python  
- Node.js  
- Docker for running Weaviate 
- Git  
## 4. Setup Instructions
## Backend
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
## Frontend
cd frontend
npm install
npm run dev
## Vector Database (Weaviate)
Run Weaviate using Docker:
docker-compose up -d
## How to Use
Start the frontend.
Enter a website URL and a search query.
Click Search Content.
Top 10 relevant HTML content chunks are displayed including relevance scores.
