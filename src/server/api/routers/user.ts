import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { hash } from "bcrypt";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      //   Cek apakah username sudah dipakai
      const existingUsername = await db.user.findUnique({
        where: { username: input.username },
      });

      if (existingUsername) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists!",
        });
      }

      //   Hash Password
      const hashedPassword = await hash(input.password, 10);

      const newUser = await db.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
        },
      });
      return newUser;
    }),
});
