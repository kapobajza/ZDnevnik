import { Button, Heading, Html } from "@react-email/components";
import React from "react";

import type { InviteStudentProps } from "./types";

export default function InviteStudentTemplate({
  inviteUrl,
}: InviteStudentProps) {
  return (
    <Html>
      <Heading>Dobrodošli na ZDnevnik!</Heading>
      <Button
        href={inviteUrl}
        style={{
          background: "hsl(179 79.9% 35.1%)",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
        }}
      >
        Kliknite kako biste se registrovali
      </Button>
    </Html>
  );
}
