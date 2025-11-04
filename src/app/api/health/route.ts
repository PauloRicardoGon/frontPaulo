import { NextResponse } from 'next/server';

export const GET = () =>
  NextResponse.json({
    status: 'ok',
    updatedAt: new Date().toISOString(),
  });
