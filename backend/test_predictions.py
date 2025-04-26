import json
import pandas as pd
from matchmaking_model import find_best_matches, get_profiles_from_mongodb

def test_predictions():
    try:
        # Read preferences from JSON file
        with open('preferences.json', 'r') as f:
            preferences_data = json.load(f)
        
        print("\nTesting predictions with static data from preferences.json...")
        print("\nInput preferences:")
        print(json.dumps(preferences_data['preferences'], indent=2))
        
        # Get profiles from MongoDB
        print("\nFetching profiles from MongoDB...")
        profiles = get_profiles_from_mongodb()
        print(f"Found {len(profiles)} profiles")
        
        # Find best matches
        print("\nFinding best matches...")
        matches = find_best_matches(preferences_data['preferences'], profiles)
        
        if matches is None:
            print("No matches found")
            return
        
        print("\nTop matches:")
        for i, (_, match) in enumerate(matches.iterrows(), 1):
            print(f"\nMatch {i}:")
            print(f"Name: {match.get('full_name', 'N/A')}")
            print(f"Age: {match.get('age', 'N/A')}")
            print(f"Gender: {match.get('gender', 'N/A')}")
            print(f"Religion: {match.get('religion', 'N/A')}")
            print(f"Mother Tongue: {match.get('mother_tongue', 'N/A')}")
            print(f"Marital Status: {match.get('marital_status', 'N/A')}")
            print(f"Education: {match.get('education', 'N/A')}")
            print(f"Height: {match.get('height_cm', 'N/A')} cm")
            print(f"Weight: {match.get('weight_kg', 'N/A')} kg")
            print(f"Income: ₹{match.get('income_usd', 'N/A') * 80} (${match.get('income_usd', 'N/A')})")
            print(f"Family Type: {match.get('family_type', 'N/A')}")
            print(f"Occupation: {match.get('occupation', 'N/A')}")
            print(f"Match Probability: {match.get('match_probability', 'N/A')}")
        
    except Exception as e:
        print(f"Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_predictions() 