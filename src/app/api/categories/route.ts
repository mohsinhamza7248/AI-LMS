import { NextResponse } from 'next/server'
import { getCategoryList } from '@/actions/admin'

export async function GET() {
  try {
    const categories = await getCategoryList()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
