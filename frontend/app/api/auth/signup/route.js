import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request) {
    try {
        const userData = await request.json();
        
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Signup failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}