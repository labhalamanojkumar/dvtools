'use client'

import { useEffect, useState } from 'react'

interface VerificationTag {
  name: string
  type: string
  code: string
}

export function AdVerificationMetaTags() {
  const [tags, setTags] = useState<VerificationTag[]>([])

  useEffect(() => {
    // Fetch verification tags from API
    fetch('/api/admin/ads/verification-tags')
      .then(res => res.json())
      .then(data => {
        if (data.tags) {
          setTags(data.tags)
        }
      })
      .catch(error => {
        console.error('Failed to load ad verification tags:', error)
      })
  }, [])

  if (tags.length === 0) return null

  return (
    <>
      {tags.map((tag, index) => (
        <meta
          key={index}
          name={getMetaTagName(tag.type)}
          content={tag.code}
        />
      ))}
    </>
  )
}

function getMetaTagName(vendorType: string): string {
  const metaTagNames: Record<string, string> = {
    GOOGLE_ADSENSE: 'google-site-verification',
    MEDIANET: 'media-net-site-verification',
    MONETAGE: 'monetag-site-verification',
    BUZZFEED_ADS: 'buzzfeed-verification',
    AMAZON_ASSOCIATES: 'amazon-verification'
  }

  return metaTagNames[vendorType] || 'site-verification'
}
