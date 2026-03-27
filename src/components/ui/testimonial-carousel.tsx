'use client'

import { Star, Quote } from 'lucide-react'

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
    <div className="relative w-full max-w-[100vw] overflow-hidden py-10">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      {/* Marquee Wrapper */}
      <div className="flex w-full fade-edges">
        <div className="flex animate-marquee group">
          {/* Scroll Track 1 */}
          <div className="flex shrink-0 gap-8 pr-8 group-hover:[animation-play-state:paused]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>

          {/* Scroll Track 2 (Duplicate for seamless scroll) */}
          <div className="flex shrink-0 gap-8 pr-8 group-hover:[animation-play-state:paused]" aria-hidden="true">
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
    <div className="relative w-[380px] sm:w-[450px] group rounded-3xl border bg-card/50 backdrop-blur-md p-8 sm:p-10 shadow-lg shadow-primary/5 transition-all hover:bg-card">
      <Quote className="absolute top-6 left-6 h-10 w-10 text-primary/10 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, j) => (
            <Star 
              key={j} 
              className={`h-4 w-4 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} 
            />
          ))}
        </div>
        
        <p className="text-lg sm:text-xl font-serif italic text-foreground/90 mb-8 leading-relaxed flex-grow">
          "{review.text}"
        </p>
        
        <div className="flex items-center gap-4 mt-auto">
          <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted shrink-0">
            <img src={review.avatar} alt={review.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-[1rem]">{review.name}</h4>
            <p className="text-sm text-primary font-medium">{review.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
