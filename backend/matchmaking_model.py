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
                # Convert ObjectId to string
                profile_id = str(profile.get('_id'))
                
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
                    'user_id': profile_id,  # Use string version of ObjectId
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
def find_best_matches(preferences, data, model_pipeline=None, top_n=10):
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
        
        # Apply filters one by one with fallback options
        temp = data.copy()
        original_count = len(temp)
        
        # Gender filter (mandatory) - Show profiles of same gender
        temp = temp[temp['gender'] == preferences['gender']]
        if len(temp) == 0:
            logging.warning("No matches after gender filter, returning empty list")
            return []
        
        # Age filter with fallback
        age_filtered = temp[temp['age'].between(preferences['age_range'][0], preferences['age_range'][1])]
        if len(age_filtered) == 0:
            # If no matches in age range, expand the range by 5 years
            temp = temp[temp['age'].between(preferences['age_range'][0] - 5, preferences['age_range'][1] + 5)]
        else:
            temp = age_filtered
        
        # Religion filter - Skip if 'Any'
        if preferences['religion'] != 'Any':
            temp = temp[temp['religion'] == preferences['religion']]
        
        # Mother tongue filter - Skip if 'Any'
        if preferences['mother_tongue'] != 'Any':
            temp = temp[temp['mother_tongue'] == preferences['mother_tongue']]
        
        # Marital status filter - Skip if 'Any'
        if preferences['marital_status'] != 'Any':
            temp = temp[temp['marital_status'].isin(marital_status_matches)]
        
        # Education filter - Skip if 'Any'
        if preferences['education'] != 'Any':
            temp = temp[temp['education'].isin(education_matches)]
        
        # Height filter with fallback
        height_filtered = temp[temp['height_cm'].between(preferences['height_range'][0], preferences['height_range'][1])]
        if len(height_filtered) == 0:
            # If no matches in height range, expand the range by 10cm
            temp = temp[temp['height_cm'].between(preferences['height_range'][0] - 10, preferences['height_range'][1] + 10)]
        else:
            temp = height_filtered
        
        # Weight filter with fallback
        weight_filtered = temp[temp['weight_kg'].between(preferences['weight_range'][0], preferences['weight_range'][1])]
        if len(weight_filtered) == 0:
            # If no matches in weight range, expand the range by 10kg
            temp = temp[temp['weight_kg'].between(preferences['weight_range'][0] - 10, preferences['weight_range'][1] + 10)]
        else:
            temp = weight_filtered
        
        # Income filter - Skip if 'Any'
        if preferences['income_range'][0] != 'Any':
            def parse_income(income_str):
                try:
                    return float(income_str.replace('$', '').replace(',', ''))
                except:
                    return 0
            
            income_min = parse_income(preferences['income_range'][0])
            income_max = parse_income(preferences['income_range'][1])
            
            income_filtered = temp[temp['income_usd'].between(income_min, income_max)]
            if len(income_filtered) == 0:
                # If no matches in income range, expand the range by 20%
                temp = temp[temp['income_usd'].between(income_min * 0.8, income_max * 1.2)]
            else:
                temp = income_filtered
        
        # Family type filter - Skip if 'Any'
        if preferences['family_type'] != 'Any':
            temp = temp[temp['family_type'] == preferences['family_type']]
        
        # Occupation filter - Skip if 'Any'
        if preferences['occupation'] != 'Any':
            temp = temp[temp['occupation'] == preferences['occupation']]
        
        logging.info(f"Final number of matches: {len(temp)}")
        
        # If we have matches, return them
        if len(temp) > 0:
            # Sort by multiple criteria to get the best matches
            temp = temp.sort_values(
                by=['income_usd', 'education', 'height_cm'],
                ascending=[False, True, True]
            )
            
            # Convert DataFrame to list of dictionaries and ensure all values are JSON serializable
            matches = []
            seen_ids = set()  # Track seen user IDs to avoid duplicates
            
            for _, row in temp.head(top_n).iterrows():
                user_id = str(row['user_id'])
                if user_id not in seen_ids:  # Only add if not seen before
                    seen_ids.add(user_id)
                    match = {
                        'user_id': user_id,
                        'full_name': str(row['full_name']),
                        'age': int(row['age']),
                        'gender': str(row['gender']),
                        'religion': str(row['religion']),
                        'mother_tongue': str(row['mother_tongue']),
                        'marital_status': str(row['marital_status']),
                        'education': str(row['education']),
                        'height_cm': float(row['height_cm']),
                        'weight_kg': float(row['weight_kg']),
                        'income_usd': float(row['income_usd']),
                        'family_type': str(row['family_type']),
                        'occupation': str(row['occupation'])
                    }
                    matches.append(match)
            
            return matches
        else:
            logging.warning("No matches found after all filters")
            return []
            
    except Exception as e:
        logging.error(f"Error in find_best_matches: {e}")
        logging.error(traceback.format_exc())
        return []

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
                    "success": False,
                    "error": "Could not fetch profiles from database",
                    "matches": []
                }
                print(json.dumps(response, ensure_ascii=False))
                return

            matches = find_best_matches(preferences['preferences'], data)
            if matches:
                response = {
                    "success": True,
                    "matches": matches
                }
            else:
                response = {
                    "success": True,
                    "matches": []
                }
            print(json.dumps(response, ensure_ascii=False))
        else:
            response = {
                "success": False,
                "error": "Please provide preferences using --recommend option",
                "matches": []
            }
            print(json.dumps(response, ensure_ascii=False))
    except Exception as e:
        logging.error("Error in recommendation process: %s", str(e))
        response = {
            "success": False,
            "error": str(e),
            "matches": []
        }
        print(json.dumps(response, ensure_ascii=False))

if __name__ == "__main__":
    main()