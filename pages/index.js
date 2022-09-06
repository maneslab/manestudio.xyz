import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-web'

import PageWrapper from 'components/pagewrapper'

import Head from 'next/head'
import Link from 'next/link'
import Logo from 'public/img/logo/manestudio.svg'
import data from '../public/animation/data.json'
import useTranslation from 'next-translate/useTranslation'

import {LightBulbIcon,ArrowRightIcon} from '@heroicons/react/outline'
// get max frame from lottie json
const MAX_FRAME = 72

export default function Home() {

  const {t,lang} = useTranslation("common");
  const root = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    if (root.current) {
      anim.current = Lottie.loadAnimation({
        name: 'data',
        container: root.current,
        renderer: 'canvas',
        loop: false,
        autoplay: false,
        animationData: data,
      })
    }

    return () => {
      Lottie.destroy('data')
    }
  }, [])

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
        console.log('debug-handscroll');
        setScrollY(window.scrollY);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])

  useEffect(() => {
    const screenHeight = window.innerHeight
    const frameLength = screenHeight / MAX_FRAME
    const nowFrame = Math.floor( scrollY / frameLength )
    console.log({ scrollY, screenHeight, nowFrame })
    //设置-1帧避免动画最后为空帧的BUG
    anim.current.goToAndStop(nowFrame-1, true)
    //修复scrollY为0时，卡帧导致视觉帧不是第一帧的问题
    if (scrollY == 0){
      anim.current.goToAndStop(0, true)
    }
  }, [scrollY])


  return <PageWrapper theme={'blue'} wapperClassName="landingpage">
  <Head>
      <title>ManeSTUDIO</title>
  </Head>
  <div className="">

      <div className='max-w-screen-xl mx-auto text-white relative'>
          <div className='mt-24 mb-12'>
              <Logo className="h-10" />
          </div>
          <div className="max-w-prose mb-12 text-[#b6b7dc]" >
              <div className='mb-4'>{t('landing-page-intro-1')}</div>
              <div className='mb-4'>{t('landing-page-intro-2')}</div>
              {
                (lang=='zh')
                ? <div className='flex justify-start items-center'>
                  ManeSTUDIO的智能合约已成功通过<span><img src="/img/beosin_logo.png" className='h-8' /></span><a className="underline underline-offset-2" href="https://docs.manestudio.xyz/v/jian-ti-zhong-wen/an-quan-shen-ji-bao-gao/you-beosin-chu-ju-de-shen-ji-bao-gao" target={"_blank"}>安全审计</a>
                </div>
                : <div className='flex justify-start items-center'>
                  ManeSTUDIO has passed the <a href="https://docs.manestudio.xyz/audit-reports/audit-report-by-beosin" target="_blank" className='underline mx-2'>Smart Contract Security Audit</a> by <span><img src="/img/beosin_logo.png" className='h-8'/></span>
                </div>
              }
          </div>
          <div>
              <a className="btn btn-secondary mr-2 capitalize text-base" href="https://docs.manestudio.xyz/" target={"_blank"}>{t('learn more')}</a>
              <Link href="/project/list">
                  <button className='btn btn-primary capitalize text-base'>{t('launch app')}</button>
              </Link>
          </div>

          <div className='mt-8 pt-8 border-t border-[#b6b7dc] border-dashed max-w-prose'>
              <h2 className='flex justify-start items-center font-bold text-lg mb-4'>
                <LightBulbIcon className="icon-sm mr-2" />
                {t('landing-page-intro-3')}
              </h2>
              <div className='mb-4 text-[#b6b7dc]'>
                {t('landing-page-intro-4')}
              </div>
              <div>
                <a target={"_blank"} className="underline underline-offset-2 flex justify-start items-center text-[#b6b7dc]" href={(lang=='zh')?"https://docs.manestudio.xyz/v/jian-ti-zhong-wen/yong-hu-fa-zhan-ji-hua/maneslab-chuang-zuo-zhe-fu-hua-ji-hua":"https://docs.manestudio.xyz/programs/project-incubation"}><ArrowRightIcon className='icon-xs mr-2'/>{t('CONTACT US')}</a>
              </div>
          </div>

          <div className='absolute' style={{width:'800px',height:'400px','right':'-150px','bottom':'-50px'}}>
            <a href="https://linktr.ee/weirdoghost" target="_blank">
            <div id="wrap" ref={root} />
            </a>
          </div>
      </div>
  </div>
</PageWrapper>


}