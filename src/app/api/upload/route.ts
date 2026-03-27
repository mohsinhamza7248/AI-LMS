import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
const apiKey = process.env.CLOUDINARY_API_KEY!
const apiSecret = process.env.CLOUDINARY_API_SECRET!

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') // 'image' | 'video'

  const timestamp = Math.round(Date.now() / 1000)
  const folder = type === 'video' ? 'lms/lectures' : 'lms/thumbnails'

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(paramsToSign).digest('hex')

  return NextResponse.json({
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder,
  })
}
