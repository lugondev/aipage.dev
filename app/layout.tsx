import {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from 'react'
import '../styles/globals.css'
const inter = Inter({subsets: ['latin']})

const metadata: Metadata = {
	title: 'AIPage.dev - An AI-Powered Landing Page Generator | by @zinedkaloc',
	description: 'AI-Powered Landing Page Generator. Experience the Open Source Project that Empowers You to Build Stunning Landing Pages Instantly',
}

export default function RootLayout({children}: {children: ReactNode}) {
	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
