import NormalRectangleButton from './Buttons/NormalRectangleButton.jsx';
import ContactInputForm from './ContactInputForm.jsx';

export default function ContactFormular (){
  return(
    <div className="grid grid-cols-5 bg-[#D9D9D9] md:p-12 my-12">
      <div className="md:p-12 col-span-2 space-y-4">
        <h1 className="text-4xl font-[SagaceMedium] text-[#FF5724]">We’ve been<br/> waiting for you!</h1>
        <p className="text-lg font-[NeueHaasRoman]">We want to hear from you.<br/> Let us know how we can help!</p>
        <p className="text-md font-[NeueHaasRoman]">Mobile:</p>
        <p className="text-lg font-[SagaceMedium]">+91 12345 12345</p>
        <p className="text-lg font-[SagaceMedium]">+91 12345 12345</p>
        <p className="text-md font-[NeueHaasRoman]">Email:</p>
        <p className="text-lg font-[SagaceMedium]">hello@bansal.com</p>
        <p className="text-md font-[NeueHaasRoman]">Address:</p>
        <p className="text-lg font-[SagaceMedium]">Shop No. 897B, <br/>Ward No. 6,Main Market, <br/>Mehrauli, New Delhi - 110030</p>
      </div>
      <div className="col-span-3 md:p-12 bg-white rounded-lg">
        <ContactInputForm/>
        <NormalRectangleButton 
          text="SEND MESSAGE"
          type="submit"
        />
      </div>
    </div>
  );
};
