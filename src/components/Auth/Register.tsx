import { Button, useDisclosure, Modal, ModalBody, ModalContent, ModalHeader, Input } from '@heroui/react';
import { MdClear } from "react-icons/md";
import { Form } from 'react-router-dom';
import { FormEvent, useState } from "react";
import { Register } from '../../services/AuthServices';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

type AccountData = {
    username: string | '';
    email: string | '',
    fullName: string | ''
    password: string | '',
    confirmpassword: string | '',
}
const RegisterComponent = () => {
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const [activeStep, setActiveStep] = useState(0);
    const { setRegisteredEmail } = useAuth();
    const [formData, setFormData] = useState<AccountData>({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: Register,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            setRegisteredEmail(formData.email);
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response.data.error);
        },
    });
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData)
    }

    const steps = ["Personal Information", "Password"];

    return (
        <div className='px-3'>
            <Button size='sm' variant="flat" className='mr-2 bg-content1 w-full' onPress={onOpen}>
                Đăng ký bằng email
            </Button>
            <Modal
                isOpen={isOpen}
                size={"2xl"}
                onOpenChange={onOpenChange}
                className='rounded-md '
                isDismissable={false}
                backdrop='blur'
                hideCloseButton
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Button
                                isIconOnly
                                className='border-none cursor-pointer w-fit bg-transparent ml-3 mt-3 hover:bg-neutral-700 rounded-full'
                                onPress={onClose}
                            >
                                <MdClear className='w-7 h-7 !text-neutral-300' />
                            </Button>
                            <ModalHeader className="flex flex-col gap-1 pt-1">
                                <div className='text-xl'>Tạo tài khoản</div>
                            </ModalHeader>
                            <ModalBody className='pb-16 border-b border-content2'>
                                <Form className="w-full flex flex-col gap-y-8" onSubmit={handleSubmit}>
                                    {activeStep === 0 && (
                                        <>
                                            <Input
                                                autoComplete=''
                                                isRequired
                                                label={<span className='text-base font-semibold'>Tên người dùng</span>}
                                                labelPlacement="outside"
                                                name="username"
                                                placeholder="Bạn muốn được gọi là gì?"
                                                type="text"
                                                maxLength={60}
                                                minLength={10}
                                                variant="bordered"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                            />
                                            <Input
                                                autoComplete=''
                                                isRequired
                                                label={<span className='text-base font-semibold'>Họ và tên</span>}
                                                labelPlacement="outside"
                                                name="fullName"
                                                placeholder="Nhập họ tên của bạn"
                                                type="text"
                                                variant="bordered"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                            <Input
                                                autoComplete=''
                                                isRequired
                                                label={<span className='text-base font-semibold'>Email</span>}
                                                labelPlacement="outside"
                                                name="email"
                                                placeholder="Nhập địa chỉ email"
                                                type="email"
                                                variant="bordered"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </>
                                    )}
                                    {activeStep === 1 && (
                                        <>
                                            <Input
                                                autoComplete=''
                                                isRequired
                                                label={<span className='text-base font-semibold'>Mật khẩu</span>}
                                                labelPlacement="outside"
                                                name="password"
                                                placeholder="Nhập mật khẩu"
                                                type="password"
                                                variant="bordered"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <Input
                                                isRequired
                                                autoComplete=''
                                                label={<span className='text-base font-semibold'>Xác nhận mật khẩu</span>}
                                                labelPlacement="outside"
                                                name="confirmpassword"
                                                placeholder="Nhập lại mật khẩu"
                                                type="password"
                                                variant="bordered"
                                                value={formData.confirmpassword}
                                                onChange={handleInputChange}
                                            />
                                        </>
                                    )}
                                    <div className='flex justify-end gap-3'>
                                        {activeStep > 0 && (
                                            <Button variant="ghost" onPress={() => setActiveStep(activeStep - 1)} radius='full'>
                                                Quay lại
                                            </Button>
                                        )}
                                        {activeStep === steps.length - 1 ? (
                                            <Button color="primary" type="submit" radius='full' isLoading={mutation.status === 'pending'}>
                                                Gửi đăng ký
                                            </Button>
                                        ) : (
                                            <Button color="primary" onPress={() => setActiveStep(activeStep + 1)} radius='full'>
                                                Tiếp theo
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default RegisterComponent;
