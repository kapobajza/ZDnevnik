import type { FastifyReply } from "fastify";

export const createErrorReply = (
  reply: FastifyReply,
  code: string,
  statusCode: number,
) => {
  return reply.status(statusCode).send({
    code,
    message: code,
    statusCode,
  });
};

export const createForbiddenReply = (reply: FastifyReply) => {
  return createErrorReply(reply, "forbidden", 403);
};

export const createUnauthorizedReply = (reply: FastifyReply) => {
  return createErrorReply(reply, "unauthorized", 401);
};

export const createInternalServerErrorReply = (reply: FastifyReply) => {
  return createErrorReply(reply, "internal_server_error", 500);
};
