import twilio from 'twilio'

const JOACHIM_PHONE = '+19547742764'

export async function sendSMS(message: string) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: JOACHIM_PHONE,
  })
}
