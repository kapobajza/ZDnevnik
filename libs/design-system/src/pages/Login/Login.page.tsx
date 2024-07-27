import React from "react";
import type { InvalidCredentialsSchema, LoginBody } from "@zdnevnik/toolkit";
import { loginBodySchema } from "@zdnevnik/toolkit";
import { Heading } from "@ds/components/ui/Typography";
import { Container } from "@ds/components/ui/Container";
import { ControlInput } from "@ds/components/ui/Input";
import { Button } from "@ds/components/ui/Button";
import { useForm } from "@ds/hooks";
import Logo from "@ds/pages/Login/assets/zdnevnik_logo.png";
import Logo3x from "@ds/pages/Login/assets/zdnevnik_logo@3x.png";
import Logo2x from "@ds/pages/Login/assets/zdnevnik_logo@2x.png";
import { getImageSource } from "@ds/lib/image";

export type LoginPageProps = {
  errors: InvalidCredentialsSchema | undefined;
};

export const LoginPage = ({ errors }: LoginPageProps) => {
  const { control } = useForm<LoginBody>({
    schema: loginBodySchema,
  });

  return (
    <Container className="zd-h-screen zd-w-full zd-flex zd-justify-center zd-items-center zd-flex-col">
      <img
        src={getImageSource(Logo)}
        srcSet={`${getImageSource(Logo2x)} 2x, ${getImageSource(Logo3x)} 3x`}
        alt="ZDnevnik Logo"
        className="zd-w-full zd-h-[256px] zd-mb-16 zd-object-contain"
      />
      <Heading variant="h4" className="zd-mb-8 zd-text-center">
        Prijavi se i odgovori na pitanje{" "}
        <span className="zd-text-primary">"Koji si ti broj"</span>?
      </Heading>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form
        className="zd-w-full zd-max-w-[500px]"
        // control={control}
        method="post"
      >
        {errors ? <div>{errors.error}</div> : null}
        <ControlInput
          placeholder="Korisničko ime"
          containerClassName="zd-mb-4"
          control={control}
          name="username"
        />
        <ControlInput
          placeholder="Lozinka"
          containerClassName="zd-mb-14"
          type="password"
          control={control}
          name="password"
        />
        <Button type="submit" className="zd-w-full">
          Prijava
        </Button>
      </form>
    </Container>
  );
};
