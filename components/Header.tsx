'use client'
import Logo from '@/components/Logo'

export default function Header() {
	return (
		<header className='w-full px-6 py-4 absolute top-0'>
			<div className='flex justify-between items-center h-10'>
				<div className='flex items-center gap-2'>
					<Logo href='/' />
				</div>
				<div className='flex items-center justify-center gap-3 sm:gap-4'>
					<a href='https://twitter.com/aipagedev' className='flex items-center text-gray-900 hover:text-blue-500 transition-colors' target='_blank' rel='noreferrer'>
						<svg className='mr-1 h-5 w-5 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
							<path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
						</svg>
					</a>
				</div>
			</div>
		</header>
	)
}
