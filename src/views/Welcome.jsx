import donutImage from "../assets/Images/donut.png";

const Welcome = () => {
  return (
    <div className="bg-[#e7efed] h-screen flex flex-col items-center justify-center">
      {/* Main content */}
      <img src={donutImage} alt="Donut" className="w-59 h-59" />
      <h1 className="text-[#5A6D57] font-bold text-6xl ">bitebyte</h1>
    </div>
  );
};

export default Welcome;
