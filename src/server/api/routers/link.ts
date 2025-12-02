import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { link } from "fs";
import { title } from "process";

export const linkRouter = createTRPCRouter({
  createLink: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const newLink = await db.links.create({
        data: {
          title: input.title,
          description: input.description,
          link: input.url,
          author: { connect: { username: session.user.username } },
        },
      });
      return newLink;
    }),

  getLinkPaginated: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(2),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { limit, cursor } = input;

      const links = await db.links.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          link: true,
          createdAt: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (links.length > limit) {
        const nextItem = links.pop();
        nextCursor = nextItem?.id;
      }
      return {
        links,
        nextCursor,
      };
    }),

  deleteLink: protectedProcedure
    .input(
      z.object({
        linkId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { linkId } = input;

      const delLink = await db.links.delete({
        where: {
          id: linkId,
        },
      });
      return delLink;
    }),

  getLinkById: protectedProcedure
    .input(z.object({ linkId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { linkId } = input;

      const linkDetail = await db.links.findUnique({
        where: {
          id: linkId,
        },
        select: {
          title: true,
          description: true,
          createdAt: true,
        },
      });
      if (!linkDetail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `post with id '${linkId}' not exist`,
        });
      }
      return linkDetail;
    }),

  updateLink: protectedProcedure
    .input(
      z.object({
        linkId: z.string(),
        title: z.string(),
        description: z.string(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { linkId } = input;

      const updtLink = await db.links.update({
        where: {
          id: linkId,
        },
        data: {
          title: input.title,
          description: input.description,
          link: input.url,
        },
      });
    }),
});
