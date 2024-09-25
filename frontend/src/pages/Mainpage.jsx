import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Login from "../AuthComponents/login";


const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<Login/>} />

      </Route>
    )
  );

  return (
    <main className="h-screen w-full flex items-center justify-center font-poppins overflow-y-hidden">
      <RouterProvider router={router} />
    </main>
  )
}

export default Mainpage