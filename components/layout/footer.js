export default function Footer(props) {
    return (
		<div className="flex justify-between max-w-screen-xl mx-auto w-full py-4 dark:text-gray-400">
			<div>© 2022 ManeSTUDIO by WeirdoGhostGang</div>
			<div className="gap-4 flex justify-end">
				<a href="/" className="hover:text-gray-400">ManeStudio</a>
				<a href="/" className="hover:text-gray-400">ManeSpace</a>
				<a href="/" className="hover:text-gray-400">Support</a>
			</div>
		</div>
    )
}
