import React, {useEffect} from 'react';
import Logo from '../../assets/StreamUp.svg'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='border-t-2 border-t-gray-400/10 relative overflow-hidden bg-gray-box w-full p-5 pl-6 pt-14 pb-20 border-l-8 border-l-hopbush-main'>
      <br />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Link to='/'>
                <img src={Logo} alt="" className='w-[15rem]'/>
                </Link>
              </div>
              <div>
              <a href="https://harshrana.in" target='_blank'>
                  <p className="text-sm text-white">&copy; Harsh Rana</p>
              </a>

              </div>
            </div>
          </div>
          
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Features
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Pricing
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Press Kit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Account
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Help
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-white">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm font-medium text-white/50 hover:text-hopbush-500"
                    to="/"
                  >
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default Footer;
