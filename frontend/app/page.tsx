import { LoginForm } from '@/components/(auth)/login/login-form';
import Image from 'next/image'

const imageStyle = {
  width: 'auto',
  height: 'auto',
  max_width: '100vh'
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center lg:flex-row">

      <div className="w-full h-[15vh] bg-linear-to-r from-neutral-200 to-neutral-400/70 lg:w-[60%] lg:h-screen">

        <div className="relative flex h-full flex-col justify-center lg:justify-end">

          <div className="self-center flex flex-col md:flex-row z-20 lg:absolute top-10 ">
            <span 
              className="h-full text-2xl ml-4 flex lg:px-0 font-spam-header md:py-4"
              >Monitor and be alerted about currency values to</span>
            <span className="h-full text-2xl flex pl-4 font-accent-header font-bold text-green-800 md:pr-4 md:pl-0 md:ml-[6px] md:py-4">save your money</span>
          </div>

          <Image 
            alt="MoneyStacksArt"
            className="hidden lg:block z-10"
            src="/money_stacks.png"
            width={100}
            height={100}
            sizes="100vw"
            style={imageStyle}
            unoptimized 
          />
        </div>

      </div>
      
      <div className="h-[85vh] lg:w-[40%] lg:h-[100vh] flex items-right justify-center font-sans">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}
