import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CheckoutSuccessRedirect({ params }: Props) {
  const { id } = await params
  redirect(`/order-confirmation/${id}`)
}
