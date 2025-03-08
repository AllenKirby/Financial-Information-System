import { Outlet } from "react-router-dom"

const Records = () => {
  return (
    <section className="w-full h-full p-3">
        <Outlet/>
    </section>
  )
}

export default Records