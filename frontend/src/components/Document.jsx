import PropTypes from 'prop-types'
import {toWords} from 'number-to-words'

const Document = ({document}) => {
  return (
    <main id="pdf" className="w-auto h-auto flex flex-col items-center justify-center font-times">
      <section className='w-a4-width h-a4-height text-black text-xs'>
        <header className='w-full h-auto flex'>
          <div className='w-1/4 h-28'></div>
          <div className='w-2/4 h-28'></div>
          <div className='w-1/4 border-t-2 border-r-2 border-l-2 border-black h-28 flex flex-col'>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Fund Cluster: {document.data.fund}</div>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Date: {document.data.date}</div>
            <div className='w-full h-1/3 flex items-center font-bold px-2'>DV No. {document.id}</div>
          </div>
        </header>
        <div>
          <div className='w-full h-9 flex border-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center font-bold'>Mode of <br/> Payment</div>
            <div className='w-5/6 py-2 flex gap-3 px-7'>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>MDS Check</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>Commercial Check</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>ADA</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>Others (Please Specify)</label>
              </div>
            </div>
          </div>
          <div className='w-full h-9 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center px-9 font-bold'>Payee</div>
            <div className='w-3/6 px-5 border-r-2 border-black flex items-center justify-center font-bold'>{document.data.payee}</div>
            <div className='w-full flex'>
              <div className='w-1/2 px-2 border-r-2 border-black py-1'>
                <div className=''>TIN/Employee No.: </div>
                <div className=' text-center font-bold'>{document.data.TIN}</div>
              </div>
              <div className="w-1/2 px-2 py-1">
                <div>ORS/BURS No.:  </div>
                <div className='text-center font-bold'>501-2024-09-408</div>
              </div>
            </div>
          </div>
          <div className='w-full h-7 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center px-9 font-bold'>Address</div>
            <div className='w-auto h-full flex items-center justify-center px-3 font-bold'>{document.data.address}</div>
          </div>
          <div className='w-full h-60 flex border-l-2 border-r-2 border-b-2 border-black'>
              <div className='w-72 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Particulars</div>
                <div className="w-full h-3/6 text-justify px-1 pb-2">{document.data.particular}</div>
                <div className="flex gap-3 px-3 py-1">
                  <div>{document.data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div>x 3%</div>
                  <div>=</div>
                  <div>{document.data.bir3percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="flex gap-3 px-3 py-1">
                  <div>{document.data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div>x 2%</div>
                  <div>=</div>
                  <div>{document.data.bir2percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="px-2 py-1">ASA No.501-2024-296 Lopez SRIP</div>
                <div className="w-full flex items-center justify-center font-bold py-1">Amount Due</div>
              </div>
              <div className='w-36 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Responsibilty Center</div>
                <div className="w-full h-3/6 flex items-center justify-center p-1">{document.data.RC}</div>
              </div>
              <div className='w-32 border-r-2 border-black'>
                <div className="w-full text-center border-b-2 border-black">MFO/PAP</div>
                <div className="w-full h-3/6 flex items-center justify-center p-2"></div>
              </div>
              <div className='w-60'>
                <div className="w-full text-center border-b-2 border-black">Amount</div>
                <div className="w-full h-3/6 flex items-center justify-end p-1">{document.data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="w-full h-24 flex justify-between items-end font-bold">
                  <div>₱</div>
                  <div>{document.data.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
          </div>
          <div className="w-full h-16 flex flex-col border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full flex">
                  <div className="p-1 border-r-2 border-b-2 border-black font-bold">A.</div>
                  <div className="flex items-center px-2">Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</div>
              </div>
              <div className="w-full text-center font-bold underline">ERWIN M. LUCELA</div>
              <div className="w-full text-center italic">Division Manager A, EOD</div>
          </div>
          <div className="h-32 w-full border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full border-b-2 border-black">
                  <div className="p-1 w-6 border-r-2 border-black font-bold">B.</div>
              </div>
              <div className="w-full h-full flex">
                  <div className="w-2/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Account Title</div>
                      <div className="w-full pt-1 pl-5">{document.data.accTitle}</div>
                      <div className="w-full pt-1 pl-5">Due to BIR(3%)</div>
                      <div className="w-full pt-1 pl-5">Due to BIR(2%)</div>
                      <div className="w-full pt-1 pl-5">Cash in Back</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">UACS Code</div>
                      <div className="w-full pt-1 text-center">{document.data.accCode}</div>
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">1 01 02 020</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Debit</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-black">
                      <div className="w-full text-center border-b-2 border-black">Credit</div>
                      <div className="w-full pt-1 text-end px-2"><br/></div>
                      <div className="w-full pt-1 text-end px-2">{document.data.bir3percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.bir2percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
              </div>
          </div>
          <div className="w-full flex h-28 border-l-2 border-b-2 border-black">
              <div className="w-1/2 border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="border-r-2 border-black p-1">C.</div>
                      <div className="flex items-center px-2">Certified:</div>
                  </div> 
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Cash Available</label>
                  </div>
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Subject to Authority to Debit Account (when applicable)</label>
                  </div>
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Supporting Documents complete amount claimed proper</label>
                  </div>
              </div>
              <div className="w-1/2 border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="border-r-2 border-black p-1">D.</div>
                      <div className="flex items-center px-2">Approved for Payment</div>
                  </div>
                  <div className='flex justify-center items-center h-full'>{`${toWords(document.data.amountDue)} pesos`}</div> 
              </div>
          </div>
          <div className="w-full flex h-[147px] border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-1/2 flex flex-col border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                      <div className="w-5/6"></div>
                  </div>
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                      <div className="w-5/6 font-bold text-sm flex items-center justify-center">JEMMELA ANNE V. MASICAT</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black">Position</div>
                      <div className="w-5/6 text-center">Chief Corporate Accountant B</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center">Head, Accounting Unit/Authorized Representative</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center flex gap-7 items-center justify-center">
                          <div>AIL-</div>
                          <div>BEM-</div>
                      </div>
                  </div>
                  <div className="w-full flex">
                      <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                      <div className="w-5/6 text-center"></div>
                  </div>
              </div>
              <div className="w-1/2">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                      <div className="w-5/6"></div>
                  </div>
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                      <div className="w-5/6 font-bold text-sm flex items-center justify-center">ROBERTO J. DELA CRUZ</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black">Position</div>
                      <div className="w-5/6 text-center">Regional Manager A</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center">Agency Head/Authorized Representative</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center flex gap-7 items-center justify-center text-white">dasd</div>
                  </div>
                  <div className="w-full flex">
                      <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                      <div className="w-5/6 text-center"></div>
                  </div>
              </div>
          </div>
          <div className="w-full flex h-30 border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-3/4 border-r-2 border-black">
                  <div className="flex border-b-2 border-black">
                      <div className="p-1 border-r-2 border-black">E.</div>
                      <div className="flex items-center px-2">Receipt of Payment</div>
                  </div>
                  <div className="w-full flex-col">
                      <div className="h-2/3 py- flex border-b-2 border-black">
                          <div className="w-1/6 border-r-2 border-black">Check/ADA No. :</div>
                          <div className="w-2/6 border-r-2 border-black"></div>
                          <div className="w-1/6 border-r-2 border-black">Date: </div>
                          <div className="w-2/6 flex-col">
                              <div className="w-full">Bank Name & Account Number:</div>
                              <div className="w-full text-center">LBP Account No. 0242-1113-46</div>
                          </div>
                      </div>
                      <div className="h-1/3 flex">
                          <div className="w-1/6 border-r-2 border-black">Signature: </div>
                          <div className="w-2/6 border-r-2 border-black"></div>
                          <div className="w-1/6 border-r-2 border-black">Date: </div>
                          <div className="w-2/6 flex-col"></div>
                      </div>
                  </div>
              </div>
              <div className="w-1/4 flex-col">
                  <div className="w-full border-b-2 border-black">
                      <div className="flex items-center p-1">JEV No.</div>
                      <div className="text-center p-1">N/A</div>
                  </div>
                  <div className="w-full p-1">Date: N/A</div>
              </div>
          </div>
          <div className="w-full p-1 border-l-2 border-r-2 border-b-2 border-black">Official Receipt No. & Date/Other Documents</div>
        </div>
      </section>
      <section className='w-a4-width h-a4-height text-black text-xs mt-1'>
        <header className='w-full h-auto flex'>
          <div className='w-1/4 h-28'></div>
          <div className='w-2/4 h-28'></div>
          <div className='w-1/4 border-t-2 border-r-2 border-l-2 border-black h-28 flex flex-col'>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Fund Cluster: {document.data.fund}</div>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Date: {document.data.date}</div>
            <div className='w-full h-1/3 flex items-center font-bold px-2'>DV No. 501-2024-09-507</div>
          </div>
        </header>
        <div>
          <div className='w-full h-9 flex border-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center font-bold'>Mode of <br/> Payment</div>
            <div className='w-5/6 py-2 flex gap-3 px-7'>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>MDS Check</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>Commercial Check</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>ADA</label>
              </div>
              <div className='flex items-center justify-center'>
                <input type="checkbox" className='w-5 h-5'/>
                <label>Others (Please Specify)</label>
              </div>
            </div>
          </div>
          <div className='w-full h-9 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center px-9 font-bold'>Payee</div>
            <div className='w-3/6 px-5 border-r-2 border-black flex items-center justify-center font-bold'>BIR</div>
            <div className='w-full flex'>
              <div className='w-1/2 px-2 border-r-2 border-black py-1'>
                <div className=''>TIN/Employee No.: </div>
                <div className=' text-center'><br/></div>
              </div>
              <div className="w-1/2 px-2 py-1">
                <div>ORS/BURS No.:  </div>
                <div className='text-center font-bold'>501-2024-09-408</div>
              </div>
            </div>
          </div>
          <div className='w-full h-7 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center px-9 font-bold'>Address</div>
            <div className='w-auto h-full flex items-center justify-center px-3 font-bold'>Calamba, Laguna</div>
          </div>
          <div className='w-full h-60 flex border-l-2 border-r-2 border-b-2 border-black'>
              <div className='w-72 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Particulars</div>
                <div className="w-full h-5/6 text-justify px-1 pb-2">{document.data.birParticular}</div>
                <div className="w-full flex items-center justify-center font-bold py-1">Amount Due</div>
              </div>
              <div className='w-36 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Responsibilty Center</div>
                <div className="w-full h-3/6 flex items-center justify-center p-1">{document.data.birRC}</div>
              </div>
              <div className='w-32 border-r-2 border-black'>
                <div className="w-full text-center border-b-2 border-black">MFO/PAP</div>
                <div className="w-full h-3/6 flex items-center justify-center p-2"></div>
              </div>
              <div className='w-60'>
                <div className="w-full text-center border-b-2 border-black">Amount</div>
                <div className="w-full h-3/6 flex items-center justify-end p-1">{document.data.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="w-full h-24 flex justify-between items-end font-bold">
                  <div>₱</div>
                  <div>{document.data.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
          </div>
          <div className="w-full h-16 flex flex-col border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full flex">
                  <div className="p-1 border-r-2 border-b-2 border-black font-bold">A.</div>
                  <div className="flex items-center px-2">Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</div>
              </div>
              <div className="w-full text-center font-bold underline">REYNARIA N. TAPIA</div>
              <div className="w-full text-center italic">Division Manager A, AFD</div>
          </div>
          <div className="h-32 w-full border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full border-b-2 border-black">
                  <div className="p-1 w-6 border-r-2 border-black font-bold">B.</div>
              </div>
              <div className="w-full h-full flex">
                  <div className="w-2/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Account Title</div>
                      <div className="w-full pt-1 pl-5">Due to BIR(3%)</div>
                      <div className="w-full pt-1 pl-5">Due to BIR(2%)</div>
                      <div className="w-full pt-1 pl-5">Cash in Back</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">UACS Code</div>
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">1 01 02 020</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Debit</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.bir3percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.bir2percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-black">
                      <div className="w-full text-center border-b-2 border-black">Credit</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                      <div className="w-full pt-1 text-end px-2">{document.data.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
              </div>
          </div>
          <div className="w-full flex h-28 border-l-2 border-b-2 border-black">
              <div className="w-1/2 border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="border-r-2 border-black p-1">C.</div>
                      <div className="flex items-center px-2">Certified:</div>
                  </div> 
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Cash Available</label>
                  </div>
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Subject to Authority to Debit Account (when applicable)</label>
                  </div>
                  <div className='pt-1 flex items-center px-2'>
                      <input type="checkbox" className='w-5 h-5 mr-2'/>
                      <label>Supporting Documents complete amount claimed proper</label>
                  </div>
              </div>
              <div className="w-1/2 border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="border-r-2 border-black p-1">D.</div>
                      <div className="flex items-center px-2">Approved for Payment</div>
                  </div> 
                  <div className='flex justify-center items-center h-full'>{`${toWords(document.data.birSubAmount)} pesos`}</div>
              </div>
          </div>
          <div className="w-full flex h-[147px] border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-1/2 flex flex-col border-r-2 border-black">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                      <div className="w-5/6"></div>
                  </div>
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                      <div className="w-5/6 font-bold text-sm flex items-center justify-center">JEMMELA ANNE V. MASICAT</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black">Position</div>
                      <div className="w-5/6 text-center">Chief Corporate Accountant B</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center">Head, Accounting Unit/Authorized Representative</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center flex gap-7 items-center justify-center">
                          <div>AIL-</div>
                          <div>BEM-</div>
                      </div>
                  </div>
                  <div className="w-full flex">
                      <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                      <div className="w-5/6 text-center"></div>
                  </div>
              </div>
              <div className="w-1/2">
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                      <div className="w-5/6"></div>
                  </div>
                  <div className="w-full flex border-b-2 border-black">
                      <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                      <div className="w-5/6 font-bold text-sm flex items-center justify-center">ROBERTO J. DELA CRUZ</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black">Position</div>
                      <div className="w-5/6 text-center">Regional Manager A</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center">Agency Head/Authorized Representative</div>
                  </div>
                  <div className="w-full border-b-2 flex border-black">
                      <div className="w-1/6 border-r-2 border-black"></div>
                      <div className="w-5/6 text-center flex gap-7 items-center justify-center text-white">dasd</div>
                  </div>
                  <div className="w-full flex">
                      <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                      <div className="w-5/6 text-center"></div>
                  </div>
              </div>
          </div>
          <div className="w-full flex h-30 border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-3/4 border-r-2 border-black">
                  <div className="flex border-b-2 border-black">
                      <div className="p-1 border-r-2 border-black">E.</div>
                      <div className="flex items-center px-2">Receipt of Payment</div>
                  </div>
                  <div className="w-full flex-col">
                      <div className="h-2/3 py- flex border-b-2 border-black">
                          <div className="w-1/6 border-r-2 border-black">Check/ADA No. :</div>
                          <div className="w-2/6 border-r-2 border-black"></div>
                          <div className="w-1/6 border-r-2 border-black">Date: </div>
                          <div className="w-2/6 flex-col">
                              <div className="w-full">Bank Name & Account Number:</div>
                              <div className="w-full text-center">LBP Account No. 0242-1113-46</div>
                          </div>
                      </div>
                      <div className="h-1/3 flex">
                          <div className="w-1/6 border-r-2 border-black">Signature: </div>
                          <div className="w-2/6 border-r-2 border-black"></div>
                          <div className="w-1/6 border-r-2 border-black">Date: </div>
                          <div className="w-2/6 flex-col"></div>
                      </div>
                  </div>
              </div>
              <div className="w-1/4 flex-col">
                  <div className="w-full border-b-2 border-black">
                      <div className="flex items-center p-1">JEV No.</div>
                      <div className="text-center p-1">N/A</div>
                  </div>
                  <div className="w-full p-1">Date: N/A</div>
              </div>
          </div>
          <div className="w-full p-1 border-l-2 border-r-2 border-b-2 border-black">Official Receipt No. & Date/Other Documents</div>
        </div>
      </section>
    </main>
  )
}

Document.propTypes = {
  document: PropTypes.object.isRequired
};

export default Document