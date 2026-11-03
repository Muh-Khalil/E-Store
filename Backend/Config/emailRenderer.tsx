import { render } from "@react-email/components"
import OrderConfirmation from "../emails/OrderConfirmation.js"
import PasswordReset from "../emails/PasswordReset.js"
import WelcomeEmail from "../emails/WelcomeEmail.js"
import nodemailer from "nodemailer"

const getTransporter = () => {
  const port = Number(process.env.SMTP_PORT) || 587
  return nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port,
    secure: port === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
}

export async function sendOrderConfirmation(params: Parameters<typeof OrderConfirmation>[0]) {
  const html = await render(<OrderConfirmation {...params} />)
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Benora Store" <${process.env.EMAIL_USER}>`,
    to: params.address.email!,
    subject: `Order confirmation - ${params.orderId}`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, name: string | undefined, resetLink: string) {
  const html = await render(<PasswordReset name={name} resetLink={resetLink} />)
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Benora Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html,
  })
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const html = await render(<WelcomeEmail name={name} />)
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Benora Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Benora!",
    html,
  })
}
