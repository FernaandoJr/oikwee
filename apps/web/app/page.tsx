import { Button } from "@repo/ui/button"
import Image from "next/image"

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<main className="flex flex-col gap-4">
				<Image
					className="w-10 h-10"
					src="/logo.svg"
					alt="Logo"
					width={120}
					height={32}
					priority
				/>
				<ol>
					<li>
						Get started by editing{" "}
						<code>apps/web/app/page.tsx</code>
					</li>
					<li>Save and see your changes instantly.</li>
				</ol>
				<Button appName="web" className="bg-blue-500 text-white">
					Open alert
				</Button>
			</main>
			<footer className="text-sm text-gray-500">
				<a
					href="https://turborepo.dev?utm_source=create-turbo"
					target="_blank"
					rel="noopener noreferrer">
					Go to turborepo.dev →
				</a>
			</footer>
		</div>
	)
}
