import Login from "../components/Auth/Login"
import SocialLogin from "../components/Auth/SocialLogin"
import Footer from "../components/Common/Footer"
import { AuthProvider } from "../context/AuthContext"
import AuthLayout from "../layouts/AuthLayout"
const AuthPage = () => {
  return (
    <AuthProvider>
      <div>
        <AuthLayout>
          <div className="flex flex-row p-0 h-3/5 mb-5">
            <SocialLogin />
            <Login />
          </div>
          <hr className="!text-white border-content4" />
          <Footer position="center" />
        </AuthLayout>
      </div>
    </AuthProvider>
  )
}

export default AuthPage