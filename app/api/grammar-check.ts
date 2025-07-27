import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { text } = req.body

  const response = await fetch("https://api-inference.huggingface.co/models/vennify/t5-base-grammar-correction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `grammar: ${text}`,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Hugging Face API error:", error)
    return res.status(500).json({ error: "Failed to correct grammar" })
  }

  const result = await response.json()
  const corrected = result[0]?.generated_text || ""

  return res.status(200).json({ corrected })
}
