import { createContext, useContext } from 'react';
import {MultiDirectedGraph } from 'graphology'
export interface MyContextType {
  // Define los tipos de las propiedades que deseas proporcionar en el contexto
  mygraph: MultiDirectedGraph;
  // Agrega más propiedades según sea necesario
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};

export default MyContext;
