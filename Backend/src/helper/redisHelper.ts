import {createClient} from 'redis';
export async function addMessageToQueue(queueName: string, message: string) {
    const client=createClient()

    try {
    //connecting to localhost here
    await client.connect();
    await client.publish(queueName, JSON.stringify(message));
    console.log('Message added to queue:', message);
  } catch (err) {
    console.error('Error adding message to queue:', err);
  } finally {
    client.disconnect();
  }
}
