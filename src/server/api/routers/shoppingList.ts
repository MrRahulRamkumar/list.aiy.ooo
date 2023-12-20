import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
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
  getShoppingList: protectedProcedure
    .input(z.object({ slug: z.string(), userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.shoppingLists.findFirst({
        with: {
          items: true,
        },
        where: eq(shoppingLists.slug, input.slug),
      });
    }),
  createShoppingList: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1).max(255),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(shoppingLists).values({
        name: input.name,
        description: input.description,
        slug: createId(),
        createdById: ctx.session.user.id,
      });
    }),
});
