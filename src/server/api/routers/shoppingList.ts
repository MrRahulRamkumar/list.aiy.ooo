import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  type SelectShoppingListWithRelations,
  shoppingListCollaborators,
  shoppingListItems,
  shoppingLists,
  unitValues,
  users,
} from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

export const shoppingListRouter = createTRPCRouter({
  getYourShoppingLists: protectedProcedure.query(async ({ ctx }) => {
    const createdBy = alias(users, "createdBy");
    const collaborator = alias(users, "collaborator");

    const rows = await ctx.db
      .select()
      .from(shoppingLists)
      .innerJoin(createdBy, eq(createdBy.id, shoppingLists.createdById))
      .leftJoin(
        shoppingListItems,
        eq(shoppingLists.id, shoppingListItems.shoppingListId),
      )
      .leftJoin(
        shoppingListCollaborators,
        eq(shoppingLists.id, shoppingListCollaborators.shoppingListId),
      )
      .leftJoin(
        collaborator,
        eq(shoppingListCollaborators.userId, collaborator.id),
      )
      .where(eq(shoppingLists.createdById, ctx.session.user.id));

    const result = rows.reduce<Record<number, SelectShoppingListWithRelations>>(
      (acc, row) => {
        const shoppingList = row.shoppingList;
        const item = row.shoppingListItem;
        const collaborator = row.collaborator;
        const createdBy = row.createdBy;

        if (!acc[shoppingList.id]) {
          acc[shoppingList.id] = {
            ...shoppingList,
            createdBy: createdBy,
            items: [],
            collaborators: [],
          };
        }

        if (item) {
          acc[shoppingList.id]?.items.push(item);
        }

        if (collaborator) {
          const collaborators = acc[shoppingList.id]?.collaborators ?? [];
          if (!collaborators.some((c) => c.id === collaborator.id)) {
            collaborators.push(collaborator);
          }
        }

        return acc;
      },
      {},
    );

    return Object.values(result);
  }),
  getCollaboratingShoppingLists: protectedProcedure.query(async ({ ctx }) => {
    const createdBy = alias(users, "createdBy");
    const collaboratorTarget = alias(
      shoppingListCollaborators,
      "collaboratorTarget",
    );
    const collaborator = alias(users, "collaborator");

    const rows = await ctx.db
      .select()
      .from(shoppingLists)
      .innerJoin(createdBy, eq(createdBy.id, shoppingLists.createdById))
      .leftJoin(
        shoppingListItems,
        eq(shoppingLists.id, shoppingListItems.shoppingListId),
      )
      .leftJoin(
        collaboratorTarget,
        eq(shoppingLists.id, collaboratorTarget.shoppingListId),
      )
      .leftJoin(
        shoppingListCollaborators,
        eq(shoppingLists.id, shoppingListCollaborators.shoppingListId),
      )
      .leftJoin(
        collaborator,
        eq(shoppingListCollaborators.userId, collaborator.id),
      )
      .where(eq(collaboratorTarget.userId, ctx.session.user.id));

    const result = rows.reduce<Record<number, SelectShoppingListWithRelations>>(
      (acc, row) => {
        const shoppingList = row.shoppingList;
        const item = row.shoppingListItem;
        const collaborator = row.collaborator;
        const createdBy = row.createdBy;

        if (!acc[shoppingList.id]) {
          acc[shoppingList.id] = {
            ...shoppingList,
            createdBy: createdBy,
            items: [],
            collaborators: [],
          };
        }

        if (item) {
          acc[shoppingList.id]?.items.push(item);
        }

        if (collaborator) {
          const collaborators = acc[shoppingList.id]?.collaborators ?? [];
          if (!collaborators.some((c) => c.id === collaborator.id)) {
            collaborators.push(collaborator);
          }
        }

        return acc;
      },
      {},
    );

    return Object.values(result);
  }),
  getShoppingList: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const shoppingList = await ctx.db.query.shoppingLists.findFirst({
        with: {
          items: {
            with: {
              createdBy: true,
              completedBy: true,
            },
            orderBy: (items, { asc, desc }) => [
              asc(items.completedAt),
              desc(items.createdAt),
            ],
          },
        },
        where: eq(shoppingLists.slug, input),
      });

      if (!shoppingList) return null;

      if (shoppingList.createdById !== ctx.session.user.id) {
        const collaborator =
          await ctx.db.query.shoppingListCollaborators.findFirst({
            where: and(
              eq(shoppingListCollaborators.userId, ctx.session.user.id),
              eq(shoppingListCollaborators.shoppingListId, shoppingList.id),
            ),
          });

        if (!collaborator) {
          await ctx.db.insert(shoppingListCollaborators).values({
            shoppingListId: shoppingList.id,
            userId: ctx.session.user.id,
          });
        }
      }

      return shoppingList;
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
      return { success: true };
    }),
  deleteShoppingListItem: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(shoppingListItems)
        .where(eq(shoppingListItems.id, input))
        .execute();
      return { success: true };
    }),
});
