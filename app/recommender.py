#import thư viện
import faiss
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer



model = SentenceTransformer("all-MiniLM-L6-v2")
df = pd.read_csv("data/Amazon-Products_processed.csv")
embeddings = np.load("models/embeddings.npy").astype("float32")
index = faiss.read_index("models/product_index.faiss")



def recommend_products(query, top_k=5):
    # Tạo embedding cho câu truy vấn
    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    ).astype("float32")

    # Chuẩn hóa
    faiss.normalize_L2(query_embedding)

    # Tìm kiếm
    scores, indices = index.search(query_embedding, top_k)

    # Lấy kết quả
    recommendations = df.iloc[indices[0]].copy()

    # Thêm điểm tương đồng
    recommendations["similarity"] = scores[0]

    return recommendations