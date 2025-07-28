import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ResendEmail } from '../../services/AuthServices';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const { mutate, isPending, error } = useMutation({
        mutationFn: ResendEmail,
        onSuccess: (data) => {
            setMessage(data.message || 'Email xác minh đã được gửi lại thành công. Vui lòng kiểm tra hộp thư.');
        },
        onError: (err) => {
            setMessage(err.message);
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        mutate(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Gửi lại email xác minh</h2>
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Địa chỉ Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    {message && (
                        <p className={`text-center ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                    {error && <p className="text-red-600 text-center">{error.message}</p>}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isPending ? 'Đang gửi...' : 'Gửi lại email'}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Quay lại <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default ResendVerification;