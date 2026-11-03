import { Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column, Link, Tailwind } from "@react-email/components"

interface OrderConfirmationProps {
  orderId: string
  customerName?: string
  items: Array<{ name: string; price: number; quantity: number; size?: string }>
  amount: number
  address: { firstName?: string; lastName?: string; street?: string; city?: string; state?: string; country?: string; zipcode?: string; phone?: string; email?: string }
  paymentMethod: string
}

const formatCurrency = (amount: number) => `$${Number(amount || 0).toFixed(2)}`

export default function OrderConfirmation({ orderId, items, amount, address, paymentMethod }: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] bg-white p-8">
            <Heading className="text-2xl font-bold text-[#E8420A]">Thank you for your order</Heading>
            <Text className="text-gray-700">Your order has been received and is now being processed.</Text>
            
            <Section className="rounded-lg bg-[#FFF3EE] p-4">
              <Text className="m-0 text-sm text-gray-500">Order ID</Text>
              <Text className="m-0 font-medium">{orderId}</Text>
              <Text className="mt-3 m-0 text-sm text-gray-500">Payment Method</Text>
              <Text className="m-0 font-medium">{paymentMethod}</Text>
            </Section>

            <Heading as="h3" className="mt-6 text-lg font-semibold">Items</Heading>
            <Section>
              <Row className="border-b border-gray-200 pb-2 font-medium text-gray-500">
                <Column className="w-1/2">Product</Column>
                <Column className="w-1/6">Size</Column>
                <Column className="w-1/6">Qty</Column>
                <Column className="w-1/6 text-right">Total</Column>
              </Row>
              {items.map((item, i) => (
                <Row key={i} className="border-b border-gray-100 py-2">
                  <Column className="w-1/2">{item.name}</Column>
                  <Column className="w-1/6">{item.size || '-'}</Column>
                  <Column className="w-1/6">{item.quantity}</Column>
                  <Column className="w-1/6 text-right">{formatCurrency(item.price * item.quantity)}</Column>
                </Row>
              ))}
            </Section>

            <Text className="mt-4 text-right text-lg font-bold">Total: {formatCurrency(amount)}</Text>

            <Hr className="my-6" />

            <Heading as="h3" className="text-lg font-semibold">Delivery Address</Heading>
            <Text className="text-gray-700">
              {address.firstName} {address.lastName}<br />
              {address.street}<br />
              {address.city}, {address.state}<br />
              {address.country} {address.zipcode}<br />
              {address.phone}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
