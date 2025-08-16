'use client'
import { ArrowLeft, CircleAlertIcon, MailIcon } from "lucide-react";
import DPImage from '../../../public/logo.webp'
import Image from "next/image";


const WhiteCheckout = () => {
    return (
        <div className="lg:flex gap-3  w-full h-full justify-center m-auto" >
            <div className="bg-[#1A1A2E] text-white w-full lg:h-screen p-3 grid lg:items-start lg:justify-end gap-3 " >

                <div className="grid gap-6 mt-6 p-3 " >
                    <div className="flex gap-2 items-center" >
                        <ArrowLeft color="#ffffff" width={20} />
                        <Image src={DPImage} className="rounded-full w-9" />
                        <p className=" lg:text-sm/relaxed text-[11px] " > DROP PAGAMENTOS & SERVICOS DIGITAIS, LDA</p>
                    </div>

                    <div>
                        <p className="text-white/60" >Pagar "Starter Plan"</p>
                        <p className="font-[600] text-3xl" >50,00 MT</p>
                    </div>

                    <div>
                        <p className="flex justify-between" >
                            <span>Starter Plan</span>
                            <span>50,00 MT</span>
                        </p>
                    </div>
                    <hr className="text-[silver]" />

                    <div className="lg:block hidden" >
                        <p className="flex justify-between" >
                            <span>Subtotal</span>
                            <span>50,00 MT</span>
                        </p>

                        <button className="bg-[#1A1A1A] p-2 rounded-sm hover:bg-[#333333]" >
                            Cupom de desconto
                        </button>

                        <p className="flex justify-between" >
                            <span className="flex gap-2" >Importo <CircleAlertIcon width={15} /></span>
                            <span>0,00 MT</span>
                        </p>

                        <hr className="text-[silver]" />

                        <p className="flex justify-between">
                            <span>Total a pagar</span>
                            <span>5,00 MT</span>
                        </p>
                    </div>


                </div>

            </div>


            <div className="bg-white text-[#303051] flex-col  w-full lg:h-screen p-3 
            grid-cols-1 items-start justify-start gap-3" >
                <p className="font-[600] mt-5" >Selecione um metodo de pagamento</p>


                <div>
                    <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900">Seu mail</label>
                    <div className="relative mb-6" >
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none" >
                            <MailIcon width={20} color="#000000" />
                        </div>
                        <input type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  block  ps-10 p-2.5 outline-none" />
                    </div>
                </div>


                <div>
                    <div className='grid gap-3' >
                        <div className='flex gap-3 justify-center items-center ring-2 ring-[silver] px-3 rounded-md  hover:ring-blue-400 ' >
                            <i className="bi bi-telephone"></i>
                            <input className='px-4 py-3 w-full outline-none text-[17px] rounded-md' type="number" placeholder='Numero Mpesa' />
                        </div>
                        <button
                            type="submit" className="flex justify-center h-14 items-center  text-white bg-[#FF0000] hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Pagar com Mpesa</button>
                    </div>
                </div>


                <div className=" text-center text-[11px] text-[silver]" >
                    <p className="w-100 text-center " >
                        Ao confirmar a inscrição, o senhor concede permissão à DROP PAGAMENTOS & SERVICOS DIGITAIS, LDA. para efetuar cobranças conforme as condições estipuladas, até que ocorra o cancelamento.
                    </p>
                    <p className="text-center" >Powered by DROPAY </p>
                </div>
            </div>


        </div>
    )
}

export default WhiteCheckout;