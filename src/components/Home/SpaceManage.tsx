import Footer from '../Common/Footer'
import SpaceCreation from '../Space/SpaceCreation'
import SpaceItem from '../Space/SpaceItem'

const SpaceManage = () => {
  return (
    <div className='w-2/3'>
      <div className='text-start'>
        <SpaceCreation />
      </div>
      <div>
        <SpaceItem />
      </div>
      <hr className='border-b !border-neutral-600 w-11/12 mx-auto' />
      <Footer position='left' />
    </div>
  )
}

export default SpaceManage