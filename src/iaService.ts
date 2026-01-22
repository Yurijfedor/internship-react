export async function askAi(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "assistant", content: "You are a helpful assistent." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  console.log(data);

  return data.choices[0].message.content;
}

export async function askAIJSON(
  prompt: string,
): Promise<Record<string, unknown>> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns only JSON. No markdown. No explanations. ",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  // AI повертає текст → перетворюємо на JSON
  return JSON.parse(data.choices[0].message.content);
}
