import valmax from '../assets/images/project-valmax.jpg';
import pernia from '../assets/images/project-pernia.jpg';
import SectionTitle from './SectionTitle.jsx';
import HomeProjects from './HomeProjects.jsx';

export default function HomeProjectShow(){

  return(
    <div>
      <SectionTitle 
        title="PROJECT DELIVERIES"
      />
      <h1 className="font-[NeueHaasRoman] text-[24px] md:text-[36px] my-12 mx-4">
        Building Your Dreams, <br/> Board by Board.
      </h1>
      <HomeProjects
        pic={valmax}
        tag="Trusted by the best!"
        title="Valmax Constructions Pvt. Ltd."
        text="We take great pride in having been the sole supplier of timber, plywood, flushdoor, mica 
        and more for most of their projects in Faridabad, Haryana."
      />
      <HomeProjects
        pic={pernia}
        tag="Crafting the stage for style"
        title="Pernia’s Pop-Up Studio"
        text="We're honored to be the exclusive supplier of timber, plywood, laminates, edge-banding, and 
        adhesives for this ambitious project in the fashion industry."
      />
    </div>
  );

};
