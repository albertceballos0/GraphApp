import React, { useEffect } from "react";

import "@react-sigma/core/lib/react-sigma.min.css";
import { useRegisterEvents, useSigma } from "@react-sigma/core";

const GraphEvents: React.FC = () => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();

    useEffect(() => {
        console.log();
        // Register the events
        registerEvents({
          // node events
         
          clickEdge: (event) =>
           {
            console.log("click", event.x, event.y);
           }
           
         });
      }, [registerEvents]);
  
    return null;
  };

export default GraphEvents;