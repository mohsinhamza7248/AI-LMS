import { Navbar } from '@/components/navigation/Navbar'
import { Building2, Plus, Globe, Shield, PieChart, Users, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminDashboard() {
  const tenants = [
    { id: 1, name: 'Demo Academy', slug: 'demo', plan: 'Enterprise', status: 'Active', revenue: '₹4,500' },
    { id: 2, name: 'Design Studio', slug: 'design', plan: 'Growth', status: 'Trial', revenue: '₹1,200' },
    { id: 3, name: 'Code Camp', slug: 'code', plan: 'Starter', status: 'Active', revenue: '₹2,800' },
  ]

  return (
    <div className="min-h-screen bg-stone-50/50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Super Admin Global Control</h1>
            <p className="text-muted-foreground text-lg mt-2">Oversee all tenants, subscriptions, and platform-wide analytics.</p>
          </div>
          
          <button className="flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-white font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
             <Plus className="h-5 w-5" />
             Create New Tenant
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-12">
           {[
             { title: 'Total Tenants', value: '42', icon: Building2, color: 'text-blue-500' },
             { title: 'Active Subs', value: '38', icon: Shield, color: 'text-green-500' },
             { title: 'Monthly Revenue', value: '₹24,500', icon: PieChart, color: 'text-purple-500' },
             { title: 'Total Users', value: '12k', icon: Users, color: 'text-amber-500' }
           ].map((stat, i) => (
             <div key={i} className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                   <div className={`p-4 rounded-2xl bg-muted/50 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-black">{stat.value}</h3>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Tenant List */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold px-2">Active Tenants</h2>
           <div className="grid gap-4">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-xl font-extrabold">{tenant.name}</h3>
                            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                               <div className="flex items-center gap-1.5 font-bold text-primary">
                                  <Globe className="h-4 w-4" />
                                  <span>{tenant.slug}.lms.com</span>
                               </div>
                               <div className="flex items-center gap-1.5 opacity-50 italic">
                                  <span>{tenant.plan} Plan</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-12">
                         <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${tenant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                               {tenant.status}
                            </span>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Revenue</p>
                            <p className="text-xl font-black text-neutral-800">{tenant.revenue}</p>
                         </div>
                         <button className="p-4 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all">
                            <ArrowUpRight className="h-6 w-6" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
