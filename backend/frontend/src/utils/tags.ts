import { TAG_MAX_COUNT, TAG_MAX_LENGTH } from '@/constants/todo'

export function parseTags(raw: string): string[] {
  const unique = new Set<string>()

  for (const part of raw.split(',')) {
    const tag = part.trim().replace(/\s+/g, ' ')
    if (tag.length === 0) {
      continue
    }
    unique.add(tag.slice(0, TAG_MAX_LENGTH))
    if (unique.size >= TAG_MAX_COUNT) {
      break
    }
  }

  return [...unique]
}

export function tagsToInputValue(tags: string[]): string {
  return tags.join(', ')
}
