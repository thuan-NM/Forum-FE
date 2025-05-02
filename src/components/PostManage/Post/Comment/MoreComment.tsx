import { Button } from '@heroui/react'
import { FaChevronDown } from "react-icons/fa";

const MoreComment = () => {
  return (
    <Button className='w-full font-semibold' size='sm' variant='bordered' radius='full'>
        View more comments <FaChevronDown/>
    </Button>
  )
}

export default MoreComment