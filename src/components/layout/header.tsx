'use client'

import { User } from '@supabase/supabase-js'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  user: User | null
  title?: string
}

export function Header({ user, title }: HeaderProps) {
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex-1">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <Button asChild size="sm" className="gap-2">
          <Link href="/dashboard/leads/new">
            <Plus className="h-4 w-4" /> Add Lead
          </Link>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
