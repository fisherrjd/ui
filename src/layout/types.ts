import type { Component } from 'vue'

export interface NavLink {
  to: string
  label: string
  icon?: Component
  /** small count at the end of the row, e.g. unread items */
  badge?: string | number
  /** tooltip */
  title?: string
}

export interface NavSection {
  /** small caps heading over the links, e.g. NAVIGATE, FEEDS */
  label: string
  links: NavLink[]
}
