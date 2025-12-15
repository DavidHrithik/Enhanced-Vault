import pymongo
import json
import os
import datetime
from bson.json_util import dumps

# Database Configuration
# Using the connection string from application.properties
# If 'Admin' user needs authentication against 'admin' db, it might need adjustment, 
# but usually Atlas connection strings handle it.
MONGO_URI = "mongodb+srv://Admin:Admin@cluster0.svux9y9.mongodb.net/testmanagement?appName=Cluster0"
DB_NAME = "testmanagement"
BACKUP_DIR = "db_backup_" + datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

def backup_db():
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        if not os.path.exists(BACKUP_DIR):
            os.makedirs(BACKUP_DIR)
            
        print(f"Backing up database '{DB_NAME}' to '{BACKUP_DIR}'...")
        
        collections = db.list_collection_names()
        
        if not collections:
            print("No collections found to backup.")
            return

        for col_name in collections:
            print(f"Backing up collection: {col_name}")
            collection = db[col_name]
            cursor = collection.find()
            
            file_path = os.path.join(BACKUP_DIR, f"{col_name}.json")
            with open(file_path, "w") as f:
                f.write(dumps(cursor, indent=4))
        
        print("Backup completed successfully.")
        
    except Exception as e:
        print(f"Error checking backup: {e}")

if __name__ == "__main__":
    backup_db()
