import HomeReel from '../components/Home/HomeReel'
import SpaceManage from '../components/Home/SpaceManage'
import HomeLayout from '../layouts/HomeLayout'

const HomePage = () => {
  return (
    <HomeLayout>
      <div className='flex flex-row mt-5'>
        <div className='basis-1/4 flex justify-end'>
          <SpaceManage />
        </div>
        <div className='basis-2/5'>
          <HomeReel />
        </div>
        {/* <div className='basis-1/4 bg-blue-300'>haha</div> */}
      </div>
    </HomeLayout>
  )
}

export default HomePage