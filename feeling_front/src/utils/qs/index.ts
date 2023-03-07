import qs from 'query-string'

export function getParsedQuery(query: string) {
  return qs.parse(query)
}

export function getStringifyObj(obj: Record<string, string>) {
  return qs.stringify(obj)
}
