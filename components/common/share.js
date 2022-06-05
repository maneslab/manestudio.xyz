import React from 'react';

import Button from 'components/common/button';
import Image from 'next/image'

class Share extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        return <div className="block-share">
            <Button className="pixel-btn">
                <Image src={'/img/social/telegram_pixel.svg'} width={18} height={18} />
            </Button>
            <Button className="pixel-btn">
                <Image src={'/img/social/discord_pixel.svg'} width={18} height={18} />
            </Button>
            <Button className="pixel-btn">
                <Image src={'/img/social/twitter_pixel.svg'} width={18} height={18} />
            </Button>
        </div>

    }
}

module.exports = Share
