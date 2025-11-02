import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateMathProblem(topic: string): Promise<string> {
  const prompt = `
    Act as an expert math teacher. 
    Generate a single, interesting high school or early college level math problem based on the topic: "${topic}".
    The problem should include a clear question.
    
    **Formatting Rules (Very Important):**
    1. Use LaTeX for ALL mathematical formulas, variables, and symbols.
    2. For inline math, enclose expressions in single dollar signs. Example: $f(x) = x^2 - 2x + 1$.
    3. For block display equations, enclose them in double dollar signs. Example: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
    4. For Greek letters, use the correct LaTeX command. For example, for rho use \\rho, for pi use \\pi. Do NOT write things like "$rho$". The command must be inside the dollar signs, like so: $\\rho$.

    Do not include the solution. Just provide the problem statement.
    Keep the problem concise and formatted as a single block of text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating math problem:", error);
    return "Sorry, I couldn't generate a problem at the moment. Please check the API key and network connection.";
  }
}
