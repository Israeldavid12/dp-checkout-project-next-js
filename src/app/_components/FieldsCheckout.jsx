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

const test_mpesa_enpoint = 'http://localhost:3000/api/payment/mpesa/live'
const live_mpesa_enpoint = 'https://payment.droopay.com/api/payment/mpesa/live'
const live_emola_enpoint = 'https://payment.droopay.com/api/payment/emola/live'
const test_emola_enpoint = 'http://localhost:3000/api/payment/emola/live'

const get_data_endppoint_test = 'http://localhost:4000/api/products/checkout-data'
const get_data_endppoint_live = 'https://api.droopay.com/api/products/checkout-data'



export default function FieldsCheckout({ id, productName, productPrice, sellerID, isManualPrice, token }) {
    const [type, setType] = useState('Mpesa')
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
        const getBuyerCountry = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();
                return data?.country_name
            } catch (e) {
                return null
            }
        }
        async function handlePayment() {
            try {
                setRunTrans(true)
                const endpoint = defineEndpoint();

                const payload = {
                    form: {
                        token,
                        productName: productName,
                        manualPrice: manualPrice,
                        buyer: formData,
                        buyerCountry: await getBuyerCountry() || null,
                        paymentMethod: type.toLocaleLowerCase(),
                        paymentNumber: paymentNumber
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
                setError("Falha ao processar o pagamento, por favor tente novamente")
                return false
            }
        }

        if (doPaymentCount !== 0) {
            handlePayment()
        }
    }, [doPaymentCount])


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
                <TransLoad type={type.toLocaleLowerCase()} />
            )}
            {is_error && (
                <p className='text-red-600 text-[16px] font-[600]' >Falha ao processar o pagamento, por favor tente novamente</p>
            )}
            <form onSubmit={onSubmit}
                className='grid gap-3 w-full p-4 md:p-10 text-black' action="">
                {data?.payer_name_field && (
                    <div className='w-full' >
                        <label className='' htmlFor="name">Seu nome completo *</label>
                        <input
                            minLength={minLength}
                            maxLength={maxLength}
                            onChange={handleName}
                            id='name'
                            name='name'

                            className='px-4 py-3 w-full outline-none ring-1 ring-[silver] text-black text-[17px] rounded-md hover:ring-2 hover:ring-blue-600' type="text" placeholder='Insira seu nome' required />

                    </div>
                )}
                <div className='w-full' >
                    <label className='py-3' htmlFor="email">O seu e-mail *</label>
                    <input
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        minLength={minLength}
                        maxLength={maxLength}
                        id='email'
                        className='px-4 py-3 w-full outline-none ring-1 ring-[silver] text-black text-[17px] rounded-md hover:ring-blue-600 focus:ring-2 focus:ring-blue-500 mt-3'
                        type="email"
                        placeholder='Insira seu e-mail'
                        required />
                </div>
                {data?.payer_contact_field && (
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
                    <p className='text-[14px] sm:text-[15px] font-[600] text-center' >Selecione um metodo de pagamento</p>
                    <div className='flex gap-3 p-3 justify-center' >
                        <div className='flex  gap-4 p-2' >
                            <Image alt='image' onClick={(e) => {
                                setType('Mpesa')
                            }} className={`w-20 h-20 rounded-md hover:opacity-75
                        ${type === "Mpesa" ? " ring-2 ring-blue-300 opacity-60 p-4 bg-[#F0F4FF]" : ""}`} src={mpesaicon} />

                            {/* EMOLA METHOD */}
                            <Image onClick={() => setType('eMola')}
                                className={`w-20 h-20  rounded-md hover:opacity-75
                         ${type === "eMola" ? " ring-2 ring-blue-300 opacity-60 p-4 bg-[#EBF0FF]" : ""}`} src={emolaicon} />
                        </div>
                    </div>
                    <div className='grid gap-3 p-0' >
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
                                        placeholder="Número Mpesa"
                                    />
                                </div>
                                <button
                                    type="submit" className="flex justify-center h-14 items-center w-full text-white bg-[#FF0000] hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Pagar com Mpesa</button>
                            </div>
                        )}
                        {type === 'eMola' && (
                            <div className='grid gap-3' >
                                <div className='flex gap-3 justify-center items-center ring-2 ring-[silver] px-3 rounded-md  hover:ring-blue-400 focus-within:ring-blue-500  ' >
                                    {/* <i className="bi bi-telephone"></i> */}
                                    <p className=' font-[600] text-black/65'>+258</p>
                                    <input onChange={(e) => setPaymentNumber(e.target.value)} className='px-4 py-3 w-full outline-none text-[17px] rounded-md' type="number" placeholder='Numero eMola' />
                                </div>
                                <button
                                    className="flex justify-center h-14 items-center w-full text-white bg-[#F9732C] hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">Pagar com eMola</button>

                            </div>

                        )}

                        {type === 'PayPal' && (
                            <PayPalCheckout id={id} productName={productName} />
                        )}
                        <p className='text-black text-[11px] text-center mt-6' >Powered By DROP PAY © 2025 - Todos os direitos reservados - <a href="#">Duvidas sobre este produto</a></p>

                    </div>
                </div>

            </form>

        </div >
    )
}