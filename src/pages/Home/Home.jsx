import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Manage your customer data with ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A powerful customer management system that helps you keep track of your customers, their information, and their interactions with your business.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              to="/customers"
              className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all duration-200"
            >
              View Customers
            </Link>
            <Link
              to="/customers"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-all duration-200"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="h-[24rem] w-[36rem] rounded-md bg-white p-8 ring-1 ring-inset ring-gray-900/10">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100"></div>
                    <div className="flex-1">
                      <div className="h-4 w-40 rounded bg-gray-100"></div>
                      <div className="mt-2 h-3 w-24 rounded bg-gray-100"></div>
                    </div>
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-3 w-3/4 rounded bg-gray-100"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home