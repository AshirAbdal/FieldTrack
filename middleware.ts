// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Include both hostname and IP variations for local development
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',  // Include your development server
  'https://your-production-domain.com'
];

export async function middleware(request: NextRequest) {
  // Enhanced logging for debugging
  console.log('Middleware Processing:', {
    method: request.method,
    url: request.url,
    origin: request.headers.get('origin'),
    host: request.headers.get('host'),
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
  });

  // Check the origin from the request
  const origin = request.headers.get('origin');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-forwarded-host',
        'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
      },
    });
  }

  // Handle regular requests
  const response = NextResponse.next();
  
  // Set CORS headers for all responses
  if (origin) {
    // If the origin is in our allowed list, reflect it back
    // Otherwise, use a default allowed origin
    response.headers.set(
      'Access-Control-Allow-Origin', 
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
    );
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-forwarded-host'
  );

  // Additional Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  // Match both API routes and form submission routes
  matcher: [
    '/api/:path*',
    '/form/:path*'  // Include your form routes
  ],
};