import { HiMenuAlt2 } from "react-icons/hi";
import { MdOutlineContactSupport } from "react-icons/md";
import { IoFlagSharp } from "react-icons/io5";
import { TbCut } from "react-icons/tb";
const IndexOptionbar = () => {

    const menus = [
        "remover","pitcher","cutter","merger","limiter","expander","noise gate","de-esser","reverb","delay","chorus","flanger"
    ]
  return (
    <div className="drawer text-gray-400 bg-transparent absolute z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-3">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="drawer-button absolute z-50 cursor-pointer"
        >
          <HiMenuAlt2 className="mx-4 text-4xl text-gray-200" />
        </label>
      </div>
      <div className="drawer-side  w-max  overflow-hidden bg-transparent">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className=" pt-16 flex flex-col justify-between items-center gap-5 h-screen bg-[#1c1c26]">
          <div className="options flex flex-col justify-start items-center overflow-y-auto h-auto ">
            
            {
                menus.map((menu, index) => (
                    <div
                      key={index}
                      className="option flex flex-col justify-center items-center p-4 hover:text-gray-200 cursor-pointer"
                    >
                      <TbCut className="text-3xl " />
                      <p className="capitalize text-xs">{menu}</p>
                    </div>
                ))
            }
            <div
              className="cutter flex flex-col justify-center items-center p-4 hover:text-gray-200 cursor-pointer"
            >
              <TbCut className="text-3xl " />
              <p className="">Cutter</p>
            </div>
           
          </div>
          <div className="settings flex flex-col justify-center items-center">
            <div className="support flex flex-col justify-center items-center gap-1 capitalize py-4">
              <MdOutlineContactSupport className="text-3xl " />
              <p className="">support</p>
            </div>
            <div className="flag py-4">
              <IoFlagSharp className="text-3xl " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexOptionbar;
