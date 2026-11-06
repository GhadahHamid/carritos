import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  await prisma.product.update({
    where: { id },
    data: body,
  });
  
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}