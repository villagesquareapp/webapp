import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path')

    if (!path) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    try {
        revalidatePath(path)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (err) {
        return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
    }
}

