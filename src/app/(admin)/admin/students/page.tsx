import { Navbar } from '@/components/navigation/Navbar'
import { getStudentList } from '@/actions/admin'
import { Users, Mail, Calendar, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminStudentsPage() {
  const students = await getStudentList()

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-muted-foreground">Manage and monitor student engagement across the platform.</p>
        </div>

        <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-6 font-bold text-sm">Student</th>
                  <th className="p-6 font-bold text-sm">Email</th>
                  <th className="p-6 font-bold text-sm text-center">Enrollments</th>
                  <th className="p-6 font-bold text-sm">Joined Date</th>
                  <th className="p-6 font-bold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground italic">
                      No students found in the database.
                    </td>
                  </tr>
                ) : (
                  students.map((student: any) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {student.avatar ? <img src={student.avatar} alt="" className="h-full w-full object-cover" /> : <Users className="h-5 w-5 text-primary" />}
                          </div>
                          <span className="font-bold">{student.name || 'Anonymous User'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 opacity-40" />
                          {student.email || 'No email provided'}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                           <BookOpen className="h-3 w-3 opacity-40" />
                           <span className="text-sm font-bold">{student.enrollmentsCount}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 opacity-40" />
                          {formatDate(student.joined)}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
