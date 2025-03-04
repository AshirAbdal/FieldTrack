import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Form } from '@/models/Form';

export async function GET() {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Require authentication
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();
    
    // Fetch forms for the current user
    const forms = await Form.find({ 
      userId: session.user.id 
    })
    .sort({ createdAt: -1 })
    .select('name email uniqueId requestUrl createdAt');
    
    return NextResponse.json({ 
      forms,
      message: 'Forms fetched successfully' 
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ 
      message: 'Error fetching forms',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
