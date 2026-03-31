'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Tag, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCategory, updateCategory, deleteCategory } from '@/actions/admin'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'

type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({ name: '', slug: '', icon: '' })
  const [isLoading, setIsLoading] = useState(false)

  const filteredCategories = initialCategories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createCategory(formData)
      toast({ title: 'Success', description: 'Category created successfully' })
      setIsAddOpen(false)
      window.location.reload()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create category', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setIsLoading(true)
    try {
      await updateCategory(editingCategory.id, formData)
      toast({ title: 'Success', description: 'Category updated successfully' })
      setIsEditOpen(false)
      window.location.reload()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update category', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      toast({ title: 'Success', description: 'Category deleted successfully' })
      window.location.reload()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete category', variant: 'destructive' })
    }
  }

  const openAddModal = () => {
    setFormData({ name: '', slug: '', icon: '' })
    setIsAddOpen(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setFormData({ name: cat.name, slug: cat.slug, icon: cat.icon || '' })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openAddModal} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icon</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Tag className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm text-muted-foreground">No categories found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-medium">{cat.name}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{cat.slug}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{cat.icon || '—'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(cat)}>
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                          <Trash2 className="h-4 w-4 text-red-500/80 hover:text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background rounded-xl shadow-xl border border-border/60 p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Web Development"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. web-development"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (Lucide name or emoji)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. Code, Monitor"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Category'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-background rounded-xl shadow-xl border border-border/60 p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon (Lucide name or emoji)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Save Changes'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
