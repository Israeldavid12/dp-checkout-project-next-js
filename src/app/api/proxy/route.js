
export async function GET() {
  try {
    const res = await fetch("https://paysuite.tech/checkout/4fb3590e-45ec-4c5c-aa74-98fa36e6d3ee");
    const html = await res.text();
    console.log("Conteúdo carregado:", html);

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new Response("Erro ao buscar conteúdo", { status: 500 });
  } 
}
