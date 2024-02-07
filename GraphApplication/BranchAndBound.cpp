#include "Graph.h"
#include <queue>
#include <iostream>
#include <iomanip> 
#include <limits>
#include "MAtrix.h"

class CBBNode {
public:

	CTrack m_Track;
	double m_Length;
	double m_WeigthMin;
	double m_WeigthMax;// Cota inferior. peso del nodo a m�s pesado m�s largo es su posible camino
public:
	CBBNode(CGraph* pGraph) : m_Track(pGraph),  m_Length(0), m_WeigthMin(0), m_WeigthMax(0) {}
	
	CBBNode(const CBBNode& node)
		: m_Track(node.m_Track)
		, m_Length(node.m_Length)
		, m_WeigthMin(node.m_WeigthMin)
		, m_WeigthMax(node.m_WeigthMax)

	{

	}
};

// comparator ==================================================================

struct comparator {
	bool operator()(const CBBNode* s1, const CBBNode* s2) {
		return s1->m_WeigthMin > s2->m_WeigthMin;
	}
};


struct comparator2 {
	bool operator()(const CBBNode* s1, const CBBNode* s2) {
		return s1->m_Length > s2->m_Length;
	}
};


// SalesmanTrackBranchAndBound2 ===================================================



// SalesmanTrackBranchAndBound3 ===================================================
int getIndex(CVisits visits, CVertex* v) {
	int i = 0;
	for (CVertex* a : visits.m_Vertices) {
		if (v == a)
			return i;
		i++;
	}
	return -1;
}

double calculaMinim(CGraph& graph,CVisits visits, vector<CVertex*> no_visitats, Matrix<double> costos, CVertex* ultim) {
	

	if (no_visitats.size() > 1) {

		double minims = 0;
		for (CVertex* inici : no_visitats) {
			int indexInici = getIndex(visits, inici);
			double min;
			if (inici != *(--no_visitats.end())) {

				int index = getIndex(visits, ultim);
				min = costos(indexInici, index);
			}
			else {
				min = DBL_MAX;
			}
			for (CVertex* v : no_visitats) {
				if (v != *(--no_visitats.end()) && v != inici) {
					int index = getIndex(visits, v);
					if (costos(indexInici, index) < min) {
						min = costos(indexInici, index);
					}
				}
			}

			minims += min;
		}
		return minims;
	}
	else {
		int index = getIndex(visits, no_visitats[0]);
		int index_inici = getIndex(visits, ultim);
		return costos(index, index_inici);
	}
	
}
double calculaMinim2(CGraph& graph, CVisits visits, vector<CVertex*> no_visitats, Matrix<double> costos, CVertex* ultim) {


	if (no_visitats.size() > 1) {

		double minims = 0;
		for (CVertex* inici : no_visitats) {
			int indexInici = getIndex(visits, inici);
			double min;
			if (inici != *(--no_visitats.end())) {

				int index = getIndex(visits, ultim);
				min = costos(indexInici, index);
			}
			else {
				min = DBL_MAX;
			}
			for (CVertex* v : visits.m_Vertices) {
				if (v != *(--no_visitats.end()) && v != inici) {
					int index = getIndex(visits, v);
					if (costos(indexInici, index) < min) {
						min = costos(indexInici, index);
					}
				}
			}

			minims += min;
		}
		return minims;
	}
	else {
		int index = getIndex(visits, no_visitats[0]);
		int index_inici = getIndex(visits, ultim);
		return costos(index, index_inici);
	}

}
double calculaMax(CGraph& graph, CVisits visits, vector<CVertex*> no_visitats, Matrix<double> costos, CVertex* ultim) {
	if (no_visitats.size() > 1) {
		double maxims = 0;
		for (CVertex* inici : no_visitats) {
			int indexInici = getIndex(visits, inici);
			double max;
			if (inici != *(--no_visitats.end())) {

				int index = getIndex(visits, ultim);
				max = costos(indexInici, index);
			}
			else {
				max = DBL_MIN;
			}
			for (CVertex* v : no_visitats) {
				if (v != *(--no_visitats.end()) && v != inici) {
					int index = getIndex(visits, v);
					if (costos(indexInici, index) > max) {
						max = costos(indexInici, index);
					}
				}
			}
			maxims += max;
		}
		return maxims;
	}
	else {

		int index = getIndex(visits, no_visitats[0]);
		int index_inici = getIndex(visits, ultim);
		return costos(index, index_inici);
	}
}

double calculaMax2(CGraph& graph, CVisits visits, vector<CVertex*> no_visitats, Matrix<double> costos, CVertex* ultim) {
	if (no_visitats.size() > 1) {
		double maxims = 0;
		for (CVertex* inici : no_visitats) {
			int indexInici = getIndex(visits, inici);
			double max;
			if (inici != *(--no_visitats.end())) {

				int index = getIndex(visits, ultim);
				max = costos(indexInici, index);
			}
			else {
				max = DBL_MIN;
			}
			for (CVertex* v : visits.m_Vertices) {
				if (v != *(--no_visitats.end()) && v != inici) {
					int index = getIndex(visits, v);
					if (costos(indexInici, index) > max) {
						max = costos(indexInici, index);
					}
				}
			}
			maxims += max;
		}
		return maxims;
	}
	else {

		int index = getIndex(visits, no_visitats[0]);
		int index_inici = getIndex(visits, ultim);
		return costos(index, index_inici);
	}
}

double calculaCotaInferior(CGraph& graph, CVisits visits, CTrack cami, Matrix<double> costos) {
	
	vector<CVertex*> visitats;
	vector<CVertex*> no_visitats;
	double cota_inf = 0;
	double length = 0;
	for (CEdge* v : cami.m_Edges) {
		length += v->m_Length;
		visitats.push_back(v->m_pOrigin);
	}
	visitats.push_back((*(--cami.m_Edges.end()))->m_pDestination);

	for (CVertex* v : visits.m_Vertices) {
		bool trobat = false;
		int i = 0;
		while (!trobat && i < visitats.size()) {
			if (visitats[i] == v)
				trobat = true;
			else
				i++;
		}
		if (!trobat)
			no_visitats.push_back(v);
	}
	if (no_visitats.size() == 0)
		return length;
	

	length += calculaMinim(graph,visits,  no_visitats, costos, *(--visitats.end()));
	return length;

}

double calculaCotaInferior2(CGraph& graph, CVisits visits, CTrack cami, Matrix<double> costos) {

	vector<CVertex*> visitats;
	vector<CVertex*> no_visitats;
	double cota_inf = 0;
	double length = 0;
	for (CEdge* v : cami.m_Edges) {
		length += v->m_Length;
		visitats.push_back(v->m_pOrigin);
	}
	visitats.push_back((*(--cami.m_Edges.end()))->m_pDestination);

	for (CVertex* v : visits.m_Vertices) {
		bool trobat = false;
		int i = 0;
		while (!trobat && i < visitats.size()) {
			if (visitats[i] == v)
				trobat = true;
			else
				i++;
		}
		if (!trobat)
			no_visitats.push_back(v);
	}
	if (no_visitats.size() == 0)
		return length;
	length += calculaMinim2(graph, visits, no_visitats, costos, *(--visitats.end()));
	return length;

}

double calculaCotaSuperior(CGraph& graph, CVisits visits, CTrack cami, Matrix<double> costos) {

	vector<CVertex*> visitats;
	vector<CVertex*> no_visitats;
	double cota_inf = 0;
	double length = 0;
	for (CEdge* v : cami.m_Edges) {
		length += v->m_Length;
		visitats.push_back(v->m_pOrigin);
	}
	visitats.push_back((*(--cami.m_Edges.end()))->m_pDestination);

	for (CVertex* v : visits.m_Vertices) {
		bool trobat = false;
		int i = 0;
		while (!trobat && i < visitats.size()) {
			if (visitats[i] == v)
				trobat = true;
			else
				i++;
		}
		if (!trobat)
			no_visitats.push_back(v);
	}
	if (no_visitats.size() == 0)
		return length;
	length += calculaMax(graph, visits, no_visitats, costos, *(--visitats.end()));
	return length;

}

double calculaCotaSuperior2(CGraph& graph, CVisits visits, CTrack cami, Matrix<double> costos) {

	vector<CVertex*> visitats;
	vector<CVertex*> no_visitats;
	double cota_inf = 0;
	double length = 0;
	for (CEdge* v : cami.m_Edges) {
		length += v->m_Length;
		visitats.push_back(v->m_pOrigin);
	}
	visitats.push_back((*(--cami.m_Edges.end()))->m_pDestination);


	for (CVertex* v : visits.m_Vertices) {
		bool trobat = false;
		int i = 0;
		while (!trobat && i < visitats.size()) {
			if (visitats[i] == v)
				trobat = true;
			else
				i++;
		}
		if (!trobat)
			no_visitats.push_back(v);
	}
	if (no_visitats.size() == 0)
		return length;
	length += calculaMax2(graph, visits, no_visitats, costos, *(--visitats.end()));
	return length;

}

bool esCami(CTrack track, CVertex* v) {
	for (CEdge* e : track.m_Edges) {
		if (e->m_pOrigin == v)
			return true;

	}
	if ((*(--track.m_Edges.end()))->m_pDestination == v)
		return true;
	else
		return false;
}


bool noQuedenVertexVisitar(CTrack track, CVisits visits) {
	for (CVertex* v : visits.m_Vertices) {

		if (v != (*(--visits.m_Vertices.end())))
			if (!esCami(track, v))
				return false;


	}
	return true;
}


CTrack camiDijkstra(CGraph graph, CVertex* origen, CVertex* desti) {
	CTrack track(&graph);
	CVertex* aux = desti;

	while (aux != origen) {
		track.AddFirst(aux->m_pDijkstraPrevious);
		aux = aux->m_pDijkstraPrevious->m_pOrigin;
	}
	return track;
}

CTrack SalesmanTrackBranchAndBound3(CGraph& graph, CVisits &visits)
{

	//Inicialitza matriu de costos per vertex a visitar
	Matrix<double> costos(visits.m_Vertices.size(), visits.m_Vertices.size());
	auto it = visits.m_Vertices.begin();
	for (int i = 0; i < visits.m_Vertices.size(); i++) {
		Dijkstra(graph,*it);
		auto it2 = visits.m_Vertices.begin();
		for (int j = 0; j < visits.m_Vertices.size(); j++) {
			costos(i, j) = (*it2)->m_DijkstraDistance;
			cout << costos(i, j);
			++it2;
		}
		++it;

	}

	//Creem la cua amb prioritat
	priority_queue<CBBNode*, std::vector<CBBNode*>, comparator> queue;
	it = visits.m_Vertices.begin();
	it++;

	if (visits.m_Vertices.size() > 2) {


		//Inicialitzem amb els n - 2 nodes a visitar sense contar amb el primer i l'ultim
		for (int i = 1; i < visits.m_Vertices.size() - 1; i++) {
			CVertex* origen = *visits.m_Vertices.begin();
			Dijkstra(graph, origen);

			CVertex* desti = *it;

			CTrack track(camiDijkstra(graph, origen, desti));


			CBBNode* n = new CBBNode(&graph);

			n->m_Track = track;
			n->m_Length = n->m_Length + desti->m_DijkstraDistance;
			n->m_WeigthMin = calculaCotaInferior(graph, visits, n->m_Track, costos);
			n->m_WeigthMax = calculaCotaSuperior(graph, visits, n->m_Track, costos);
			queue.push(n);
			it++;

		}

		while (queue.size() > 0) {

			CBBNode node(*(queue.top()));
			queue.pop();


			CTrack cami = node.m_Track;



			CVertex* origen = (*(--cami.m_Edges.end()))->m_pDestination;
			Dijkstra(graph, origen);


			//Si nom�s queda per afegir l'�ltim vertex a visitar
			if (noQuedenVertexVisitar(cami, visits)) {


				CVertex* desti = *(--visits.m_Vertices.end());

				CTrack track(camiDijkstra(graph, origen, desti));

				CBBNode* a = new CBBNode(node);
				for (CEdge* e : track.m_Edges)
					cami.AddLast(e);

				return cami;
			}

			else {

				for (CVertex* v : visits.m_Vertices) {

					if (!esCami(cami, v) && v != (*(--visits.m_Vertices.end()))) {

						CVertex* desti = v;


						CTrack track(camiDijkstra(graph, origen, desti));


						CBBNode* a = new CBBNode(node);
						for (CEdge* e : track.m_Edges)
							cami.AddLast(e);


						a->m_Track = cami;
						a->m_Length += desti->m_DijkstraDistance;
						a->m_WeigthMin = calculaCotaInferior(graph, visits, cami, costos);
						a->m_WeigthMax = calculaCotaSuperior(graph, visits, cami, costos);

						if (a->m_WeigthMin <= node.m_WeigthMax)
							queue.push(a);

					}

				}
			}

		}
	}
	else {
		CVertex* origen = *visits.m_Vertices.begin();
		Dijkstra(graph, origen);

		CVertex* desti = *it;

		CTrack track(camiDijkstra(graph, origen, desti));

		return track;
	}
	return CTrack(&graph);

}
CTrack SalesmanTrackBranchAndBound2(CGraph& graph, CVisits& visits)
{

	//Inicialitza matriu de costos per vertex a visitar
	Matrix<double> costos(visits.m_Vertices.size(), visits.m_Vertices.size());
	auto it = visits.m_Vertices.begin();
	for (int i = 0; i < visits.m_Vertices.size(); i++) {
		Dijkstra(graph, *it);
		auto it2 = visits.m_Vertices.begin();
		for (int j = 0; j < visits.m_Vertices.size(); j++) {
			costos(i, j) = (*it2)->m_DijkstraDistance;
			cout << costos(i, j);
			++it2;
		}
		++it;

	}

	//Creem la cua amb prioritat
	priority_queue<CBBNode*, std::vector<CBBNode*>, comparator> queue;
	it = visits.m_Vertices.begin();
	it++;

	if (visits.m_Vertices.size() > 2) {


		//Inicialitzem amb els n - 2 nodes a visitar sense contar amb el primer i l'ultim
		for (int i = 1; i < visits.m_Vertices.size() - 1; i++) {
			CVertex* origen = *visits.m_Vertices.begin();
			Dijkstra(graph, origen);

			CVertex* desti = *it;

			CTrack track(camiDijkstra(graph, origen, desti));


			CBBNode* n = new CBBNode(&graph);

			n->m_Track = track;
			n->m_Length = n->m_Length + desti->m_DijkstraDistance;
			n->m_WeigthMin = calculaCotaInferior2(graph, visits, n->m_Track, costos);
			n->m_WeigthMax = calculaCotaSuperior2(graph, visits, n->m_Track, costos);
			queue.push(n);
			it++;

		}

		while (queue.size() > 0) {

			CBBNode node(*(queue.top()));
			queue.pop();


			CTrack cami = node.m_Track;



			CVertex* origen = (*(--cami.m_Edges.end()))->m_pDestination;
			Dijkstra(graph, origen);


			//Si nom�s queda per afegir l'�ltim vertex a visitar
			if (noQuedenVertexVisitar(cami, visits)) {


				CVertex* desti = *(--visits.m_Vertices.end());

				CTrack track(camiDijkstra(graph, origen, desti));

				CBBNode* a = new CBBNode(node);
				for (CEdge* e : track.m_Edges)
					cami.AddLast(e);

				return cami;
			}

			else {

				for (CVertex* v : visits.m_Vertices) {

					if (!esCami(cami, v) && v != (*(--visits.m_Vertices.end()))) {

						CVertex* desti = v;


						CTrack track(camiDijkstra(graph, origen, desti));


						CBBNode* a = new CBBNode(node);
						for (CEdge* e : track.m_Edges)
							cami.AddLast(e);


						a->m_Track = cami;
						a->m_Length += desti->m_DijkstraDistance;
						a->m_WeigthMin = calculaCotaInferior(graph, visits, cami, costos);
						a->m_WeigthMax = calculaCotaSuperior(graph, visits, cami, costos);

						if (a->m_WeigthMin <= node.m_WeigthMax)
							queue.push(a);

					}

				}
			}

		}
	}
	else {
		CVertex* origen = *visits.m_Vertices.begin();
		Dijkstra(graph, origen);

		CVertex* desti = *it;

		CTrack track(camiDijkstra(graph, origen, desti));

		return track;
	}
	return CTrack(&graph);
}


CTrack SalesmanTrackBranchAndBound1(CGraph& graph, CVisits& visits)
{

	//Inicialitza matriu de costos per vertex a visitar
	Matrix<double> costos(visits.m_Vertices.size(), visits.m_Vertices.size());
	auto it = visits.m_Vertices.begin();
	for (int i = 0; i < visits.m_Vertices.size(); i++) {
		Dijkstra(graph, *it);
		auto it2 = visits.m_Vertices.begin();
		for (int j = 0; j < visits.m_Vertices.size(); j++) {
			costos(i, j) = (*it2)->m_DijkstraDistance;
			cout << costos(i, j);
			++it2;
		}
		++it;

	}

	//Creem la cua amb prioritat
	priority_queue<CBBNode*, std::vector<CBBNode*>, comparator2> queue;
	it = visits.m_Vertices.begin();
	it++;

	if (visits.m_Vertices.size() > 2) {


		//Inicialitzem amb els n - 2 nodes a visitar sense contar amb el primer i l'ultim
		for (int i = 1; i < visits.m_Vertices.size() - 1; i++) {
			CVertex* origen = *visits.m_Vertices.begin();
			Dijkstra(graph, origen);

			CVertex* desti = *it;

			CTrack track(camiDijkstra(graph, origen, desti));


			CBBNode* n = new CBBNode(&graph);

			n->m_Track = track;
			n->m_Length = n->m_Length + desti->m_DijkstraDistance;
			queue.push(n);
			it++;

		}

		while (queue.size() > 0) {

			CBBNode node(*(queue.top()));
			queue.pop();


			CTrack cami = node.m_Track;



			CVertex* origen = (*(--cami.m_Edges.end()))->m_pDestination;
			Dijkstra(graph, origen);


			//Si nom�s queda per afegir l'�ltim vertex a visitar
			if (noQuedenVertexVisitar(cami, visits)) {


				CVertex* desti = *(--visits.m_Vertices.end());

				CTrack track(camiDijkstra(graph, origen, desti));

				CBBNode* a = new CBBNode(node);
				for (CEdge* e : track.m_Edges)
					cami.AddLast(e);

				return cami;
			}

			else {

				for (CVertex* v : visits.m_Vertices) {

					if (!esCami(cami, v) && v != (*(--visits.m_Vertices.end()))) {

						CVertex* desti = v;


						CTrack track(camiDijkstra(graph, origen, desti));


						CBBNode* a = new CBBNode(node);
						for (CEdge* e : track.m_Edges)
							cami.AddLast(e);


						a->m_Track = cami;
						a->m_Length += desti->m_DijkstraDistance;
						queue.push(a);

					}

				}
			}

		}
	}
	else {
		CVertex* origen = *visits.m_Vertices.begin();
		Dijkstra(graph, origen);

		CVertex* desti = *it;

		CTrack track(camiDijkstra(graph, origen, desti));

		return track;
	}
	return CTrack(&graph);

}