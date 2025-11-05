'use client'
import styles from '../checkout.layout.module.css'
import mpesaicon from '../../../public/mpesa.png'
import emolaicon from '../../../public/emola.png'
import paypalIcon from '../../../public/paypal.png'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import axios from 'axios'
import TransLoad from '../_components/TransLoading';
import { useRouter } from 'next/navigation'
import PayPalCheckout from './PayPalCheckout'
import { useSearchParams } from "next/navigation";
// import { setFbCookiesFromFbclid } from '@/lib/facebookCookies';


const test_mpesa_enpoint = 'http://localhost:3000/api/payment/mpesa/live'
const live_mpesa_enpoint = 'https://payment.droopay.com/api/payment/mpesa/live'
const live_emola_enpoint = 'https://payment.droopay.com/api/payment/emola/live'
const test_emola_enpoint = 'http://localhost:3000/api/payment/emola/live'

const get_data_endppoint_test = 'http://localhost:4000/api/products/checkout-data'
const get_data_endppoint_live = 'https://api.droopay.com/api/products/checkout-data'


const granted_ids = ["124", "120"]


const ErrorMessage = () => {
    return (
        <div id="alert-2" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50  " role="alert">
            <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <div class="ms-3 text-sm font-medium">
                Falha ao processar o pagamento, por favor verifique o <a href="#" class="font-semibold underline hover:no-underline">saldo da sua conta</a>. e tente novamente.
            </div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8  dark:text-red-400 " data-dismiss-target="#alert-2" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
    )
}


const getBuyerIpAdress = async () => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data?.ip
    } catch (e) {
        return null
    }
}

const getBuyerCountry = async () => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data?.country_name
    } catch (e) {
        return null
    }
}


export default function FieldsCheckout({ id, productName, productPrice, sellerID, isManualPrice, token }) {
    const [type, setType] = useState('')
    const [formData, setFormData] = useState(null)
    const [doPaymentCount, setDoPaymentCount] = useState(0)
    const [paymentNumber, setPaymentNumber] = useState(null)
    const minLength = 1;
    const maxLength = 100;
    const [data, setData] = useState(null)
    const [runTrans, setRunTrans] = useState(false)
    const router = useRouter();
    const [manualPrice, setManualPrice] = useState(null)
    const [is_error, setError] = useState(null)
    const [email, setEmail] = useState(null)
    const [name, setName] = useState(null)
    const searchParams = useSearchParams();
    // const fbclid = searchParams.get("fbclid");
    const fbc = searchParams.get("fbc");
    const fbp = searchParams.get("fbp");
    // console.log("fbclid from URL:", fbclid);



    // const handleWhiteCheckout = async () => {
    //     try {
    //         if (!email) return setError("Por favor, insira seu e-mail antes de continuar");

    //         const url_endpoint = 'https://payment.droopay.com/api/payment/checkout/white/live'
    //         const response = await axios.post(url_endpoint, {
    //             id,
    //             buyer_email: email
    //         });
    //         const url = response.data?.url;
    //         router.push(url)
    //     } catch (e) {
    //         console.error("Error during white checkout:", e);
    //         setError("Falha ao processar o pagamento, por favor tente novamente");
    //     }
    // }

    useEffect(() => {
        const payload = {
            id: id
        };

        axios.post(get_data_endppoint_live, payload)
            .then(res => {
                setData(res.data);

            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        const defineEndpoint = () => {
            if (type.toLocaleLowerCase() === 'mpesa') {
                return live_mpesa_enpoint
            }
            if (type.toLocaleLowerCase() === 'emola') {
                return live_emola_enpoint
            }
        }

        async function handlePayment() {
            try {
                setRunTrans(true)
                const endpoint = defineEndpoint();

                // const { fbc, fbp } = setFbCookiesFromFbclid(fbclid)
                // console.log("fbp and fbc:", { fbp, fbc });

                const payload = {
                    form: {
                        token,
                        productName: productName,
                        manualPrice: manualPrice,
                        buyer: formData,
                        buyerCountry: await getBuyerCountry() || null,
                        paymentMethod: type.toLocaleLowerCase(),
                        paymentNumber: paymentNumber,
                        ip_adress: await getBuyerIpAdress(),
                        fbp: fbp || null,
                        fbc: fbc || null,
                    }
                }


                const response = await axios.post(endpoint, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const result = response.data;

                if (response.data && response.data.status == 201) {

                    router.push(`/success?email=${result?.buyer_email || ''}&type=${result?.type}&acess=${result?.acess_url}`);
                    setRunTrans(false)
                }

            } catch (err) {

                setRunTrans(false)
                setError("Falha ao processar o pagamento, por favor verifique o saldo da sua conta e tente novamente")
                return false
            }
        }


        if (doPaymentCount !== 0) {
            handlePayment()
        }
    }, [doPaymentCount])


    async function handleEmolaCheckout() {
        try {
            const endpoint = 'https://payment.droopay.com/api/payment/checkout/white/live'
            const payload = {
                id,
                price: productPrice,
            }

            const response = await axios.post(endpoint, payload);
            const url = response.data?.url;
            router.push(url)
        } catch (error) {
            console.log(error)
        }
    }



    function onSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        setFormData(data)
        setDoPaymentCount(doPaymentCount + 1)
    }




    function handleName(e) {
        setName((e.target.value).length)
        if ((e.target.value).length > 100) {
            e.target.value = ''
        }
    }

    return (
        <div className={styles.fields} >
            {runTrans && (
                <TransLoad type={type.toLocaleLowerCase()} number={paymentNumber} />
            )}
            {is_error && (
                <ErrorMessage />
            )}
            <form onSubmit={onSubmit}
                className='grid gap-3 w-full p-4 md:p-10 text-black' action="">
                {data?.product?.payer_name_field && (
                    <div className='w-full' >
                        <label className='' htmlFor="name">Seu nome *</label>
                        <input
                            minLength={minLength}
                            maxLength={maxLength}
                            onChange={handleName}
                            id='name'
                            name='name'
                            className='px-4 py-3 w-full outline-none ring-1 ring-[silver] text-black text-[14px] rounded-md hover:ring-blue-600 focus:ring-2 focus:ring-blue-500  mt-3'
                            type="text"
                            placeholder='Insira seu nome'
                            required />

                    </div>
                )}
                <div className='w-full' >
                    <label className='py-3' htmlFor="email">E-mail *</label>
                    <input
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        minLength={minLength}
                        maxLength={maxLength}
                        id='email'
                        className='px-4 py-3 w-full outline-none ring-1 ring-[silver] text-black text-[14px] rounded-md hover:ring-blue-600 focus:ring-2 focus:ring-blue-500 mt-3'
                        type="email"
                        placeholder='Insira seu e-mail'
                        required />
                </div>
                {!data?.payer_contact_field && (
                    <div className='w-full' >
                        <label className='' htmlFor="contact">Contacto *</label>
                        <input
                            name='contact'
                            minLength={minLength}
                            maxLength={maxLength}
                            id='contact' className='px-4 py-3 w-full outline-none ring-1 ring-[silver] text-black text-[17px] rounded-md hover:ring-2 hover:ring-blue-600' type="number" placeholder='Insira seu celular' />
                    </div>
                )}
                <hr className='text-[silver] my-4' />
                {isManualPrice && (
                    <div className='grid gap-2' >
                        <p>Insira o montante a pagar</p>
                        <div className='flex gap-3 justify-center items-center ring-1 ring-[silver] px-3 rounded-md hover:ring-2 hover:ring-blue-400 ' >
                            <i class="bi bi-currency-dollar"></i>
                            <input
                                min={5}
                                max={40000}
                                onChange={(e) => setManualPrice(e.target.value)} className='px-4 py-3 w-full outline-none text-[17px] rounded-md' type="number" placeholder='0.00' required />
                        </div>
                    </div>
                )}
                <div>
                    <p className='text-[14px] sm:text-[15px] font-[600] text-center text-black/75' >Selecione um metodo de pagamento</p>
                    <div className='flex gap-3 p-3 justify-center' >
                        <div className='flex  gap-4 p-2 justify-between w-full' >
                            <Image alt='image'
                                onClick={(e) => {
                                    setType('Mpesa') 
                                }}
                                className={`w-full object-contain h-20 rounded-lg hover:opacity-75
                           bg-red-600
                        ${type === "Mpesa" ? " ring-5 ring-blue-300 opacity-55  bg-[#F0F4FF]" : ""}`} src={mpesaicon} /> 
   
                            {/* EMOLA METHOD */}
                           {granted_ids.includes(id) && ( 
                           <Image
                                onClick={() => setType('eMola')}
                                // onClick={handleEmolaCheckout}
                                className={`w-full  h-20 object-contain rounded-lg hover:opacity-75 
                             bg-orange-500
                         ${type === "eMola" ? " ring-5 ring-blue-300 opacity-55  bg-[#EBF0FF]" : ""}`} src={emolaicon} /> 
                             )}  
                        </div>
                    </div>
                    <div className='grid gap-3 p-0 w-full ' >
                        {type === 'Mpesa' && (
                            <div className='grid gap-3' >
                                <div
                                    className="flex gap-3 justify-center items-center px-3  
                                        ring-2 ring-[silver]  focus-within:ring-blue-500 
                                     rounded-md"
                                >
                                    {/* <i className="bi bi-telephone"></i> */}
                                    <p className="font-[600] text-black/65">+258</p>
                                    <input
                                        onChange={(e) => setPaymentNumber(e.target.value)}
                                        className="px-4 py-3 w-full outline-none text-[17px]"
                                        type="number"
                                        placeholder="84/85XXXXXXX"
                                    />
                                </div>
                                <button
                                    type="submit" className="flex justify-center h-14 items-center w-full text-white bg-[#FF0000] hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Pagar com M-pesa</button>
                            </div>
                        )}
                        {type === 'eMola' && (
                            <div className='grid gap-3' >
                                <div className='flex gap-3 justify-center items-center ring-2 ring-[silver] px-3 rounded-md  hover:ring-blue-400 focus-within:ring-blue-500  ' >
                                    {/* <i className="bi bi-telephone"></i> */}
                                    <p className=' font-[600] text-black/65'>+258</p>
                                    <input onChange={(e) => setPaymentNumber(e.target.value)} className='px-4 py-3 w-full outline-none text-[17px] rounded-md' type="number" placeholder='86/87XXXXXXX' />
                                </div>
                                <button

                                    className="flex justify-center h-14 items-center w-full text-white bg-[#F9732C] hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">Pagar com e-Mola</button>

                            </div>

                        )}

                        {type === 'PayPal' && (
                            <PayPalCheckout id={id} productName={productName} />
                        )}
                        <p className='text-black text-[11px] text-center mt-8' >Powered By <span className='font-bold' >DROP PAY </span> © 2025 - Todos os direitos reservados - <a href="#">Duvidas sobre este produto</a></p>

                    </div>
                </div>

            </form>

        </div >
    )
}