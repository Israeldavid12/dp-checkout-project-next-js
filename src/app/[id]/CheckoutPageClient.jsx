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

const get_data_endppoint = 'http://localhost:4000/api/products/checkout-data'



export default function CheckoutPageClient({ id }) {
    const [is_active, setIsActive] = useState(true)
    const [is_loading, setLoading] = useState(false)
    const [res, setRes] = useState(null)
    const [token, setToken] = useState(null)
    const [decoded, setDecoded] = useState(null)
    const [response_status_code, setStatus] = useState(0)


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
                const res = await axios.post(get_data_endppoint, payload);
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

    if ([403, 404].includes(response_status_code)) {
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