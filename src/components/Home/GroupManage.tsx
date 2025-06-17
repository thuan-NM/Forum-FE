import { GroupProvider } from '../../context/GroupContext'
import TopicTab from '../PostManage/Question/Topic/TopicTab'
const GroupManage = () => {
  return (
    <GroupProvider>
      <div className='w-3/4 mx-auto'>
        <div>
          <TopicTab/>
        </div>
      </div>
    </GroupProvider>
  )
}

export default GroupManage