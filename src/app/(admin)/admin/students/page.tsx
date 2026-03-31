import { Navbar } from '@/components/navigation/Navbar'
import { getStudentList } from '@/actions/admin'
import { Users, Mail, Calendar, BookOpen, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function AdminStudentsPage() {
  const students = await getStudentList()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Student Directory</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor and manage student engagement.{' '}
              <span className="font-medium text-foreground">{students.length} students.</span>
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2.5 rounded-full border border-border/60 bg-background text-sm w-full sm:w-[240px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="border-border/60 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Enrollments</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-sm text-muted-foreground">No students found yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {student.name?.slice(0, 2).toUpperCase() || 'AN'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold truncate max-w-[120px]">
                            {student.name || 'Anonymous User'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{student.email || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-semibold">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          {student.enrollmentsCount}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatDate(student.joined)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 font-semibold">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
