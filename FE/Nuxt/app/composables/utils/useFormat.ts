import type { SelectItem } from '@nuxt/ui'

type SelectValue = string | number | boolean | null | undefined

export function toSelection<T extends Record<string, unknown>>(items: T[], labelKey: keyof T, valueKey: keyof T): SelectItem[] {
    return items.map((item) => ({
        label: String(item[labelKey]),
        value: item[valueKey] as SelectValue,
    }))
}
