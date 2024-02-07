
#include <iostream>
#include "Graph.h"
#include <ctime>
using namespace std;

CGraph mygraph(NULL);
CVisits visitas(NULL);
CTrack track(NULL);
enum {
	LOAD = 1, 
};
int main(int argc, char* argv[]) {
	//Comprobación argumentos
	//MyAssert(argc > 1);

	//Convertir en int el primer argumento despúes del nombre del programa
	//int option = stoi(argv[1]);
	clock_t start = clock();

	switch (1)
	{
	case LOAD: 
		//Cargar grafo mediante archivo ya existente
		//MyAssert(argc > 3);
		
		start = clock();

		mygraph.Load("../../../TestSalesMan/Graf50_200_6.GR");
		cout << double(clock() - start) / CLOCKS_PER_SEC << endl;
		
		visitas.SetGraph(&mygraph);
		start = clock();
		visitas.Load("../../../TestSalesMan/Graf50_200_6.VIS");

		cout << double(clock() - start) / CLOCKS_PER_SEC << endl;

		start = clock();
		track = SalesmanTrackBacktracking(mygraph, visitas);

		cout << double(clock() - start) / CLOCKS_PER_SEC << endl;

		start = clock();
		track = SalesmanTrackBacktrackingGreedy(mygraph, visitas);

		cout << double(clock() - start) / CLOCKS_PER_SEC << endl;	

		

		break;
	default:
		break;
	}

}