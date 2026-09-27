import type { Me } from "../types/types"

interface ReviewPageProps {
  userInfo: Me;
}

export default function ReviewPage({ userInfo }: ReviewPageProps) {
    const user = userInfo
  return (
    <div>{user}</div>
  )
}
