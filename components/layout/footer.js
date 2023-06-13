import config from 'helper/config'
import useTranslation from 'next-translate/useTranslation'
import DiscordIcon from 'public/img/icons/discord.svg'
import TwitterIcon from 'public/img/icons/twitter.svg'
import NewwindowIcon from 'public/img/icons/newwindow.svg'

export default function Footer(props) {
	let space_url = config.get('SPACE_WEBSITE');
	let {t} = useTranslation('common');

    return (
		<div className="flex justify-between max-w-screen-xl mx-auto w-full py-4 footer dark:text-gray-400">
			<div>{t('footer-left-text')}</div>
			<div className="gap-4 flex justify-end items-center">
				<a href={"https://www.maneslab.xyz/"} target="_blank"  className="hover:text-gray-400">ManesLAB</a>
				<a href={space_url} target="_blank" className="hover:text-gray-400">ManeSPACE</a>
				<a href="https://twitter.com/manestudioxyz" target="_blank" className="hover:text-gray-400"><TwitterIcon className="icon-xs"/></a>
				<a href="https://docs.manestudio.xyz" target="_blank" className="hover:text-gray-400 capitalize flex justify-start items-center">{t('Doc')}<NewwindowIcon className="icon-xs ml-1"/></a>
			</div>
		</div>
    )
}
