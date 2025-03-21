from flask import Flask, jsonify
import json, os, random

app = Flask(__name__)

# Load dummy profiles from disk
dummy_data_path = os.path.join("data", "dummy_profiles.json")
with open(dummy_data_path, "r") as f:
    dummy_profiles = json.load(f)

# Candidate preferences (hard-coded for demonstration)
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

# Load dummy model weights from disk
model_path = os.path.join("models", "dummy_model.json")
if os.path.exists(model_path):
    with open(model_path, "r") as f:
        model_weights = json.load(f)
else:
    # Fallback weights if file not found
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

def compute_compatibility(candidate, user, weights):
    diff = 0
    if user["age"] < candidate["ageRange"]["min"] or user["age"] > candidate["ageRange"]["max"]:
        diff += 20
    if user["religion"].lower() != candidate["religion"].lower():
        diff += 15
    if user["motherTongue"].lower() != candidate["motherTongue"].lower():
        diff += 15
    if user["maritalStatus"].lower() != candidate["maritalStatus"].lower():
        diff += 10
    if candidate["education"].lower() not in user["education"].lower():
        diff += 10
    if user["height"] < candidate["height"]["min"] or user["height"] > candidate["height"]["max"]:
        diff += 10
    diff += abs(user["annualIncome"] - candidate["income"]) / 10000
    if user["familyType"].lower() != candidate["familyType"].lower():
        diff += 5
    if user["weight"] < candidate["weight"]["min"] or user["weight"] > candidate["weight"]["max"]:
        diff += 10
    if user["occupation"].lower() != candidate["occupation"].lower():
        diff += 10
    compatibility = 100 - diff
    return max(0, min(100, int(compatibility)))

@app.route("/api/model-predict", methods=["GET"])
def model_predict():
    predictions = []
    for user in dummy_profiles:
        score = compute_compatibility(candidate_prefs, user, model_weights)
        # Add a small random variation to simulate model randomness
        score += random.randint(-2, 2)
        score = max(0, min(100, score))
        user_with_score = user.copy()
        user_with_score["compatibilityScore"] = score
        predictions.append(user_with_score)
    predictions.sort(key=lambda x: x["compatibilityScore"], reverse=True)
    # Simulate a delay (here we simply return the response)
    return jsonify(predictions)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
