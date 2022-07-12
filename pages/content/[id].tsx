import { useRouter } from 'next/router'

const Content = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Content: {id}</p>
}

export default Content
