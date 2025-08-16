"use client"
import { useEffect, useState } from "react";

const ThirdPage = () => {
    const [conteudo, setConteudo] = useState("");

    useEffect(() => {
        console.log("Carregando conteúdo da página...");
        fetch("/api/proxy")
            .then((res) => res.text()) // pega como texto (HTML)
            .then((html) => {
                console.log("Conteúdo carregado:", html);
                setConteudo(html);
            })
            .catch((err) => console.log("Erro ao carregar:", err));
    }, []);


    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-4">Conteúdo da Página</h1>
                <div dangerouslySetInnerHTML={{ __html: conteudo }} />
            </div>
        </div>
    )
}

export default ThirdPage