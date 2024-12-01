import { useSuperAdminHook } from "../../hooks/useSuperAdminHook"
import { useEffect } from "react"

const Logs = () => {
    const {getLogs} = useSuperAdminHook()

    useEffect(() => {
        getLogs()
    }, [])

    return (
        <section className="w-full h-full p-3">
            <div>hello</div>
        </section>
    )
}

export default Logs
