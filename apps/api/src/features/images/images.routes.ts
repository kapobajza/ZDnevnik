import type { FastifyInstance } from "fastify";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  fileRequestSchema,
  imageGetParamsSchema,
  imageUploadResponseSchema,
} from "@zdnevnik/toolkit";
import sharp from "sharp";

import {
  createInternalServerErrorReply,
  createNotFoundReply,
  createValidationErrorReply,
} from "~/api/error/replies";
import { generateUdid } from "~/api/util/udid";

export default function images(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  const env = fastify.getEnvs();
  const client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:key",
    {
      schema: {
        params: imageGetParamsSchema,
      },
      preHandler: fastify.auth([fastify.verifyUserFromSession]),
    },
    async (request, reply) => {
      try {
        const { Body } = await client.send(
          new GetObjectCommand({
            Bucket: env.AWS_S3_IMAGES_BUCKET,
            Key: request.params.key,
          }),
        );

        if (!Body) {
          return createNotFoundReply(reply);
        }

        return reply.send(Body);
      } catch (err) {
        console.error("Error with image get", err);
        return createInternalServerErrorReply(reply);
      }
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      preHandler: fastify.auth(
        [fastify.verifyUserFromSession, fastify.verifyTeacherFromSession],
        {
          relation: "and",
        },
      ),
      schema: {
        response: {
          200: imageUploadResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const file = await request.file({
          limits: {
            fileSize: 10 * 1024 * 1024,
          },
        });
        const fileValidationRes = fileRequestSchema.safeParse(file);

        if (!fileValidationRes.success) {
          return createValidationErrorReply(
            reply,
            fileValidationRes.error.issues,
          );
        }

        const buffer = await file?.toBuffer();
        const processedImageBuffer = await sharp(buffer)
          .resize(800)
          .webp()
          .toBuffer();

        const key = `${generateUdid()}-zdnevnik-image.webp`;

        await client.send(
          new PutObjectCommand({
            Bucket: env.AWS_S3_IMAGES_BUCKET,
            Key: key,
            Body: processedImageBuffer,
          }),
        );

        return reply.send({
          url: `${request.protocol}://${request.headers.host}/images/${key}`,
        });
      } catch (err) {
        console.error("Error with image upload", err);
        return createInternalServerErrorReply(reply);
      }
    },
  );

  done();
}
