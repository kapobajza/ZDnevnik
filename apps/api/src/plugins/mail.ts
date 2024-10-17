import fp from "fastify-plugin";

import { FastifyCustomProp } from "~/api/types";
import type { EmailClient } from "~/api/email/client";

export default fp<{ emailClient: EmailClient }>((fastify, opts, done) => {
  fastify.decorate(FastifyCustomProp.EmailClient, opts.emailClient);

  done();
});
