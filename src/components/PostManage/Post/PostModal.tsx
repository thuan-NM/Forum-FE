import { Button, Input, ModalBody, ModalFooter, Textarea, User } from '@heroui/react'
import { Form } from 'react-router-dom'
import TiptapEditor from '../../TextEditor/Tiptap';
interface PostModalProps {
    onClose: () => void;
}
const PostModal: React.FC<PostModalProps> = ({ onClose }) => {
    return (
        <div>
            <ModalBody>
                <div className='flex justify-start'>
                    <User
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        }}
                        name={<p className='text-sm font-semibold mb-1'>Nguyen Minh Thuan</p>}
                        description={<Button variant='bordered' size='sm' radius='full'>Knows Vietnamese</Button>}
                    />
                </div>
                {/* <Textarea
                    isClearable
                    className="w-full bg-content1 !p-0"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    placeholder="Say something..."
                    // eslint-disable-next-line no-console
                    onClear={() => console.log("textarea cleared")}
                    size='lg'
                /> */}
                <TiptapEditor initialContent='' onChange={(value)=>{console.log(value)}} isDisabled={false}></TiptapEditor>

            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                    Create
                </Button>
            </ModalFooter>
        </div>
    )
}

export default PostModal