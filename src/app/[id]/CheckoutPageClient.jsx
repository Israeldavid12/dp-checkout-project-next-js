'use client'
import styles from '../checkout.layout.module.css'
import axios from 'axios';
import Timer from '../_components/Timer'
import ProductInfo from '../_components/ProductInfo'
import FieldsCheckout from '../_components/FieldsCheckout';
import { useState, useEffect } from 'react';
import unavailable from '../../../public/503.jpg'
import Image from 'next/image';
import Loading from '../_components/LoadingAnim'
import jwt from 'jsonwebtoken';
import { CheckIcon } from 'lucide-react';

const get_data_endppoint_test = 'http://localhost:4000/api/products/checkout-data'
const get_data_endppoint_live = 'https://api.droopay.com/api/products/checkout-data'


const random_names = [
  "Patrícia J. Pedro",
  "Marta C.",
  "Josefina Augusto",
  "Shelton Matola",
  "Isabela E.",
  "Antónia C.",
  "Carlos Nhantumbo",
  "Adélia Mucavele",
  "Paulo Tembe",
  "Fátima Macamo",
  "Rui Matusse",
  "Helena Mondlane",
  "Alberto Cumbe",
  "Júlia Zandamela",
  "Sérgio Chissano",
  "Joana Sitoe",
  "Afonso Machava",
  "Graça Simango",
  "David Mucavele",
  "Elisa Tembe",
  "Mateus Nhantumbo",
  "Cristina Machel",
  "Armando Muthemba",
  "Celina Zavale",
  "Henrique Massingue",
  "Beatriz Muianga",
  "Rosa Chilengue",
  "Fernando Malate",
  "Lurdes Tembe",
  "Gilberto Macamo",
  "Cláudia Zandamela",
  "Samuel Nhantumbo",
  "Ângela Cossa",
  "Leonel Matola",
  "Joaquina Mavale",
  "Manuel Chissano",
  "Ida Mondlane",
  "Ricardo Sitoe",
  "Tatiana Cumbe",
  "Jaime Muthemba",
  "Vanessa Muianga",
  "Celso Zavale",
  "Amélia Chilengue",
  "Orlando Tembe",
  "Vasco Malate",
  "Dina Nhantumbo",
  "Alzira Mondlane",
  "Félix Machava",
  "Rafaela Matusse",
  "Tomás Cossa",
  "Cecília Macamo",
  "Humberto Simango",
  "Olga Chissano",
  "Nelson Muianga",
  "Paula Mucavele",
  "Jonas Tembe",
  "Eliana Matola",
  "Rodrigo Nhantumbo",
  "Berta Cumbe",
  "Hermínio Mondlane",
  "Alice Zavale",
  "Isac Chilengue",
  "Verónica Muthemba",
  "Arminda Muianga",
  "Eduardo Massingue",
  "Silvia Matusse",
  "Augusto Tembe",
  "Nélia Macamo",
  "Gil Simango",
  "Lídia Mondlane",
  "Caetano Nhantumbo",
  "Margarida Chissano",
  "Sandro Mucavele",
  "Eva Malate",
  "Osvaldo Tembe",
  "Noémia Sitoe",
  "António Mondlane",
  "Rosa Cumbe",
  "Jorge Muthemba",
  "Anabela Zandamela",
  "Cláudio Massingue",
  "Tatiana Chilengue",
  "Pedro Nhantumbo",
  "Marisa Macamo",
  "Vicente Muianga",
  "Helder Mavale",
  "Inês Tembe",
  "Cristóvão Malate",
  "Luciana Simango",
  "Adriano Chissano",
  "Beatriz Mucavele",
  "Samuel Muthemba",
  "Celeste Mondlane",
  "Daniel Nhantumbo",
  "Regina Cumbe",
  "Maurício Tembe",
  "Débora Macamo",
  "Filipe Zavale",
  "Aníbal Chilengue",
  "Eunice Muianga",
  "Osório Massingue",
  "Tatiana Mondlane"
];



const DisplayFakeSales = () => {
  const [index, setIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);

      setIndex((prevIndex) => (prevIndex + 1) % random_names.length);

      setTimeout(() => {
        setIsActive(false);
      }, 3000); // esconde após 2s
    }, 8000); // troca a cada 3s

    return () => clearInterval(interval);
  }, [random_names.length]);

  return (
    <div
      className={`absolute bottom-4 left-4 transition-all duration-500 ease-in-out ${
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border-l-4 border-green-500">
        <CheckIcon className="w-5 h-5 text-green-600" />
        <p className="text-sm">
          {random_names[index]} acabou de comprar
        </p>
      </div>
    </div>
  );
};




export default function CheckoutPageClient({ id }) {
    const [is_active, setIsActive] = useState(true)
    const [is_loading, setLoading] = useState(false)
    const [res, setRes] = useState(null)
    const [token, setToken] = useState(null)
    const [decoded, setDecoded] = useState(null)
    const [response_status_code, setStatus] = useState(0)

    console.log(id)


    useEffect(() => {

        if (token) {
            try {
                const decoded = jwt.decode(token);

                if (decoded && decoded.exp * 1000 < Date.now()) {
                    setIsActive(false);
                    setDecoded(null);
                } else {
                    setDecoded(decoded);
                    setIsActive(decoded?.is_active);

                }
            } catch (error) {
                setData(false);

            }
        }


    }, [token])


    useEffect(() => {

        const sendData = async () => {
            const payload = {
                id: id
            };
            try {
                const res = await axios.post(get_data_endppoint_live, payload);
                setRes(res?.data?.product)
                setToken(res?.data?.token)
                setStatus(res?.data?.status_code)

            } catch (e) {
                setRes(e?.response?.status)
                setStatus(e?.response?.status)
            }
        };
        if (!res) {
            sendData()
        }


    }, [id]);

    if (!res) return <Loading />;

    if ([403, 404, 500].includes(response_status_code)) {
        return (
            <div className='flex justify-center items-center h-[100vh] bg-white'>
                <div>
                    <div className='flex justify-between items-center gap-4'>
                        <span className='font-[600]'>503</span>
                        <span className='border-y-neutral-700 border-1 h-[25px]'></span>
                        <span>PRODUTO INDISPONÍVEL</span>
                    </div>
                    <Image className='w-40 h-40 self-center justify-self-center' src={unavailable} alt='503' />
                </div>
            </div>
        );
    }



    return (
        <div className={styles.main}>
            <DisplayFakeSales />
            <Timer />
           
            {token && decoded && (
                <ProductInfo price={decoded?.price} is_manual_price={decoded?.is_manual_price} name={res?.name} banner_url={res?.banner_url} image_url={res?.image_url} />
            )}
            {token && decoded && (
                <FieldsCheckout isManualPrice={decoded?.is_manual_price} productName={res?.name} productPrice={decoded?.price} sellerID={decoded?.user_uid} id={id} token={token} />
            )}
        </div>
    )
}