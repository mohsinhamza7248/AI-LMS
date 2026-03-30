import Link from 'next/link'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Platform: [
    { label: 'Courses', href: '/courses' },
    { label: 'AI Tutor', href: '/ai-tutor' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-card/40 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 pb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
              <div className="flex h-10 w-24 items-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain object-left" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering your future with next-gen AI-powered learning. Master real-world skills with interactive, expert-led courses.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-sm font-semibold mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 opacity-50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Parth LMS. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            Crafted with <Sparkles className="h-3.5 w-3.5 text-primary" /> for the future of learning
          </div>
        </div>
      </div>
    </footer>
  )
}
