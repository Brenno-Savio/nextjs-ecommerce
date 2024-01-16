import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { cookies } from 'next/dist/client/components/headers';
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
  const localCartId = cookies().get('localCartId')?.value;
  if (!localCartId) return null;
  let myCartId;

  const listCartId = await prisma.cart.findMany({ select: { id: true } });
  for (const cartId of listCartId) {
    let comparison = await bcrypt.compareSync(cartId.id, localCartId);
    comparison === true ? (myCartId = cartId.id) : null;
  }

  if (!myCartId) return null;

  const cart =
    myCartId !== undefined
      ? await prisma.cart.findUnique({
          where: { id: myCartId },
          include: { items: { include: { product: true } } },
        })
      : null;

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
  const newCart = await prisma.cart.create({
    data: {},
  });
  const salt = await bcrypt.genSaltSync(Number(process.env.SALT));
  const cartId = await bcrypt.hashSync(newCart.id, salt);

  cookies().set('localCartId', cartId);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}
