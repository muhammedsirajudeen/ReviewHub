import redis
import pymongo
from bson import ObjectId
from dotenv import load_dotenv
import os
import json
import google.generativeai as genai
import re
load_dotenv()



#generating json has been successfull now we have to validate it as extra steps

#global variables for both collection and database
COLLECTION_NAME="chapters"
RESOURCE_NAME="resources"
DATABASE_NAME="test"
QUIZ_NAME="quizes"

def QueryObjects():
    try:
        client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        mongo_url=os.getenv("MONGO_URL")
        print(mongo_url)
        mongoclient=pymongo.MongoClient(mongo_url)
        #currently the database is test dont forget to change it
        my_db=mongoclient[DATABASE_NAME]
        # my_col=my_db[COLLECTION_NAME]

        sub=client.pubsub()
        sub.subscribe("chapter")
        print("connected Successfully to Redis and Mongodb")
        return my_db,sub

                
    except:
        print("Error Connecting to Redis")

def PromptResultGenerator(prompt,additionalPrompt,quizStatus):
    genai.configure(api_key=os.environ['GEMINI_API'])
    model = genai.GenerativeModel("gemini-1.5-flash")
    if(quizStatus!=True):
       #case when status is not quiz
        response = model.generate_content(
            f'''
            Just return a JSON output based on the following keys and values:
            The context is: {prompt} {additionalPrompt}
            
            {{
                "chapterName": "{prompt}",
                "Section": [
                    {{
                        "_id":"uniqueid",
                        "sectionName": "sectionOne",
                        "content": [
                            {{
                                "_id:"uniqueid",
                                "subheading": "populate",
                                "article": "populate"
                            }},
                            {{
                                "_id:"uniqueid"
                                "subheading": "populate",
                                "article": "populate"
                            }}
                        ]
                    }},
                    {{
                        "_id":"uniqueid",
                        "sectionName": "sectionTwo",
                        "content": [
                            {{
                                "_id":"uniqueid",
                                "subheading": "populate",
                                "article": "populate"
                            }},
                            {{
                                "_id":"uniqueid",
                                "subheading": "populate",
                                "article": "populate"
                            }}
                        ]
                    }}
                ]
            }}
            Just the JSON, nothing else. Provide two sections with two entries each, nothing more sections should be in array called sections
             Adhere strictly to the given JSON Format even follow the letter casing too .
            '''
        )
        return response.text
    else:
        response = model.generate_content(
            f'''
                Your Role is to Create a Quiz in the following JSON format strict adherence is required 
                The Context is {prompt} The JSON format is
                {{
                    "chapterName":"{prompt}",
                    "Quiz":[
                        {{
                            "_id":"uniqueid",
                            "question":"populate",
                            "description":"populate",
                            "answer:"populate",
                            "options":["populate"(atleast 3 options)]
                            "reward":"popilate",
                        }}
                    ]
                }}
                reward is an integer from 1 to 20 just 3 questions Now
            '''
        )
        return response.text



def extract_json_from_text(text):
    # Regular expression to find JSON-like structures in the text
    json_match = re.search(r"\{.*\}", text, re.DOTALL)
    
    if json_match:
        json_str = json_match.group()  # Extracted JSON string
        try:
            json_data = json.loads(json_str)  # Convert string to JSON (Python dictionary)
            return json_data
        except json.JSONDecodeError:
            print("Invalid JSON format")
    else:
        print("No JSON found")
    return None

def main():
    my_db,sub=QueryObjects()
    while True:
        msg=sub.get_message()
        if(msg):
            if(msg['type']=='subscribe'):
                pass
            else:
                #we are getting the id here
                messageData=json.loads(json.loads(msg['data']))
                chapter_col=my_db[COLLECTION_NAME]
                Chapter=chapter_col.find_one({'_id':ObjectId(messageData['chapterId'])})
                #now we got the associated data time for prompt

                print(Chapter)
                result=PromptResultGenerator(prompt=Chapter['chapterName'],additionalPrompt=Chapter['additionalPrompt'],quizStatus=Chapter['quizStatus'])
                json_result=extract_json_from_text(result)

                print(json_result)
                if Chapter['quizStatus']:
                    resource_col=my_db[QUIZ_NAME]
                    
                else:
                    resource_col=my_db[RESOURCE_NAME]
                    
                json_result["chapterId"]=ObjectId(messageData['chapterId'])
                json_result["roadmapId"]=ObjectId(messageData['roadmapId'])
                try:
                    resource_col.insert_one(json_result)
                    print("Successfully Inserted")
                except:
                    print("Failed Inserting to Mongodb")

if (__name__=='__main__'):
    main()