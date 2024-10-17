import formData from "form-data";
import Mailgun from "mailgun.js";

import type { EnvRecord } from "~/api/env/util";

export type EmailClient = {
  send(params: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  }): Promise<void>;
};

export function createEmailClient(env: EnvRecord): EmailClient {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: env.MAILGUN_API_KEY,
    url: env.MAILGUN_API_URL,
  });

  return {
    async send(params) {
      await mg.messages.create("zdnevnik.com", params);
    },
  };
}
