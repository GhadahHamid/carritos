import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { supplierId, exchangeRate, items } = await req.json();

    // Create the Purchase Order
    const totalCost = items.reduce((sum: number, item: any) => sum + (item.costPerItemUSD * item.itemsPerBox), 0);
    
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        supplierId,
        totalCost,
        exchangeRate,
      },
    });

    // Loop through items and create/update products
    for (const item of items) {
      let existingProduct = null;
      if (item.barcode) {
        existingProduct = await prisma.product.findUnique({ where: { barcode: item.barcode } });
      }

      let productId;

      if (existingProduct) {
        // Update stock and prices
        const updatedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            stock: existingProduct.stock + item.itemsPerBox,
            costPrice: item.costPerItemUSD,
            price: item.sellingPriceUSD,
            categoryId: item.categoryId,
          }
        });
        productId = updatedProduct.id;
      } else {
        // Create new product
        const newProduct = await prisma.product.create({
          data: {
            name: item.name,
            categoryId: item.categoryId,
            barcode: item.barcode || null,
            costPrice: item.costPerItemUSD,
            price: item.sellingPriceUSD,
            stock: item.itemsPerBox,
          }
        });
        productId = newProduct.id;
      }

      // Save item in Purchase history
      await prisma.purchaseItem.create({
        data: {
          purchaseOrderId: purchaseOrder.id,
          productId: productId,
          quantity: item.itemsPerBox,
          unitCost: item.costPerItemUSD,
        }
      });
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 });
  }
}