export interface SongsResult {
  songs: {
    __typename: string
    data: Song[]
  }
}

export interface Song {
  __typename: string
  id: string
  attributes: {
    __typename: string
    createdAt: Date
    updatedAt: Date
    publishedAt: Date
    name: string
    description: string
    audio: AudioCollection
  }
}

export interface AudioCollection {
  __typename: string
  data: Audio[]
}

export interface Audio {
  __typename: string
  id: string
  attributes: {
    createdAt: Date
    updatedAt: Date
    name: string
    alternativeText: string
    caption: string
    width: number
    height: number
    formats: JSON
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: string
    provider: string
    provider_metadata: string
  }
}
