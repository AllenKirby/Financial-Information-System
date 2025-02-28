import { Rings } from 'react-loader-spinner'

const LargeLoader = () => {
  return (
    <div>
        <div className="fixed inset-0 z-40 bg-black opacity-50" />
        <section className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
            <Rings
                visible={true}
                height="200"
                width="200"
                color="#4fa94d"
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </section>
    </div>
  )
}

export default LargeLoader