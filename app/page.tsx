import { Button } from '@/components/ui/button';
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon
} from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    name: "Store your PDF Documents",
    description: `Keep all your important PDF files securely stored 
    and easily accessible anytime, anywhere`,
    icon: GlobeIcon
  },
  {
    name: "Blazing Fast Responses",
    description: "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorisation",
    description: "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer",
    description: "Engage with your PDFs like never before using our intuitive and interactive viewer.",
    icon: EyeIcon,
  },
  {
    name: "Cloud Backup",
    description: "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
    icon: ServerCogIcon
  },
  {
    name: "Responsive Across Devices",
    description: "Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
    icon: MonitorSmartphoneIcon,
  }

];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className='bg-white py-24 sm:py-32 rounded-md drop-shadow-xl'>
        <div className='flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='text-base font-semibold leading-7 text-indigo-600'>
              Your Interactive Document Companion
            </h2>
            <p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl'>Tranform Your PDFs into Interactive Conversations</p>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Qs. Ideal for
              everyone, <span className="text-indigo-600">
                Chat with PDF
              </span>{" "}
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button asChild className='mt-10'>
            <Link href='/dashborad'>Get Started</Link>
          </Button>
        </div>
        <div>
          <div>
            <Image 
            alt="App screenshot"
            src="https://i.imgur.com/VciRSTI.jpeg"
            width={2432}
            height={1442}
            className='mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10'
            />
          </div>
        </div>
      </div>
    </main>
  );
}