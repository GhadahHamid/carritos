import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany();
    return NextResponse.json(suppliers);
  } catch (error) {
    // If the table is empty or there's a DB error, return an empty array instead of crashing
    return NextResponse.json([]); 
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const supplier = await prisma.supplier.create({ data: { name } });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}