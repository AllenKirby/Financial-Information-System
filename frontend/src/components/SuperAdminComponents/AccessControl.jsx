import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { collection, onSnapshot } from "firebase/firestore"
import { firestore } from "../../config/firebase-config"

import { useSuperAdminHook } from "../../hooks/useSuperAdminHook";

const AccessControl = () => {
  //state
  const [roles, setRoles] = useState([]);
  //hooks
  const {changeAccess, isLoading, error} = useSuperAdminHook()

  useEffect(() => {
    const q = collection(firestore, 'Roles');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {...doc.data()}
        return acc;
      }, {});
      setRoles(users)
    })

    return () => unsubscribe()   
  }, []);

  const handleToggleChange = async( roleName, currentPermission) => {
    Swal.fire({
      title: `Do you really want to ${currentPermission ? 'revoke' : 'grant'} access?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Grant it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newPermission = !currentPermission
            const res = await changeAccess(roleName, newPermission)
            if (res) {
                Swal.fire({
                    title: "Access Granted!",
                    text: "The account now has access",
                    icon: "success",
                });
            }else{
            Swal.fire({
                title: "Error!",
                text: {error},
                icon: "error",
            });
          }
        }
      }
    );
  };

  return (
    <section className="w-full h-full p-3">
      <div className="w-full h-full border rounded-lg">
        <div className="w-full h-auto flex rounded-t-lg bg-gray-100 text-gray-500 px-1">
          <div className="w-full h-auto flex">
            <h1 className="w-1/4 px-2 py-1">Role</h1>
            <h1 className="w-1/4 px-2 py-1">Permission</h1>
            <h1 className="w-1/4 px-2 py-1">Granted Features</h1>
            <h1 className="w-1/4 px-2 py-1">Description</h1>
          </div>
        </div>
        <div className="w-full h-full bg-white">
          {roles && Object.entries(roles).length > 0 ? (
            Object.entries(roles).map(([key, role], index) => (
              <div key={key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full h-auto flex py-2 cursor-pointer my-1`}>
                <p className="w-1/4 px-2 font-bold">{role.roleName}</p>
                <p className="w-1/4 px-2">
                  <label
                    className="has-[:checked]:bg-green-500 bg-gray-300 relative inline-block h-7 w-14 cursor-pointer rounded-full transition [-webkit-tap-highlight-color:_transparent]"
                  >
                    <input 
                      className="peer sr-only" 
                      id="AcceptConditions" 
                      type="checkbox" 
                      disabled={isLoading}
                      checked={role.permission}
                      onChange={() => handleToggleChange(role.roleName, role.permission)}/>
                    <span
                      className="absolute inset-y-0 m-1 rounded-full peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent start-0 size-5 bg-gray-300 ring-[6px] ring-inset ring-white transition-all"
                    ></span>
                  </label>
                </p>
                <p className="w-1/4 px-2">{role.grantedAccess}</p>
                <p className="w-1/4 px-2 truncate">{role.description}</p>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div>
                <h1 className="text-xl font-semibold">No Roles Found</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccessControl;
