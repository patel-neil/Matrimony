import subprocess
import json

def test_recommendations():
    # Test preferences
    test_preferences = {
        "preferences": {
            "gender": "Female",
            "age_range": [25, 35],
            "religion": "Hindu",
            "mother_tongue": "Hindi",
            "marital_status": "Single",
            "education": "B.Tech.",
            "height_range": [150, 180],
            "weight_range": [45, 80],
            "income_range": ["30000", "50000"],
            "family_type": "Nuclear",
            "occupation": "Software Engineer"
        }
    }

    # Convert preferences to JSON string
    preferences_json = json.dumps(test_preferences)

    try:
        # Run the matchmaking script
        result = subprocess.run(
            ['python', 'matchmaking_model.py', '--recommend', preferences_json],
            capture_output=True,
            text=True
        )

        # Check if the command was successful
        if result.returncode == 0:
            try:
                # Parse the output as JSON
                output = json.loads(result.stdout)
                print("\nTest Results:")
                print("-------------")
                print(f"Success: {output.get('success', False)}")
                print(f"Number of matches: {len(output.get('matches', []))}")
                if output.get('matches'):
                    print("\nSample match:")
                    print(json.dumps(output['matches'][0], indent=2))
                if output.get('error'):
                    print(f"\nError: {output['error']}")
            except json.JSONDecodeError:
                print("\nError: Output is not valid JSON")
                print("Raw output:")
                print(result.stdout)
        else:
            print("\nError running the script:")
            print(result.stderr)

    except Exception as e:
        print(f"\nError during test: {str(e)}")

if __name__ == "__main__":
    test_recommendations() 