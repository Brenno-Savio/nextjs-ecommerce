import { Cart, CartItem, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/dist/client/components/headers';
import { authOptions } from '../authOptions';
import { env } from '../env';
import { prisma } from './prisma';

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  } else {
    const localCartId = cookies().get('localCartId')?.value;
    if (!localCartId) return null;
    let myCartId;

    const listCartId = await prisma.cart.findMany({ select: { id: true } });
    for (const cartId of listCartId) {
      let comparison = await bcrypt.compareSync(cartId.id, localCartId);
      comparison === true ? (myCartId = cartId.id) : null;
    }

    if (!myCartId) return null;

    cart =
      myCartId !== undefined
        ? await prisma.cart.findUnique({
            where: { id: myCartId },
            include: { items: { include: { product: true } } },
          })
        : null;
  }

  if (!cart) return null;

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });
  }

  const salt = await bcrypt.genSaltSync(Number(env.SALT));
  const cartId = await bcrypt.hashSync(newCart.id, salt);

  cookies().set('localCartId', cartId);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get('localCartId')?.value;
  if (!localCartId) return null;
  let myCartId;

  const listCartId = await prisma.cart.findMany({ select: { id: true } });
  for (const cartId of listCartId) {
    let comparison = await bcrypt.compareSync(cartId.id, localCartId);
    comparison === true ? (myCartId = cartId.id) : null;
  }

  if (!myCartId) return null;

  const localCart =
    myCartId !== undefined
      ? await prisma.cart.findUnique({
          where: { id: myCartId },
          include: { items: true },
        })
      : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set('localCartId', '');
  });
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
