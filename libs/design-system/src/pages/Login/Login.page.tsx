import React from "react";
import type { LoginBody } from "@zdnevnik/toolkit";
import { loginBodySchema } from "@zdnevnik/toolkit";

import Logo from "./assets/zdnevnik_logo.png";
import Logo2x from "./assets/zdnevnik_logo@2x.png";
import Logo3x from "./assets/zdnevnik_logo@3x.png";

import { Heading } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "@/hooks";

export const LoginPage = () => {
  const { register, formState } = useForm<LoginBody>({
    schema: loginBodySchema,
  });

  return (
    <Container className="zd-h-screen zd-w-full zd-flex zd-justify-center zd-items-center zd-flex-col">
      <img
        src={Logo}
        srcSet={`${Logo2x} 2x, ${Logo3x} 3x`}
        alt="ZDnevnik Logo"
        className="zd-w-full zd-h-[256px] zd-mb-16 zd-object-contain"
      />
      <Heading variant="h4" className="zd-mb-8 zd-text-center">
        Prijavi se i odgovori na pitanje{" "}
        <span className="zd-text-primary">"Koji si ti broj"</span>?
      </Heading>
      <div className="zd-w-full zd-max-w-[500px]">
        <Input
          placeholder="Korisničko ime"
          containerClassName="zd-mb-4"
          error={formState.errors?.username?.message}
          {...register("username")}
        />
        <Input
          placeholder="Lozinka"
          containerClassName="zd-mb-14"
          type="password"
          error={formState.errors?.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="zd-w-full">
          Prijava
        </Button>
      </div>
    </Container>
  );
};
