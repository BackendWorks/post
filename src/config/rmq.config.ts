import { registerAs } from '@nestjs/config';

export default registerAs(
  'rmq',
  (): Record<string, any> => ({
    uri: process.env.RABBITMQ_URL,
    auth: process.env.RABBITMQ_AUTH_QUEUE,
    post: process.env.RABBITMQ_POST_QUEUE,
  }),
);
