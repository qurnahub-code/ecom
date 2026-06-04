import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const orderId = params.id;

    console.log(`[DEBUG] API looking for Order ID: ${orderId}`);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        // ❌ REMOVED: addresses: true (This caused the crash)
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      console.log(`[DEBUG] Order ID ${orderId} NOT found.`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Manually format the address for the frontend to use
    // The frontend expects an array `addresses: [{ ... }]`
    const responseData = {
      ...order,
      addresses: [
        {
          fullName: order.guestName || "Customer", // Fallback if name isn't stored
          street: order.address,
          city: order.city,
          postalCode: order.postalCode,
          country: "Pakistan",
          phone: order.phone
        }
      ]
    };

    console.log(`[DEBUG] Order Found! Returning data.`);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("[DEBUG] Fetch Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}