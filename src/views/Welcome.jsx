import donutImage from "../assets/bite1.gif";
import appLogo from "../assets/Images/largeLogo.png"

const Welcome = () => {
  return (
    <div className="bg-[#e7efed] h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xs mx-auto">
        <img src={donutImage} alt="Donut" className="w-full h-auto" />
      </div>
      <div className="max-w-sm mx-auto">
        <img src={appLogo} alt="bitebyte logo" className="w-52 h-auto mx-auto" />
      </div>
    </div>
  );
};

export default Welcome;
