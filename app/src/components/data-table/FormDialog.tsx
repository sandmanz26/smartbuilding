import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BaseFieldConfig = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  /** Minimum numeric value (type: 'number' only). */
  min?: number
}

export type FieldConfig =
  | (BaseFieldConfig & { type: 'text' | 'number' | 'date' | 'datetime' })
  | (BaseFieldConfig & { type: 'textarea' })
  | (BaseFieldConfig & { type: 'select'; options: { label: string; value: string }[] })

export type FormValues = Record<string, string | number>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FieldConfig[]
  defaultValues: FormValues
  onSubmit: (values: FormValues) => void
  submitLabel?: string
}

function validateField(field: FieldConfig, rawValue: string | number): string | null {
  const value = String(rawValue ?? '').trim()
  if (field.required !== false && value === '') {
    return 'Wajib diisi.'
  }
  if (value === '') return null

  if (field.type === 'number') {
    const num = Number(value)
    if (Number.isNaN(num)) return 'Harus berupa angka.'
    if (field.min !== undefined && num < field.min) return `Minimal ${field.min}.`
  }
  if (field.type === 'date' || field.type === 'datetime') {
    if (Number.isNaN(new Date(value).getTime())) return 'Tanggal tidak valid.'
  }
  return null
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Simpan',
}: FormDialogProps) {
  const [values, setValues] = useState<FormValues>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setValues(defaultValues)
      setErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(defaultValues)])

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {}
    for (const field of fields) {
      const message = validateField(field, values[field.name])
      if (message) nextErrors[field.name] = message
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-1.5">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required !== false && <span className="text-destructive"> *</span>}
              </Label>
              {field.type === 'select' ? (
                <Select
                  value={String(values[field.name] ?? '')}
                  onValueChange={(v) => handleChange(field.name, v)}
                >
                  <SelectTrigger id={field.name} aria-invalid={!!errors[field.name]}>
                    <SelectValue placeholder={`Pilih ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  aria-invalid={!!errors[field.name]}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type === 'datetime' ? 'datetime-local' : field.type}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  aria-invalid={!!errors[field.name]}
                />
              )}
              {errors[field.name] && (
                <p className="text-xs text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
