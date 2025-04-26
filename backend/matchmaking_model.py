from pymongo import MongoClient
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
import numpy as np
import pickle
from datetime import datetime
import re
import traceback
import json
import argparse
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('python_debug.log'),
        logging.StreamHandler(sys.stderr)
    ]
)

# Function to calculate age from date of birth
def calculate_age(dob):
    if not dob:
        return None
    today = datetime.now()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

# Function to extract height in cm from height string
def extract_height_cm(height_str):
    if not height_str:
        return None
    
    # If height is already stored as a number
    if isinstance(height_str, (int, float)):
        return height_str
    
    # Extract numeric part from string like "175 cm"
    match = re.search(r'(\d+)\s*cm', str(height_str), re.IGNORECASE)
    if match:
        return int(match.group(1))
    
    # Try to extract just the number
    try:
        return float(str(height_str).split()[0])
    except:
        return None

# Connect to MongoDB and extract data
def get_profiles_from_mongodb():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://neil200417:neil2017@cluster0.s91vbxd.mongodb.net/')
        logging.info("Connected to MongoDB")
        
        db = client['test']
        profiles = list(db.userprofiles.find())
        logging.info(f"Found {len(profiles)} profiles")
        
        processed_data = []
        
        for profile in profiles:
            try:
                processed_profile = {
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
                    'hobbies': profile.get('hobbies', [])[0] if profile.get('hobbies') and len(profile.get('hobbies')) > 0 else None,
                    'food_preference': profile.get('diet'),
                    'location': 'Urban' if profile.get('city') in ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] else 'Rural',
                    'lifestyle': profile.get('fitnessLevel'),
                    'full_name': f"{profile.get('firstName')} {profile.get('lastName')}",
                    'user_id': profile.get('_id'),
                    'label': 1 if (
                        profile.get('gender') and
                        profile.get('religion') and
                        profile.get('maritalStatus') == 'Never Married' and
                        profile.get('education') in ['Graduate', 'Post Graduate'] and
                        profile.get('annualIncome', 0) >= 30000 and
                        profile.get('height') and
                        profile.get('weight')
                    ) else 0
                }
                
                if all(processed_profile[key] is not None for key in ['age', 'gender', 'religion', 'height_cm', 'weight_kg']):
                    processed_data.append(processed_profile)
                    
            except Exception as e:
                logging.error(f"Error processing profile: {e}")
                continue
        
        df = pd.DataFrame(processed_data)
        
        if df.empty:
            logging.warning("No valid profiles found after processing")
            return None
        
        logging.info(f"Processed {len(df)} profiles with complete data")
        logging.info(f"Positive matches: {df['label'].sum()}")
        logging.info(f"Negative matches: {len(df) - df['label'].sum()}")
        
        return df
        
    except Exception as e:
        logging.error(f"MongoDB connection error: {e}")
        logging.error(traceback.format_exc())
        return None

# Train ML model
def train_matrimony_model(df):
    try:
        # Clean data
        df = df.dropna()
        
        # Define feature columns and target
        X = df.drop(columns=['label', 'user_id', 'full_name'])
        y = df['label']
        
        # Define numerical and categorical features
        numerical_features = ['age', 'height_cm', 'weight_kg', 'income_usd']
        categorical_features = [col for col in X.columns if col not in numerical_features]
        
        # Preprocessor for scaling numerical features and one-hot encoding categorical features
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numerical_features),
                ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
            ]
        )
        
        # Gradient Boosting model
        model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', GradientBoostingClassifier(
                n_estimators=300,
                learning_rate=0.1,
                max_depth=15,
                random_state=42
            ))
        ])
        
        # Split into train and test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Fit the model
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model accuracy: {accuracy:.4f}")
        
        # Save the trained model to a pickle file
        with open('matrimony_match_predictor.pkl', 'wb') as file:
            pickle.dump(model, file)
        
        print("Model saved to 'matrimony_match_predictor.pkl'")
        
        return model, X.columns
        
    except Exception as e:
        print(f"Error training model: {e}")
        return None, None

# Function to find the best matches
def find_best_matches(preferences, data, model_pipeline=None, top_n=5):
    try:
        logging.info("Received preferences: %s", json.dumps(preferences, indent=2))
        logging.info(f"Initial number of profiles: {len(data)}")
        
        # Define marital status variations
        marital_status_matches = ['Never Married', 'Single', 'Unmarried']
        
        # Define education variations
        education_matches = [
            'B.Tech.', 'B.E.', 'B.Com.', 'BCom', 'B.Sc.', 'BCA', 'BBA', 'B.A.',
            'B.Arch', 'BFA', 'B.Music', 'B.Pharm', 'BHM', 'BHMS', 'BAMS', 'BDS',
            'BVSc', 'B.Ed', 'M.Tech.', 'MBA', 'MCA', 'M.Sc.', 'M.A.', 'M.Com.',
            'M.Arch', 'M.Pharm', 'M.Ed', 'M.Music', 'MFA', 'MS', 'MBBS', 'MD',
            'CA', 'CS', 'ICWA', 'LLB', 'LLM', 'PhD'
        ]
        
        logging.info("\nUnique values in dataset:")
        logging.info(f"Gender: {data['gender'].unique()}")
        logging.info(f"Religion: {data['religion'].unique()}")
        logging.info(f"Mother Tongue: {data['mother_tongue'].unique()}")
        logging.info(f"Marital Status: {data['marital_status'].unique()}")
        logging.info(f"Education: {data['education'].unique()}")
        logging.info(f"Income USD range: {data['income_usd'].min()} to {data['income_usd'].max()}")
        logging.info(f"Height range: {data['height_cm'].min()} to {data['height_cm'].max()}")
        logging.info(f"Weight range: {data['weight_kg'].min()} to {data['weight_kg'].max()}")
        
        # Apply filters one by one
        temp = data.copy()
        
        # Gender filter
        temp = temp[temp['gender'] != preferences['gender']]
        logging.info(f"After gender filter: {len(temp)} profiles")
        
        # Age filter
        temp = temp[temp['age'].between(preferences['age_range'][0], preferences['age_range'][1])]
        logging.info(f"After age filter: {len(temp)} profiles")
        
        # Religion filter
        if preferences['religion'] != 'Any':
            temp = temp[temp['religion'] == preferences['religion']]
        logging.info(f"After religion filter: {len(temp)} profiles")
        
        # Mother tongue filter
        if preferences['mother_tongue'] != 'Any':
            temp = temp[temp['mother_tongue'] == preferences['mother_tongue']]
        logging.info(f"After mother tongue filter: {len(temp)} profiles")
        
        # Marital status filter
        if preferences['marital_status'] != 'Any':
            temp = temp[temp['marital_status'].isin(marital_status_matches)]
        logging.info(f"After marital status filter: {len(temp)} profiles")
        
        # Education filter
        if preferences['education'] != 'Any':
            temp = temp[temp['education'].isin(education_matches)]
        logging.info(f"After education filter: {len(temp)} profiles")
        
        # Height filter
        temp = temp[temp['height_cm'].between(preferences['height_range'][0], preferences['height_range'][1])]
        logging.info(f"After height filter: {len(temp)} profiles")
        
        # Weight filter
        temp = temp[temp['weight_kg'].between(preferences['weight_range'][0], preferences['weight_range'][1])]
        logging.info(f"After weight filter: {len(temp)} profiles")
        
        # Income filter - handle 'Any' case
        if preferences['income_range'][0] != 'Any':
            # Convert income string to numeric value
            def parse_income(income_str):
                if income_str == 'Any':
                    return None
                try:
                    # Remove currency symbol and convert to numeric
                    income_str = income_str.replace('₹', '').strip()
                    if 'Lakh' in income_str:
                        return float(income_str.split()[0]) * 100000
                    elif 'Crore' in income_str:
                        return float(income_str.split()[0]) * 10000000
                    return float(income_str)
                except:
                    return None
            
            min_income = parse_income(preferences['income_range'][0])
            if min_income is not None:
                temp = temp[temp['income_usd'] >= min_income]
        logging.info(f"After income filter: {len(temp)} profiles")
        
        candidates = temp
        
        logging.info(f"Final number of candidates: {len(candidates)}")
        
        if len(candidates) == 0:
            logging.warning("No candidates found matching preferences")
            return {
                "success": True,
                "matches": [],
                "debug": {
                    "total_profiles": len(data),
                    "filtered_profiles": 0
                }
            }
        
        if model_pipeline is not None:
            try:
                model_features = candidates.drop(columns=['label', 'user_id', 'full_name', 'match_probability'] 
                                             if 'match_probability' in candidates.columns 
                                             else ['label', 'user_id', 'full_name'])
                
                match_probs = model_pipeline.predict_proba(model_features)[:, 1]
                candidates['match_probability'] = match_probs
            except Exception as e:
                logging.error(f"Error using model for prediction: {e}")
                candidates['match_probability'] = 1.0
        else:
            candidates['match_probability'] = 1.0
        
        top_matches = candidates.sort_values(by='match_probability', ascending=False).head(top_n)
        
        logging.info(f"Returning top {len(top_matches)} matches")
        
        # Convert matches to JSON-serializable format
        matches = []
        for _, match in top_matches.iterrows():
            # Convert Series to dictionary
            match_dict = match.to_dict()
            # Convert ObjectId to string
            if 'user_id' in match_dict:
                match_dict['user_id'] = str(match_dict['user_id'])
            matches.append(match_dict)
        
        response = {
            "success": True,
            "matches": matches,
            "debug": {
                "total_profiles": len(data),
                "filtered_profiles": len(matches)
            }
        }
        
        return response
        
    except Exception as e:
        logging.error("Error in recommendation process: %s", str(e))
        response = {
            "success": False,
            "error": str(e)
        }
        return response

# Function to get user profile by ID
def get_user_profile(user_id):
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb+srv://neil200417:neil2017@cluster0.s91vbxd.mongodb.net/')
        db = client['test']
        
        # Get user profile
        user_profile = db.userprofiles.find_one({'_id': user_id})
        
        if not user_profile:
            return None
        
        # Format profile for ML
        processed_profile = {
            'age': calculate_age(user_profile.get('dateOfBirth')),
            'gender': user_profile.get('gender'),
            'religion': user_profile.get('religion'),
            'mother_tongue': user_profile.get('motherTongue'),
            'marital_status': user_profile.get('maritalStatus'),
            'education': user_profile.get('education'),
            'height_cm': extract_height_cm(user_profile.get('height')),
            'weight_kg': user_profile.get('weight'),
            'income_usd': user_profile.get('annualIncome') / 80 if user_profile.get('annualIncome') else None,
            'family_type': user_profile.get('familyType'),
            'occupation': user_profile.get('occupation'),
            'hobbies': user_profile.get('hobbies', [])[0] if user_profile.get('hobbies') and len(user_profile.get('hobbies')) > 0 else None,
            'food_preference': user_profile.get('diet'),
            'location': 'Urban' if user_profile.get('city') in ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] else 'Rural',
            'lifestyle': user_profile.get('fitnessLevel')
        }
        
        # Check if all required fields are available
        if all(processed_profile[key] is not None for key in ['age', 'gender', 'religion', 'height_cm', 'weight_kg']):
            return processed_profile
        else:
            print("User profile missing essential data")
            return None
            
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return None

# Function to recommend matches for a user
def recommend_matches_for_user(user_id, top_n=5):
    try:
        # Get user profile
        user_profile = get_user_profile(user_id)
        if not user_profile:
            return None
            
        # Get all profiles for matching
        all_profiles = get_profiles_from_mongodb()
        if all_profiles is None:
            return None
            
        # Load the trained model
        try:
            with open('matrimony_match_predictor.pkl', 'rb') as file:
                model = pickle.load(file)
        except FileNotFoundError:
            # Train model if not found
            print("Model not found, training new model...")
            model, _ = train_matrimony_model(all_profiles)
            
        # Find matches
        matches = find_best_matches(user_profile, all_profiles, model, top_n)
        
        return matches
    
    except Exception as e:
        print(f"Error recommending matches: {e}")
        return None

# Main function to run everything
def main():
    parser = argparse.ArgumentParser(description='Matrimony Matchmaking System')
    parser.add_argument('--recommend', type=str, help='JSON string of preferences')
    args = parser.parse_args()

    try:
        if args.recommend:
            preferences = json.loads(args.recommend)
            logging.info("Received preferences: %s", json.dumps(preferences, indent=2))
            
            data = get_profiles_from_mongodb()
            if data is None:
                response = {
                    "error": "Could not fetch profiles from database",
                    "success": False
                }
                print(json.dumps(response, ensure_ascii=False))
                return

            matches = find_best_matches(preferences['preferences'], data)
            if matches is not None:
                print(json.dumps(matches, ensure_ascii=False))
            else:
                response = {
                    "error": "No matches found",
                    "success": False,
                    "debug": {
                        "total_profiles": len(data),
                        "filtered_profiles": 0
                    }
                }
                print(json.dumps(response, ensure_ascii=False))
        else:
            response = {
                "error": "Please provide preferences using --recommend option",
                "success": False
            }
            print(json.dumps(response, ensure_ascii=False))
    except Exception as e:
        logging.error("Error in recommendation process: %s", str(e))
        response = {
            "error": str(e),
            "success": False
        }
        print(json.dumps(response, ensure_ascii=False))

if __name__ == "__main__":
    main()