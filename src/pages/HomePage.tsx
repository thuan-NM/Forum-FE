import HomeReel from '../components/Home/HomeReel'
import GroupManage from '../components/Home/GroupManage'
import HomeLayout from '../layouts/HomeLayout'

const HomePage = () => {
  return (
    <HomeLayout>
      <div className='flex flex-row mt-5'>
        <div className='basis-1/4 flex justify-end'>
          <GroupManage />
        </div>
        <div className='basis-2/5'>
          <HomeReel />
        </div>
      </div>

    </HomeLayout>
  )
}

export default HomePage