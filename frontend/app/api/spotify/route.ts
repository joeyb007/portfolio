import { NextResponse } from 'next/server'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN!,
    }),
  })

  const data = await res.json()
  return data.access_token
}

export async function GET() {
  const accessToken = await getAccessToken()

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  // 204 = nothing playing
  if (res.status === 204) return NextResponse.json({ isPlaying: false })

  const data = await res.json()

  if (!data?.item) return NextResponse.json({ isPlaying: false })

  return NextResponse.json({
    isPlaying:  data.is_playing,
    title:      data.item.name,
    artist:     data.item.artists.map((a: { name: string }) => a.name).join(', '),
    album:      data.item.album.name,
    albumArt:   data.item.album.images[0]?.url ?? null,
    songUrl:    data.item.external_urls.spotify,
  })
}
