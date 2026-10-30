import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

// the link-preview card for any page: /og?title=... draws the title in the site's ink on white
export function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") ?? site.name

  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-white p-20 text-[#0a0a0a]">
      <div tw="text-3xl text-[#737373]">{site.name}</div>
      <div tw="text-7xl font-bold leading-tight tracking-tight">{title}</div>
    </div>,
    { width: 1200, height: 630 }
  )
}
