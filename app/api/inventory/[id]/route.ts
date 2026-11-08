import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Fetch a single product (for the Edit page)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  return NextResponse.json(product);
}

// Update a product (handles all fields: name, price, stock, isFeatured, etc.)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  await prisma.product.update({
    where: { id },
    data: body, // Prisma will automatically match the fields sent
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

// Delete a product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}