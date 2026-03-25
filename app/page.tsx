import { Suspense } from 'react'
import HomePage, { HomeSuspenseFallback } from './home-client'

/** Avoid stale static shell on Vercel; pairs with Suspense for useSearchParams */
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<HomeSuspenseFallback />}>
      <HomePage />
    </Suspense>
  )
}
