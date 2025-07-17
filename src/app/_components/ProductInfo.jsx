'use client'
import styles from '../checkout.layout.module.css'
import SkeletonLoader from '../_components/SkeletonLoader';




export default function ProductInfo({ price, is_manual_price, name, banner_url, image_url }) {



    if (!price) return <SkeletonLoader />;

    return (
        <div className={`${styles.productInfo} md:rounded-lg md:shadow-lg bg-white `} >
            <div className='w-[100%] h-48 overflow-hidden rounded-lg mt-3 sm:mt-0' >
                <img className='w-full h-full object-cover rounded-lg ' src={`${banner_url}`} alt="logo" />
            </div>

            <div className='flex gap-10 justify-start items-start w-full sm:pl-10' >
                <div >
                    <img className='w-35 sm:w-60 rounded-md' src={`${image_url}`} alt="" />
                </div>

                <div className='grid gap-2 ' >
                    <p>Esta a pagar:</p>
                    <p className='font-[700]' >{name}</p>
                    <p>COMPRA 100% SEGURA</p>
                    <p className='text-[#5C5CC4] text-[22px] font-[800] ' >{!is_manual_price && (price + ' MT')}</p>
                    <div>
                        <p className='text-[12px]' >Author: {name}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}