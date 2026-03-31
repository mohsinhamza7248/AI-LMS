import { Navbar } from '@/components/navigation/Navbar'
import { getCategoryList } from '@/actions/admin'
import { CategoryManager } from '@/components/admin/CategoryManager'

export default async function AdminCategoriesPage() {
  const categories = await getCategoryList()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Categories</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add, update, or remove course categories.{' '}
              <span className="font-medium text-foreground">{categories.length} categories.</span>
            </p>
          </div>
        </div>

        <CategoryManager initialCategories={categories} />
      </div>
    </div>
  )
}
