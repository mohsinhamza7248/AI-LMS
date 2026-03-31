'use client'

import { useState } from 'react'
import { addUser } from '@/actions/admin'
import { Loader2, UserPlus, X, Mail, Phone, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AddUserForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await addUser({ name, email, phone, role: 'tutor' })
      setSuccess('Tutor added successfully!')
      setName('')
      setEmail('')
      setPhone('')
      setTimeout(() => setOpen(false), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to add tutor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="default"
        className="rounded-full gap-2 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
      >
        <UserPlus className="h-4 w-4" />
        Add Tutor
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-md border-border/60 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <CardHeader className="relative pb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <UserPlus className="h-5 w-5" />
                 </div>
                 <CardTitle className="text-xl font-bold">Register New Tutor</CardTitle>
              </div>
              <CardDescription>
                Onboard a new instructor to the platform. They will be able to manage their own courses.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <form id="add-tutor-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 rounded-xl focus-visible:ring-primary/20"
                    placeholder="e.g. Dr. Jane Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Phone Number <span className="lowercase font-normal opacity-70">(required for login)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-11 rounded-xl focus-visible:ring-primary/20"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address <span className="lowercase font-normal opacity-70">(optional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl focus-visible:ring-primary/20"
                    placeholder="jane.smith@example.com"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 animate-in shake duration-500">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-medium border border-emerald-500/20 flex items-center gap-2 animate-in zoom-in-95 duration-300">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {success}
                  </div>
                )}
              </form>
            </CardContent>

            <Separator />

            <CardFooter className="bg-muted/30 p-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                form="add-tutor-form"
                type="submit"
                disabled={loading || !name || !phone}
                className="rounded-full px-8 bg-primary hover:bg-primary/90 font-bold"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Tutor
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
