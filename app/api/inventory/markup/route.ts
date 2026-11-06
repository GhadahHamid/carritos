import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { percent } = await req.json();
  const multiplier = 1 + (percent / 100);

  const products = await prisma.product.findMany();
  
  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: { price: product.price * multiplier },
    });
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}