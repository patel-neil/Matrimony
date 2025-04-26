from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
import pickle
import numpy as np
from datetime import datetime
import re

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify frontend URL instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
with open("matrimony_match_predictor.pkl", "rb") as f:
    model = pickle.load(f)

# Connect to MongoDB
client = MongoClient('mongodb+srv://neil200417:neil2017@cluster0.s91vbxd.mongodb.net/')
db = client['test']
profiles_collection = db['userprofiles']

# Utility functions
def calculate_age(dob):
    if not dob:
        return None
    today = datetime.now()
    dob = datetime.strptime(dob, "%Y-%m-%d")
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

def extract_height_cm(height_str):
    if not height_str:
        return None
    if isinstance(height_str, (int, float)):
        return height_str
    match = re.search(r'(\d+)\s*cm', str(height_str), re.IGNORECASE)
    if match:
        return int(match.group(1))
    try:
        return float(str(height_str).split()[0])
    except:
        return None

# Helper function to validate ObjectId
def is_valid_object_id(user_id: str) -> bool:
    try:
        # Try to convert user_id to ObjectId
        ObjectId(user_id)
        return True
    except:
        return False

# API route
@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    if not is_valid_object_id(user_id):
        raise HTTPException(status_code=400, detail="Invalid user_id format.")

    try:
        # Fetch the current user profile
        current_user = profiles_collection.find_one({"_id": ObjectId(user_id)})
        if not current_user:
            raise HTTPException(status_code=404, detail="User not found.")

        # Fetch all profiles except the current user
        all_profiles = list(profiles_collection.find({"_id": {"$ne": ObjectId(user_id)}}))
        processed_profiles = []

        for profile in all_profiles:
            try:
                processed = {
                    'age': calculate_age(profile.get('dateOfBirth')),
                    'gender': profile.get('gender'),
                    'religion': profile.get('religion'),
                    'mother_tongue': profile.get('motherTongue'),
                    'marital_status': profile.get('maritalStatus'),
                    'education': profile.get('education'),
                    'height_cm': extract_height_cm(profile.get('height')),
                    'weight_kg': profile.get('weight'),
                    'income_usd': profile.get('annualIncome') / 80 if profile.get('annualIncome') else None,
                    'family_type': profile.get('familyType'),
                    'occupation': profile.get('occupation'),
                    'hobbies': profile.get('hobbies', [])[0] if profile.get('hobbies') else None,
                    'food_preference': profile.get('diet'),
                    'location': 'Urban' if profile.get('city') in ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] else 'Rural',
                    'lifestyle': profile.get('fitnessLevel'),
                    'full_name': f"{profile.get('firstName')} {profile.get('lastName')}",
                    'user_id': str(profile.get('_id')),
                }
                
                # Ensure essential fields are present
                if all(processed[key] is not None for key in ['age', 'gender', 'religion', 'height_cm', 'weight_kg']):
                    processed_profiles.append(processed)

            except Exception as e:
                continue
        
        if not processed_profiles:
            return {"success": True, "recommendations": []}

        # Full dataframe
        df_profiles = pd.DataFrame(processed_profiles)

        # Separate features and metadata
        feature_cols = df_profiles.drop(columns=["full_name", "user_id"])

        # Predict match probabilities
        match_probs = model.predict_proba(feature_cols)[:, 1]  # probability of class 1 (match)

        # Attach prediction to original data
        df_profiles["match_probability"] = match_probs

        # Sort by match probability
        top_matches = df_profiles.sort_values(by="match_probability", ascending=False)

        # Convert to list of dicts for JSON response
        recommendations = top_matches[["user_id", "full_name", "match_probability"]].to_dict(orient="records")

        return {"success": True, "recommendations": recommendations}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
