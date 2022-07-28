import config from 'helper/config'
import useTranslation from 'next-translate/useTranslation'

export default function Footer(props) {
	let space_url = config.get('SPACE_WEBSITE');
	let {t} = useTranslation('common');

    return (
		<div className="flex justify-between max-w-screen-xl mx-auto w-full py-4 footer dark:text-gray-400">
			<div>{t('footer-left-text')}</div>
			<div className="gap-4 flex justify-end">
				<a href={"/"} className="hover:text-gray-400">ManeStudio</a>
				<a href={space_url} target="_blank" className="hover:text-gray-400">ManeSpace</a>
				<a href="/" className="hover:text-gray-400">{t('support')}</a>
			</div>
		</div>
    )
}
