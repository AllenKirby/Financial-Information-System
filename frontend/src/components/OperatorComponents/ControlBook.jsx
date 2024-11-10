import { useState } from "react"
import { useSelector } from 'react-redux'
import { Outlet, useParams } from "react-router-dom"

import AddControlBook from "./AddControlBook"
import Folder from "./Folder"

const ControlBook = () => {
  const [controlBookFlag, setControlBookFlag] = useState(false)

  const controlBooks = useSelector((state) => state.controlBook)

  const { id } = useParams()

  const modal = () => setControlBookFlag(!controlBookFlag)

  return (
    <section className="w-full h-full">
      {!id ? (
        <>
          <div className="w-full h-[10%] flex items-end justify-between py-2">
            <p className="font-semibold">Control Books({controlBooks ? Object.entries(controlBooks).length : 0})</p>
            <button 
              onClick={modal}
              className="px-3 py-2 rounded-lg bg-fundingBlueGreen text-white"
              >Add Control Book
            </button>
          </div>
          <div className="p-2 w-full h-[88%] grid grid-cols-4 gap-2 border-2 rounded-lg">
            {controlBooks && Object.entries(controlBooks).length > 0 ? (
              Object.entries(controlBooks).map(([key, controlBook]) => (
                <Folder key={key} ASANo={key} controlBook={controlBook}/>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                No Control Books Found
              </div>
            )}
          </div>
          {controlBookFlag && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black opacity-50" 
                onClick={modal} 
              />
              <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center">
                <AddControlBook modal={modal} flag={false}/>
              </div>
            </>
          )}
        </>
      ) : <Outlet/>}
    </section>
  )
}

export default ControlBook
