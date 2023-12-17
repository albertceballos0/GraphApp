import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import React, { useEffect } from "react";

const Fa2: React.FC = () => {
    const { start, kill } = useWorkerLayoutForceAtlas2({ settings: { slowDown: 10 } });

    useEffect(() => {
      // start FA2
      start();
      return () => {
        // Kill FA2 on unmount
        kill();
      };
    }, [start, kill]);

    return null;
  };
export default Fa2;