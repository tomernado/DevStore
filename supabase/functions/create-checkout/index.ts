import Stripe from 'https://esm.sh/stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { cart, successUrl, cancelUrl } = await req.json()

    // Create Stripe Checkout Session with actual cart items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cart.map((item: { nameHe: string; image: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'ils',
          product_data: {
            name: item.nameHe,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // agorot
        },
        quantity: item.quantity,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    // Send order notification email via EmailJS REST API
    const emailjsServiceId = Deno.env.get('EMAILJS_SERVICE_ID')
    const emailjsTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID')
    const emailjsPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY')

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      const total = cart.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)
      const itemsList = cart.map((i: { nameHe: string; quantity: number }) => `${i.nameHe} ×${i.quantity}`).join('\n')

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: 'tomernado1233@gmail.com',
            total: `₪${total.toLocaleString('he-IL')}`,
            items: itemsList,
          },
        }),
      }).catch(() => {
        // Email failure shouldn't block checkout
      })
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
