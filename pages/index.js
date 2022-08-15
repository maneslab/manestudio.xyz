import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-web'

import PageWrapper from 'components/pagewrapper'

import Head from 'next/head'
import Link from 'next/link'
import Logo from 'public/img/logo/manestudio.svg'
import data from '../public/animation/data.json'
import useTranslation from 'next-translate/useTranslation'

// get max frame from lottie json
const MAX_FRAME = 72

export default function Home() {

  const {t} = useTranslation("common");
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
          <div className="max-w-prose mb-12" >
              <div className='mb-4'>{t('landing-page-intro-1')}</div>
              <div className=''>{t('landing-page-intro-2')}</div>
          </div>
          <div>
              <button className="btn btn-secondary mr-2 capitalize text-base">{t('learn more')}</button>
              <Link href="/project/list">
                  <button className='btn btn-primary capitalize text-base'>{t('launch app')}</button>
              </Link>
          </div>
          <div className='absolute' style={{width:'800px',height:'400px','right':'-150px','bottom':'-50px'}}>
            <div id="wrap" ref={root} />
          </div>
      </div>
  </div>
</PageWrapper>


}