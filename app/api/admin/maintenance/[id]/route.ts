import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  
  await prisma.product.update({
    where: { id },
    data: { price: body.price }
  });
  
  return NextResponse.json({ success: true });
}