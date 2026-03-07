"use client";

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderConfirmedEmail({
  to,
  orderId,
  total,
}: {
  to: string;
  orderId: number;
  total: string;
}) {
  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order #${orderId} confirmed`,
    html: `
      <h2>Order Confirmed</h2>
      <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
      <p>Total: £${total}</p>
      <p>Thank you for your purchase!</p>
    `,
  });
}