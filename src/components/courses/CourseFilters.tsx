'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface CourseFiltersProps {
  categories: Category[]
  availableSkills: string[]
}

export function CourseFilters({ categories, availableSkills }: CourseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [skill, setSkill] = useState(searchParams.get('skill') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl({ search, skill, category })
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const updateUrl = (params: { search: string, skill: string, category: string }) => {
    const url = new URL(window.location.href)
    if (params.search) url.searchParams.set('search', params.search)
    else url.searchParams.delete('search')
    
    if (params.skill && params.skill !== 'All Levels') url.searchParams.set('skill', params.skill)
    else url.searchParams.delete('skill')

    if (params.category && params.category !== 'all') url.searchParams.set('category', params.category)
    else url.searchParams.delete('category')

    router.push(url.pathname + url.search)
  }

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    updateUrl({ search, skill, category: val })
  }

  const handleSkillChange = (val: string) => {
    setSkill(val)
    updateUrl({ search, skill: val, category })
  }

  const skillsList = ['All Levels', ...availableSkills]

  return (
    <div className="flex flex-col gap-8 w-full mb-8 z-10 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2.5 rounded-full border border-border/60 bg-background text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start border-t border-border/40 pt-6">
        {/* Category Filter */}
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                category === '' || category === 'all'
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-transparent text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  category === c.id
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-transparent text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Level Filter */}
        <div className="flex flex-col gap-3 flex-1 md:max-w-[400px]">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Skill Level</h3>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((s) => (
              <button
                key={s}
                onClick={() => handleSkillChange(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  (skill === s) || (skill === '' && s === 'All Levels')
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'bg-transparent text-muted-foreground border-border/60 hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
