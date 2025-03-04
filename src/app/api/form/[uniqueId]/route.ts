import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Form } from "@/models/Form";
import { Message } from "@/models/Message";




export async function GET(
  _request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  try {
    await connectDB();

    // Validate session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure findOne() is properly awaited
    const form = await Form.findOne({ 
      uniqueId: params.uniqueId, 
      userId: session.user.id 
    }).exec(); // Add .exec() for better async handling

    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    // Fetch messages properly
    const messages = await Message.find({ 
      formId: form._id,
      userId: session.user.id 
    })
    .sort({ createdAt: -1 })
    .exec(); // Add .exec() for better async handling

    return NextResponse.json({
      requestUrl: form.requestUrl,
      messages: messages.map(msg => ({
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt
      })),
    });
  } catch (error) {
    console.error("Error fetching form details:", error);
    return NextResponse.json(
      { message: "Error fetching form details" },
      { status: 500 }
    );
  }
}



export async function POST(
  request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  console.log("Form page POST received:", params.uniqueId);

  try {
    await connectDB();

    const form = await Form.findOne({ uniqueId: params.uniqueId });
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    const data = { name, email, message };

    console.log("Form data received:", data);

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required",
          receivedData: data,
        },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      userId: form.userId,
      formId: form._id,
      name,
      email,
      message,
      requestUrl: request.url,
    });

    console.log("Message created:", newMessage);

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully",
        redirectUrl: `/src/app/thank-youy`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errorDetails: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  try {
    await connectDB();

    // Validate session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the form and ensure it belongs to the current user
    const form = await Form.findOne({ 
      uniqueId: params.uniqueId, 
      userId: session.user.id 
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    // Delete all messages associated with this form
    await Message.deleteMany({ formId: form._id });

    // Delete the form itself
    await Form.deleteOne({ _id: form._id });

    return NextResponse.json({ 
      success: true, 
      message: "Form and associated messages deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error deleting form",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
