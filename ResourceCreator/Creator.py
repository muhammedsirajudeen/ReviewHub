import redis
try:
    client = redis.Redis(host='localhost', port=6379, decode_responses=True)
    sub=client.pubsub()
    sub.subscribe("chapter")
    print("connected Successfully")
    while True:
        msg=sub.get_message()
        if(msg):
            print(msg)
except:
    print("Error Connecting to Redis")