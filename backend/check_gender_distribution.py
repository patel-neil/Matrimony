from matchmaking_model import get_profiles_from_mongodb
import pandas as pd
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

def check_gender_distribution():
    try:
        logging.info("Fetching profiles from MongoDB...")
        df = get_profiles_from_mongodb()
        
        if df is not None and not df.empty:
            # Count gender distribution
            gender_counts = df['gender'].value_counts()
            logging.info("\nGender distribution:")
            print(gender_counts)
            
            # Print total number of profiles
            total = len(df)
            logging.info(f"\nTotal profiles: {total}")
            
            # Print percentage distribution
            logging.info("\nPercentage distribution:")
            for gender, count in gender_counts.items():
                percentage = (count / total) * 100
                print(f"{gender}: {percentage:.1f}% ({count} profiles)")
            
            # Print sample profiles
            logging.info("\nSample profiles for each gender:")
            for gender in df['gender'].unique():
                print(f"\nSamples for gender = '{gender}':")
                samples = df[df['gender'] == gender].head(2)
                for _, profile in samples.iterrows():
                    print("-" * 40)
                    print(f"Name: {profile['full_name']}")
                    print(f"Gender: {profile['gender']}")
                    print(f"Age: {profile['age']}")
                    print(f"Religion: {profile['religion']}")
                    print(f"Education: {profile['education']}")
        else:
            logging.error("No profiles found in the database")
            
    except Exception as e:
        logging.error(f"Error checking gender distribution: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_gender_distribution() 