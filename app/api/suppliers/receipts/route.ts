import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object as required by Next.js 15+
    const { id } = await context.params;
    
    const receipts = await prisma.purchaseOrder.findMany({
      where: { supplierId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(receipts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }
}