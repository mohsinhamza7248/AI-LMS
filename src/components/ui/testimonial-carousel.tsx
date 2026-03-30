'use client'

import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: "Rahul Verma",
    role: "JEE Aspirant",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
    text: "The AI tutor integrated into the courses is a game-changer. It explains complex physics concepts better than anywhere else I've seen! It feels like having a personal mentor 24/7.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    text: "The Next.js SaaS bundle was incredibly thorough. I was able to launch my own startup's MVP within just 3 weeks of enrolling. The instructors are world-class professionals.",
    rating: 5
  },
  {
    id: 3,
    name: "Ankit Desai",
    role: "High School Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    text: "Very polished platform. The real-time feedback during live batches and the rich dashboard make learning highly addictive. I've improved my grades significantly.",
    rating: 5
  },
  {
    id: 4,
    name: "Aman Gupta",
    role: "Data Scientist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
    text: "The machine learning curriculum is second to none. The interactive notebooks and code grading helped me master concepts that used to confuse me for months.",
    rating: 4
  },
  {
    id: 5,
    name: "Neha Patel",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop",
    text: "Aesthetically, this is the most pleasing learning platform I've ever used. The courses on product design genuinely elevated my portfolio to the next level.",
    rating: 5
  },
  {
    id: 6,
    name: "Karan Singh",
    role: "Freelance Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1887&auto=format&fit=crop",
    text: "I was skeptical about taking another bootcamp, but the instructor feedback here is deeply personalized. It's the best investment I've made in myself this year.",
    rating: 5
  },
  {
    id: 7,
    name: "Meera Reddy",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    text: "The platform's pacing is exceptional. It respects your time while ensuring you master every critical concept before moving forward.",
    rating: 5
  },
  {
    id: 8,
    name: "Vikram Joshi",
    role: "Cloud Architect",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
    text: "A masterclass in modern education. The seamless mix of video and text-based interactive lessons kept me engaged from start to finish.",
    rating: 5
  }
]

export function TestimonialCarousel() {
  return (
    <div className="relative w-full max-w-[100vw] overflow-hidden py-14">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      <div className="flex w-full fade-edges">
        <div className="flex animate-marquee hover:paused gap-8">
          {/* Scroll Track 1 */}
          <div className="flex shrink-0 gap-8">
            {testimonials.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>

          {/* Scroll Track 2 (Duplicate for seamless scroll) */}
          <div className="flex shrink-0 gap-8" aria-hidden="true">
            {testimonials.map((review) => (
              <TestimonialCard key={`dup-${review.id}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialCard({ review }: { review: typeof testimonials[0] }) {
  return (
    <Card className="relative w-[380px] sm:w-[500px] border-border/40 bg-card/60 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-primary/5 transition-all hover:border-primary/30 hover:bg-card hover:-translate-y-2 group overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
      
      <Quote className="absolute top-6 right-8 h-12 w-12 text-primary/5 group-hover:text-primary transition-all duration-700 rotate-180" />
      
      <CardContent className="p-0 flex flex-col h-full relative z-10">
        <div className="flex items-center gap-1.5 mb-8">
          {[...Array(5)].map((_, j) => (
            <Star 
              key={j} 
              className={`h-4.5 w-4.5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} transition-transform group-hover:scale-110`}
              style={{ transitionDelay: `${j * 100}ms` }}
            />
          ))}
          <span className="ml-2 text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-widest">{review.rating.toFixed(1)}</span>
        </div>
        
        <p className="text-xl sm:text-2xl font-serif italic text-foreground tracking-tight mb-10 leading-relaxed grow">
          “{review.text}”
        </p>
        
        <div className="flex items-center gap-6 mt-auto">
          <Avatar className="h-16 w-16 border-2 border-primary/20 ring-4 ring-primary/5 group-hover:ring-primary/10 transition-all">
            <AvatarImage src={review.avatar} alt={review.name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {review.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h4 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{review.name}</h4>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{review.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
