import PostList from '../PostManage/Post/PostList'
import PostManage from '../PostManage/PostManage'
import QuestionList from '../PostManage/Question/QuestionList'

const HomeReel = () => {
  return (
    <div>
        <PostManage/>
        <PostList/>
        <QuestionList/>
    </div>
  )
}

export default HomeReel