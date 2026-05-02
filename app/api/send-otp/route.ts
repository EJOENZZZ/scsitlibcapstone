import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const { error }: { error?: Error } = await transporter.sendMail({
    from: `"SCSIT Library" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification Code",
    html: `<div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:16px">
      <h2 style="color:#1e293b;margin-bottom:8px">Email Verification</h2>
      <p style="color:#64748b;margin-bottom:24px">Enter this code to verify your new email address:</p>
      <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;letter-spacing:12px;font-size:36px;font-weight:bold;color:#1e293b">${code}</div>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>`,
  }).then(() => ({})).catch((e: Error) => ({ error: e }));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
