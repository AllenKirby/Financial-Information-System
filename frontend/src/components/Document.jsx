import PropTypes from 'prop-types'
import {toWords} from 'number-to-words'
import TopDesign from '../assets/images/top.png'
import Logo1 from '../assets/images/Picture1.png'
import Logo2 from '../assets/images/DOA.png'
import Text1 from '../assets/images/text.png'
import BottomDesign from '../assets/images/bottom.png'
import Text2 from '../assets/images/dasda.png'

const Document = ({document}) => {
  const doc = document
  console.log('document', doc)
  return (
    <main id="pdf" className="w-auto h-auto flex flex-col items-center justify-center font-times">
      <section className='w-a4-width h-a4-height text-black text-xs'>
        <header className='w-full h-auto flex'>
          <div className='w-3/4 h-28 relative'>
            <img src={TopDesign} alt="Top" className='h-[118px] w-96' />
            <img src={Logo1} alt="Logo1" className='h-20 w-20 absolute top-8 left-[73px]'/>
            <img src={Logo2} alt="Logo2" className='h-[70px] w-26 absolute top-10 left-36'/>
            <img src={Text1} alt="text" className='absolute top-5 left-[253px] w-72 h-[75px]' />
            <h1 className='text-2xl font-bold absolute -bottom-1 left-[260px]'>Disbursement Voucher</h1>
          </div>
          <div className='w-1/4 border-t-2 border-r-2 border-l-2 border-black h-28 flex flex-col'>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Fund Cluster: {doc.fund}</div>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Date: {doc.date}</div>
            <div className='w-full h-1/3 flex items-center font-bold px-2'>DV No. {doc.DV}</div>
          </div>
        </header>
        <div>
          <div className='w-full h-9 flex border-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center font-bold'>Mode of <br/> Payment</div>
            <div className='w-5/6 py-2 flex gap-10 px-7'>
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
            <div className='w-3/6 px-5 border-r-2 border-black flex items-center justify-center font-bold'>{doc.payee}</div>
            <div className='w-full flex'>
              <div className='w-1/2 px-2 border-r-2 border-black py-1'>
                <div className=''>TIN/Employee No.: </div>
                <div className=' text-center font-bold'>{doc.TT_tax} {doc.TIN}</div>
              </div>
              <div className="w-1/2 px-2 py-1">
                <div>ORS/BURS No.:  </div>
                <div className='text-center font-bold'>{doc.ORSBURS}</div>
              </div>
            </div>
          </div>
          <div className='w-full h-7 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-20 border-r-2 border-black flex items-center justify-center px-9 font-bold'>Address</div>
            <div className='w-auto h-full flex items-center justify-center px-3 font-bold'>{doc.address}</div>
          </div>
          <div className='w-full h-60 flex border-l-2 border-r-2 border-b-2 border-black'>
              <div className='w-72 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Particulars</div>
                <div className="w-full h-3/6 text-justify px-1 pb-2">{doc.particular}</div>
                <div className="flex gap-3 px-3 py-1">
                  <div>{doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div>{doc.TT_formula1.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')}</div>
                  <div>=</div>
                  <div>{eval(doc.amount + doc.TT_formula1).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="flex gap-3 px-3 py-1">
                  <div>{doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div>{doc.TT_formula2.replace(/\*/g, ' x ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/\-/g, ' - ')}</div>
                  <div>=</div>
                  <div>{eval(doc.amount + doc.TT_formula2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="px-2 py-1">ASA No.{doc.ASA}</div>
                <div className="w-full flex items-center justify-center font-bold py-1">Amount Due</div>
              </div>
              <div className='w-36 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Responsibilty Center</div>
                <div className="w-full h-3/6 flex items-center justify-center p-1">{doc.RC}</div>
              </div>
              <div className='w-32 border-r-2 border-black'>
                <div className="w-full text-center border-b-2 border-black">MFO/PAP</div>
                <div className="w-full h-3/6 flex items-center justify-center p-2"></div>
              </div>
              <div className='w-60'>
                <div className="w-full text-center border-b-2 border-black">Amount</div>
                <div className="w-full h-3/6 flex items-center justify-end p-1">{doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="w-full h-24 flex justify-between items-end font-bold">
                  <div>₱</div>
                  <div>{doc.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
          </div>
          <div className="w-full h-16 flex flex-col border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full flex">
                  <div className="p-1 border-r-2 border-b-2 border-black font-bold">A.</div>
                  <div className="flex items-center px-2">Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</div>
              </div>
              <div className="w-full text-center font-bold underline">{doc.NF_name}</div>
              <div className="w-full text-center italic">{doc.NF_office}</div>
          </div>
          <div className="h-32 w-full border-l-2 border-r-2 border-b-2 border-black">
              <div className="w-full border-b-2 border-black">
                  <div className="p-1 w-6 border-r-2 border-black font-bold">B.</div>
              </div>
              <div className="w-full h-full flex">
                  <div className="w-2/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Account Title</div>
                      {doc.accTitle.map((title, index) => (
                        <div key={index} className="w-full pt-1 pl-5">{title}</div>
                      ))}
                      <div className="w-full pt-1 pl-5">Due to BIR(3%)</div>
                      <div className="w-full pt-1 pl-5">Due to BIR(2%)</div>
                      <div className="w-full pt-1 pl-5">Cash in Back</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">UACS Code</div>
                      {doc.accCode.map((code, index) => (
                        <div key={index} className="w-full pt-1 text-center">{code}</div>
                      ))}
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">2 02 01 010</div>
                      <div className="w-full pt-1 text-center">1 01 02 020</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-r-2 border-black">
                      <div className="w-full text-center border-b-2 border-black">Debit</div>
                      {doc.optionalAmount.length > 0 ? doc.optionalAmount.map((fixamount, index) => (
                        <div key={index} className="w-full pt-1 text-end px-2">{fixamount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      ))
                      : doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <div className="w-full pt-1 text-end px-2"></div>
                  </div>
                  <div className="w-1/5 h-[100px] border-black">
                      <div className="w-full text-center border-b-2 border-black">Credit</div>
                      <div className="w-full pt-1 text-end px-2"><br/></div>
                      <div className="w-full pt-1 text-end px-2">{doc.bir3percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{doc.bir2percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{doc.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                  <div className='flex justify-center items-center h-full'>{`${toWords(doc.amountDue).charAt(0).toUpperCase() + toWords(doc.amountDue).slice(1)} pesos`}</div> 
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
        <footer className='h-28 w-full relative'>
          <div className="h-full w-[510px] text-[8px] font-bold flex items-center pt-3 pl-3">
            <div>
              <p>National Hi-way, Rizal ST., Brgy. Sta Clara Sur Pila, Laguna, Philippines</p>
              <p>Tel. Nos.:(049) 559 0722 (Administrative) • 559 0723 (Engineering) • 559 0724 (COA) • 559 0727 (Regional Manager)</p>
              <p className='ml-6'>• 576 5543 (Equipment) • 523 3668 (Finance) Telefax No.: (049) 559 0726</p>
              <p>Website: region4A.nia.gov.ph • Facebook: www.facebook.com/region4A.nia.gov.ph</p>
              <p>TIN: 000916415043</p>
              <p className='mt-2'>NIA-RO-AFD-FIN-INT-Form-209-Rev00</p>
            </div>
          </div>
          <img src={BottomDesign} alt="bottom" className ="absolute bottom right-0 bottom-0 h-28 w-[320px]" />
          <img src={Text2} alt="text" className ="absolute bottom right-16 bottom-6 h-12 w-28" />
        </footer>
      </section>
      <section className='w-a4-width h-a4-height text-black text-xs mt-1'>
        <header className='w-full h-auto flex'>
        <div className='w-3/4 h-28 relative'>
            <img src={TopDesign} alt="Top" className='h-[118px] w-96' />
            <img src={Logo1} alt="Logo1" className='h-20 w-20 absolute top-8 left-[73px]'/>
            <img src={Logo2} alt="Logo2" className='h-[70px] w-26 absolute top-10 left-36'/>
            <img src={Text1} alt="text" className='absolute top-5 left-[253px] w-72 h-[75px]' />
            <h1 className='text-2xl font-bold absolute -bottom-1 left-[260px]'>Disbursement Voucher</h1>
          </div>
          <div className='w-1/4 border-t-2 border-r-2 border-l-2 border-black h-28 flex flex-col'>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Fund Cluster: {doc.fund}</div>
            <div className='w-full h-1/3 border-b-2 border-black flex items-center font-bold px-2'>Date: {doc.date}</div>
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
                <div className='text-center font-bold'>{doc.ORSBURS}</div>
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
                <div className="w-full h-5/6 text-justify px-1 pb-2">{doc.birParticular}</div>
                <div className="w-full flex items-center justify-center font-bold py-1">Amount Due</div>
              </div>
              <div className='w-36 border-r-2 border-black flex-col'>
                <div className="w-full text-center border-b-2 border-black">Responsibilty Center</div>
                <div className="w-full h-3/6 flex items-center justify-center p-1">{doc.birRC}</div>
              </div>
              <div className='w-32 border-r-2 border-black'>
                <div className="w-full text-center border-b-2 border-black">MFO/PAP</div>
                <div className="w-full h-3/6 flex items-center justify-center p-2"></div>
              </div>
              <div className='w-60'>
                <div className="w-full text-center border-b-2 border-black">Amount</div>
                <div className="w-full h-3/6 flex items-center justify-end p-1">{doc.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="w-full h-24 flex justify-between items-end font-bold">
                  <div>₱</div>
                  <div>{doc.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                      <div className="w-full pt-1 text-end px-2">{doc.bir3percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">{doc.bir2percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                  </div>
                  <div className="w-1/5 h-[100px] border-black">
                      <div className="w-full text-center border-b-2 border-black">Credit</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                      <div className="w-full pt-1 text-end px-2">-</div>
                      <div className="w-full pt-1 text-end px-2">{doc.birSubAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                  <div className='flex justify-center items-center h-full'>{`${toWords(doc.birSubAmount)} pesos`}</div>
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
        <footer className='h-28 w-full relative'>
          <div className="h-full w-[510px] text-[8px] font-bold flex items-center pt-3 pl-3">
            <div>
              <p>National Hi-way, Rizal ST., Brgy. Sta Clara Sur Pila, Laguna, Philippines</p>
              <p>Tel. Nos.:(049) 559 0722 (Administrative) • 559 0723 (Engineering) • 559 0724 (COA) • 559 0727 (Regional Manager)</p>
              <p className='ml-6'>• 576 5543 (Equipment) • 523 3668 (Finance) Telefax No.: (049) 559 0726</p>
              <p>Website: region4A.nia.gov.ph • Facebook: www.facebook.com/region4A.nia.gov.ph</p>
              <p>TIN: 000916415043</p>
              <p className='mt-2'>NIA-RO-AFD-FIN-INT-Form-209-Rev00</p>
            </div>
          </div>
          <img src={BottomDesign} alt="bottom" className ="absolute bottom right-0 bottom-0 h-28 w-[320px]" />
          <img src={Text2} alt="text" className ="absolute bottom right-16 bottom-6 h-12 w-28" />
        </footer>
      </section>
    </main>
  )
}

Document.propTypes = {
  document: PropTypes.object.isRequired
};

export default Document