import { useEffect } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useRegisterEvents } from "@react-sigma/core";
import useGraphStore from "../store";

const GraphEvents: React.FC = () => {
    const registerEvents = useRegisterEvents();
    const {mygraph} = useGraphStore();


    const comproveNodes = (event) => {

      mygraph.forEachNode((node, attributes) => {
        console.log(attributes.x, attributes.y);
        if((attributes.x === event.x + event.x*0.01 || attributes.x === event.x - event.x*0.01)
            &&
           (attributes.y === event.y + event.y*0.01 || attributes.y === event.y - event.y*0.01))
        {
          
          return true;
        }
      });
      return false;
    }

      useEffect(() => {
        // Register the events
        registerEvents({
          // node events

          // default mouse events
          click: (event) =>{ 
            console.log("click", event.x, event.y);
            console.log(comproveNodes(event));
          },
        });
      }, [registerEvents]);

    return null;
  };

export default GraphEvents;