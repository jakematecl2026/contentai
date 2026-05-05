const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY

async function callClaude(prompt, maxTokens = 1200) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await res.json()
  let text = ''
  data.content?.forEach(b => { if (b.type === 'text') text += b.text })
  return text.replace(/```json|```/g, '').trim()
}

function brandContext(brand) {
  if (!brand) return 'Eres un experto en marketing digital y creación de contenido.'
  return `Eres ${brand.name}${brand.specialty ? ', ' + brand.specialty : ''}${brand.client_ideal ? ', que ayuda a ' + brand.client_ideal : ''}${brand.client_result ? ' a ' + brand.client_result : ''}. Tono: ${brand.tone || 'directo, cercano, con autoridad'}${brand.avoid_words ? '. Nunca uses: ' + brand.avoid_words : ''}.`
}

export async function generateCategories(brand) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Genera exactamente 10 categorías de contenido para Instagram adaptadas específicamente al negocio descrito. Cada categoría debe ser relevante para el nicho: ${brand?.niche || 'marketing digital'}.

Responde SOLO con JSON válido, sin texto adicional:
{"categories":[{"id":1,"name":"nombre corto","desc":"descripción de una línea","ideas":["idea 1","idea 2","idea 3","idea 4","idea 5","idea 6"]}]}`

  const raw = await callClaude(prompt, 2000)
  const parsed = JSON.parse(raw)
  return parsed.categories
}

export async function generateCarousel(brand, idea) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Crea exactamente 10 slides para un carrusel de Instagram sobre: "${idea}"

Estructura obligatoria:
Slide 1 - HOOK: Frase que detiene el scroll. Máx 10 palabras. Sin "Descubre" ni "¿Sabías que?".
Slide 2 - PROBLEMA: El dolor que el cliente reconoce como propio.
Slide 3 - COSTO: Qué le cuesta seguir con ese problema.
Slide 4 - CAMBIO: El insight que cambia su perspectiva.
Slide 5 - SISTEMA 1: Primer paso accionable.
Slide 6 - SISTEMA 2: Segundo paso específico.
Slide 7 - SISTEMA 3: Tercer paso que cierra la lógica.
Slide 8 - RESULTADO: Antes y después concreto.
Slide 9 - DECISIÓN: Tensión que activa la acción.
Slide 10 - CTA: Una sola acción (guardar/comentar/DM).

Reglas: máx 3 líneas por slide, tono directo sin clichés.

Responde SOLO JSON válido:
{"slides":[{"n":1,"name":"HOOK","text":"..."},{"n":2,"name":"PROBLEMA","text":"..."},{"n":3,"name":"COSTO","text":"..."},{"n":4,"name":"CAMBIO","text":"..."},{"n":5,"name":"SISTEMA 1","text":"..."},{"n":6,"name":"SISTEMA 2","text":"..."},{"n":7,"name":"SISTEMA 3","text":"..."},{"n":8,"name":"RESULTADO","text":"..."},{"n":9,"name":"DECISIÓN","text":"..."},{"n":10,"name":"CTA","text":"..."}]}`

  const raw = await callClaude(prompt, 1200)
  return JSON.parse(raw).slides
}

export async function generateCaption(brand, topic, objetivo, tono) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Escribe un caption de Instagram sobre: "${topic}". Objetivo: ${objetivo}. Tono: ${tono}.

Responde SOLO JSON válido:
{"feed":"caption largo max 120 palabras con pregunta al final","story":"versión corta max 25 palabras","hashtags":"5 hashtags: 2 masivos 1M+, 2 de nicho 50k-200k, 1 de marca"}`

  const raw = await callClaude(prompt, 600)
  return JSON.parse(raw)
}

export async function generateReel(brand, topic) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Escribe un script de Reel de Instagram de 30-45 segundos sobre: "${topic}".

Estructura:
[0-3s] Hook visual + frase de apertura que para el scroll
[4-30s] 3 puntos concretos y accionables  
[31-45s] Cierre + CTA claro

Incluye entre corchetes lo que se ve en pantalla. Tono natural, como si hablaras directo a cámara. No para memorizar.`

  return await callClaude(prompt, 800)
}

export async function generatePlan(brand) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Crea un plan de contenidos de 4 semanas para Instagram. Por cada semana: 3 posts. Por cada post: día, formato (Carrusel/Reel/Imagen), título impactante, gancho de una línea, objetivo (Guardados/Comentarios/DMs/Alcance).

Responde SOLO JSON válido:
{"weeks":[{"week":1,"theme":"tema de la semana","posts":[{"day":"Lunes","format":"Carrusel","title":"...","hook":"...","objetivo":"Guardados"}]}]}`

  const raw = await callClaude(prompt, 1800)
  return JSON.parse(raw).weeks
}

export async function generateSequence(brand) {
  const bp = brandContext(brand)
  const prompt = `${bp}

Crea una secuencia de 10 posts ordenados por lógica algorítmica progresiva para Instagram. Fase 1 (posts 1-3): prueba algorítmica. Fase 2 (posts 4-7): retención y autoridad. Fase 3 (posts 8-10): conversión directa.

Por cada post: número, fase, formato, título, señal prioritaria a medir, por qué en ese orden.

Responde SOLO JSON válido:
{"posts":[{"n":1,"fase":"Prueba","format":"Carrusel","title":"...","signal":"Guardados","why":"..."}]}`

  const raw = await callClaude(prompt, 1400)
  return JSON.parse(raw).posts
}
