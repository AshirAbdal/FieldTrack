import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Form } from '@/models/Form';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { name, email } = await request.json();
    const uniqueId = uuidv4();
    const requestUrl = `${process.env.NEXTAUTH_URL}/api/form/${uniqueId}`;

    const form = await Form.create({
      uniqueId,
      userId: session.user.id,
      name,
      email,
      requestUrl
    });

    return NextResponse.json({ message: 'Form created successfully', form }, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating form', error: errorMessage }, { status: 500 });
  }
}
