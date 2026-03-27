'use client'

import { useState } from 'react'
import { addUser } from '@/actions/admin' // Using addUser which supports roles natively
import { Loader2, UserPlus, X } from 'lucide-react'

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
      // Hardcode role to 'tutor' per request
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
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-muted/50 px-6 py-3 font-bold text-foreground transition-all hover:bg-muted"
      >
        <UserPlus className="h-5 w-5" />
        Add Tutor
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">Add Tutor</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the tutor's details to pre-register or promote them.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold block">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold block">Phone Number (Required for Login)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold block">Email Address (Optional)</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="john@example.com"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium bg-green-50 p-3 rounded-xl">{success}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-bold hover:bg-muted focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || !name || !phone}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-primary-foreground font-bold transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

