from flask import Flask, request, jsonify, Response
app = Flask(__name__)
import argparse
import io
import PIL
import duckdb
import lancedb
import pyarrow.compute as pc
from transformers import CLIPModel, CLIPProcessor, CLIPTokenizerFast
import gradio as gr

@app.route("/api/python", methods=['GET'])
def get_image_blob():
    # Assuming you have the setup_clip_model, get_table, and embed_func functions
    # data = request.json
    setup_clip_model()
    tbl = get_table()
    emb = embed_func("car")
    print(emb)
    result_df = tbl.search(emb).limit(1).to_df()

    if not result_df.empty:
        image_col = "image"
        image, prompt = _extract(result_df)
        
        # Convert PIL.Image to bytes
        image_bytes = io.BytesIO()
        image.save(image_bytes, format='PNG')
        image_blob = image_bytes.getvalue()

        return Response(image_blob, content_type='image/png')

    return jsonify({"error": "No matching data found"})

def _extract(df):
    image_col = "image"
    return PIL.Image.open(io.BytesIO(df.iloc[0][image_col])), df.iloc[0]["prompt"]


MODEL_ID = None
MODEL = None
TOKENIZER = None
PROCESSOR = None

def get_table():
    db = lancedb.connect("data/lancedb")
    return db.open_table("images")

def setup_clip_model():
    global MODEL_ID, MODEL, TOKENIZER, PROCESSOR
    MODEL_ID = "openai/clip-vit-base-patch32"
    TOKENIZER = CLIPTokenizerFast.from_pretrained(MODEL_ID)
    MODEL = CLIPModel.from_pretrained(MODEL_ID)
    PROCESSOR = CLIPProcessor.from_pretrained(MODEL_ID)

def embed_func(query):
    inputs = TOKENIZER([query], padding=True, return_tensors="pt")
    text_features = MODEL.get_text_features(**inputs)
    return text_features.detach().numpy()[0]