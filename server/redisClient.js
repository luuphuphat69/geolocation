const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
      host: 'redis-10176.c10.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 10176
  },
    password: process.env.REDIS_PASSWORD,
  });
    (async () => {
      try{
        await redisClient.connect()
        console.log('Connected to Redis Cloud');
      }catch(err){
        console.log('Redis connection error: ', err);
      }
    })();
module.exports = redisClient;