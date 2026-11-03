import { Html, Head, Body, Container, Section, Text, Heading, Link, Tailwind } from "@react-email/components"

interface PasswordResetProps {
  name?: string
  resetLink: string
}

export default function PasswordReset({ name, resetLink }: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] bg-white p-8">
            <Heading className="text-2xl font-bold text-[#E8420A]">Reset your password</Heading>
            <Text className="text-gray-700">Hi {name || 'there'},</Text>
            <Text className="text-gray-700">Someone requested a password reset for your account. Click the link below to reset your password. This link expires in 1 hour.</Text>
            <Section className="text-center">
              <Link href={resetLink} className="inline-block rounded bg-[#E8420A] px-6 py-3 text-white no-underline">Reset Password</Link>
            </Section>
            <Text className="text-gray-500 text-sm mt-6">If you didn't request this, you can safely ignore this email.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
