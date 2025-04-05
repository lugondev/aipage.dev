'use client'

import {useChat} from 'ai/react'
import {useRef, useState} from 'react'
import Frame from 'react-frame-component'
import Image from 'next/image'
import TweetButton from '@/components/tweetButton'
import Link from 'next/link'

export default function Chat() {
	const [iframeContent, setIframeContent] = useState('')
	const [codeViewActive, setCodeViewActive] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const maxLength = 500

	const examplePrompts = ['Create a modern SaaS landing page', 'Design a restaurant website', 'Build a portfolio page']

	const {messages, isLoading, input, handleInputChange, handleSubmit} = useChat({
		onFinish: (message: {content: string}) => {
			setIframeContent(message.content)
			setError(null)
		},
		onError: (error: Error) => {
			setError(error.message)
		},
	})

	const iframeRef = useRef<HTMLIFrameElement>(null)
	const toggleView = () => setCodeViewActive(!codeViewActive)

	const handleSave = () => {
		const fileName = 'landing-page.html'
		const blob = new Blob([iframeContent], {type: 'text/html'})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = fileName
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const initialFrameContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="img-src https: data: blob:; default-src https: 'unsafe-inline' 'unsafe-eval'; font-src https: data:"></head><body><div id="root"></div></body></html>`

	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-4'>
			<div className='mb-8 text-center'>
				<Image src='/logoa.png' alt='AIPage.dev logo' width={200} height={200} className='mx-auto h-32 w-32' />
				<h1 className='mb-4 text-4xl font-bold'>AIPage.dev</h1>
				<p className='text-lg text-gray-600'>Generate landing pages with AI</p>
			</div>

			<div className='w-full max-w-md'>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<div className='relative'>
							<input
								type='text'
								value={input}
								onChange={(e) => {
									if (e.target.value.length <= maxLength) {
										handleInputChange(e)
									}
								}}
								placeholder='Describe your landing page...'
								className='w-full rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
								disabled={isLoading}
								maxLength={maxLength}
							/>
							{isLoading ? (
								<div className='absolute right-3 top-4'>
									<div className='animate-spin text-lg'>🔄</div>
								</div>
							) : (
								<div className='absolute right-3 top-4 text-sm text-gray-400'>
									{input.length}/{maxLength}
								</div>
							)}
						</div>
						<div className='mt-2 flex flex-wrap gap-2'>
							{examplePrompts.map((prompt) => (
								<button key={prompt} onClick={() => handleInputChange({target: {value: prompt}} as any)} className='rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700'>
									{prompt}
								</button>
							))}
						</div>
					</div>
					<button type='submit' className='w-full rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50' disabled={isLoading || !input.trim()}>
						{isLoading ? 'Generating...' : 'Generate Landing Page'}
					</button>
				</form>
				{error && <div className='mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-500'>{error}</div>}
			</div>

			{(isLoading || iframeContent) && (
				<div className='mt-8 w-full rounded-lg border'>
					<div className='relative w-full'>
						<div className='absolute right-2 top-2 flex space-x-2'>
							<button onClick={handleSave} disabled={isLoading} className='rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'>
								<span className={isLoading ? 'animate-spin' : ''}>💾</span>
								Save
							</button>
							<button onClick={toggleView} className='rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 flex items-center gap-2'>
								{codeViewActive ? '🖼️' : '🖨️'}
								{codeViewActive ? 'Preview' : 'Code'}
							</button>
						</div>
						{isLoading ? (
							<div className='w-full min-h-[600px] bg-gray-50 rounded-lg animate-pulse flex flex-col items-center justify-center'>
								<div className='w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>
								<p className='mt-4 text-gray-500'>Crafting your landing page...</p>
							</div>
						) : (
							<Frame ref={iframeRef} className='w-full min-h-[600px]' initialContent={initialFrameContent} sandbox='allow-same-origin allow-scripts allow-forms allow-popups'>
								{codeViewActive ? <pre className='whitespace-pre-wrap p-4'>{iframeContent}</pre> : <div dangerouslySetInnerHTML={{__html: iframeContent}} />}
							</Frame>
						)}
					</div>
				</div>
			)}

			<div className='fixed bottom-4 right-4 flex items-center space-x-4'>
				<Link href='https://github.com/zinedkaloc/aipage.dev' target='_blank' rel='noreferrer' className='text-2xl'>
					⭐️
				</Link>
				<TweetButton />
			</div>
		</div>
	)
}
