import logoBlack from '../assets/images/banal_logo_full.png';


export default function Footer(){

  const footerLinks = [
  
    {id:1, name: "Home"},
    {id:2, name: "Products"},
    {id:3, name: "About Us"},
    {id:4, name: "Blogs"},
    {id:5, name: "Contact Us"},
  
  ];

  return(
  
    <div className="rounded-lg p-8 bg-[#E6E6E6] flex flex-col m-4 md:m-8">
      <div className="w-[90%] max-w-screen-2xl mx-auto">
        <div className="flex justify-center">
        <a href="/" className="inline-block items-center">
        <img 
          src={logoBlack} 
          alt="Bansal Timber & Plywood Logo"
          className=" cursor-pointer align-center mb-6 mx-auto mt-8"
        />
        </a>
        </div>
        <hr className="my-8"/>
        <div className="flex flex-col justify-between my-3 md:flex-row">
          {footerLinks.map((link) => (
            <a 
              key={link.id}
              href={`/${link.name.toLowerCase().replace(/\s+/g, "")}`}
              className="text-black font-[SagaceBold] text-[24px] hover:text-[#FF5724] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
        <hr className="my-8"/>
        <div className="flex flex-col md:flex-row my-6 justify-between gap-4">
          <p className="font-[NeueHaasRoman]"><span className="font-[NeueHaasBold]">Give us a Call:</span> <br/>+91 12345 12345 &nbsp;&nbsp; | &nbsp; +91 12345 12345</p>
          <p className="font-[NeueHaasRoman]"><span className="font-[NeueHaasBold]">email:</span> bansaltimber@gmail.com</p>
          <p className="font-[NeueHaasRoman]">
            <span className="font-[NeueHaasBold]">Address:</span> <br/>
            897 B Ward, no.8, Main Bazar Rd,<br/>
            Ward no- 2, Aam Bagh, Mehrauli Village,<br/>
            Mehrauli, New Delhi, Delhi 110030
          </p>
        </div>
        <hr className="my-8"/>
        <p className="text-center font-[NeueHaasRoman] text-sm">
          Copyright @ 2025 Bansal Timber and Plywood. All rights reserved.
        </p>
      </div>
    </div>

  );




};
