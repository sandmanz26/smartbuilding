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
import { Checkbox } from '@/components/ui/checkbox'
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
  | (BaseFieldConfig & { type: 'boolean' })

export type FormValues = Record<string, string | number | boolean>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FieldConfig[]
  defaultValues: FormValues
  /** Return an error message string to keep the dialog open and show it; return void/undefined to submit successfully. */
  onSubmit: (values: FormValues) => string | void
  submitLabel?: string
  /** Optional hook fired whenever any field changes, useful for deriving dynamic options (e.g. dependent select fields) in the parent. */
  onFieldChange?: (name: string, value: string | boolean, values: FormValues) => void
}

function validateField(field: FieldConfig, rawValue: string | number | boolean): string | null {
  if (field.type === 'boolean') return null
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

function isBooleanField(field: FieldConfig): field is BaseFieldConfig & { type: 'boolean' } {
  return field.type === 'boolean'
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
  onFieldChange,
}: FormDialogProps) {
  const [values, setValues] = useState<FormValues>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setValues(defaultValues)
      setErrors({})
      setFormError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(defaultValues)])

  function handleChange(name: string, value: string | boolean) {
    setValues((prev) => {
      const next = { ...prev, [name]: value }
      onFieldChange?.(name, value, next)
      return next
    })
    setFormError(null)
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
    const result = onSubmit(values)
    if (result) {
      setFormError(result)
      return
    }
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
          {formError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}
          {fields.map((field) => (
            <div key={field.name} className="grid gap-1.5">
              {isBooleanField(field) ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={field.name}
                    checked={Boolean(values[field.name])}
                    onCheckedChange={(checked) => handleChange(field.name, checked === true)}
                  />
                  <Label htmlFor={field.name}>{field.label}</Label>
                </div>
              ) : (
                <>
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
                </>
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
