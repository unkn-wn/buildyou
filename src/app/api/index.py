from flask import Flask, request, jsonify, Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import argparse
import io
import PIL
import duckdb
import lancedb
import lance
import pyarrow.compute as pc
from transformers import CLIPModel, CLIPProcessor, CLIPTokenizerFast
import gradio as gr
@app.route("/api/python", methods=['POST'])
def get_image_blob():
    # Assuming you have the setup_clip_model, get_table, and embed_func functions
    data = request.get_json()  # Parse incoming JSON data
    prompt = data.get('prompt', '')  # Get the 'prompt' property from the JSON data
    tbl = get_table()
    print(data)
    emb = embed_func(prompt)
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
import pyarrow.compute as pc

def get_table():
    db = lancedb.connect("data/lancedb")
    if "diffusiondb" in db.table_names():
        tbl= db.open_table("diffusiondb")
    else:
        # First data processing and full-text-search index
        data = lance.dataset("rawdata.lance").to_table()
        # remove null prompts
        tbl = db.create_table("diffusiondb", data.filter(~pc.field("prompt").is_null()), mode="overwrite")
        tbl = tbl.create_fts_index(["prompt"])
    return tbl
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

setup_clip_model()
