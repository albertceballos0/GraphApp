import "@react-sigma/core/lib/react-sigma.min.css";
import { useRef, ChangeEvent, useState } from 'react';
import FormNode from "../forms/formNode";
import FormEdge from "../forms/formEdge";
import useGraphStore from "../store";

const Navbar = () => {

  const [addNode, setAddNode] = useState(false);
  const [addEdge, setAddEdge] = useState(false);
  
  const { mygraph, setGraphFromJson , layout} = useGraphStore();

  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          
          const data = JSON.parse(e.target?.result as string);
          setGraphFromJson(data);

        } catch (error) {
          console.log('Error:', error);
        }
      };
      reader.readAsText(file);

    }
  };
  const handleClickLoadData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    fileInputRef.current?.click();
    setAddNode(false);
    setAddEdge(false);  

  }
  const handleClickAddNode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setAddNode(true);
    setAddEdge(false);
  }
  const handleClickAddEdge = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setAddEdge(true);
    setAddNode(false);
    
  }
    return (
        <div>
            <div className="mt-10 bg-gray-200 ml-20 mr-20 px-4 py-2 border border-black rounded-md ">
                <div className="flex justify-center space-x-4 ">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button onClick = {handleClickLoadData} className="bg-transparent hover:bg-gray-600 text-green-500 font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
                        FILE
                    </button>
                    <button onClick = {handleClickAddNode} className="bg-transparent hover:bg-gray-600 text-green-500 font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
                        ADD NODE
                    </button>
                    <button onClick = {handleClickAddEdge} className="bg-transparent hover:bg-gray-600 text-green-500 font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded">
                        ADD EDGE
                    </button>
                    
                </div>
            </div>  
            {   addNode && !addEdge ? <FormNode /> : <></>  }
            {   addEdge && !addNode? <FormEdge /> : <></>  }

        </div>
    )
}

export default Navbar