'use client'
import Image from "next/image"
import successIco from '../../../public/sucess-2.png'
import { useSearchParams } from "next/navigation"
import { Suspense } from 'react';



function SuccessContent() {
    const searchParams = useSearchParams();
    const email_ = searchParams.get('email');

    return (
        <div class="grid justify-center items-center gap-6 p-5 text-[#242424] bg-white ">

            <Image className="w-15 self-center justify-self-center" src={successIco} alt="sucess" />

            <p class="font-bold text-center text-[20px]">Pagamento realizado com sucesso</p>

            <p>O seu pagamento foi completado e enviado para o endereco de e-mail: <strong class="payer-email" >{email_}</strong></p>

            <a href="mailto:droppaymentsinc@gmail.com" class="bg-[#6528E0] rounded-md text-white py-3 px-5 text-center" >Ok</a>

            <div class="flex justify-center fixed left-0 right-0 bottom-0 gap-2 p-3 text-[14px] text-center bg-white">
                <p> <i class="bi bi-lock-fill"></i> Pagamento 100% seguro </p>
                <p> Powered by <strong>DROP PAY</strong></p>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}