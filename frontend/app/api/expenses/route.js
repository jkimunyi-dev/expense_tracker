import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Proxy requests to the Go backend
export async function GET(request) {
  const response = await fetch(`${API_BASE_URL}/api/expenses`);
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request) {
  const expense = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request) {
  const expense = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/expenses/${expense.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request, { params }) {
  const response = await fetch(`${API_BASE_URL}/api/expenses/${params.id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
