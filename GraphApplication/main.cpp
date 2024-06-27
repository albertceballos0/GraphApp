#include <iostream>
#include "Graph.h"
#include <ctime>
using namespace std;

CGraph mygraph(NULL);
CVisits visitas(NULL);
enum {
    LOAD = 1,
};
int main(int argc, char* argv[]) {
    //Comprobación argumentos
    //MyAssert(argc > 1);

    //Convertir en int el primer argumento después del nombre del programa
    //int option = stoi(argv[1]);
    clock_t start = clock();

    //Cargar grafo desde archivo
    //mygraph.Load("/Users/albertceballos/project/myapp/TestSalesMan/graf30_300_8.GR");
    mygraph.Load(argv[1]);

    //Cargar visitas desde archivo
    visitas.SetGraph(&mygraph);
            
    //visitas.Load("/Users/albertceballos/project/myapp/TestSalesMan/visites.VIS");
    visitas.Load(argv[2]);

    start = clock();
    
    
    
    
    std::cout << SalesmanTrackBranchAndBound(mygraph, visitas) << endl;
    cout << double(clock() - start) / CLOCKS_PER_SEC << endl;



        
    



    return 0;
}
