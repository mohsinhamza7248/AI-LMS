import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background/50 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5 border-b border-border/50 pb-12">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl transition-colors hover:opacity-80">
              <div className="flex h-12 w-24 items-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain object-left" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Empowering your future with Next-Gen AI-powered learning. Master real-world skills with interactive, expert-led courses.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="/ai-tutor" className="hover:text-primary transition-colors">AI Tutor</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Parth LMS. All rights reserved.</p>
          <div className="flex items-center gap-1 font-medium">
            Crafted with <Sparkles className="h-4 w-4 text-primary" /> for the future of learning
          </div>
        </div>
      </div>
    </footer>
  )
}
