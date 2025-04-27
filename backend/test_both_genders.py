from matchmaking_model import get_profiles_from_mongodb, find_best_matches
import json
import pandas as pd

def test_both_genders():
    # Get all profiles
    data = get_profiles_from_mongodb()
    
    if data is None:
        print("Error: Could not fetch profiles from database")
        return
        
    # Print total number of profiles and gender distribution
    print(f"\nTotal profiles: {len(data)}")
    gender_counts = data['gender'].value_counts()
    print("\nGender distribution:")
    print(gender_counts)
    
    # Test preferences template
    preferences_template = {
        "age_range": [25, 35],
        "religion": "Any",
        "mother_tongue": "Any",
        "marital_status": "Any",
        "education": "Any",
        "height_range": [150, 180],
        "weight_range": [45, 80],
        "income_range": ["Any", "Any"],
        "family_type": "Any",
        "occupation": "Any"
    }
    
    # Test male profiles
    print("\nTesting Male Profiles:")
    print("=====================")
    male_preferences = preferences_template.copy()
    male_preferences["gender"] = "Male"
    male_matches = find_best_matches(male_preferences, data, top_n=5)  # Increased to 5 matches
    
    if male_matches:
        print(f"\nFound {len(male_matches)} male matches")
        for i, match in enumerate(male_matches, 1):
            print(f"\nMale Match {i}:")
            print(f"Name: {match['full_name']}")
            print(f"Gender: {match['gender']}")
            print(f"Age: {match['age']}")
            print(f"Religion: {match['religion']}")
    else:
        print("No male matches found")
    
    # Test female profiles
    print("\nTesting Female Profiles:")
    print("=======================")
    female_preferences = preferences_template.copy()
    female_preferences["gender"] = "Female"
    female_matches = find_best_matches(female_preferences, data, top_n=5)  # Increased to 5 matches
    
    if female_matches:
        print(f"\nFound {len(female_matches)} female matches")
        for i, match in enumerate(female_matches, 1):
            print(f"\nFemale Match {i}:")
            print(f"Name: {match['full_name']}")
            print(f"Gender: {match['gender']}")
            print(f"Age: {match['age']}")
            print(f"Religion: {match['religion']}")
    else:
        print("No female matches found")

if __name__ == "__main__":
    test_both_genders() 