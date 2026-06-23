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

export type FieldConfig =
  | { name: string; label: string; type: 'text' | 'number' | 'date' | 'datetime'; placeholder?: string }
  | { name: string; label: string; type: 'textarea'; placeholder?: string }
  | { name: string; label: string; type: 'select'; options: { label: string; value: string }[] }

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

  useEffect(() => {
    if (open) setValues(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(defaultValues)])

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit() {
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
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'select' ? (
                <Select
                  value={String(values[field.name] ?? '')}
                  onValueChange={(v) => handleChange(field.name, v)}
                >
                  <SelectTrigger id={field.name}>
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
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type === 'datetime' ? 'datetime-local' : field.type}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
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
