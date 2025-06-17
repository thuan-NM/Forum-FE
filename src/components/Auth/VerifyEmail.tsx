import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { VerifyEmail } from '../../services/AuthServices';
import React from 'react';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const { data, error, isLoading } = useQuery({
        queryKey: ['verifyEmail', token],
        queryFn: () => VerifyEmail(token || ''),
        enabled: !!token && !localStorage.getItem(`verified_${token}`),
        retry: false,
    });

    // Lưu trạng thái đã xác minh vào localStorage sau khi thành công
    React.useEffect(() => {
        if (data?.message === "Email verified successfully. You can now log in.") {
            localStorage.setItem(`verified_${token}`, 'true');
        }
    }, [data, token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                {isLoading ? (
                    <p className="text-lg text-gray-700">Verifying your email...</p>
                ) : error ? (
                    <>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Email Verification Failed</h2>
                        <p className="text-gray-700 mb-4">{error.message || 'Unknown error'}</p>
                        <Link
                            to="/auth/resend-verification"
                            className="mt-4 inline-block bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                        >
                            Resend Verification Email
                        </Link>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verification</h2>
                        <p className="text-gray-700 mb-4">{data?.message || 'Email verified successfully. You can now log in.'}</p>
                        <Link
                            to="/auth"
                            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;