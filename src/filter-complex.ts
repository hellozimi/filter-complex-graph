/**
 * Filter option can be a string and a number. If the value is a ffmpeg function
 * like `between` or `select` the parser will escape the commas for you.
 */
export type FilterOptionValue = string | number
export type Filter = {
  name: FilterOptionValue
  options?: Record<string, FilterOptionValue> | FilterOptionValue
}

export type FilterOperation = {
  inputs: string | string[]
  outputs?: string | string[]
  filters: Filter | Filter[]
}

/**
 * Reg exp for finding a function including multple parameters.
 * Example: between(t, 10, 20)
 */
const filterFunctionRegExp = /\w+\(([\w\d\s]+,)+[\w\d\s]+\)/

/**
 * Formats the filter option value. If it's a ffmpeg function the commas will
 * be escaped automatically.
 */
function formatFilterOptionValue(value: FilterOptionValue): string {
  if (typeof value === 'string' && filterFunctionRegExp.test(value)) {
    return value.replaceAll(/(\s+)?,(\s+)?/g, '\\, ')
  }
  return `${value}`
}

function formatStream(stream: string): string {
  return `[${stream}]`
}

function formatFilterOptions(options: NonNullable<Filter['options']>) {
  if (typeof options !== 'object') {
    return formatFilterOptionValue(options)
  }

  return Object.entries(options)
    .map(([name, value]) => `${name}=${formatFilterOptionValue(value)}`)
    .join(':')
}

function formatFilter({ name, options }: Filter) {
  const formattedOptions = options && formatFilterOptions(options)
  return [name, formattedOptions].filter(v => v).join('=')
}

function formatOperation({ inputs, filters, outputs }: FilterOperation): string {
  const ins = (Array.isArray(inputs) ? inputs : [inputs]).map(formatStream).join('')
  const ops = (Array.isArray(filters) ? filters : [filters]).map(formatFilter).join(',')
  const outs = outputs ? (Array.isArray(outputs) ? outputs : [outputs]).map(formatStream).join('') : null
  return [ins, ops, outs].filter(v => v).join('')
}

export function createFilterGraph(operations: FilterOperation[]): string {
  return operations.flatMap(formatOperation).join(';')
}

export function prettyPrint(filterGraph: string) {
  return filterGraph.replaceAll(';', ';\n')
}
