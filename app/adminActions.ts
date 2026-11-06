"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryName = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
  
  let category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categoryName, slug } });
  }

  await prisma.product.create({
    data: { name, description, price, stock, imageUrl, categoryId: category.id },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);

  await prisma.product.update({
    where: { id },
    data: { price, stock },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
}