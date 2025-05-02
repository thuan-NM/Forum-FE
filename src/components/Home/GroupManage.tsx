import { GroupProvider } from '../../context/GroupContext'
import Footer from '../Common/Footer'
import GroupCreation from '../Group/GroupCreation'
import GroupItem from '../Group/GroupItem'
const GroupManage = () => {
  return (
    <GroupProvider>
      <div className='w-2/3'>
        <div className='text-start'>
          <GroupCreation />
        </div>
        <div>
          <GroupItem />

        </div>
        <hr className='border-b !border-neutral-600 w-11/12' />
        <Footer position='left' />
      </div>
    </GroupProvider>
  )
}

export default GroupManage