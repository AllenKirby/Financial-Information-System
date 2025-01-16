import {Oval} from 'react-loader-spinner'

const Loader = () => {
  return (
    <Oval
  visible={true}
  height="25"
  width="25"
  color="#FFFFFF"
  ariaLabel="oval-loading"
  wrapperStyle={{}}
  wrapperClass=""/>
  )
}

export default Loader