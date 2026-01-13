import { XMLParser } from 'fast-xml-parser'

export async function GET() {
  const CHANNEL_ID = 'UCJXoVsiDddXFEGxaiN2yKgA'
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

  try {
    const response = await fetch(RSS_URL)
    const xmlText = await response.text()

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    const data = parser.parse(xmlText)
    const videos = data.feed.entry || []

    const mappedSermons = videos.map((video, index) => {
      const dateObj = new Date(video.published)
      const dateStr = dateObj.toISOString().split('T')[0]

      let excerpt = video['media:group']['media:description'] || ''
      if (excerpt.length > 100) excerpt = excerpt.substring(0, 100) + '...'

      return {
        id: video['yt:videoId'],
        title: video.title,
        excerpt: excerpt,
        book: 'Sermon',
        date: dateStr,
        hasAudio: false,
        hasVideo: true,
        videoLink: video.link['@_href'],
        thumbnail: `https://i.ytimg.com/vi/${video['yt:videoId']}/mqdefault.jpg`,
      }
    })

    return new Response(JSON.stringify(mappedSermons), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from YouTube' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
