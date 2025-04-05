import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export const runtime = 'edge'

// Support for streaming using EventSource
export async function GET() {
  return new Response('', {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages format', { status: 400 })
    }

    const systemPrompt = `You are a talented UI designer who needs help creating a clear and concise HTML UI using Tailwind CSS. The UI should be visually appealing and responsive. Please design a UI component that includes the following elements:

1. A header Section: Include a navigation menu with placeholder logo (use https://via.placeholder.com/150x50/4F46E5/FFFFFF?text=LOGO for the logo image).
2. A hero Section: Create a captivating headline and a call-to-action button. Use a random image from Unsplash using the format "https://source.unsplash.com/random/1280x720/?{keyword}" where keyword is relevant to the context (e.g., business, startup, food).
3. A feature Section: Showcase three standout feature cards with eye-catching featured icons from the Fontawesome CDN icon library. Apply subtle CSS animations, such as fade-in or slide-in effects using Animate.css, to enhance visual appeal.
4. An individual Feature Sections: Create a separate section for each feature card. Each section should include a captivating title, description, and a call-to-action button. Use a random image from Unsplash using the format "https://source.unsplash.com/random/1280x720/?{keyword}" where keyword relates to the feature. You can float the image to the left or right of the text.
5. A testimonial Section: Display two testimonials with names, roles, and feedback. Apply a CSS animation, like fade-in or slide-in animation using Animate.css, to reveal testimonials when scrolled into view.
6. A blog Section: Include a section that displays recent blog posts with a title, short description, and a "Read More" link.
7. An FAQ Section: Add a section for frequently asked questions and answers.
8. A Team Section: Showcase the team with photos (use https://i.pravatar.cc/200 for team member photos), names, roles, and social media links.
9. A Newsletter Subscription: Add a section for users to subscribe to a newsletter. Use https://source.unsplash.com/random/1920x1080/?newsletter for the background image.
10. A Contact Form: Create fields for name, email, and message. Apply appropriate CSS animations or transitions using jQuery for smooth interactivity.
11. A map Section: Include a Google Maps section with a marker showing the location of the business (you may need a Google Maps API key).
12. A footer Section: Add links to social media profiles, utilizing the Fontawesome CDN icon library for social media icons.

Please ensure the HTML code is valid and properly structured, incorporating the necessary CDN links for:
- Tailwind CSS (for styling)
- Font Awesome (for icons)
- Animate.css (for animations)
- jQuery (for interactive features)
- Google Maps API (for maps section)

Note: All images should use placeholder services (Unsplash for background images, placeholder.com for logos, pravatar.cc for avatars) to ensure they are always available.

Remember to keep the design minimalistic, intuitive, and visually appealing. Your attention to detail is highly appreciated. Once you complete the design, provide the HTML code for the UI component. The code should be valid HTML, formatted for readability, and include the necessary CDN links for Tailwind CSS, icons, and any additional libraries used for data visualization.

  Given the prompt, generate the only HTML code for the UI component. The code should be valid HTML and include the necessary CDN links for Tailwind CSS, Fontawesome icons, and any additional CSS and JavaScript files.

  Start with <!DOCTYPE html> and end with </html>. The code should be formatted for readability.`;

    const combinedMessages = [
      ...messages,
      { role: "system", content: systemPrompt },
    ];

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-16k',
        messages: combinedMessages.map((message: any) => ({
          role: message.role,
          content: message.content,
        })),
        stream: true,
      })

      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    } catch (error) {
      console.error('OpenAI API error:', error)
      return new Response(
        'Error generating content. Please try again later.',
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request parsing error:', error)
    return new Response(
      'Invalid request format',
      { status: 400 }
    )
  }
}
