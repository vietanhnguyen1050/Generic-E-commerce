from fastapi import FastAPI
from app.recommender import recommend_products

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Service is running"}

@app.get("/recommend_products")
def recommendation(query: str):

    return recommend_products(query).to_dict("records")