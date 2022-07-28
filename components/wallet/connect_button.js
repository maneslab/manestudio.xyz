import { ConnectButton } from '@rainbow-me/rainbowkit';
import useTranslation from 'next-translate/useTranslation'

const ConnectWalletButton = () => {
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
                    {t('Connect Wallet')}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="btn btn-warning" type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div className='flex justify-start items-center'>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className='btn btn-ghost capitalize text-base mr-2'
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 18, height: 18 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button" className='btn btn-ghost capitalize text-base'>
                    {account.displayName}
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
export default ConnectWalletButton;