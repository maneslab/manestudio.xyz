import { ConnectButton } from '@rainbow-me/rainbowkit';
import useTranslation from 'next-translate/useTranslation'

const SwitchChainButton = () => {
  let {t} = useTranslation('common');

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} className="btn btn-outline" type="button">
                    {t('connect wallet')}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="btn btn-warning" type="button">
                    {t('wrong network')}
                  </button>
                );
              }

              return (
                <div className='flex'>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className='btn btn-primary capitalize text-base'
                  >
                    {t('switch network')}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
export default SwitchChainButton;