import { Button } from '@heroui/react'
import { FaChevronDown } from "react-icons/fa";

const MoreComment = () => {
  return (
    <Button className='w-full font-semibold' size='sm' variant='bordered' radius='full'>
        Xem thêm bình luận <FaChevronDown />
    </Button>
  )
}

export default MoreComment
