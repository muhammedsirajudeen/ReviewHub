import { createClient } from 'redis';
export async function addMessageToQueue(queueName: string, message: string) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });
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

export async function addValueToCache(
  email: string,
  value: string | number,
  time: number
) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });  try {
    await client.connect();
    await client.set(email, value);
    await client.expire(email, time);

    console.log('otp added to cache:', value);
  } catch (error) {
    console.log(error);
    throw 'errror while adding to cache';
  } finally {
    client.disconnect();
  }
}

export async function getValueFromCache(value: string): Promise<string> {
  const client = createClient({
    url: process.env.REDIS_URL,
  });  try {
    await client.connect();
    const cacheValue = await client.get(value);
    if (cacheValue) return cacheValue;
    return '';
  } catch (error) {
    console.log(error);
    return '';
  } finally {
    client.disconnect();
  }
}

export async function removeValueFromCache(key: string) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });  try {
    await client.connect();
    await client.del(key);
  } catch (error) {
    console.log(error);
  }
}
