const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
      host: 'redis-17391.c281.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 17391
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