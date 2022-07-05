import { ConnectButton } from '@rainbow-me/rainbowkit';

const SwitchChainButton = () => {
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
                    Connect Wallet
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
                <div className='flex'>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className='btn btn-primary capitalize text-base'
                  >
                    switch network
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