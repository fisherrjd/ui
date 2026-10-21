import type { Component } from 'vue'

export interface NavLink {
  to: string
  label: string
  icon?: Component
  /** small count at the end of the row, e.g. unread items */
  badge?: string | number
  /** tooltip */
  title?: string
  /** more path prefixes that count as this link, e.g. ['/checklist'] for a
   *  page reached from it */
  match?: string[]
}

export interface NavSection {
  /** small caps heading over the links, e.g. NAVIGATE, FEEDS */
  label: string
  links: NavLink[]
}
