import { Html, Head, Body, Container, Section, Text, Heading, Link, Tailwind } from "@react-email/components"

interface WelcomeEmailProps {
  name?: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] bg-white p-8">
            <Heading className="text-2xl font-bold text-[#E8420A]">Welcome{name ? `, ${name}` : ''}!</Heading>
            <Text className="text-gray-700">Thank you for creating an account. We're excited to have you on board.</Text>
            <Text className="text-gray-700">Start exploring our latest collections and enjoy a seamless shopping experience.</Text>
            <Section className="text-center">
              <Link href={process.env.FRONTEND_URL || 'http://localhost:5173'} className="inline-block rounded bg-[#E8420A] px-6 py-3 text-white no-underline">Shop Now</Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
