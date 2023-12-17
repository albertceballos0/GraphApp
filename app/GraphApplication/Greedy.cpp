#include "pch.h"
#include "Graph.h"
#include <string>
#include <limits>
// SalesmanTrackGreedy =========================================================

CEdge* CercaAresta(CVertex* a, CVertex* b)
{
	list<CEdge*>::iterator it = a->m_Edges.begin();

	for (it; it != a->m_Edges.end(); it++)
		if ((*it)->m_pDestination == b)
			return *it;
	return NULL;
}




CTrack SalesmanTrackGreedy(CGraph& graph, CVisits &visits)
{

	CTrack cami(&graph);

	//Inicialitza Vertex V
	list<CVertex*>::iterator it = visits.m_Vertices.begin();
	CVertex* v = *it;

	//Llista de candidats
	list<CVertex*> candidats = visits.m_Vertices;

	CVertex* final = *(--candidats.end());

	candidats.erase(candidats.begin());
	candidats.erase(--candidats.end());

	//Mentre queden candidats
	while (candidats.size() > 0) {

		DijkstraQueue(graph, v);

		
		//Selecciona+r V1
		list<CVertex*>::iterator aux = candidats.begin();
		double min = DBL_MAX;
		CVertex* v1 = *aux;

		for (aux; aux != candidats.end(); aux++)
		{
			if ((*aux)->m_DijkstraDistance < min)
			{
				min = (*aux)->m_DijkstraDistance;
				v1 = *aux;
			}
		}

		//Cecar aresta que va de v a v1
		CEdge* aresta;

		if (v1->m_pDijkstraPrevious->m_pOrigin == v)
		{
			aresta = CercaAresta(v, v1);
			cami.AddLast(aresta);
		}

		else
		{
			CTrack cami_aux(&graph);
			CVertex* a = v1->m_pDijkstraPrevious->m_pOrigin;
			CVertex* b = v1;
			while (a != v)
			{
				aresta = CercaAresta(a, b);
				cami_aux.AddFirst(aresta);
				b = a;
				a = a->m_pDijkstraPrevious->m_pOrigin;
			}
			aresta = CercaAresta(a, b);
			cami_aux.AddFirst(aresta);
			cami.Append(cami_aux);
		}
		//Afegir aresta a CTrack

		//Eliminar v1 de candidats
		list<CVertex*>::iterator it = candidats.begin();

		candidats.erase(remove(candidats.begin(), candidats.end(), v1), candidats.end());

		v = v1;
	}


	DijkstraQueue(graph, v);
	CEdge* aresta;
	
	if ((final)->m_pDijkstraPrevious->m_pOrigin == v)
	{
		aresta = CercaAresta(v, final);
		cami.AddLast(aresta);
	}

	else
	{
		CTrack cami_aux(&graph);
		CVertex* a = (final)->m_pDijkstraPrevious->m_pOrigin;
		CVertex* b = (final);
		while (a != v)
		{
			aresta = CercaAresta(a, b);
			cami_aux.AddFirst(aresta);
			b = a;
			a = a->m_pDijkstraPrevious->m_pOrigin;
		}
		aresta = CercaAresta(a, b);
		cami_aux.AddFirst(aresta);
		cami.Append(cami_aux);
	}

	return cami;
}

