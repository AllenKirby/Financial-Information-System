import { useParams } from "react-router-dom"
import { useDisbursementContext } from "../hooks/useDisbursementContext"
import { useEffect, useState } from "react"

const ViewDocument = () => {
    const { id } = useParams()
    const { documents } = useDisbursementContext()
    const [doc, setDoc] = useState(null) 

    useEffect(() => {
        const selectedDocument = documents.documents.find((document) => document.data.DV === id)
        if(selectedDocument){
            setDoc(selectedDocument)
        }
        else{
            console.log("error finding the document")
        }
    }, [documents.documents, id])

  return (
    <div>{doc.payee}</div>
  )
}

export default ViewDocument