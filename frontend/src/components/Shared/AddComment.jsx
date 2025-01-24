import PropTypes from 'prop-types'
import Swal from 'sweetalert2'

import { useState, useEffect } from 'react'

import { usePreparerHook } from '../../hooks/usePreparerHook'
import { useFundingHook } from "../../hooks/useFundingHook";
import { useBudgetOfficerHook } from "../../hooks/useBudgetOfficerHook";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useApproverHook } from '../../hooks/useApproverHook';

import LargeLoader from '../Loaders/LargeLoader';

const AddComment = ({idStatus, doc, modal, type, ASA}) => {
    const [comment, setComment] = useState('')
    const [color, setColor] = useState({bg: '', border: '', font: ''})

    const { submitDoc, isLoading: isLoadingPreparer, error: errorPreparer } = usePreparerHook();
    const { returnDoc, transferToHead, isLoading: isLoadingFunding, error: errorFunding } = useFundingHook();
    const { submitToAdmin, returnDocFromHeader, isLoading: isLoadingBO, error: errorBO } = useBudgetOfficerHook();
    const { returnDocFromAdmin, isLoading: isLoadingApprover, error: errorApprover } = useApproverHook();

    const { user } = useAuthContext()

    const isLoading = isLoadingPreparer || isLoadingFunding || isLoadingBO || isLoadingApprover;



    useEffect(() => {
      if(user && user.role){
          switch (user.role) {
              case '4':
                  return setColor({
                    bg:'bg-preparerPrimary',
                    border: 'border-preparerPrimary',
                    font: 'text-preparerPrimary'});
              case '3':
                return setColor({
                  bg:'bg-fundingBlueGreen',
                  border: 'border-fundingBlueGreen',
                  font: 'text-fundingBlueGreen'});
              case '2':
                return setColor({
                  bg:'bg-BOGreen',
                  border: 'border-BOGreen',
                  font: 'text-BOGreen'});
              case '1':
                return setColor({
                  bg:'bg-customgreen',
                  border: 'border-customgreen',
                  font: 'text-customgreen'});
              default:
                  return null
          }
      }
  }, [user]);

    const handleSubmit = async() => {
        const data = {
          DV: idStatus.id,
          payee: doc.payee,
          remarks: comment
        }
    
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#009933",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Submit it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await submitDoc(data)
            if (res) {
              Swal.fire({
                title: "Submitted!",
                text: "Your document has been submit.",
                icon: "success",
              });
              window.history.back()
            }
            else{
              Swal.fire({
                title: "Error!",
                text: {errorPreparer},
                icon: "error",
              });
            }
          }
        });
    }

    const returnDV = async() => {
        const data = {
          DV: idStatus.id,
          payee: doc.payee,
          remarks: comment
        }
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#009933",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Return it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await returnDoc(data)
            if (res) {
              Swal.fire({
                title: "Returned",
                text: "Your document has been returned.",
                icon: "success",
              });
              window.history.back()
            }
            else{
              Swal.fire({
                title: "Error!",
                text: {errorFunding},
                icon: "error",
              });
            }
          }
        });
    }

    const handleSubmitForOp = async() => {
      if(ASA) {
        const data = {
          DV: idStatus.id,
          payee: doc.payee,
          remarks: comment
        }

        const fieldOfficeData = {
          date: doc.date,
          DVNo: doc.DV,
          BUR: doc.ORSBURS,
          particulars: doc.particular,
          amount: doc.amount,
          asa: doc.ASA,
        }

        const combinedData = {
          data: data,
          fieldOfficeData: fieldOfficeData
        }
    
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#009933",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Submit it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await transferToHead(combinedData)
            if (res) {
              Swal.fire({
                title: "Submitted!",
                text: "Your document has been submitted.",
                icon: "success",
              });
              window.history.back()
            }
            else{
              Swal.fire({
                title: "Error!",
                text: {errorFunding},
                icon: "error",
              });
            }
          }
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: 'ASA No. cannot be empty.',
          icon: "error",
        });
      }
    }

    const handleReturn = (backToRole) => {
        const data = {
          DV: idStatus.id,
          payee: doc.payee,
          returnTo: backToRole,
          remarks: comment
        }
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#009933",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Return it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            let res;
            if(backToRole === '3'){
              res = returnDocFromHeader(data)
            }else if(backToRole === '4'){
              res = returnDocFromHeader(data)
            }
            if (res) {
              Swal.fire({
                title: "Returned!",
                text: "Your document has been returned.",
                icon: "success",
              });
              window.history.back()
            }
            else{
              Swal.fire({
                title: "Error!",
                text: {errorBO},
                icon: "error",
              });
            }
          }
        });
    }

    const handleReturnFromAdmin = (backToRole) => {
      const data = {
        DV: idStatus.id,
        payee: doc.payee,
        returnTo: backToRole,
        remarks: comment
      }
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#009933",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Return it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let res;
          switch(backToRole) {
            case '4':
              res = returnDocFromAdmin(data)
              break
            case '3':
              res = returnDocFromAdmin(data)
              break
            case '2':
              res = returnDocFromAdmin(data)
              break
          }
          if (res) {
            Swal.fire({
              title: "Returned!",
              text: "Your document has been returned.",
              icon: "success",
            });
            window.history.back()
          }
          else{
            Swal.fire({
              title: "Error!",
              text: {errorApprover},
              icon: "error",
            });
          }
        }
      });
  }

    const handleSubmitForHead = async() => {
        const data = {
          DV: idStatus.id,
          payee: doc.payee,
          remarks: comment
        }
    
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#009933",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Submit it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await submitToAdmin(data)
            if (res) {
              Swal.fire({
                title: "Submitted!",
                text: "Your document has been submit.",
                icon: "success",
              });
              window.history.back()
            }
            else{
              Swal.fire({
                title: "Error!",
                text: {errorBO},
                icon: "error",
              });
            }
          }
        });
    }

    const sortFunctions = (e) => {
      e.preventDefault()
      switch(type) {
        case 'SubmitPreparer':
          handleSubmit();
          break;
        case 'ReturnDV':
          returnDV();
          break;
        case 'SubmitFunding':
          handleSubmitForOp();
          break;
        case 'SubmitBO':
          handleSubmitForHead();
          break;
        case 'ReturnToPreparer':
          handleReturn('4');
          break;
        case 'ReturnToFunding':
          handleReturn('3');
          break;
        case 'ReturnToPreparerFromAdmin':
          handleReturnFromAdmin('4');
          break;
        case 'ReturnToFundingFromAdmin':
          handleReturnFromAdmin('3');
          break;
        case 'ReturnToBOFromAdmin':
          handleReturnFromAdmin('2');
          break;
        default:
          return console.log('Cannot specify the function')
      }
    }

    const message = () => {

      if(type === 'SubmitPreparer' || type === 'SubmitFunding' || type === 'SubmitBO'){
        return 'Is there anything specific we should know about this submission?'
      }else{
        return 'Could you specify the issue?'
      }

    }

  return (
    <form onSubmit={sortFunctions} className="w-3/4 sm:w-2/4 h-auto bg-white rounded-lg p-3 text-gray-500">
      <h1 className={`text-lg sm:text-2xl font-bold text-center ${color.font}`}>Add Comment(Optional)</h1>
      <p className='text-sm sm:text-base my-2'>{message()}</p>
      <textarea 
          className="w-full h-48 p-2 rounded-lg focus:outline-none border-2 resize-none"
          placeholder="Leave a comment..."
          onChange={(e) => setComment(e.target.value)}></textarea>
      <div className="flex items-center justify-end gap-2 my-2">
          <button 
            disabled={isLoading} 
            onClick={modal}
            className={`px-4 py-2 rounded-lg font-semibold border-2 hover:bg-gray-200 transition-all duration-150`}>Back</button>
          <button 
            disabled={isLoading} 
            type="submit"
            className={`px-4 py-2 rounded-lg font-semibold text-white ${color.bg} hover:bg-white hover:${color.font} border-2 ${color.border} transition-all duration-150`}>Save</button>
      </div>
      {isLoading && (
        <LargeLoader/>
      )}
    </form>
  )
}

AddComment.propTypes = {
    idStatus: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired,
    modal: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    ASA: PropTypes.string,
    permission: PropTypes.bool.isRequired
  }

export default AddComment