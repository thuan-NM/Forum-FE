import Login from "../components/Auth/Login"
import SocialLogin from "../components/Auth/SocialLogin"
import Footer from "../components/Common/Footer"
import AuthLayout from "../layouts/AuthLayout"
const AuthPage = () => {
  return (
    <div>
      <AuthLayout>
        <div className="flex flex-row p-0 mb-6">
          <SocialLogin />
          <Login />
        </div>
        <hr className="!text-white border-neutral-700"/>
        <Footer position="center"/>
      </AuthLayout>
    </div>
  )
}

export default AuthPage