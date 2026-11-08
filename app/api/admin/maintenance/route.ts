import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany();
  const issues: any[] = [];

  products.forEach(p => {
    // If it's manually flagged for maintenance, add it to the list
    if (p.needsMaintenance) {
      issues.push({ ...p, issue: "Flagged for Maintenance" });
    } 
    // Otherwise, scan for broken items
    else if (!p.price || p.price === 0) {
      issues.push({ ...p, issue: "Price is $0" });
    } 
    else if (p.price > 1000) {
      issues.push({ ...p, issue: "Price in LBP" });
    } 
    else if (!p.imageUrl) {
      issues.push({ ...p, issue: "No Image" });
    }
  });

  return NextResponse.json(issues);
}