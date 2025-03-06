
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params:  Promise<{ messageId: string }>}
) {
  try {
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    await connectDB();

    
    const { messageId } = await params;
    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    // Parse the request body for the reply text
    const { replyText } = await request.json();

   
    const existingMessage = await Message.findById(messageId);
    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Send the reply via Resend
    await resend.emails.send({
      from: "noreply@fieldtrack.ravee.xyz",
      to: existingMessage.email, // Reply to the sender's email
      subject: "Reply to Your Submission",
      html: `<p>${replyText}</p>`,
    });

    return NextResponse.json({ success: true, message: "Reply sent successfully." });
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 });
  }
}
