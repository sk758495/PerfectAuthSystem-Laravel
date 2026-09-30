<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 500px; background-color: #0f172a; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 36px 36px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
                            <div style="display: inline-block; width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #06b6d4); line-height: 48px; text-align: center; font-size: 22px; font-weight: bold; color: #ffffff; margin-bottom: 12px;">
                                &#128737;
                            </div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                Perfect<span style="color: #06b6d4;">Auth</span>
                            </h1>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">
                                Email Verification
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 36px 36px 28px; text-align: center;">
                            <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #ffffff;">
                                Verify Your Email Address
                            </h2>
                            <p style="margin: 0 0 28px; font-size: 14px; line-height: 22px; color: #94a3b8;">
                                Use the 6-digit verification code below to complete your registration or login.
                            </p>

                            <!-- OTP Box -->
                            <div style="display: inline-block; background-color: #020617; border: 2px solid #06b6d4; border-radius: 16px; padding: 18px 36px; margin-bottom: 28px;">
                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #06b6d4; display: block;">
                                    {{ $otp }}
                                </span>
                            </div>

                            <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">
                                This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #64748b;">
                                If you did not request this code, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 36px 28px; text-align: center; border-top: 1px solid #1e293b; background-color: #090d16;">
                            <p style="margin: 0; font-size: 11px; color: #475569;">
                                &copy; {{ date('Y') }} PerfectAuth. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
