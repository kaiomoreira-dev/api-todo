// fastify.d.ts

import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user:{
      id: string;
      token: string;
    }
  }
}
