import logo from './../assets/images/banal_logo_full.png'
import NavButtons from './NavButtons'

function Header() {

  return (
    <div>
      <img src={logo} />
      <NavButtons buttonName='Home' />
      <NavButtons buttonName='Products' />
      <NavButtons buttonName='Blogs' />
      <NavButtons buttonName='About' />
      <NavButtons buttonName='Contact' />
    </div>
  )

}

export default Header
