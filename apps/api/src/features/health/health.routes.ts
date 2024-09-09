import type { FastifyInstance } from "fastify";

export default function health(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.get("", async (_request, reply) => {
    return reply
      .status(200)
      .send({ message: "ZDnevnik API is up and running" });
  });

  done();
}
