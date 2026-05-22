import { Suspense } from 'react'
import HomePage, { HomeSuspenseFallback } from './home-client'

export default function Page() {
  return (
    <Suspense fallback={<HomeSuspenseFallback />}>
      <HomePage />
    </Suspense>
  )
}
