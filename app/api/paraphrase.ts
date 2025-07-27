import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { text } = req.body
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/Vamsi/T5_Paraphrase_Paws", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `paraphrase: ${text} </s>`,
      }),
    })

    const result = await response.json()

    if (result.error) return res.status(500).json({ error: result.error })

    const paraphrased = result[0]?.generated_text || "No output"
    res.status(200).json({ paraphrased })
  } catch (err) {
    res.status(500).json({ error: "Failed to paraphrase." })
  }
}
