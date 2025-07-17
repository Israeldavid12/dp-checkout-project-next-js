'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/0')
  }, [router])

  return (
    <div className="flex justify-center items-center w-[100vw] h-full" >
      {/* <h1>DP-CHECKOUT</h1> */}
    </div>
  )
}

