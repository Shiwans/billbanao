import React,{useEffect} from "react";

function UpdateSale({ onClose, children, actionBar }) {
  useEffect(()=>{
    document.body.classList.add('overflow-hidden')

    return () =>{
      document.body.classList.remove('overflow-hidden')

    }
  },[])

  return (
    <div>
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-300 opacity-80"
      ></div>

      <div className="absolute inset-40 p-10 bg-white z-10 text-black ">
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex justify-end">
            {actionBar}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateSale;
