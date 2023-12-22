import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  shoppingListItems,
  shoppingLists,
  unitValues,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const shoppingListRouter = createTRPCRouter({
  getShoppingLists: protectedProcedure.query(({ ctx }) => {
    const shoppingListsQuery = ctx.db.query.shoppingLists
      .findMany({
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
      })
      .toSQL();
    console.log(shoppingListsQuery);

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
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.shoppingLists.findFirst({
        with: {
          items: {
            with: {
              createdBy: true,
              completedBy: true,
            },
          },
        },
        where: eq(shoppingLists.slug, input),
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
  addShoppingListItem: protectedProcedure
    .input(
      z.object({
        shoppingListId: z.number(),
        name: z.string().min(1).max(255),
        quantity: z.number().min(1).optional(),
        unit: z.enum(unitValues).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(shoppingListItems).values({
        name: input.name,
        quantity: input.quantity,
        unit: input.unit,
        shoppingListId: input.shoppingListId,
        createdById: ctx.session.user.id,
      });
    }),
  completeShoppingListItem: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const statement = sql`
      update
        ${shoppingListItems}
      set
        completedAt = (
          CASE
            WHEN completedAt IS NULL THEN CURRENT_TIMESTAMP(3)
            ELSE null
          END
        ),
        completedById = (
          CASE
            WHEN completedById IS NULL THEN ${ctx.session.user.id}
            ELSE null
          END
        )
      where
        id = ${input};
      `;

      await ctx.db.execute(statement);
    }),
});
