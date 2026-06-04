import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, paymentMethod, shippingDetails, paymentData } = body;

    // 1. Validate User
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- 🔍 NEW: Validate Products Exist ---
    // Extract IDs from the cart items
    const productIds = items.map((item: any) => item.id);
    
    // Check DB for these IDs
    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: { id: true }
    });

    // If we found fewer products in DB than are in the cart, something is invalid
    if (validProducts.length !== productIds.length) {
      console.error("[ORDER ERROR] Cart contains invalid Product IDs");
      return NextResponse.json({ 
        error: "One or more items in your cart are no longer available. Please clear your cart." 
      }, { status: 400 });
    }
    // ----------------------------------------

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: parseFloat(total),
        status: "PENDING",
        
        paymentMethod: paymentMethod, 
        transactionId: paymentData?.transactionId || null,
        paymentPhone: paymentData?.paymentPhone || null,
        
        guestName: shippingDetails.fullName,
        guestEmail: session.user.email,
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        phone: shippingDetails.phone,

        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
        },
      },
    });

    // 4. Send Email (Optional)
    try {
        await sendEmail({
          to: user.email,
          subject: `Order #${order.id.slice(-6).toUpperCase()} Confirmed`,
          html: `<h1>Order Confirmed</h1><p>Thanks for shopping with us!</p>`
        });
    } catch (emailError) {
        console.error("Email failed:", emailError);
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error: any) {
    console.error("❌ ORDER API ERROR:", error); 
    return NextResponse.json({ 
      error: "Order processing failed.", 
      details: error.message 
    }, { status: 500 });
  }
}