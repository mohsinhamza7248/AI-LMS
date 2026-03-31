import { BarChart3, Users, BookOpen, DollarSign, GraduationCap, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function DashboardStats({
  stats
}: {
  stats: { students: number; tutors: number; courses: number; revenue: number }
}) {
  const cards = [
    {
      title: 'Total Students',
      value: stats.students.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: '+12% this month',
    },
    {
      title: 'Total Tutors',
      value: stats.tutors.toLocaleString(),
      icon: GraduationCap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      trend: `${stats.tutors} active`,
    },
    {
      title: 'Active Courses',
      value: stats.courses.toLocaleString(),
      icon: BookOpen,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      trend: `${stats.courses} published`,
    },
    // {
    //   title: 'Total Revenue',
    //   value: `₹${stats.revenue.toLocaleString()}`,
    //   icon: TrendingUp,
    //   color: 'text-emerald-500',
    //   bg: 'bg-emerald-500/10',
    //   trend: 'Lifetime earnings',
    // },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <Card key={stat.title} className="border-border/60 bg-card hover:shadow-md hover:border-border transition-all duration-200 p-0">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-xs text-muted-foreground/70 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
