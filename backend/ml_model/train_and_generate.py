import random
import json
import os

# --- Helper functions ---
def random_choice(lst):
    return random.choice(lst)

def random_number(min_val, max_val):
    return random.randint(min_val, max_val)

def generate_phone():
    return str(random.randint(10**9, 10**10 - 1))

# --- Preset arrays for dummy data ---
names_female = ["Priya", "Neha", "Aisha", "Sunita", "Anjali", "Ritu", "Pooja"]
names_male = ["Rahul", "Amit", "Sanjay", "Rohit", "Vijay", "Raj", "Arjun"]
surnames = ["Shah", "Gupta", "Khan", "Verma", "Singh", "Patel"]
cities = ["new york", "mumbai", "bangalore", "delhi", "chennai", "dubai"]
religions = ["hindu", "muslim", "sikh", "christian"]
professions = ["Software Engineer", "Doctor", "Teacher", "Businessman", "Designer", "Engineer"]
educations = [
    "B.Tech in Computer Science",
    "MBA",
    "MBBS",
    "B.Des",
    "B.E."
]
hobbies_list = [
    "Reading, Travelling",
    "Cycling, Music",
    "Dancing, Painting",
    "Photography, Yoga",
    "Gaming, Reading"
]
mother_tongues = ["Hindi", "Marathi", "English", "Tamil", "Telugu"]
family_types = ["Joint", "Nuclear"]
marital_statuses = ["Single", "Married"]

def generate_profile(profile_id):
    gender = "female" if random.random() < 0.5 else "male"
    first_name = random_choice(names_female if gender == "female" else names_male)
    surname = random_choice(surnames)
    name = f"{first_name} {surname}"
    age = random_number(22, 40)
    location = random_choice(cities)
    religion = random_choice(religions)
    profession = random_choice(professions)
    height = random_number(150, 190)
    weight = random_number(45, 90)
    annual_income = random_number(40000, 150000)
    phone = generate_phone()
    email = f"{first_name.lower()}.{surname.lower()}@example.com"
    marital_status = random_choice(marital_statuses)
    education = random_choice(educations)
    hobbies = random_choice(hobbies_list)
    mother_tongue = random_choice(mother_tongues)
    family_type = random_choice(family_types)
    occupation = profession  # For simplicity, same as profession.
    return {
        "id": profile_id,
        "name": name,
        "age": age,
        "gender": gender,
        "location": location,
        "religion": religion,
        "profession": profession,
        "height": height,
        "weight": weight,
        "annualIncome": annual_income,
        "phone": phone,
        "email": email,
        "maritalStatus": marital_status,
        "education": education,
        "hobbies": hobbies,
        "motherTongue": mother_tongue,
        "familyType": family_type,
        "occupation": occupation
    }

# --- Generate dummy dataset of 100 profiles ---
dummy_profiles = [generate_profile(i) for i in range(1, 101)]

# Save dummy dataset to disk
os.makedirs("data", exist_ok=True)
with open("data/dummy_profiles.json", "w") as f:
    json.dump(dummy_profiles, f, indent=2)
print("Dummy profiles saved to data/dummy_profiles.json")

# --- Candidate Essential Preferences (for demonstration) ---
candidate_prefs = {
    "ageRange": {"min": 25, "max": 30},
    "religion": "hindu",
    "motherTongue": "Hindi",
    "maritalStatus": "Single",
    "education": "B.Tech in Computer Science",
    "height": {"min": 160, "max": 170},
    "income": 60000,
    "familyType": "Joint",
    "weight": {"min": 50, "max": 60},
    "occupation": "Software Engineer"
}

# --- Dummy model weights for each essential feature ---
model_weights = {
    "ageRange": 0.15,
    "religion": 0.10,
    "motherTongue": 0.10,
    "maritalStatus": 0.10,
    "education": 0.10,
    "height": 0.10,
    "income": 0.15,
    "familyType": 0.05,
    "weight": 0.05,
    "occupation": 0.10
}

# Save model weights to disk
os.makedirs("models", exist_ok=True)
with open("models/dummy_model.json", "w") as f:
    json.dump(model_weights, f, indent=2)
print("Dummy model weights saved to models/dummy_model.json")

# --- Dummy compatibility function ---
def compute_compatibility(candidate, user, weights):
    diff = 0
    # Age penalty: if out of candidate's range
    if user["age"] < candidate["ageRange"]["min"] or user["age"] > candidate["ageRange"]["max"]:
        diff += 20
    # Religion: penalty if not an exact match
    if user["religion"].lower() != candidate["religion"].lower():
        diff += 15
    # Mother Tongue: penalty if not matching
    if user["motherTongue"].lower() != candidate["motherTongue"].lower():
        diff += 15
    # Marital Status: penalty if not matching
    if user["maritalStatus"].lower() != candidate["maritalStatus"].lower():
        diff += 10
    # Education: dummy check (if candidate's education keyword not in user's education)
    if candidate["education"].lower() not in user["education"].lower():
        diff += 10
    # Height: penalty if out of range
    if user["height"] < candidate["height"]["min"] or user["height"] > candidate["height"]["max"]:
        diff += 10
    # Income: normalized absolute difference penalty
    diff += abs(user["annualIncome"] - candidate["income"]) / 10000
    # Family Type: penalty if not matching
    if user["familyType"].lower() != candidate["familyType"].lower():
        diff += 5
    # Weight: penalty if out of range
    if user["weight"] < candidate["weight"]["min"] or user["weight"] > candidate["weight"]["max"]:
        diff += 10
    # Occupation: penalty if not matching
    if user["occupation"].lower() != candidate["occupation"].lower():
        diff += 10
    compatibility = 100 - diff
    return max(0, min(100, int(compatibility)))

# Optionally, compute and display predictions for demonstration:
predictions = []
for user in dummy_profiles:
    score = compute_compatibility(candidate_prefs, user, model_weights)
    predictions.append({**user, "compatibilityScore": score})
predictions.sort(key=lambda x: x["compatibilityScore"], reverse=True)
print("Sample Predictions:")
print(json.dumps(predictions[:5], indent=2))
