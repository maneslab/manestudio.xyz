import Document, { Head, Main, NextScript, Html} from 'next/document';

import config from 'helper/config'

export default class extends Document {
  render() {
    let GA_TRACKING_ID = config.get('GA_TRACKING_ID');
    
    /*              <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@closeskycom" />
          <meta name="twitter:creator" content="@closeskycom" />
          <meta property="og:url" content="https://www.closesky.io" />
          <meta property="og:title" content="CloseSky - sell NFT with 0 royalty" />
          <meta property="og:description" content="CloseSky is a nft market with only 1% commission" />
          <meta property="og:image" content="https://www.closesky.io/img/bannerio.png" />      */
    return (
      <Html data-theme="dark">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />


        </Head>
        <body>
          <Main />
          <NextScript />
          <svg height="0" viewBox="0 0 200 200" width="0">
            <defs>
              <clipPath clipPathUnits="objectBoundingBox" id="hex-clip" transform="scale(0.005 0.005)">
              <path d="M 100 0 C 20 0 0 20 0 100 C 0 180 20 200 100 200 C 180 200 200 180 200 100 C 200 20 180 0 100 0 Z"/>
              </clipPath>
            </defs>
          </svg>
        </body>
      </Html>
    )
  }
}