import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { shoppingLists } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const shoppingListRouter = createTRPCRouter({
  getShoppingLists: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.shoppingLists.findMany({
      with: {
        items: true,
        createdBy: true,
        collaborators: {
          with: {
            user: true,
          },
        },
      },
      where: eq(shoppingLists.createdById, ctx.session.user.id),
    });
  }),
  getList: protectedProcedure
    .input(z.object({ slug: z.string(), userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.shoppingLists.findFirst({
        with: {
          items: true,
        },
        where: eq(shoppingLists.slug, input.slug),
      });
    }),
});
