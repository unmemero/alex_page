// functions/submit.js

export async function onRequest(context) {
    // Only allow POST requests
    if (context.request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const formData = await context.request.json();
        const { name, email, message } = formData;

        // --- Get secrets from Cloudflare environment ---
        // You must set these in your Cloudflare Pages project settings
        const RESEND_API_KEY = context.env.RESEND_API_KEY;
        const CONTACT_EMAIL = context.env.CONTACT_EMAIL;
        const MY_EMAIL = context.env.MY_EMAIL;
        const CONTACT_SUBJECT = context.env.CONTACT_SUBJECT || 'New Contact Form Submission | Searching for Lucet';

        if (!RESEND_API_KEY || !CONTACT_EMAIL) {
            console.error('Missing RESEND_API_KEY or CONTACT_EMAIL environment variables');
            return new Response('Server configuration error.', { status: 500 });
        }

        // --- Payload for Resend API ---
        const resendPayload = {
            from: `Form Submission <${CONTACT_EMAIL}>`,
            to: [MY_EMAIL],
            subject: CONTACT_SUBJECT,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        };

        // --- Send email to admin ---
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify(resendPayload),
        });

        if (!resendResponse.ok) {
            const errorData = await resendResponse.json();
            console.error('Resend API Error:', errorData);
            return new Response('Failed to send email.', { status: 500 });
        }
        
        // --- Send confirmation email to user ---
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `A Friend <${CONTACT_EMAIL}>`,
                to: [email],
                subject: 'We\'ll get back to you soon | Searching for Lucet',
                html: `
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
                    <p>Best regards,<br>- A friend</p>
                `
            }),
        });


        return new Response(JSON.stringify({ message: 'Form submitted successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error processing form submission:', error);
        return new Response('An error occurred.', { status: 500 });
    }
}