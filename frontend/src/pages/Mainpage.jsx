import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
//Components
import Login from '../AuthComponents/login'
import {AuthRole} from "../components/AuthRole";


const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />

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