import redis
import pymongo
from bson import ObjectId
from dotenv import load_dotenv
import os
import json
load_dotenv()


#global variables for both collection and database
COLLECTION_NAME="chapters"
DATABASE_NAME="test"


def QueryObjects():
    try:
        client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        mongo_url=os.getenv("MONGO_URL")
        print(mongo_url)
        mongoclient=pymongo.MongoClient(mongo_url)
        #currently the database is test dont forget to change it
        my_db=mongoclient[DATABASE_NAME]
        my_col=my_db[COLLECTION_NAME]
        sub=client.pubsub()
        sub.subscribe("chapter")
        print("connected Successfully to Redis and Mongodb")
        return my_col,sub

                
    except:
        print("Error Connecting to Redis")

def main():
    my_col,sub=QueryObjects()
    while True:
        msg=sub.get_message()
        if(msg):
            if(msg['type']=='subscribe'):
                pass
            else:
                #we are getting the id here
                id=json.loads(msg['data'])
                Chapter=my_col.find_one({'_id':ObjectId(id)})
                #now we got the associated data time for prompt
                print(Chapter)

if (__name__=='__main__'):
    main()