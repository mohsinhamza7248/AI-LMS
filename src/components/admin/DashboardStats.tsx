import { BarChart3, Users, BookOpen, DollarSign, TrendingUp, GraduationCap } from 'lucide-react'

export function DashboardStats({ 
  stats 
}: { 
  stats: { students: number, tutors: number, courses: number, revenue: number } 
}) {
  const cards = [
    { title: 'Total Students', value: stats.students.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Total Tutors', value: stats.tutors.toString(), icon: GraduationCap, color: 'text-amber-600' },
    { title: 'Active Courses', value: stats.courses.toString(), icon: BookOpen, color: 'text-purple-600' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <div key={stat.title} className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
        </div>
      ))}
    </div>
  )
}
