import HomeIntroIcons from './HomeIntroIcons.jsx'

export default function HomeIntroSection(){ 
return(
  <div className="flex flex-col md:flex-row justify-between gap-5 mt-12 mb-12 md:items-center">
      <p className="text-black text-[24px] font-[NeueHaasBold] md:text-[36px]"> Building your dreams,<br/>Board by Board.</p>
      <HomeIntroIcons/>
  </div>
);
}
